import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";
import { getLaunchPromoStatus } from "@/lib/promo";

export const runtime = "nodejs";

const PRODUCT_KEY = "off_season_plan_2026_elite";

export async function POST() {
  try {
    const product = getProduct(PRODUCT_KEY);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const base = siteUrl();

    // Auto-Apply für den Launch-Rabatt: Wenn der Promo-Code in Stripe aktiv
    // ist UND noch Slots frei sind, ziehen wir den Rabatt automatisch ab —
    // ohne dass der Käufer einen Code eingeben muss. Stripe zählt
    // `times_redeemed` selbst hoch und deaktiviert den Code, sobald
    // `max_redemptions` erreicht ist.
    const promo = await getLaunchPromoStatus();
    const discounts = promo.promotionCodeId
      ? [{ promotion_code: promo.promotionCodeId }]
      : undefined;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      ...(discounts ? { discounts } : {}),
      // Kein hart-kodiertes payment_method_types → Stripe nutzt "dynamic
      // payment methods": zeigt automatisch ALLE im Dashboard aktivierten
      // Methoden an (Karte inkl. Apple Pay / Google Pay automatisch, plus
      // PayPal / Klarna / SEPA — was immer der Coach im Dashboard freischaltet
      // und was zum Gerät/Land des Käufers passt).
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              description: product.description,
            },
            tax_behavior: "inclusive",
          },
        },
      ],
      automatic_tax: { enabled: true },
      customer_creation: "always",
      billing_address_collection: "required",
      // Hinweis: Die AGB-/Widerrufs-Zustimmung holen wir bereits auf der
      // eigenen Seite (Pflicht-Checkbox vor dem Checkout). Daher kein
      // Stripe-seitiges consent_collection nötig — das hängt sonst von einer
      // im Dashboard hinterlegten ToS-URL ab.
      custom_text: {
        submit: {
          message:
            "Mit dem Kauf beginnt die Lieferung sofort; dein Widerrufsrecht erlischt mit Beginn des Downloads.",
        },
      },
      locale: "de",
      success_url: `${base}${product.successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}${product.cancelPath}?canceled=1`,
      metadata: {
        product_key: product.key,
      },
      payment_intent_data: {
        metadata: { product_key: product.key },
        description: product.name,
      },
    });

    // Pre-create a "pending" purchase row (best-effort; Webhook ist die
    // autoritative Quelle und wird beim Status-Update den Eintrag finden).
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("purchases").insert({
        product_key: product.key,
        stripe_session_id: session.id,
        amount_cents: product.priceCents,
        currency: product.currency,
        customer_email: "pending@unresolved.local",
        status: "pending",
      });
    } catch (err) {
      // Wenn der Insert scheitert (z.B. Supabase noch nicht migriert), den
      // Checkout dennoch zulassen — der Webhook trägt den Datensatz nach.
      // eslint-disable-next-line no-console
      console.warn("[checkout] purchases insert (pending) failed:", err);
    }

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe returned no checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[checkout/off-season]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
