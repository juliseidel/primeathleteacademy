import { generatePageMetadata } from "@/lib/metadata";
import PageHero from "@/components/layout/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import GlowCard from "@/components/ui/GlowCard";
import FadeInView from "@/components/animation/FadeInView";
import StaggerChildren from "@/components/animation/StaggerChildren";
import ImageWithPlaceholder from "@/components/media/ImageWithPlaceholder";
import GoldGlow from "@/components/effects/GoldGlow";
import { coaches, contact } from "@/lib/constants";
import {
  Trophy,
  GraduationCap,
  Users,
  Target,
  Handshake,
  Brain,
  Heart,
  Award,
  CheckCircle,
} from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Über uns",
  description:
    "Lerne Jonas Kehl und Patrick Scheder kennen – die Gründer der Prime Athlete Academy. Aktive Profifußballer mit jahrelanger Erfahrung im Spitzensport.",
  path: "/ueber-uns",
});

const highlightIconMap: Record<string, React.ReactNode> = {
  trophy: <Trophy className="w-5 h-5 text-gold" />,
  football: <Award className="w-5 h-5 text-gold" />,
  graduation: <GraduationCap className="w-5 h-5 text-gold" />,
  users: <Users className="w-5 h-5 text-gold" />,
};

const philosophyValues = [
  {
    icon: <Target className="w-8 h-8 text-gold" />,
    title: "Individualität",
    description:
      "Kein Athlet ist wie der andere. Jeder Plan wird maßgeschneidert auf deine Stärken, Schwächen und Ziele abgestimmt.",
  },
  {
    icon: <Brain className="w-8 h-8 text-gold" />,
    title: "Wissenschaft trifft Praxis",
    description:
      "Evidenzbasierte Methoden, kombiniert mit der täglichen Erfahrung als aktive Profifußballer.",
  },
  {
    icon: <Handshake className="w-8 h-8 text-gold" />,
    title: "Auf Augenhöhe",
    description:
      "Wir sind keine klassischen Coaches – wir sind Spieler, die denselben Weg gehen wie du.",
  },
  {
    icon: <Heart className="w-8 h-8 text-gold" />,
    title: "Ganzheitlicher Ansatz",
    description:
      "Training, Ernährung, Regeneration und Mindset – wir betrachten Performance als Gesamtbild.",
  },
];

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        tag="Über uns"
        title="Wir kennen den Weg"
        titleAccent="weil wir ihn selbst gehen"
        description="Gegründet von zwei aktiven Profifußballern, die aus eigener Erfahrung wissen, was es braucht, um auf höchstem Niveau zu performen."
      />

      {/* ===== COACHES SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <GoldGlow size="lg" position="top-left" className="opacity-30" />

        <div className="max-w-7xl mx-auto px-6">
          {/* Jonas - Image Left, Text Right */}
          <FadeInView direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
              {/* Image */}
              <FadeInView direction="left">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.08]">
                  <ImageWithPlaceholder
                    src={coaches[0].imageSrc}
                    alt={coaches[0].name}
                    fill
                    className="rounded-2xl"
                    placeholderIcon="user"
                    placeholderText={coaches[0].name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
                </div>
              </FadeInView>

              {/* Text */}
              <FadeInView direction="right" delay={0.2}>
                <div>
                  <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
                    Co-Founder
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-2">
                    {coaches[0].name}
                  </h2>
                  <p className="text-gold/80 font-medium mb-6">
                    {coaches[0].role}
                  </p>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {coaches[0].bio}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-4 mb-8">
                    {coaches[0].highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold/[0.08] border border-gold/[0.12] flex items-center justify-center">
                          {highlightIconMap[h.icon] || (
                            <CheckCircle className="w-5 h-5 text-gold" />
                          )}
                        </div>
                        <span className="text-gray-300">{h.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Licenses */}
                  <div className="flex flex-wrap gap-2">
                    {coaches[0].licenses.map((license, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-xs font-medium rounded-full border border-gold/20 bg-gold/[0.08] text-gold"
                      >
                        {license}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInView>
            </div>
          </FadeInView>

          {/* Divider between coaches */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-24" />

          {/* Patrick - Text Left, Image Right (reversed) */}
          <FadeInView direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text (first on mobile, visually left on desktop) */}
              <FadeInView direction="left" delay={0.2}>
                <div className="order-2 lg:order-1">
                  <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
                    Co-Founder
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-2">
                    {coaches[1].name}
                  </h2>
                  <p className="text-gold/80 font-medium mb-6">
                    {coaches[1].role}
                  </p>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {coaches[1].bio}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-4 mb-8">
                    {coaches[1].highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gold/[0.08] border border-gold/[0.12] flex items-center justify-center">
                          {highlightIconMap[h.icon] || (
                            <CheckCircle className="w-5 h-5 text-gold" />
                          )}
                        </div>
                        <span className="text-gray-300">{h.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Licenses */}
                  <div className="flex flex-wrap gap-2">
                    {coaches[1].licenses.map((license, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-xs font-medium rounded-full border border-gold/20 bg-gold/[0.08] text-gold"
                      >
                        {license}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInView>

              {/* Image */}
              <FadeInView direction="right">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden order-1 lg:order-2 border border-white/[0.08]">
                  <ImageWithPlaceholder
                    src={coaches[1].imageSrc}
                    alt={coaches[1].name}
                    fill
                    className="rounded-2xl"
                    placeholderIcon="user"
                    placeholderText={coaches[1].name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
                </div>
              </FadeInView>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* ===== PHILOSOPHY SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-0 gradient-mesh" />
        <GoldGlow size="md" position="center" className="opacity-20" />
        <GoldGlow size="sm" position="top-right" className="opacity-15" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="Philosophie"
            title="Unsere Philosophie"
            titleMuted="Was uns antreibt"
            description="Wir glauben daran, dass jeder Athlet sein volles Potenzial erreichen kann – mit dem richtigen System, der richtigen Betreuung und dem richtigen Mindset."
          />

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {philosophyValues.map((value, i) => (
              <FadeInView key={i} direction="up" delay={i * 0.1}>
                <GlowCard padding="large" className="h-full text-center">
                  <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-xl bg-gold/[0.08] border border-gold/[0.12] flex items-center justify-center transition-all duration-300 hover:bg-gold/15 hover:border-gold/25">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </GlowCard>
              </FadeInView>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-0 gradient-mesh-subtle" />
        <GoldGlow size="lg" position="center" className="opacity-30" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Bereit für den{" "}
              <span className="text-gold glow-gold-text">nächsten Schritt</span>
              ?
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Lerne uns in einem kostenlosen Erstgespräch kennen und erfahre, wie
              wir dich auf das nächste Level bringen können.
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
