"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { offSeasonPlan } from "@/lib/constants";
import { useLaunchPromoActive } from "@/lib/use-launch-promo";

const DISMISS_KEY = "paa_promo_banner_dismissed_off_season_2026";
const BANNER_H_PX = 32;

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flicker
  const [campaignActive, setCampaignActive] = useState(false);
  const launchActive = useLaunchPromoActive();

  useEffect(() => {
    // Hydration-safe init: read campaign and dismissed state on the client.
    const endDate = new Date(offSeasonPlan.campaignEndDate).getTime();
    const stored = typeof window !== "undefined" ? localStorage.getItem(DISMISS_KEY) : null;
    /* eslint-disable react-hooks/set-state-in-effect */
    setCampaignActive(Date.now() < endDate);
    setDismissed(stored === "1");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Publish banner height as a CSS variable on <html> so the Navigation can
  // anchor itself below the banner (avoids the two stacking and overlapping
  // each other at the top of the page).
  useEffect(() => {
    const visible = campaignActive && !dismissed;
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--promo-banner-h",
      visible ? `${BANNER_H_PX}px` : "0px"
    );
    return () => {
      document.documentElement.style.setProperty("--promo-banner-h", "0px");
    };
  }, [campaignActive, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem(DISMISS_KEY, "1");
  };

  if (!campaignActive) return null;

  return (
    <AnimatePresence>
      {!dismissed ? (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ height: BANNER_H_PX }}
          className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-background"
        >
          <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
            <Link
              href="/off-season-plan"
              className="flex items-center justify-center gap-1.5 md:gap-2.5 h-full group text-[11px] md:text-[13px]"
            >
              {launchActive ? (
                <>
                  <span className="font-black tracking-wider uppercase">
                    🎉 Launch-Rabatt
                  </span>
                  <span className="hidden sm:inline font-bold">
                    20 % auf den Off-Season Plan sichern
                  </span>
                  <span className="sm:hidden font-bold">
                    20 % auf den Off-Season Plan
                  </span>
                </>
              ) : (
                <>
                  <span className="font-bold tracking-wider uppercase">
                    Off-Season Plan 2026
                  </span>
                  <span className="font-black">— 99 €</span>
                </>
              )}
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDismiss();
              }}
              aria-label="Banner schließen"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
