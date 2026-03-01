"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Users, ArrowRight } from "lucide-react";
import { coaches, mission, contact } from "@/lib/constants";

export default function UeberUnsPage() {
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
            Über uns
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black gradient-text-gold mb-6"
          >
            Wir kennen den Weg
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg md:text-xl max-w-2xl mx-auto"
          >
            Gegründet von zwei aktiven Profifußballern, die aus eigener Erfahrung
            wissen, was es braucht, um auf höchstem Niveau zu performen.
          </motion.p>
        </div>
      </section>

      {/* ===== COACHES ===== */}
      <section className="py-20 md:py-32 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Deine <span className="gradient-text-gold">Coaches</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Zwei aktive Profifußballer, die Praxiserfahrung mit wissenschaftlicher
              Expertise verbinden.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coaches.map((coach, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-2xl p-8 transition-colors duration-300"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
                    <span className="text-gold font-bold text-xl">{coach.initials}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{coach.name}</h3>
                    <p className="text-gold/80 text-sm">{coach.role}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-muted leading-relaxed mb-6">{coach.bio}</p>

                {/* Highlights as tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {coach.highlights.map((h, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded-full"
                    >
                      {h.text}
                    </span>
                  ))}
                </div>

                {/* Licenses */}
                <div>
                  <p className="text-white text-sm font-semibold mb-2">Lizenzen</p>
                  <ul className="space-y-1">
                    {coach.licenses.map((license, j) => (
                      <li key={j} className="text-muted text-sm flex items-center gap-2">
                        <Star className="w-3 h-3 text-gold flex-shrink-0" />
                        {license}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Unsere <span className="gradient-text-gold">Mission</span>
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                {mission.headline}
              </p>
              <p className="text-muted leading-relaxed">
                {mission.text}
              </p>
            </motion.div>
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
              Bereit für den <span className="gradient-text-gold">nächsten Schritt</span>?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              Lerne uns in einem kostenlosen Erstgespräch kennen und erfahre, wie
              wir dich auf das nächste Level bringen können.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gold hover:bg-gold-light text-background font-bold rounded-full transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Kostenloses Erstgespräch buchen
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-white/10 hover:border-gold/30 rounded-full text-sm font-medium text-muted hover:text-gold transition-all duration-300 inline-flex items-center justify-center"
              >
                Folge uns auf Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
