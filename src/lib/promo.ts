/**
 * Promo-Code-Konfiguration für den Off-Season Plan.
 *
 * Der Code wird in Stripe verwaltet (Coupon + Promotion Code) und ist
 * standardmäßig inaktiv. Aktivierung erfolgt manuell im Stripe-Dashboard
 * (Promotion Codes → LAUNCH2K → Toggle "Active") — oder via API mit dem
 * passenden Helper auf Anfrage.
 *
 * Stripe-IDs:
 *  - Coupon:         uMfMAEIh
 *  - Promotion Code: promo_1TcmIILpNyRPKCxvqypistQm (Code: LAUNCH2K)
 */

import { getStripe } from "./stripe";

/** Display code — auch das was Käufer (theoretisch) eingeben würden. */
export const LAUNCH_PROMO_CODE = "LAUNCH2K";

/** Maximale Einlösungen — muss mit dem in Stripe gesetzten Wert übereinstimmen. */
export const LAUNCH_PROMO_MAX_REDEMPTIONS = 20;

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
