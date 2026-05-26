import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Lazy-initialized Stripe client.
 *
 * Stripe's constructor throws when `apiKey` is empty, which would crash the
 * Next.js build during "Collect page data" if the env var isn't set yet.
 * We defer construction until the first request.
 */
export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured — Checkout/Webhook nicht möglich."
    );
  }
  cached = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    appInfo: {
      name: "Prime Athlete Academy",
      url: "https://primeathleteacademy.com",
    },
  });
  return cached;
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
