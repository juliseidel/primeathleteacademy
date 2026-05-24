import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Server-only Supabase client with the service_role key.
 *
 * MUST NOT be imported into client components — the service_role key
 * bypasses RLS and would be a critical security leak if exposed.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "[supabase-admin] SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein."
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return cached;
}

export const STORAGE_BUCKET = "protected-downloads";
export const OFF_SEASON_PDF_PATH = "off-season-plan-2026-elite.pdf";

// 30 Tage in Sekunden — passend zu purchase.download_expires_at-Default.
export const MAIL_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 30;

/**
 * Erstellt eine lang-laufende signed Supabase-Storage-URL für die Mail.
 * Der Link funktioniert direkt — ohne Umweg über unseren Server, ohne
 * Vercel-Auth, ohne Token-Lookup. Browser lädt das PDF sofort herunter.
 */
export async function createDirectDownloadUrl(
  storagePath: string,
  downloadFilename: string
): Promise<string | null> {
  const { data, error } = await getSupabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, MAIL_SIGNED_URL_TTL_SECONDS, {
      download: downloadFilename,
    });
  if (error || !data?.signedUrl) {
    // eslint-disable-next-line no-console
    console.error("[storage] createSignedUrl failed", error);
    return null;
  }
  return data.signedUrl;
}
