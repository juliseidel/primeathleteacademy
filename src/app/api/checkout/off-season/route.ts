import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";

const PRODUCT_KEY = "off_season_plan_2026_elite";

export async function POST() {
  try {
    const product = getProduct(PRODUCT_KEY);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const base = siteUrl();

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "klarna", "sepa_debit"],
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
      // Wichtig für DSGVO/Widerrufsrecht digitaler Produkte: Käufer muss
      // ausdrücklich bestätigen. Stripe zeigt automatisch einen Hinweis,
      // wenn man `consent_collection.terms_of_service` aktiviert.
      consent_collection: { terms_of_service: "required" },
      custom_text: {
        terms_of_service_acceptance: {
          message:
            "Ich stimme den AGB zu und bestätige, dass die Lieferung vor Ablauf der Widerrufsfrist beginnt und mein Widerrufsrecht mit Beginn des Downloads erlischt.",
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
