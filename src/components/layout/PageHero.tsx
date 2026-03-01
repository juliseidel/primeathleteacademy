"use client";

import RevealText from "@/components/animation/RevealText";
import FadeInView from "@/components/animation/FadeInView";
import GoldGlow from "@/components/effects/GoldGlow";
import GridPattern from "@/components/effects/GridPattern";

interface PageHeroProps {
  tag: string;
  title: string;
  titleAccent?: string;
  description?: string;
  backgroundVariant?: "lines" | "dots";
}

export default function PageHero({
  tag,
  title,
  titleAccent,
  description,
  backgroundVariant = "lines",
}: PageHeroProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950" />
      <GridPattern variant={backgroundVariant} />
      <GoldGlow size="lg" position="center" className="opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Tag */}
        <FadeInView delay={0.1}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-gold text-sm font-medium tracking-wide">
              {tag}
            </span>
          </span>
        </FadeInView>

        {/* Title */}
        <RevealText
          text={title}
          as="h1"
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
          delay={0.2}
        />
        {titleAccent && (
          <RevealText
            text={titleAccent}
            as="p"
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-500 leading-tight mt-2"
            delay={0.4}
          />
        )}

        {/* Description */}
        {description && (
          <FadeInView delay={0.6}>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-8 leading-relaxed">
              {description}
            </p>
          </FadeInView>
        )}
      </div>
    </section>
  );
}
