/**
 * Catalog of digital products that can be purchased via Stripe Checkout.
 * Server-only — used in /api/checkout/* and webhook handlers.
 */

import { OFF_SEASON_PDF_PATH } from "./supabase-admin";

export type DigitalProduct = {
  key: string;
  name: string;
  description: string;
  priceCents: number;
  currency: "eur";
  storagePath: string;
  /** Redirect path after successful checkout (without query string). */
  successPath: string;
  cancelPath: string;
};

export const PRODUCTS: Record<string, DigitalProduct> = {
  off_season_plan_2026_elite: {
    key: "off_season_plan_2026_elite",
    name: "Off-Season Plan 2026 — Elite Edition",
    description:
      "67-seitiger periodisierter Athletik- und Ernährungsplan für die Saison-Vorbereitung. PDF-Download.",
    priceCents: 9900,
    currency: "eur",
    storagePath: OFF_SEASON_PDF_PATH,
    successPath: "/off-season-plan/danke",
    cancelPath: "/off-season-plan",
  },
};

export function getProduct(key: string): DigitalProduct | null {
  return PRODUCTS[key] ?? null;
}
