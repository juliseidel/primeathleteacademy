"use client";

import { motion, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import RevealText from "@/components/animation/RevealText";
import FadeInView from "@/components/animation/FadeInView";
import SpeedLines from "@/components/effects/SpeedLines";
import FootballFieldLines from "@/components/effects/FootballFieldLines";
import { contact, stats } from "@/lib/constants";

export default function HomeHero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const background = useMotionTemplate`radial-gradient(350px circle at ${smoothX}px ${smoothY}px, rgba(197,165,90,0.06), transparent 80%)`;

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Football field lines (very subtle) */}
      <FootballFieldLines className="opacity-60" />

      {/* Speed lines */}
      <SpeedLines count={4} />

      {/* Gold glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/[0.04] rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[120px]" />

      {/* Cursor-following glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Badge */}
        <FadeInView delay={0.2}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-gold text-sm font-medium tracking-wide">
              Elite Athletik-Coaching
            </span>
          </span>
        </FadeInView>

        {/* Main heading */}
        <RevealText
          text="Entfessle dein"
          as="h1"
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
          delay={0.3}
        />
        <RevealText
          text="volles Potenzial"
          as="p"
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-gold glow-gold-text leading-tight"
          delay={0.5}
        />

        {/* Subheading */}
        <FadeInView delay={0.7}>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mt-8 mb-12 leading-relaxed">
            Individuelles Athletik- und Ernährungscoaching von Profifußballern
            &mdash; wissenschaftlich fundiert, auf dich zugeschnitten.
          </p>
        </FadeInView>

        {/* CTA buttons */}
        <FadeInView delay={0.9}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <GlowButton
              href={contact.calendlyUrl}
              variant="primary"
              size="large"
              external
            >
              Kostenloses Erstgespräch
            </GlowButton>
            <GlowButton href="/leistungen" variant="secondary" size="large">
              Was wir bieten
            </GlowButton>
          </div>
        </FadeInView>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-24 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              target={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              duration={2.5}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="text-gray-600 hover:text-gold transition-colors cursor-pointer"
        >
          <ChevronDown size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}
