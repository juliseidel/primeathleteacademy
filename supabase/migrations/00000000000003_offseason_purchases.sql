-- ============================================================================
-- Off-Season Plan 2026 — Purchases & Downloads
-- ----------------------------------------------------------------------------
-- Stand: 2026-05-19
-- Speichert Käufe des Off-Season-Plans (digitaler PDF-Download, 99 €):
--   - Stripe Checkout Session + Payment Intent (für Refund-Tracking)
--   - Customer Email + Name (von Stripe übernommen)
--   - Download-Token (signiert, gültig 30 Tage) für sichere PDF-Auslieferung
--   - Download-Statistik (count, last_downloaded_at)
--   - Email-Versand-Status
--
-- Sicherheit:
--   - Tabelle hat RLS, aber KEINE Policies für anon/authenticated → nur
--     service_role (= Backend API Routes mit Stripe-Webhook-Signing) darf
--     lesen/schreiben. Käufer sehen ihre Daten nur über token-validierte
--     API-Endpoints.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- ENUM: Status des Kauf-Lifecycles
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE purchase_status AS ENUM (
    'pending',    -- Checkout-Session erstellt, noch nicht bezahlt
    'paid',       -- Bezahlung bestätigt via Webhook
    'failed',     -- Bezahlung fehlgeschlagen
    'refunded'    -- Manuelle Rückerstattung im Stripe-Dashboard
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ----------------------------------------------------------------------------
-- Tabelle: purchases
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchases (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),

  -- Welches Produkt wurde gekauft (für spätere Erweiterung weiterer Pläne)
  product_key              text NOT NULL,

  -- Stripe-Referenzen
  stripe_session_id        text NOT NULL UNIQUE,
  stripe_payment_intent_id text,
  stripe_customer_id       text,

  -- Customer-Daten (von Stripe Checkout übernommen)
  customer_email           text NOT NULL,
  customer_name            text,
  customer_country         text,

  -- Preis-Snapshot (für historisches Tracking, da Preise sich ändern können)
  amount_cents             integer NOT NULL,
  currency                 text NOT NULL DEFAULT 'eur',

  -- Status
  status                   purchase_status NOT NULL DEFAULT 'pending',
  paid_at                  timestamptz,

  -- Download-Token (verwendet im signed-Link statt session_id zu exposen)
  download_token           text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  download_expires_at      timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  download_count           integer NOT NULL DEFAULT 0,
  last_downloaded_at       timestamptz,

  -- Email-Versand
  email_sent_at            timestamptz,
  email_resent_count       integer NOT NULL DEFAULT 0
);

-- Indexes für schnelle Lookups
CREATE INDEX IF NOT EXISTS purchases_download_token_idx  ON purchases (download_token);
CREATE INDEX IF NOT EXISTS purchases_stripe_session_idx  ON purchases (stripe_session_id);
CREATE INDEX IF NOT EXISTS purchases_customer_email_idx  ON purchases (customer_email);
CREATE INDEX IF NOT EXISTS purchases_status_idx          ON purchases (status);

-- updated_at automatisch pflegen
CREATE OR REPLACE FUNCTION purchases_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS purchases_updated_at ON purchases;
CREATE TRIGGER purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION purchases_set_updated_at();

-- ----------------------------------------------------------------------------
-- RLS — keine Public-Policies, nur service_role darf
-- ----------------------------------------------------------------------------
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE purchases IS
  'Käufe digitaler Produkte (z.B. Off-Season-Plan). Nur service_role-Zugriff (Backend/Webhook). Käufer-Zugriff via Download-Token-validierte API-Routes.';

-- ----------------------------------------------------------------------------
-- Storage-Bucket: protected-downloads
-- ----------------------------------------------------------------------------
-- Privater Bucket für PDF-Downloads. Wird via Supabase Service-Role aus dem
-- Next.js-Backend gelesen und als signed URL (kurzlebig, 5 Min) ausgeliefert.
-- Manuell anzulegen im Supabase-Dashboard ODER über die SQL unten:

INSERT INTO storage.buckets (id, name, public)
VALUES ('protected-downloads', 'protected-downloads', false)
ON CONFLICT (id) DO NOTHING;

-- Keine Storage-Policies — Bucket bleibt für anon/authenticated unsichtbar,
-- Zugriff ausschließlich via service_role aus dem Backend.
