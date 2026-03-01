"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Calendar, Pill, RefreshCw, Moon, ShoppingCart, ChevronDown, ArrowRight } from "lucide-react";
import { nutritionServices, nutritionFaq, contact } from "@/lib/constants";

const serviceIcons: Record<string, React.ReactNode> = {
  clipboard: <ClipboardList className="w-7 h-7 text-gold" />,
  calendar: <Calendar className="w-7 h-7 text-gold" />,
  pill: <Pill className="w-7 h-7 text-gold" />,
  refresh: <RefreshCw className="w-7 h-7 text-gold" />,
  moon: <Moon className="w-7 h-7 text-gold" />,
  shoppingCart: <ShoppingCart className="w-7 h-7 text-gold" />,
};

export default function ErnaehrungPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            Ernährung
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black gradient-text-gold mb-6"
          >
            Fuel your Performance
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg md:text-xl max-w-2xl mx-auto"
          >
            Die beste Trainingseinheit bringt nichts ohne die richtige Ernährung.
            Wir zeigen dir, wie du deine Leistung durch smarte
            Ernährungsstrategien maximierst.
          </motion.p>
        </div>
      </section>

      {/* ===== NUTRITION SERVICES ===== */}
      <section className="py-20 md:py-32 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Was wir dir <span className="gradient-text-gold">bieten</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Ganzheitliches Ernährungscoaching, individuell auf dich abgestimmt.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {nutritionServices.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-2xl p-8 transition-colors duration-300"
              >
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                  {serviceIcons[service.icon]}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Häufige <span className="gradient-text-gold">Fragen</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {nutritionFaq.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-2xl transition-colors duration-300 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                )}
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
              Bereit, deine Ernährung zu{" "}
              <span className="gradient-text-gold">optimieren</span>?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              In einem kostenlosen Erstgespräch besprechen wir deine aktuelle
              Ernährung und zeigen dir, wo das größte Potenzial liegt.
            </p>
            <a
              href={contact.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gold hover:bg-gold-light text-background font-bold rounded-full transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
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
