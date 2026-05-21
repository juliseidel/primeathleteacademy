import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";
import { sendPurchaseEmail } from "@/lib/email";
import { siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

const MAX_RESENDS = 5;

/**
 * POST /api/download/resend  { email: string }
 *
 * Schickt einem Käufer seinen Download-Link erneut. Gibt aus Datenschutz-
 * gründen IMMER eine generische Erfolgsmeldung zurück (keine Auskunft, ob
 * eine E-Mail existiert → keine Adress-Enumeration).
 */
export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ error: "Bitte gültige E-Mail eingeben." }, { status: 400 });
  }

  // Generische Antwort — unabhängig vom Ergebnis.
  const genericOk = NextResponse.json({
    ok: true,
    message:
      "Falls ein Kauf mit dieser E-Mail existiert, haben wir den Download-Link gerade verschickt.",
  });

  try {
    const supabase = getSupabaseAdmin();

    const { data: purchase } = await supabase
      .from("purchases")
      .select(
        "download_token, customer_name, product_key, status, download_expires_at, email_resent_count"
      )
      .eq("customer_email", email)
      .eq("status", "paid")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!purchase) return genericOk;

    // Abgelaufen? Dann nicht neu senden (Link wäre ohnehin tot).
    if (new Date(purchase.download_expires_at).getTime() < Date.now()) {
      return genericOk;
    }

    // Rate-Limit: max. MAX_RESENDS erneute Sendungen.
    if ((purchase.email_resent_count ?? 0) >= MAX_RESENDS) {
      return genericOk;
    }

    const product = getProduct(purchase.product_key);
    const downloadUrl = `${siteUrl()}/api/download/${purchase.download_token}`;

    await sendPurchaseEmail({
      toEmail: email,
      toName: purchase.customer_name ?? null,
      productName: product?.name ?? "Prime Athlete Academy",
      downloadUrl,
    });

    await supabase
      .from("purchases")
      .update({ email_resent_count: (purchase.email_resent_count ?? 0) + 1 })
      .eq("download_token", purchase.download_token);

    return genericOk;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[download/resend]", err);
    // Auch im Fehlerfall generisch antworten.
    return genericOk;
  }
}
