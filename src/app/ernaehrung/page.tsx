import { generatePageMetadata } from "@/lib/metadata";
import PageHero from "@/components/layout/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import GlowCard from "@/components/ui/GlowCard";
import FadeInView from "@/components/animation/FadeInView";
import StaggerChildren from "@/components/animation/StaggerChildren";
import Divider from "@/components/ui/Divider";
import GoldGlow from "@/components/effects/GoldGlow";
import NutritionFAQ from "@/components/sections/ernaehrung/NutritionFAQ";
import { nutritionServices, contact } from "@/lib/constants";
import {
  ClipboardList,
  CalendarDays,
  Pill,
  RefreshCw,
  Moon,
  ShoppingCart,
} from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Ernährung",
  description:
    "Individuelles Ernährungscoaching für Fußballer: Ernährungspläne, Matchday-Nutrition, Supplement-Beratung und Regenerations-Ernährung.",
  path: "/ernaehrung",
});

const serviceIconMap: Record<string, React.ReactNode> = {
  clipboard: <ClipboardList className="w-8 h-8 text-gold" />,
  calendar: <CalendarDays className="w-8 h-8 text-gold" />,
  pill: <Pill className="w-8 h-8 text-gold" />,
  refresh: <RefreshCw className="w-8 h-8 text-gold" />,
  moon: <Moon className="w-8 h-8 text-gold" />,
  shoppingCart: <ShoppingCart className="w-8 h-8 text-gold" />,
};

export default function ErnaehrungPage() {
  return (
    <>
      <PageHero
        tag="Ernährung"
        title="Fuel your Performance"
        titleAccent="mit der richtigen Ernährung"
        description="Die beste Trainingseinheit bringt nichts ohne die richtige Ernährung. Wir zeigen dir, wie du deine Leistung durch smarte Ernährungsstrategien maximierst."
      />

      {/* ===== NUTRITION APPROACH ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="md" position="top-left" className="opacity-20" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeInView>
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
              Unser Ansatz
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Ernährung als
              <span className="text-gray-500"> Leistungsfaktor</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-6">
              Wir glauben nicht an Diäten oder Verzicht. Unser Ansatz basiert auf
              wissenschaftlichen Erkenntnissen und praktischer Erfahrung als
              aktive Profifußballer. Wir wissen aus eigener Erfahrung, was
              funktioniert – und was nicht.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
              Jeder Ernährungsplan wird individuell auf dein Trainingspensum,
              deine Position, deine Saisonphase und deine persönlichen Vorlieben
              abgestimmt. Keine starren Pläne, sondern flexible Strategien, die
              in deinen Alltag passen.
            </p>
          </FadeInView>
        </div>
      </section>

      <Divider />

      {/* ===== SERVICES GRID ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-subtle" />
        <GoldGlow size="lg" position="center" className="opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="Services"
            title="Was wir dir bieten"
            titleMuted="Ganzheitliches Ernährungscoaching"
          />

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nutritionServices.map((service, i) => (
              <FadeInView key={i} direction="up" delay={i * 0.1}>
                <GlowCard padding="large" className="h-full">
                  <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                    {serviceIconMap[service.icon]}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </GlowCard>
              </FadeInView>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <Divider />

      {/* ===== FAQ SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="md" position="bottom-right" className="opacity-20" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <SectionHeader
            tag="FAQ"
            title="Häufige Fragen"
            titleMuted="zur Ernährung"
          />

          <FadeInView>
            <NutritionFAQ />
          </FadeInView>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="lg" position="center" className="opacity-30" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Bereit, deine Ernährung zu optimieren?
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              In einem kostenlosen Erstgespräch besprechen wir deine aktuelle
              Ernährung und zeigen dir, wo das größte Potenzial liegt.
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
