"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Kolja Oudenne",
    team: "Hannover 96",
    league: "2. Bundesliga",
    quote:
      "Das Coaching hat meine Athletik auf ein neues Level gebracht. Die individuelle Betreuung und die wissenschaftlich fundierten Methoden machen den Unterschied.",
  },
  {
    name: "Robin Heußer",
    team: "Eintracht Braunschweig",
    league: "2. Bundesliga",
    quote:
      "Jonas und Patrick verstehen als aktive Profis genau, was man braucht. Die Trainingspläne sind perfekt auf meinen Spielplan abgestimmt.",
  },
  {
    name: "Jannick Hofmann",
    team: "Rot-Weiß Essen",
    league: "3. Liga",
    quote:
      "Seit ich mit PAA arbeite, hat sich meine Explosivkraft und Regeneration deutlich verbessert. Absolute Empfehlung für jeden ambitionierten Fußballer.",
  },
  {
    name: "Alexander Prokopenko",
    team: "Aktiver Profifußballer",
    league: "4. Liga",
    quote:
      "Die Kombination aus Athletik- und Ernährungscoaching ist perfekt. Man merkt, dass die Jungs wissen, wovon sie reden &mdash; weil sie es selbst leben.",
  },
];

export default function Results() {
  return (
    <section id="results" className="py-24 sm:py-32 relative">
      {/* Top border */}
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
            Erfolge
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Was unsere Athleten
            <br />
            <span className="text-gray-500">über uns sagen</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Von der 2. Bundesliga bis zur Regionalliga &mdash; unsere Klienten
            spielen auf höchstem Niveau und vertrauen auf unsere Methoden.
          </p>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-6 hover:border-gold/20 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-gold/30 mb-4" />
              <p
                className="text-gray-300 text-sm leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: t.quote }}
              />
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <span className="text-gold text-sm font-bold">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">
                    {t.team} &middot; {t.league}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
