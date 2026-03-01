"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";
import { testimonials, stats, contact } from "@/lib/constants";

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export default function ReferenzenPage() {
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
            Referenzen
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black gradient-text-gold mb-6"
          >
            Was unsere Athleten sagen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg md:text-xl max-w-2xl mx-auto"
          >
            Profifußballer aus ganz Deutschland vertrauen auf unser Coaching.
            Hier sind ihre Geschichten.
          </motion.p>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 md:py-32 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => {
              const { count, ref } = useCounter(stat.value);
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-surface border border-white/5 hover:border-gold/20 rounded-2xl p-8 transition-colors duration-300 text-center"
                >
                  <p className="text-4xl md:text-5xl font-black gradient-text-gold mb-2">
                    {count}{stat.suffix}
                  </p>
                  <p className="text-muted text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Stimmen unserer <span className="gradient-text-gold">Athleten</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-white/5 hover:border-gold/20 rounded-2xl p-8 transition-colors duration-300 flex flex-col"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Quote className="w-6 h-6 text-gold/40" />
                  </div>
                </div>

                <p className="text-white/80 text-lg leading-relaxed mb-8 flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="border-t border-white/5 pt-6">
                  <p className="text-white font-semibold text-lg">{testimonial.name}</p>
                  <p className="text-gold/80 text-sm mt-1">{testimonial.team}</p>
                  <p className="text-muted text-sm">{testimonial.league}</p>
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
              Werde Teil der <span className="gradient-text-gold">Academy</span>
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              Schließe dich den Athleten an, die bereits von unserem Coaching
              profitieren. Starte mit einem kostenlosen Erstgespräch.
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
