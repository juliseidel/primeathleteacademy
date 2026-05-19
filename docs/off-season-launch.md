# Off-Season Plan 2026 — Launch-Anleitung

Komplette Checkliste, um den Verkauf des Off-Season-Plans live zu schalten.

---

## Was gebaut wurde

### Frontend (`src/app/`)
- **`/off-season-plan`** — Verkaufs-Detail-Seite (Hero, 4-Phasen-Timeline, Feature-Grid, Coach-Endorsement, Price-Block, FAQ, Final CTA)
- **`/off-season-plan/danke`** — Danke-Seite nach erfolgreicher Bezahlung (mit Direkt-Download und E-Mail-Hinweis)
- **`PromoBanner`** — Top-Strip auf jeder Seite (auto-versteckt sich nach `offSeasonPlan.campaignEndDate`, schließbar)
- **Featured-Section auf der Home** — direkt nach dem Stats-Ticker
- **Layout-Metadata** für `/off-season-plan` (OpenGraph, Keywords)

### Backend (`src/app/api/`)
- **`POST /api/checkout/off-season`** — erstellt eine Stripe Checkout Session
- **`GET /api/checkout/verify?session_id=…`** — validiert die Session für die Danke-Seite (idempotent, mit Polling-Support)
- **`POST /api/webhooks/stripe`** — verifiziert Webhook-Signatur, trägt den Kauf ein, schickt die Mail
- **`GET /api/download/[token]`** — Token-validiertes Re-Direct auf eine kurzlebige signierte Supabase-Storage-URL

### Libraries (`src/lib/`)
- `stripe.ts` — Stripe-SDK-Client + Site-URL-Helper
- `supabase-admin.ts` — Service-Role-Client (server-only)
- `products.ts` — Produkt-Katalog (Preis, Storage-Pfad, Redirect-URLs)
- `email.ts` — Resend-Versand mit Brand-konformem HTML-Template (Gold-Header, Inter-Style)
- `constants.ts` (Ergänzung) — `offSeasonPlan` mit Texten, FAQ, Wochen-Phasen, Features

### Datenbank + Storage
- **Migration `00000000000003_offseason_purchases.sql`** — `purchases`-Tabelle + `purchase_status` enum + `protected-downloads`-Bucket
- **RLS aktiviert, KEINE Public-Policies** — nur service-role-Zugriff
- **Download-Token** wird automatisch generiert (`gen_random_bytes(32)`), gültig 30 Tage

---

## Setup-Schritte (Reihenfolge)

### 1. Stripe-Account anlegen (Jonas + Patrick)

Komplette Anleitung in [docs/stripe-setup.md](./stripe-setup.md). Kurz:

