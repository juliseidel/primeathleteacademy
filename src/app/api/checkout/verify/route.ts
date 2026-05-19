import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

/**
 * GET /api/checkout/verify?session_id=cs_...
 *
 * Validates a Stripe Checkout session and returns purchase details + a
 * download token. Idempotent — can be polled by the Danke-Page while
 * the webhook is still in-flight.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId || !sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "Missing or invalid session_id." },
        { status: 400 }
      );
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["customer_details", "payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        status: "pending",
        paymentStatus: session.payment_status,
      });
    }

    const supabase = getSupabaseAdmin();

    // Lookup or upsert the purchase row.
    const { data: existing, error: existingError } = await supabase
      .from("purchases")
      .select("download_token, customer_email, product_key, status")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existingError) {
      // eslint-disable-next-line no-console
      console.error("[verify] supabase select error", existingError);
    }

    if (existing && existing.status === "paid" && existing.download_token) {
      return NextResponse.json({
        status: "paid",
        downloadToken: existing.download_token,
        email: existing.customer_email,
        productKey: existing.product_key,
      });
    }

    // Webhook noch nicht durch — wir markieren bezahlt selbst (idempotent).
    const customerEmail = session.customer_details?.email ?? null;
    const customerName = session.customer_details?.name ?? null;
    const customerCountry = session.customer_details?.address?.country ?? null;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
    const productKey =
      (session.metadata?.product_key as string | undefined) ?? "unknown";

    const { data: upserted, error: upsertError } = await supabase
      .from("purchases")
      .upsert(
        {
          product_key: productKey,
          stripe_session_id: sessionId,
          stripe_payment_intent_id: paymentIntentId,
          stripe_customer_id:
            typeof session.customer === "string" ? session.customer : null,
          customer_email: customerEmail ?? "unknown@unresolved.local",
          customer_name: customerName,
          customer_country: customerCountry,
          amount_cents: session.amount_total ?? 0,
          currency: session.currency ?? "eur",
          status: "paid",
          paid_at: new Date().toISOString(),
        },
        { onConflict: "stripe_session_id" }
      )
      .select("download_token, customer_email, product_key")
      .single();

    if (upsertError || !upserted) {
      // eslint-disable-next-line no-console
      console.error("[verify] upsert error", upsertError);
      return NextResponse.json(
        { error: "Failed to record purchase." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "paid",
      downloadToken: upserted.download_token,
      email: upserted.customer_email,
      productKey: upserted.product_key,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[checkout/verify]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
