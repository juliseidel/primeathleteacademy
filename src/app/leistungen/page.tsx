import { generatePageMetadata } from "@/lib/metadata";
import PageHero from "@/components/layout/PageHero";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import GlowCard from "@/components/ui/GlowCard";
import FadeInView from "@/components/animation/FadeInView";
import StaggerChildren from "@/components/animation/StaggerChildren";
import Divider from "@/components/ui/Divider";
import GoldGlow from "@/components/effects/GoldGlow";
import { deliverables, processSteps, contact } from "@/lib/constants";
import {
  Dumbbell,
  Apple,
  Video,
  MessageCircle,
  Phone,
  Users,
  ClipboardList,
  Activity,
  RotateCcw,
  Settings,
  TrendingUp,
  Shield,
  MessageSquare,
  ClipboardCheck,
  Rocket,
  Sparkles,
} from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Leistungen",
  description:
    "Alles was du brauchst in einem Coaching: Individueller Trainingsplan, Ernährungsplan, Video-Anleitungen, 24/7 Support und mehr.",
  path: "/leistungen",
});

const deliverableIconMap: Record<string, React.ReactNode> = {
  dumbbell: <Dumbbell className="w-6 h-6 text-gold" />,
  apple: <Apple className="w-6 h-6 text-gold" />,
  video: <Video className="w-6 h-6 text-gold" />,
  messageCircle: <MessageCircle className="w-6 h-6 text-gold" />,
  phone: <Phone className="w-6 h-6 text-gold" />,
  users: <Users className="w-6 h-6 text-gold" />,
  clipboardList: <ClipboardList className="w-6 h-6 text-gold" />,
  activity: <Activity className="w-6 h-6 text-gold" />,
  rotateCcw: <RotateCcw className="w-6 h-6 text-gold" />,
  settings: <Settings className="w-6 h-6 text-gold" />,
  trendingUp: <TrendingUp className="w-6 h-6 text-gold" />,
  shield: <Shield className="w-6 h-6 text-gold" />,
};

const processIconMap: Record<string, React.ReactNode> = {
  messageSquare: <MessageSquare className="w-6 h-6 text-gold" />,
  clipboardCheck: <ClipboardCheck className="w-6 h-6 text-gold" />,
  rocket: <Rocket className="w-6 h-6 text-gold" />,
  trendingUp: <TrendingUp className="w-6 h-6 text-gold" />,
};

export default function LeistungenPage() {
  return (
    <>
      <PageHero
        tag="Leistungen"
        title="Alles was du brauchst"
        titleAccent="in einem Coaching"
        description="Ein ganzheitliches Coaching-Paket, das keine Wünsche offen lässt – maßgeschneidert auf dich als Athlet."
      />

      {/* ===== DELIVERABLES GRID ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh-subtle" />
        <GoldGlow size="lg" position="top-right" className="opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <SectionHeader
            tag="Leistungsumfang"
            title="Das bekommst du"
            titleMuted="Alles inklusive"
            description="Jede Leistung wird individuell auf dich und deine Ziele abgestimmt."
          />

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliverables.map((item, i) => (
              <FadeInView key={i} direction="up" delay={i * 0.05}>
                <GlowCard className="h-full">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      {deliverableIconMap[item.icon]}
                    </div>
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                </GlowCard>
              </FadeInView>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <Divider />

      {/* ===== PROCESS TIMELINE ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="md" position="center" className="opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <SectionHeader
            tag="Prozess"
            title="Dein Weg mit uns"
            titleMuted="Von Erstgespräch bis Peak Performance"
          />

          <div className="relative">
            {/* Gold connecting line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden sm:block" />

            <div className="space-y-12">
              {processSteps.map((step, i) => (
                <FadeInView key={i} direction="left" delay={i * 0.15}>
                  <div className="flex gap-8 items-start relative">
                    {/* Timeline node */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-gray-950 border-2 border-gold/40 flex items-center justify-center shadow-[0_0_15px_rgba(197,165,90,0.2)]">
                        {processIconMap[step.icon] || (
                          <span className="text-gold font-bold text-sm">
                            {step.step}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content card */}
                    <GlowCard padding="large" className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-gold/60 text-sm font-mono">
                          Schritt {step.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </GlowCard>
                  </div>
                </FadeInView>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ===== INDIVIDUELL SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="md" position="bottom-left" className="opacity-20" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeInView>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
            </div>
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
              Individuell
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Individuell auf dich abgestimmt
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              Jeder Athlet ist anders – deshalb gibt es bei uns keine
              Standard-Pakete oder feste Preislisten. Wir erstellen ein Coaching,
              das exakt auf deine Situation, deine Ziele und deinen Zeitplan
              abgestimmt ist.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              In einem unverbindlichen Erstgespräch lernen wir dich kennen und
              besprechen, wie wir zusammenarbeiten können. Kein Sales-Pitch –
              nur ein ehrliches Gespräch auf Augenhöhe.
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

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <GoldGlow size="lg" position="center" className="opacity-30" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <FadeInView>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Starte jetzt mit deinem Coaching
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Sichere dir dein kostenloses Erstgespräch und erfahre, wie wir
              gemeinsam deine Performance auf das nächste Level bringen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton
                href={contact.calendlyUrl}
                external
                size="large"
                showArrow
              >
                Jetzt Erstgespräch buchen
              </GlowButton>
              <GlowButton
                href={contact.instagramUrl}
                variant="secondary"
                external
                size="large"
              >
                Mehr auf Instagram
              </GlowButton>
            </div>
          </FadeInView>
        </div>
      </section>
    </>
  );
}
