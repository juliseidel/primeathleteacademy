"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Star, Users, ArrowRight } from "lucide-react";
import { coaches, mission, contact } from "@/lib/constants";

export default function UeberUnsPage() {
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
            Über uns
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black gradient-text-gold mb-4 md:mb-6"
          >
            Wir kennen den Weg
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-sm md:text-xl max-w-2xl mx-auto"
          >
            Gegründet von zwei aktiven Profifußballern, die aus eigener Erfahrung
            wissen, was es braucht, um auf höchstem Niveau zu performen.
          </motion.p>
        </div>
      </section>

      {/* ===== COACHES ===== */}
      <section className="py-12 md:py-32 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">
              Deine <span className="gradient-text-gold">Coaches</span>
            </h2>
            <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
              Zwei aktive Profifußballer, die Praxiserfahrung mit wissenschaftlicher
              Expertise verbinden.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {coaches.map((coach, i) => {
              const imgSrc = i === 0 ? "/images/jonas.jpg" : "/images/patrick.jpg";
              const imgW = i === 0 ? 626 : 533;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-xl md:rounded-2xl overflow-hidden transition-colors duration-300 flex flex-row"
              >
                {/* Coach Image - contained portrait */}
                <div className="relative w-28 sm:w-44 shrink-0 overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={coach.name}
                    width={imgW}
                    height={799}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-surface/40 to-transparent" />
                </div>

                <div className="p-4 md:p-6 flex-1 min-w-0">
                  {/* Name */}
                  <div className="mb-3 md:mb-4">
                    <h3 className="text-base md:text-xl font-bold text-white">{coach.name}</h3>
                    <p className="text-gold/80 text-xs md:text-sm">{coach.role}</p>
                  </div>

                  {/* Bio */}
                  <p className="text-muted leading-relaxed mb-3 md:mb-4 text-xs md:text-sm">{coach.bio}</p>

                  {/* Highlights as tags */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                    {coach.highlights.map((h, j) => (
                      <span
                        key={j}
                        className="px-2 md:px-3 py-0.5 md:py-1 bg-gold/10 text-gold text-[10px] md:text-xs font-medium rounded-full"
                      >
                        {h.text}
                      </span>
                    ))}
                  </div>

                  {/* Licenses */}
                  <div>
                    <p className="text-white text-xs md:text-sm font-semibold mb-1.5 md:mb-2">Lizenzen</p>
                    <ul className="space-y-1">
                      {coach.licenses.map((license, j) => (
                        <li key={j} className="text-muted text-xs md:text-sm flex items-center gap-1.5 md:gap-2">
                          <Star className="w-3 h-3 text-gold flex-shrink-0" />
                          {license}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">
                Unsere <span className="gradient-text-gold">Mission</span>
              </h2>
              <p className="text-muted text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
                {mission.headline}
              </p>
              <p className="text-muted text-sm md:text-base leading-relaxed">
                {mission.text}
              </p>
            </motion.div>
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
              Bereit für den <span className="gradient-text-gold">nächsten Schritt</span>?
            </h2>
            <p className="text-muted text-sm md:text-lg mb-6 md:mb-10 max-w-2xl mx-auto">
              Lerne uns in einem kostenlosen Erstgespräch kennen und erfahre, wie
              wir dich auf das nächste Level bringen können.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <a
                href={contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 md:px-8 md:py-4 bg-gold hover:bg-gold-light text-background font-bold rounded-full transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Kostenloses Erstgespräch buchen
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 md:px-6 md:py-3 border border-white/10 hover:border-gold/30 rounded-full text-xs md:text-sm font-medium text-muted hover:text-gold transition-all duration-300 inline-flex items-center justify-center"
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
