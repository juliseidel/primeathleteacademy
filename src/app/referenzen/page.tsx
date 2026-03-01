import { generatePageMetadata } from "@/lib/metadata";
import PageHero from "@/components/layout/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import GlowCard from "@/components/ui/GlowCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import FadeInView from "@/components/animation/FadeInView";
import StaggerChildren from "@/components/animation/StaggerChildren";
import Divider from "@/components/ui/Divider";
import GoldGlow from "@/components/effects/GoldGlow";
import { testimonials, stats, contact } from "@/lib/constants";
import { Quote } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Referenzen",
  description:
    "Was unsere Athleten über die Prime Athlete Academy sagen. Erfahrungsberichte von Profifußballern aus der 2. Bundesliga, 3. Liga und 4. Liga.",
  path: "/referenzen",
});

export default function ReferenzenPage() {
  return (
    <>
      <PageHero
        tag="Referenzen"
        title="Was unsere Athleten"
        titleAccent="über uns sagen"
        description="Profifußballer aus ganz Deutschland vertrauen auf unser Coaching. Hier sind ihre Geschichten."
      />

      {/* ===== STATS SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="md" position="center" className="opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <FadeInView>
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <AnimatedCounter
                  key={i}
                  target={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </div>
          </FadeInView>
        </div>
      </section>

      <Divider />

      {/* ===== TESTIMONIALS GRID ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-subtle" />
        <GoldGlow size="lg" position="top-left" className="opacity-20" />
        <GoldGlow size="md" position="bottom-right" className="opacity-15" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="Testimonials"
            title="Stimmen unserer Athleten"
            titleMuted="Echte Erfahrungen, echte Ergebnisse"
          />

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <FadeInView key={i} direction="up" delay={i * 0.1}>
                <GlowCard padding="large" className="h-full flex flex-col">
                  {/* Quote icon */}
                  <div className="mb-6">
                    <Quote className="w-10 h-10 text-gold/30" />
                  </div>

                  {/* Quote text */}
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Attribution */}
                  <div className="border-t border-gray-800/50 pt-6">
                    <p className="text-white font-semibold text-lg">
                      {testimonial.name}
                    </p>
                    <p className="text-gold/80 text-sm mt-1">
                      {testimonial.team}
                    </p>
                    <p className="text-gray-500 text-sm">{testimonial.league}</p>
                  </div>
                </GlowCard>
              </FadeInView>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="lg" position="center" className="opacity-30" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Werde Teil der Academy
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Schließe dich den Athleten an, die bereits von unserem Coaching
              profitieren. Starte mit einem kostenlosen Erstgespräch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton
                href={contact.calendlyUrl}
                external
                size="large"
                showArrow
              >
                Kostenloses Erstgespräch buchen
              </GlowButton>
              <GlowButton
                href={contact.instagramUrl}
                variant="secondary"
                external
                size="large"
              >
                Folge uns auf Instagram
              </GlowButton>
            </div>
          </FadeInView>
        </div>
      </section>
    </>
  );
}
