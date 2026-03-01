"use client";

import { motion } from "framer-motion";
import {
  Dumbbell, Apple, Video, MessageCircle, Phone, Users,
  ClipboardList, Activity, RotateCcw, Settings, TrendingUp, Shield,
  ArrowRight,
} from "lucide-react";
import { deliverables, processSteps, contact } from "@/lib/constants";

const deliverableIcons: Record<string, React.ReactNode> = {
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

export default function LeistungenPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="tracking-[0.3em] uppercase text-muted text-sm mb-4"
          >
            Leistungen
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black gradient-text-gold mb-6"
          >
            Alles was du brauchst
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg md:text-xl max-w-2xl mx-auto"
          >
            Ein ganzheitliches Coaching-Paket, das keine Wünsche offen lässt --
            maßgeschneidert auf dich als Athlet.
          </motion.p>
        </div>
      </section>

      {/* ===== DELIVERABLES ===== */}
      <section className="py-20 md:py-32 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Das bekommst <span className="gradient-text-gold">du</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Jede Leistung wird individuell auf dich und deine Ziele abgestimmt.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliverables.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-2xl p-8 transition-colors duration-300 flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {deliverableIcons[item.icon]}
                </div>
                <span className="text-white font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Dein Weg <span className="gradient-text-gold">mit uns</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Von Erstgespräch bis Peak Performance.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-2xl p-8 transition-colors duration-300 flex gap-6 items-start"
              >
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-bold text-lg">{step.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-muted leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-surface/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Starte jetzt mit deinem{" "}
              <span className="gradient-text-gold">Coaching</span>
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              Sichere dir dein kostenloses Erstgespräch und erfahre, wie wir
              gemeinsam deine Performance auf das nächste Level bringen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gold hover:bg-gold-light text-background font-bold rounded-full transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Jetzt Erstgespräch buchen
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-white/10 hover:border-gold/30 rounded-full text-sm font-medium text-muted hover:text-gold transition-all duration-300 inline-flex items-center justify-center"
              >
                Mehr auf Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
