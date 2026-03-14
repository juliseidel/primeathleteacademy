"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";
import { testimonials, stats, contact } from "@/lib/constants";

// Video mapping for testimonials (some athletes have videos, some don't)
const testimonialVideos: Record<string, string> = {
  "Kolja Oudenne": "/videos/testimonials/kolja-oudenne.mp4",
  "Robin Heußer": "/videos/testimonials/robin-heusser.mp4",
  "Jannick Hofmann": "/videos/testimonials/jannick-hofmann.mp4",
  "Veron Dobruna": "/videos/testimonials/veron-dobruna.mp4",
  "Kaan Kurt": "/videos/testimonials/kaan-kurt.mp4",
};

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

function LazyVideo({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={style}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

export default function ReferenzenPage() {
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
            Referenzen
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black gradient-text-gold mb-4 md:mb-6"
          >
            Was unsere Athleten sagen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-sm md:text-xl max-w-2xl mx-auto"
          >
            Profifußballer aus ganz Deutschland vertrauen auf unser Coaching.
            Hier sind ihre Geschichten.
          </motion.p>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 md:py-32 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-4xl mx-auto">
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
                  className="bg-surface border border-white/5 hover:border-gold/20 rounded-xl md:rounded-2xl p-4 md:p-8 transition-colors duration-300 text-center"
                >
                  <p className="text-2xl md:text-5xl font-black gradient-text-gold mb-1 md:mb-2">
                    {count}{stat.suffix}
                  </p>
                  <p className="text-muted text-[10px] md:text-sm">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-12 md:py-32 overflow-hidden">
        {/* Background image - rasenplatz */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/rasenplatz.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.45) saturate(0.65)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4">
              Stimmen unserer <span className="gradient-text-gold">Athleten</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {testimonials.map((testimonial, i) => {
              const videoSrc = testimonialVideos[testimonial.name];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="overflow-hidden border border-white/5 hover:border-gold/20 rounded-xl md:rounded-2xl transition-colors duration-300 flex flex-col bg-surface/80 backdrop-blur-sm"
                >
                  {/* Video or image header */}
                  <div className="relative w-full aspect-[4/3] bg-black/50 overflow-hidden">
                    {videoSrc ? (
                      <LazyVideo
                        src={videoSrc}
                        className="w-full h-full"
                      />
                    ) : (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={testimonial.imageSrc}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          style={{ filter: "brightness(0.7) saturate(0.6)" }}
                        />
                      </>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="p-5 md:p-8 flex flex-col flex-1">
                    <div className="mb-3 md:mb-4">
                      <Quote className="w-6 h-6 md:w-8 md:h-8 text-gold/30" />
                    </div>

                    <p className="text-white/80 text-sm md:text-base leading-relaxed mb-5 md:mb-8 flex-1">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    <div className="border-t border-white/10 pt-4 md:pt-5 flex items-center gap-3 md:gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={testimonial.imageSrc}
                        alt={testimonial.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-gold/30"
                      />
                      <div>
                        <p className="text-white font-semibold text-sm md:text-base">{testimonial.name}</p>
                        <p className="text-gold/80 text-xs md:text-sm">
                          {testimonial.team} · {testimonial.league}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              Werde Teil der <span className="gradient-text-gold">Academy</span>
            </h2>
            <p className="text-muted text-sm md:text-lg mb-6 md:mb-10 max-w-2xl mx-auto">
              Schließe dich den Athleten an, die bereits von unserem Coaching
              profitieren. Starte mit einem kostenlosen Erstgespräch.
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
