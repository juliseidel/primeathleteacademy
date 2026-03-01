"use client";

import { motion } from "framer-motion";
import { Zap, Flame, Shield, Heart, Check, ArrowRight, MessageSquare, ClipboardCheck, Rocket, TrendingUp } from "lucide-react";
import { trainingPillars, processSteps, contact } from "@/lib/constants";

const pillarIcons: Record<string, React.ReactNode> = {
  zap: <Zap className="w-6 md:w-7 h-6 md:h-7 text-gold" />,
  flame: <Flame className="w-6 md:w-7 h-6 md:h-7 text-gold" />,
  shield: <Shield className="w-6 md:w-7 h-6 md:h-7 text-gold" />,
  heart: <Heart className="w-6 md:w-7 h-6 md:h-7 text-gold" />,
};

const stepIcons: Record<string, React.ReactNode> = {
  messageSquare: <MessageSquare className="w-6 h-6 text-gold" />,
  clipboardCheck: <ClipboardCheck className="w-6 h-6 text-gold" />,
  rocket: <Rocket className="w-6 h-6 text-gold" />,
  trendingUp: <TrendingUp className="w-6 h-6 text-gold" />,
};

export default function AthletiktrainingPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="tracking-[0.3em] uppercase text-muted text-xs md:text-sm mb-3 md:mb-4"
          >
            Athletiktraining
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black gradient-text-gold mb-4 md:mb-6"
          >
            Maximale Performance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-sm md:text-xl max-w-2xl mx-auto"
          >
            Individualisiertes Athletiktraining, das dich schneller, explosiver und
            widerstandsfähiger macht -- entwickelt von aktiven Profifußballern.
          </motion.p>
        </div>
      </section>

      {/* ===== TRAINING PILLARS ===== */}
      <section className="py-12 md:py-32 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">
              Die 4 <span className="gradient-text-gold">Säulen</span>
            </h2>
            <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
              Jede Säule wird individuell auf dich abgestimmt und in deinen
              Trainingsplan integriert.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {trainingPillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-xl md:rounded-2xl p-5 md:p-8 transition-colors duration-300"
              >
                <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-5">
                  <div className="w-11 h-11 md:w-14 md:h-14 bg-gold/10 rounded-lg md:rounded-xl flex items-center justify-center">
                    {pillarIcons[pillar.icon]}
                  </div>
                  <div>
                    <h3 className="text-base md:text-xl font-bold text-white">{pillar.title}</h3>
                    <p className="text-gold/60 text-xs md:text-sm">{pillar.subtitle}</p>
                  </div>
                </div>

                <p className="text-muted text-sm leading-relaxed mb-4 md:mb-6">{pillar.description}</p>

                <ul className="space-y-2 md:space-y-3">
                  {pillar.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 md:gap-3">
                      <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold flex-shrink-0" />
                      <span className="text-muted text-xs md:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">
              So starten wir <span className="gradient-text-gold">zusammen</span>
            </h2>
            <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
              In 4 Schritten zu deiner besten Performance.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-xl md:rounded-2xl p-5 md:p-8 transition-colors duration-300 flex gap-4 md:gap-6 items-start"
              >
                <div className="w-11 h-11 md:w-14 md:h-14 bg-gold/10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-bold text-base md:text-lg">{step.step}</span>
                </div>
                <div>
                  <h3 className="text-base md:text-xl font-bold text-white mb-1.5 md:mb-2">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-12 md:py-32 bg-gradient-to-b from-surface/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">
              Bereit für dein <span className="gradient-text-gold">nächstes Level</span>?
            </h2>
            <p className="text-muted text-sm md:text-lg mb-6 md:mb-10 max-w-2xl mx-auto">
              Lass uns in einem kostenlosen Erstgespräch herausfinden, wie wir dein
              Athletiktraining optimieren können.
            </p>
            <a
              href={contact.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 md:px-8 md:py-4 bg-gold hover:bg-gold-light text-background font-bold rounded-full transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 text-sm md:text-base"
            >
              Kostenloses Erstgespräch buchen
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
