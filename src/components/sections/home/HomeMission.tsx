"use client";

import FadeInView from "@/components/animation/FadeInView";
import Divider from "@/components/ui/Divider";
import GoldGlow from "@/components/effects/GoldGlow";
import { mission } from "@/lib/constants";

export default function HomeMission() {
  return (
    <section className="py-24 sm:py-32 relative gradient-mesh-subtle">
      <Divider />

      {/* Background glow */}
      <GoldGlow size="lg" position="center" className="opacity-30" />

      <div className="relative max-w-4xl mx-auto px-6 pt-24 text-center">
        <FadeInView>
          <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-8">
            Unsere Mission
          </p>
        </FadeInView>

        <FadeInView delay={0.2}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
            {mission.headline}
          </h2>
        </FadeInView>

        <FadeInView delay={0.4}>
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            {mission.text}
          </p>
        </FadeInView>

        {/* Decorative gold line */}
        <FadeInView delay={0.6}>
          <div className="mt-12 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </FadeInView>
      </div>
    </section>
  );
}
