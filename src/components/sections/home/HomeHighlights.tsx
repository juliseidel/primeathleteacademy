"use client";

import { motion } from "framer-motion";
import { Zap, Apple, Trophy } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowCard from "@/components/ui/GlowCard";
import StaggerChildren from "@/components/animation/StaggerChildren";
import GoldGlow from "@/components/effects/GoldGlow";
import { fadeInUp } from "@/lib/animations";

const highlights = [
  {
    icon: Zap,
    title: "Athletiktraining",
    description:
      "Schnelligkeit, Explosivkraft, Stabilität und Ausdauer. Individualisierte Trainingspläne, abgestimmt auf deine Position und Saisonphase.",
    href: "/athletiktraining",
  },
  {
    icon: Apple,
    title: "Ernährungscoaching",
    description:
      "Personalisierte Ernährungspläne für maximale Leistungsfähigkeit. Von Matchday-Nutrition bis Regenerationsernährung.",
    href: "/ernaehrung",
  },
  {
    icon: Trophy,
    title: "Proven Results",
    description:
      "Klienten von der 2. Bundesliga bis zur Regionalliga vertrauen auf unsere Methoden. Die Ergebnisse sprechen für sich.",
    href: "/referenzen",
  },
];

export default function HomeHighlights() {
  return (
    <section className="py-24 sm:py-32 relative gradient-mesh">
      {/* Section separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <GoldGlow size="lg" position="top-left" className="opacity-20" />
      <GoldGlow size="md" position="bottom-right" className="opacity-15" />

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          tag="Was wir bieten"
          title="Dein Vorteil"
          titleMuted="auf einen Blick"
          description="Drei Säulen für deine optimale Performance. Alles individuell auf dich abgestimmt."
        />

        <StaggerChildren className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {highlights.map((item) => (
            <motion.div key={item.title} variants={fadeInUp}>
              <Link href={item.href} className="block group">
                <GlowCard className="h-full" padding="large">
                  <div className="w-14 h-14 rounded-xl bg-gold/[0.08] border border-gold/[0.12] flex items-center justify-center mb-6 group-hover:bg-gold/15 group-hover:border-gold/25 group-hover:shadow-[0_0_20px_rgba(197,165,90,0.15)] transition-all duration-500">
                    <item.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-gold/60 group-hover:text-gold transition-colors duration-300">
                    Mehr erfahren
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </GlowCard>
              </Link>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
