"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowCard from "@/components/ui/GlowCard";
import StaggerChildren from "@/components/animation/StaggerChildren";
import { fadeInUp } from "@/lib/animations";
import { testimonials } from "@/lib/constants";

export default function HomeTestimonialPreview() {
  // Show first 2 testimonials on homepage
  const featured = testimonials.slice(0, 2);

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          tag="Referenzen"
          title="Was unsere Athleten"
          titleMuted="über uns sagen"
        />

        <StaggerChildren className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {featured.map((t) => (
            <motion.div key={t.name} variants={fadeInUp}>
              <GlowCard padding="large" className="h-full">
                <Quote className="w-10 h-10 text-gold/20 mb-6" />
                <p className="text-gray-300 leading-relaxed mb-8 text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <span className="text-gold text-sm font-bold">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-sm">
                      {t.team} &middot; {t.league}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </StaggerChildren>

        {/* Link to all */}
        <div className="text-center mt-10">
          <Link
            href="/referenzen"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors group"
          >
            Alle Referenzen ansehen
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
