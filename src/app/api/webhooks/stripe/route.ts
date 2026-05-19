import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET, siteUrl } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";
import { sendPurchaseEmail } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Stripe Webhook handler.
 *
 * Stripe verifies the request signature using the raw request body, so we
 * MUST NOT parse JSON before verification.
 */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    // eslint-disable-next-line no-console
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      raw,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.async_payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        // Other events we don't care about
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[webhook] handler error", err);
    // Stripe retries on non-2xx — we want it to retry on transient errors,
    // but only return 500 for genuine failures.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const productKey =
    (session.metadata?.product_key as string | undefined) ?? "unknown";
  const product = getProduct(productKey);

  const customerEmail = session.customer_details?.email;
  if (!customerEmail) {
    // eslint-disable-next-line no-console
    console.warn("[webhook] no customer email on session", session.id);
    return;
  }

  const supabase = getSupabaseAdmin();

  // Upsert as paid. The DB default generates a download_token automatically
  // on insert. On a re-emit we keep the existing token.
  const { data: row, error } = await supabase
    .from("purchases")
    .upsert(
      {
        product_key: productKey,
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        stripe_customer_id:
          typeof session.customer === "string" ? session.customer : null,
        customer_email: customerEmail,
        customer_name: session.customer_details?.name ?? null,
        customer_country: session.customer_details?.address?.country ?? null,
        amount_cents: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        status: "paid",
        paid_at: new Date().toISOString(),
      },
      { onConflict: "stripe_session_id" }
    )
    .select("download_token, email_sent_at, customer_name")
    .single();

  if (error || !row) {
    throw new Error(`Failed to upsert purchase: ${error?.message}`);
  }

  // Send the email if it hasn't been sent yet (webhook can be replayed).
  if (!row.email_sent_at) {
    const downloadUrl = `${siteUrl()}/api/download/${row.download_token}`;
    try {
      await sendPurchaseEmail({
        toEmail: customerEmail,
        toName: row.customer_name ?? session.customer_details?.name ?? null,
        productName: product?.name ?? "Prime Athlete Academy",
        downloadUrl,
      });

      await supabase
        .from("purchases")
        .update({ email_sent_at: new Date().toISOString() })
        .eq("stripe_session_id", session.id);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[webhook] email send failed (will retry on replay)", err);
      // Don't rethrow — the customer still has the direct download via the
      // Danke-Page; we'll just leave email_sent_at NULL so a manual resend
      // can pick it up.
    }
  }
}

async function handlePaymentFailed(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from("purchases")
    .update({ status: "failed" })
    .eq("stripe_session_id", session.id);
}
