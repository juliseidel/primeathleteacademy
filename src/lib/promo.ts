/**
 * Promo-Code-Konfiguration für den Off-Season Plan.
 *
 * Der Code wird in Stripe verwaltet (Coupon + Promotion Code). Aktivierung /
 * Deaktivierung erfolgt im Stripe-Dashboard (Promotion Codes → SUMMER25 →
 * Toggle "Active") — oder via API.
 *
 * Aktuelle Aktion: 25 % Sommer-Rabatt, unbegrenzte Einlösungen.
 * Stripe-IDs:
 *  - Coupon:         tCnM2abP (25 % off)
 *  - Promotion Code: promo_1TiCMyLpNyRPKCxv6ENVPcKf (Code: SUMMER25)
 *
 * Vorherige Aktion (beendet): Coupon uMfMAEIh / Code LAUNCH2K (20 %, 19/20).
 */

import { getStripe } from "./stripe";

/** Display code — auch das was Käufer (theoretisch) eingeben würden. */
export const LAUNCH_PROMO_CODE = "SUMMER25";

/** Rabatt in Prozent — für die Anzeige im Frontend. */
export const LAUNCH_PROMO_PERCENT = 25;

export type LaunchPromoStatus = {
  /** True, wenn der Promo-Code aktiv ist UND noch mindestens 1 Slot frei. */
  active: boolean;
  /** Stripe Promotion Code-ID, falls aktiv — sonst null. Wird vom Checkout
   *  für Auto-Apply benötigt. */
  promotionCodeId: string | null;
};

/**
 * Liest den aktuellen Status des Launch-Codes aus Stripe.
 *
 * Returns `{ active: false, promotionCodeId: null }` falls
 *  - der Code nicht existiert,
 *  - Stripe nicht erreichbar ist,
 *  - der Code in Stripe inaktiv ist,
 *  - oder alle Einlösungen aufgebraucht sind.
 *
 * Wirft niemals — der Aufrufer kann sich auf das Result verlassen.
 */
export async function getLaunchPromoStatus(): Promise<LaunchPromoStatus> {
  try {
    const stripe = getStripe();
    const list = await stripe.promotionCodes.list({
      code: LAUNCH_PROMO_CODE,
      limit: 1,
    });
    const promo = list.data[0];
    if (!promo) {
      return { active: false, promotionCodeId: null };
    }

    const slotsLeft =
      promo.max_redemptions === null || promo.max_redemptions === undefined
        ? Infinity
        : promo.max_redemptions - promo.times_redeemed;

    const isActive = promo.active && slotsLeft > 0;

    return {
      active: isActive,
      promotionCodeId: isActive ? promo.id : null,
    };
  } catch (err) {
    console.warn("[promo/status] fetch failed, returning inactive:", err);
    return { active: false, promotionCodeId: null };
  }
}