- Account auf [stripe.com/de](https://stripe.com/de) erstellen
- Geschäftsdaten + USt-ID + Bankverbindung
- **Stripe Tax aktivieren** (Pflicht für DE-Mehrwertsteuer)
- Test-Keys aus Dashboard → an Julian schicken
- Nach Verifizierung: Live-Keys + Webhook-Secret nachreichen

### 2. Supabase-Migration anwenden

```bash
# Falls Supabase-CLI installiert:
supabase db push

# Alternativ: SQL aus
# supabase/migrations/00000000000003_offseason_purchases.sql
# manuell im Supabase Dashboard → SQL Editor ausführen
```

Prüfen im Dashboard:
- Tabelle `purchases` existiert
- Bucket `protected-downloads` ist als **privat** angelegt

### 3. PDF in Supabase Storage hochladen

PDF liegt in `private/off-season-plan-2026-elite.pdf` (gitignored).

```bash
# Voraussetzung: SUPABASE_SERVICE_ROLE_KEY in .env.local
node scripts/upload-off-season-pdf.mjs
```

Das Script ist idempotent — re-runs überschreiben die Datei.

### 4. Resend-Account einrichten

- Account auf [resend.com](https://resend.com) (Free-Tier reicht: 3.000 Mails/Monat)
- Domain `primeathleteacademy.com` verifizieren:
  - DNS-Records (SPF, DKIM, DMARC) eintragen — Resend zeigt sie an
  - Dauert ~10-30 Minuten bis Verifizierung durch ist
- API-Key generieren → in `.env.local` als `RESEND_API_KEY`
- Absender konfigurieren: `plan@primeathleteacademy.com` (oder anderer Subdomain-Alias)

**Falls Domain-Verifizierung dauert:** Resend erlaubt im Test als Absender
`onboarding@resend.dev` und Empfang nur an die eigene Account-Mail.

### 5. Environment-Variablen setzen

```bash
cp .env.example .env.local
# Werte eintragen — siehe Kommentare in .env.example
```

**Für Vercel Production:** Variablen via Vercel Dashboard → Project → Settings → Environment Variables eintragen. **Niemals** Secret-Keys ins Repo committen.

### 6. Stripe-Webhook konfigurieren

**Lokal (Test):**
```bash
# Stripe CLI installieren: brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# → kopiere das whsec_… und packe es in .env.local als STRIPE_WEBHOOK_SECRET
```

**Production:**
- Stripe Dashboard → Entwickler → Webhooks → Endpoint hinzufügen
- URL: `https://primeathleteacademy.com/api/webhooks/stripe`
- Events:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
- Signing Secret kopieren → Vercel als `STRIPE_WEBHOOK_SECRET`

---

## Lokales End-to-End-Testen

```bash
# Terminal 1
npm run dev

# Terminal 2 (Stripe CLI)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Test-Flow:
1. http://localhost:3000/off-season-plan aufrufen
2. "Jetzt sichern" klicken
3. Stripe-Test-Karte verwenden: `4242 4242 4242 4242`, beliebiges Datum + CVC, beliebige PLZ
4. Email-Adresse eingeben (für lokal-Test gerne deine eigene mit `+test` für Resend)
5. Nach Klick auf "Bezahlen" → Redirect auf `/off-season-plan/danke?session_id=…`
6. Download-Button sollte funktionieren
7. E-Mail sollte in deinem Postfach landen
8. Check `purchases`-Tabelle in Supabase — Status `paid`, `email_sent_at` gesetzt

**Häufige Fehlerquellen:**
- 500 vom Checkout-Endpoint → `STRIPE_SECRET_KEY` nicht gesetzt
- Webhook bekommt 400 "Invalid signature" → `STRIPE_WEBHOOK_SECRET` mit `stripe listen` neu generieren
- Download gibt 404 → PDF noch nicht in Storage hochgeladen, `scripts/upload-off-season-pdf.mjs` laufen
- E-Mail kommt nicht an → Resend-Domain nicht verifiziert ODER Absender-Adresse stimmt nicht

---

## Go-Live Checkliste

- [ ] Stripe Live-Keys in Vercel-Env eintragen (nicht Test-Keys!)
- [ ] Stripe Webhook auf Production-URL umstellen (`whsec_…` aus dem Live-Webhook)
- [ ] Resend-Domain verifiziert (DNS-Records gesetzt)
- [ ] PDF in **Production**-Supabase-Storage hochgeladen
- [ ] AGB + Widerrufsbelehrung auf `/datenschutz` oder eigener `/agb`-Seite ergänzen
- [ ] Mit echter Karte (nicht 4242…) einen Test-Kauf machen — danach manuell im Stripe-Dashboard refunden
- [ ] Email mit echter Adresse testen — Spam-Filter checken
- [ ] Banner-Datum prüfen: `offSeasonPlan.campaignEndDate` in `src/lib/constants.ts` (aktuell `2026-07-20`)
- [ ] Vercel-Deploy

---

## Nach 2 Monaten — Aktion beenden

Banner + Featured-Section verstecken sich automatisch nach `campaignEndDate`.
Wenn die Aktion komplett beendet werden soll:

1. `campaignEndDate` ist abgelaufen → Banner und Home-Featured-Section unsichtbar
2. **Optional:** Detail-Page `/off-season-plan` weiter erreichbar lassen oder Redirect:
   - Redirect via `next.config.ts`: `redirects()` → `/leistungen`
3. **Optional:** Stripe-Webhook deaktivieren (oder lassen für Refund-Tracking)
4. PDF im Supabase-Bucket lassen — falls ein Käufer noch innerhalb seiner 30 Tage downloaden will

---

## Datei-Übersicht

```
docs/
├── stripe-setup.md           # Anweisung für Coaches
└── off-season-launch.md      # dieses File

private/
└── off-season-plan-2026-elite.pdf   # gitignored

scripts/
└── upload-off-season-pdf.mjs        # einmaliger Upload nach Supabase

supabase/migrations/
└── 00000000000003_offseason_purchases.sql

src/app/
├── off-season-plan/
│   ├── layout.tsx            # SEO/Metadata
│   ├── page.tsx              # Verkaufs-Page
│   └── danke/page.tsx        # Bestätigung + Download
└── api/
    ├── checkout/
    │   ├── off-season/route.ts   # Session erstellen
    │   └── verify/route.ts       # Session validieren
    ├── webhooks/stripe/route.ts  # Webhook handler
    └── download/[token]/route.ts # Signed URL Redirect

src/components/layout/
└── PromoBanner.tsx           # Top-Strip auf allen Pages

src/lib/
├── stripe.ts                 # Stripe-Client
├── supabase-admin.ts         # Service-Role-Client
├── products.ts               # Produkt-Katalog
├── email.ts                  # Resend-Versand
└── constants.ts              # offSeasonPlan Texte + FAQ + Wochen
```

---

## Rechtliches

- **Widerrufsrecht:** Mit `consent_collection.terms_of_service = "required"` muss
  der Käufer im Stripe-Checkout aktiv bestätigen, dass sein Widerrufsrecht mit
  Beginn des Downloads erlischt. Der Custom-Text dazu ist in `/api/checkout/off-season/route.ts`.
- **AGB + Datenschutz:** Müssen erreichbar sein (Footer-Links). Stripe verlinkt
  sie nicht selbst, aber der Käufer akzeptiert sie via `terms_of_service_url` —
  derzeit nicht gesetzt, kann ergänzt werden sobald AGB-Seite existiert.
- **Impressum:** Bereits unter `/impressum` vorhanden.
- **USt-Rechnung:** Stripe Tax generiert automatisch konforme Rechnungen mit
  19 % MwSt-Ausweis und schickt sie dem Käufer per Mail.
