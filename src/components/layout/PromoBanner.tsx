"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Sparkles } from "lucide-react";
import { offSeasonPlan } from "@/lib/constants";

const DISMISS_KEY = "paa_promo_banner_dismissed_off_season_2026";

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flicker
  const [campaignActive, setCampaignActive] = useState(false);

  useEffect(() => {
    // Hydration-safe init: read campaign and dismissed state on the client.
    const endDate = new Date(offSeasonPlan.campaignEndDate).getTime();
    const stored = typeof window !== "undefined" ? localStorage.getItem(DISMISS_KEY) : null;
    /* eslint-disable react-hooks/set-state-in-effect */
    setCampaignActive(Date.now() < endDate);
    setDismissed(stored === "1");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem(DISMISS_KEY, "1");
  };

  if (!campaignActive) return null;

  return (
    <AnimatePresence>
      {!dismissed ? (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-background"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/off-season-plan"
              className="flex items-center justify-center gap-2 md:gap-3 py-2 md:py-2.5 group"
            >
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-[11px] md:text-sm font-bold tracking-wider uppercase">
                <span className="hidden sm:inline">Limitiert · </span>
                Off-Season Plan 2026
              </span>
              <span className="hidden md:inline text-xs opacity-80">
                4 Wochen periodisiert · von Profis
              </span>
              <span className="text-[11px] md:text-sm font-black">— 99 €</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDismiss();
            }}
            aria-label="Banner schließen"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black/10 rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
