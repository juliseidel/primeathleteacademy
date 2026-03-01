"use client";

import { motion } from "framer-motion";
import { Award, GraduationCap, Users } from "lucide-react";

const coaches = [
  {
    name: "Jonas Kehl",
    role: "Co-Founder & Head Coach",
    highlights: [
      "8 Jahre FC Bayern München",
      "Aktiver Profifußballer (4. Liga)",
      "Sportwissenschaft-Studium",
    ],
    licenses: [
      "Athletiktrainer A-Lizenz",
      "Ernährungsberater A-Lizenz",
      "Personal Trainer Lizenz",
    ],
    image: "/images/jonas.jpg",
  },
  {
    name: "Patrick Scheder",
    role: "Co-Founder & Head Coach",
    highlights: [
      "Jugend bei 1. FC Nürnberg & FC Carl Zeiss Jena",
      "Aktiver Profifußballer (4. Liga)",
      "150k+ Social Media Follower",
    ],
    licenses: [
      "Athletiktrainer A-Lizenz",
      "Ernährungsberater A-Lizenz",
      "Personal Trainer Lizenz",
    ],
    image: "/images/patrick.jpg",
  },
];

function CoachCard({
  coach,
  index,
}: {
  coach: (typeof coaches)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative group"
    >
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 hover:border-gold/30 transition-all duration-300">
        {/* Photo placeholder */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center mb-6 mx-auto">
          <span className="text-gold text-2xl font-bold">
            {coach.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-center mb-1">{coach.name}</h3>
        <p className="text-gold text-sm text-center mb-6">{coach.role}</p>

        {/* Highlights */}
        <div className="space-y-3 mb-6">
          {coach.highlights.map((h) => (
            <div key={h} className="flex items-start gap-3">
              <Award className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <span className="text-gray-300 text-sm">{h}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
            Lizenzen
          </p>
          <div className="space-y-2">
            {coach.licenses.map((l) => (
              <div key={l} className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 relative">
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
            Über uns
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Wir kennen den Weg
            <br />
            <span className="text-gray-500">weil wir ihn selbst gehen</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Keine Theoretiker &mdash; wir sind aktive Profifußballer mit
            jahrelanger Erfahrung auf höchstem Niveau und den Lizenzen, die
            unsere Expertise untermauern.
          </p>
        </motion.div>

        {/* Coach cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {coaches.map((coach, i) => (
            <CoachCard key={coach.name} coach={coach} index={i} />
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            <span className="text-sm">
              Klienten von der 2. Bundesliga bis 5. Liga
            </span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gold" />
            <span className="text-sm">Wissenschaftlich fundierte Methoden</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
