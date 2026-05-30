"use client";

import { useEffect, useState } from "react";

/**
 * Modul-globaler Mini-Cache: vermeidet, dass jede Komponente, die den Hook
 * verwendet, einen eigenen Fetch absetzt. 30 s TTL, gleich wie der API-Cache.
 */
let cached: { active: boolean; ts: number } | null = null;
const CACHE_MS = 30_000;

/**
 * Liest den Aktiv-Status des Launch-Rabatts (Stripe Promotion Code "LAUNCH2K").
 *
 * Returns:
 *  - `null`  → noch nicht geladen (initial)
 *  - `true`  → Rabatt aktiv & noch Slots frei → Banner/Highlights zeigen
 *  - `false` → inaktiv oder ausverkauft → normale Variante zeigen
 *
 * Defensiv: bei Fetch-Fehler wird `false` zurückgegeben (Banner versteckt
 * sich lieber, als bei einem Stripe-Hänger fälschlich zu erscheinen).
 */
export function useLaunchPromoActive(): boolean | null {
  const [active, setActive] = useState<boolean | null>(() =>
    cached && Date.now() - cached.ts < CACHE_MS ? cached.active : null
  );

  useEffect(() => {
    // Wenn der Cache zum Mount-Zeitpunkt frisch war, hat useState bereits
    // den gecachten Wert übernommen — nichts zu fetchen.
    if (cached && Date.now() - cached.ts < CACHE_MS) return;

    let alive = true;
    fetch("/api/promo/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { active?: boolean }) => {
        if (!alive) return;
        const isActive = Boolean(d?.active);
        cached = { active: isActive, ts: Date.now() };
        setActive(isActive);
      })
      .catch(() => {
        if (!alive) return;
        cached = { active: false, ts: Date.now() };
        setActive(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return active;
}
