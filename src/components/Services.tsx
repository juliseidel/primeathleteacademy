"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Apple,
  RotateCcw,
  Video,
  MessageCircle,
  ClipboardList,
} from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Athletiktraining",
    description:
      "Individualisierte Trainingspläne für Schnelligkeit, Explosivkraft, Stabilität und Ausdauer. Abgestimmt auf deine Position und Saisonphase.",
    features: [
      "Individuelle Periodisierung",
      "Kraft- & Schnelligkeitstraining",
      "Positionsspezifisches Training",
    ],
  },
  {
    icon: Apple,
    title: "Ernährungscoaching",
    description:
      "Personalisierte Ernährungspläne für maximale Leistungsfähigkeit. Von Matchday-Nutrition bis Regenerationsernährung.",
    features: [
      "Individuelle Ernährungspläne",
      "Matchday-Protokolle",
      "Supplement-Beratung",
    ],
  },
  {
    icon: RotateCcw,
    title: "Regeneration",
    description:
      "Professionelle Regenerationsprotokolle für schnellere Erholung. Schlafoptimierung, Recovery-Strategien und Verletzungsprävention.",
    features: [
      "Recovery-Protokolle",
      "Schlafoptimierung",
      "Verletzungsprävention",
    ],
  },
  {
    icon: Video,
    title: "Video-Anleitungen",
    description:
      "Detaillierte Video-Guides für jede Übung. Korrekte Ausführung und Technik-Coaching direkt von uns.",
    features: [
      "Übungs-Demos",
      "Technik-Feedback",
      "Warm-up Routinen",
    ],
  },
  {
    icon: MessageCircle,
    title: "1-zu-1 Betreuung",
    description:
      "Persönliche Betreuung rund um die Uhr. Regelmäßige Calls, Check-ins und direkter Draht zu deinem Coach.",
    features: [
      "24/7 Erreichbarkeit",
      "Wöchentliche Calls",
      "WhatsApp-Support",
    ],
  },
  {
    icon: ClipboardList,
    title: "Spieltags-Protokolle",
    description:
      "Strukturierte Pläne für Spieltage. Vom Warm-up über die Ernährung bis zur Nachbereitung.",
    features: [
      "Pre-Game Routine",
      "Matchday-Nutrition",
      "Post-Game Recovery",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 sm:py-32 relative bg-gray-950">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Leistungen
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Alles was du brauchst
            <br />
            <span className="text-gray-500">in einem Coaching</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Kein Standard-Programm. Jeder Plan wird individuell auf dich,
            deine Ziele und deine Saisonphase abgestimmt.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-gray-900/30 border border-gray-800/50 rounded-lg p-6 hover:border-gold/20 hover:bg-gray-900/60 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <service.icon className="w-6 h-6 text-gold" />
              </div>

              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
