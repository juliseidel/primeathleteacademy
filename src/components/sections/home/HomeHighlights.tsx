"use client";

import { motion } from "framer-motion";
import { Zap, Apple, Trophy } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowCard from "@/components/ui/GlowCard";
import StaggerChildren from "@/components/animation/StaggerChildren";
import { fadeInUp } from "@/lib/animations";

const highlights = [
  {
    icon: Zap,
    title: "Athletiktraining",
    description:
      "Schnelligkeit, Explosivkraft, Stabilität und Ausdauer. Individualisierte Trainingspläne, abgestimmt auf deine Position und Saisonphase.",
    href: "/athletiktraining",
    color: "text-gold",
  },
  {
    icon: Apple,
    title: "Ernährungscoaching",
    description:
      "Personalisierte Ernährungspläne für maximale Leistungsfähigkeit. Von Matchday-Nutrition bis Regenerationsernährung.",
    href: "/ernaehrung",
    color: "text-gold",
  },
  {
    icon: Trophy,
    title: "Proven Results",
    description:
      "Klienten von der 2. Bundesliga bis zur Regionalliga vertrauen auf unsere Methoden. Die Ergebnisse sprechen für sich.",
    href: "/referenzen",
    color: "text-gold",
  },
];

export default function HomeHighlights() {
  return (
    <section className="py-24 sm:py-32 relative gradient-mesh">
      <div className="max-w-7xl mx-auto px-6">
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
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors duration-300">
                    <item.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-gold/70 group-hover:text-gold transition-colors">
                    Mehr erfahren
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
