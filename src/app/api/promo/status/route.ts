import { NextResponse } from "next/server";
import { getLaunchPromoStatus } from "@/lib/promo";

export const runtime = "nodejs";

/**
 * GET /api/promo/status
 *
 * Liefert nur `{ active: boolean }` — bewusst KEIN Counter / kein
 * `times_redeemed`-Wert, weil Coach explizit keine sichtbaren Zahlen
 * möchte (Knappheit-Wording statt harter Counter).
 *
 * Wird vom Frontend (Banner-Komponente) gepollt; mit 30 s public-Cache,
 * damit nicht jeder Page-Load Stripe pingt.
 */
export async function GET() {
  const status = await getLaunchPromoStatus();
  return NextResponse.json(
    { active: status.active },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  );
}
