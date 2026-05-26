import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin, createDirectDownloadUrl } from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";
import { sendPurchaseEmail } from "@/lib/email";

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
      .select("download_token, customer_email, customer_name, product_key, email_sent_at")
      .single();

    if (upsertError || !upserted) {
      // eslint-disable-next-line no-console
      console.error("[verify] upsert error", upsertError);
      return NextResponse.json(
        { error: "Failed to record purchase." },
        { status: 500 }
      );
    }

    // Mail-Backup: Falls noch nicht verschickt (Webhook nicht konfiguriert
    // oder hat sich verzögert), schicken wir sie hier. Race-condition-safe
    // via conditional update auf email_sent_at — wir senden nur, wenn unser
    // Update das Feld tatsächlich von NULL auf NOW gesetzt hat.
    if (!upserted.email_sent_at && customerEmail) {
      const { data: claimed } = await supabase
        .from("purchases")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("stripe_session_id", sessionId)
        .is("email_sent_at", null)
        .select("download_token")
        .maybeSingle();

      if (claimed?.download_token) {
        const product = getProduct(upserted.product_key);
        // Direct signed Supabase URL → Mail-Klick lädt sofort das PDF.
        const downloadUrl = product
          ? await createDirectDownloadUrl(
              product.storagePath,
              `${product.name}.pdf`
            )
          : null;
        try {
          if (!downloadUrl) throw new Error("Could not create signed URL");
          await sendPurchaseEmail({
            toEmail: customerEmail,
            toName: upserted.customer_name ?? null,
            productName: product?.name ?? "Prime Athlete Academy",
            downloadUrl,
          });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("[verify] email send failed", err);
          // email_sent_at zurücksetzen, damit ein späterer Versuch
          // (Webhook, Resend-Endpoint) es nochmal probieren kann.
          await supabase
            .from("purchases")
            .update({ email_sent_at: null })
            .eq("stripe_session_id", sessionId);
        }
      }
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
