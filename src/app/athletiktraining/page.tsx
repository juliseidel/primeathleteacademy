import { generatePageMetadata } from "@/lib/metadata";
import PageHero from "@/components/layout/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import GlowCard from "@/components/ui/GlowCard";
import FadeInView from "@/components/animation/FadeInView";
import StaggerChildren from "@/components/animation/StaggerChildren";
import Divider from "@/components/ui/Divider";
import GoldGlow from "@/components/effects/GoldGlow";
import { trainingPillars, processSteps, contact } from "@/lib/constants";
import {
  Zap,
  Flame,
  Shield,
  Heart,
  MessageSquare,
  ClipboardCheck,
  Rocket,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Athletiktraining",
  description:
    "Individuelles Athletiktraining für Profifußballer: Schnelligkeit, Explosivkraft, Stabilität und Ausdauer – wissenschaftlich fundiert und praxisorientiert.",
  path: "/athletiktraining",
});

const pillarIconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-8 h-8 text-gold" />,
  flame: <Flame className="w-8 h-8 text-gold" />,
  shield: <Shield className="w-8 h-8 text-gold" />,
  heart: <Heart className="w-8 h-8 text-gold" />,
};

const processIconMap: Record<string, React.ReactNode> = {
  messageSquare: <MessageSquare className="w-6 h-6 text-gold" />,
  clipboardCheck: <ClipboardCheck className="w-6 h-6 text-gold" />,
  rocket: <Rocket className="w-6 h-6 text-gold" />,
  trendingUp: <TrendingUp className="w-6 h-6 text-gold" />,
};

export default function AthletiktrainingPage() {
  return (
    <>
      <PageHero
        tag="Athletiktraining"
        title="Maximale Performance"
        titleAccent="auf dem Platz"
        description="Individualisiertes Athletiktraining, das dich schneller, explosiver und widerstandsfähiger macht – entwickelt von aktiven Profifußballern."
      />

      {/* ===== PHILOSOPHY INTRO ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="md" position="top-right" className="opacity-20" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInView>
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
              Unser Ansatz
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Training, das auf dem Platz
              <span className="text-gray-500"> den Unterschied macht</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
              Kein generisches Fitnessprogramm, sondern fußballspezifisches
              Athletiktraining, das exakt auf deine Position, deine Stärken und
              deine Ziele abgestimmt ist. Wir trainieren nicht nur Muskeln – wir
              trainieren Bewegungsmuster, die dich auf dem Platz besser machen.
            </p>
          </FadeInView>
        </div>
      </section>

      <Divider />

      {/* ===== TRAINING PILLARS ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-subtle" />
        <GoldGlow size="lg" position="center" className="opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="Die 4 Säulen"
            title="Unser Trainingsansatz"
            titleMuted="Vier Säulen der Performance"
            description="Jede Säule wird individuell auf dich abgestimmt und in deinen Trainingsplan integriert."
          />

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trainingPillars.map((pillar, i) => (
              <FadeInView key={i} direction="up" delay={i * 0.1}>
                <GlowCard padding="large" className="h-full">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      {pillarIconMap[pillar.icon]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {pillar.title}
                      </h3>
                      <p className="text-gold/60 text-sm">{pillar.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  <ul className="space-y-3">
                    {pillar.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </FadeInView>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <Divider />

      {/* ===== PROCESS STEPS ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="md" position="bottom-left" className="opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <SectionHeader
            tag="Dein Weg"
            title="So starten wir zusammen"
            titleMuted="In 4 Schritten zu deiner besten Performance"
          />

          <div className="space-y-8">
            {processSteps.map((step, i) => (
              <FadeInView key={i} direction="left" delay={i * 0.15}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <span className="text-gold font-bold text-sm">
                        {step.step}
                      </span>
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="w-px h-16 bg-gradient-to-b from-gold/30 to-transparent mt-2" />
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="lg" position="center" className="opacity-30" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Bereit für dein nächstes Level?
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Lass uns in einem kostenlosen Erstgespräch herausfinden, wie wir
              dein Athletiktraining optimieren können.
            </p>
            <GlowButton
              href={contact.calendlyUrl}
              external
              size="large"
              showArrow
            >
              Kostenloses Erstgespräch buchen
            </GlowButton>
          </FadeInView>
        </div>
      </section>
    </>
  );
}
