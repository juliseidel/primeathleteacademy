import { NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  STORAGE_BUCKET,
} from "@/lib/supabase-admin";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";

/**
 * GET /api/download/[token]
 *
 * Validates the download token, looks up the purchase, and redirects to a
 * short-lived signed Supabase Storage URL (~5 minutes). The token itself
 * is permanent until `download_expires_at` — the signed URL is regenerated
 * on each request, so users can re-download anytime within their 30-day
 * window.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Invalid token." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: purchase, error } = await supabase
    .from("purchases")
    .select("status, product_key, download_expires_at, download_count")
    .eq("download_token", token)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[download] supabase select error", error);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }

  if (!purchase) {
    return NextResponse.json({ error: "Token not found." }, { status: 404 });
  }

  if (purchase.status !== "paid") {
    return NextResponse.json(
      { error: "This purchase is not active." },
      { status: 403 }
    );
  }

  if (new Date(purchase.download_expires_at).getTime() < Date.now()) {
    return NextResponse.json(
      {
        error:
          "Dieser Download-Link ist abgelaufen. Bitte kontaktiere uns für einen neuen Link.",
      },
      { status: 410 }
    );
  }

  const product = getProduct(purchase.product_key);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  // Create a short-lived signed URL for the actual file. 5 minutes is
  // enough for the browser to start the download.
  const { data: signed, error: signedError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(product.storagePath, 60 * 5, {
      download: `${product.name}.pdf`,
    });

  if (signedError || !signed?.signedUrl) {
    // eslint-disable-next-line no-console
    console.error("[download] signed url error", signedError);
    return NextResponse.json(
      { error: "Could not create signed URL." },
      { status: 500 }
    );
  }

  // Track the download. Awaited, weil in einer Serverless-Function alles nach
  // dem Return abgebrochen wird — ein fire-and-forget-Update würde sonst oft
  // nicht durchlaufen.
  await supabase
    .from("purchases")
    .update({
      download_count: (purchase.download_count ?? 0) + 1,
      last_downloaded_at: new Date().toISOString(),
    })
    .eq("download_token", token);

  return NextResponse.redirect(signed.signedUrl, { status: 302 });
}
