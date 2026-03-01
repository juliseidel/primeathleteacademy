"use client";

import { motion } from "framer-motion";
import { MessageSquare, ClipboardCheck, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Erstgespräch",
    description:
      "Kostenloser Call, in dem wir dich, deine Ziele und deine aktuelle Situation kennenlernen. Kein Sales-Pitch &mdash; wir schauen ehrlich, ob wir zusammenpassen.",
  },
  {
    icon: ClipboardCheck,
    step: "02",
    title: "Analyse & Plan",
    description:
      "Wir erstellen deinen individuellen Trainings- und Ernährungsplan. Basierend auf deiner Position, Saisonphase und deinen spezifischen Zielen.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Umsetzung",
    description:
      "Du startest mit deinem Plan und wir begleiten dich 24/7. Video-Anleitungen, Check-ins und direkter Kontakt zu deinem Coach.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Optimierung",
    description:
      "Regelmäßige Anpassungen basierend auf deinen Fortschritten. Wir optimieren kontinuierlich, damit du immer besser wirst.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 sm:py-32 relative bg-gray-950">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Ablauf
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            So starten wir
            <br />
            <span className="text-gray-500">zusammen durch</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex gap-6 items-start group"
            >
              {/* Step number + icon */}
              <div className="shrink-0 w-16 h-16 rounded-lg bg-gray-900/50 border border-gray-800 flex flex-col items-center justify-center group-hover:border-gold/30 transition-colors">
                <s.icon className="w-6 h-6 text-gold mb-0.5" />
                <span className="text-[10px] text-gray-600 font-mono">
                  {s.step}
                </span>
              </div>

              <div className="pt-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">
                  {s.title}
                </h3>
                <p
                  className="text-gray-400 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: s.description }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
