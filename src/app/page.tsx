"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Apple, Trophy, Quote, Instagram, Star } from "lucide-react";
import { coaches, testimonials, stats, contact } from "@/lib/constants";

const trainingVideos = [
  "/videos/training-1.mp4",
  "/videos/training-2.mp4",
  "/videos/training-3.mp4",
];

const showcaseImages = [
  "/images/slideshow/patrick-1.jpg",
  "/images/slideshow/jonas-1.jpg",
  "/images/slideshow/patrick-2.jpg",
  "/images/slideshow/jonas-2.jpg",
  "/images/slideshow/patrick-3.jpg",
  "/images/slideshow/jonas-3.jpg",
  "/images/slideshow/patrick-4.jpg",
  "/images/slideshow/jonas-4.jpg",
  "/images/slideshow/patrick-5.jpg",
  "/images/slideshow/jonas-5.jpg",
  "/images/slideshow/jonas-6.jpg",
];

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-0 md:min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-8 md:py-0">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-surface" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A55A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Player Images - Background (full height) */}
        {/* Jonas - Left Side */}
        <div className="absolute left-0 inset-y-0 w-[50%] z-[2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/jonas-action.jpg"
            alt="Jonas Action"
            className="absolute inset-0 w-full h-full object-cover object-[70%_30%] md:object-[center_30%]"
            style={{ filter: 'brightness(0.55) saturate(0.15)' }}
          />
          {/* Fade to center/right */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background" />
          {/* Fade to bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        {/* Patrick - Right Side */}
        <div className="absolute right-0 inset-y-0 w-[50%] z-[2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/patrick-action.jpg"
            alt="Patrick Action"
            className="absolute inset-0 w-full h-full object-cover object-[30%_20%] md:object-[center_20%]"
            style={{ filter: 'brightness(0.55) saturate(0.15)' }}
          />
          {/* Fade to center/left */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background" />
          {/* Fade to bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-gold/10 rounded-full blur-[80px] md:blur-[120px] z-[3]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 md:w-72 h-48 md:h-72 bg-gold-dark/10 rounded-full blur-[60px] md:blur-[100px] z-[3]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 md:pt-0">
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/80 mb-3 md:mb-6"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7)' }}
          >
            Elite Athletik-Coaching
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-black tracking-tight gradient-text-gold glow-gold-text mb-4 md:mb-8"
          >
            <span className="block text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1]">PRIME ATHLETE</span>
            <span className="block text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight">ACADEMY</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed px-2"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.7)' }}
          >
            Individuelles Athletik- und Ernährungscoaching von Profifußballern.
            <br className="hidden md:block" />
            Wissenschaftlich fundiert,{" "}
            <span className="text-gold font-semibold">auf dich zugeschnitten</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
          >
            <a
              href={contact.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gold hover:bg-gold-light text-background text-sm md:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20"
            >
              Kostenloses Erstgespräch
            </a>
            <Link
              href="/leistungen"
              className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 border border-white/10 hover:border-gold/30 rounded-full text-sm md:text-base text-foreground/70 hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Was wir bieten
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 md:mt-20 mb-4 md:mb-0 flex flex-wrap items-center justify-center gap-6 md:gap-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl md:text-3xl font-black text-gold">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[10px] md:text-xs text-muted tracking-widest uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS TICKER ===== */}
      <div className="w-full overflow-hidden bg-surface/50 border-y border-white/5 py-2 md:py-3">
        <div className="animate-ticker whitespace-nowrap flex">
          {[1, 2, 3].map((repeat) => (
            <span key={repeat} className="text-[10px] md:text-sm font-mono tracking-widest text-muted mx-4">
              8+ JAHRE FC BAYERN &nbsp;&middot;&nbsp; 150K+ COMMUNITY &nbsp;&middot;&nbsp; 2. BUNDESLIGA KLIENTEN &nbsp;&middot;&nbsp; A-LIZENZ COACHES &nbsp;&middot;&nbsp; INDIVIDUELLES COACHING &nbsp;&middot;&nbsp; WISSENSCHAFTLICH FUNDIERT &nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-5xl font-black mb-1 md:mb-2">
              Was wir <span className="gradient-text-gold">bieten</span>
            </h2>
            <p className="text-muted text-sm md:text-base mb-6 md:mb-10">
              Drei Säulen für deine maximale Performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: Zap,
                title: "Athletiktraining",
                description: "Schnelligkeit, Explosivkraft, Stabilität und Ausdauer. Individualisierte Trainingspläne, abgestimmt auf deine Position und Saisonphase.",
                href: "/athletiktraining",
              },
              {
                icon: Apple,
                title: "Ernährungscoaching",
                description: "Personalisierte Ernährungspläne für maximale Leistungsfähigkeit. Von Matchday-Nutrition bis Regenerationsernährung.",
                href: "/ernaehrung",
              },
              {
                icon: Trophy,
                title: "Proven Results",
                description: "Von der Kreisliga bis zur 2. Bundesliga – wir bringen jeden Athleten auf sein nächstes Level. Messbare Ergebnisse, egal wo du gerade stehst.",
                href: "/referenzen",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="group block bg-surface border border-white/5 hover:border-gold/20 rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-300 hover:bg-surface-light"
                >
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gold/10 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-6">
                    <item.icon size={20} className="text-gold md:hidden" />
                    <item.icon size={24} className="text-gold hidden md:block" />
                  </div>
                  <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                  <p className="text-muted text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gold opacity-70 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    Mehr erfahren <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRAINING SHOWCASE WITH SLIDESHOW ===== */}
      <TrainingShowcase />

      {/* ===== COACHES SECTION ===== */}
      <section className="py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">
              Deine <span className="gradient-text-gold">Coaches</span>
            </h2>
            <p className="text-muted text-sm md:text-base max-w-xl mx-auto">
              Zwei aktive Profifußballer. Lizenzierte Coaches. Über ein Jahrzehnt Erfahrung im Leistungssport.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {coaches.map((coach, index) => {
              const imgSrc = index === 0 ? "/images/jonas.jpg" : "/images/patrick.jpg";
              const imgW = index === 0 ? 626 : 533;
              return (
                <motion.div
                  key={coach.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.15 }}
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

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-12 md:py-32 bg-surface/50 overflow-hidden">
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
            <h2 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">
              Was Athleten <span className="gradient-text-gold">sagen</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {testimonials.slice(0, 4).map((t, index) => {
              const videoMap: Record<string, string> = {
                "Kolja Oudenne": "/videos/testimonials/kolja-oudenne.mp4",
                "Robin Heußer": "/videos/testimonials/robin-heusser.mp4",
                "Jannick Hofmann": "/videos/testimonials/jannick-hofmann.mp4",
                "Veron Dobruna": "/videos/testimonials/veron-dobruna.mp4",
              };
              const videoSrc = videoMap[t.name] || "";
              return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/5 hover:border-gold/20 transition-colors duration-300 group"
              >
                {/* Background Video */}
                {videoSrc ? (
                  <TestimonialVideo src={videoSrc} />
                ) : (
                  <div className="absolute inset-0 bg-surface" />
                )}
                {/* Gradient overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40 z-[1]" />

                {/* Content */}
                <div className="relative z-[2] p-5 md:p-8">
                  <Quote size={18} className="text-gold/40 mb-3 md:mb-4 md:hidden" />
                  <Quote size={24} className="text-gold/40 mb-3 md:mb-4 hidden md:block" />
                  <p className="text-white leading-relaxed mb-4 md:mb-6 italic text-sm md:text-base" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gold/40 flex-shrink-0">
                      <img
                        src={t.imageSrc}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs md:text-sm text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{t.name}</p>
                      <p className="text-[10px] md:text-xs text-white/70" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{t.team} &middot; {t.league}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-6 md:mt-8"
          >
            <Link
              href="/referenzen"
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 border border-white/10 hover:border-gold/30 rounded-full text-xs md:text-sm font-medium text-muted hover:text-gold transition-all duration-300"
            >
              Alle Referenzen ansehen
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== INSTAGRAM SECTION ===== */}
      <section className="py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-10"
          >
            <h2 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">
              Folge uns auf <span className="gradient-text-gold">Instagram</span>
            </h2>
            <p className="text-muted text-sm md:text-base max-w-xl mx-auto">
              Tägliche Einblicke in unser Training, Tipps und Motivation.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-full text-gold text-sm md:text-base font-bold transition-all duration-300 hover:scale-105"
          >
            <Instagram size={18} />
            {contact.instagramHandle}
            <ArrowRight size={14} />
          </motion.a>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-12 md:py-32 bg-gradient-to-b from-surface/50 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-6">
              Bereit für dein <span className="gradient-text-gold">nächstes Level</span>?
            </h2>
            <p className="text-muted text-sm md:text-lg mb-6 md:mb-10 max-w-xl mx-auto">
              Buche dein kostenloses Erstgespräch und finde heraus, wie wir dich nach vorne bringen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
              <a
                href={contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gold hover:bg-gold-light text-background text-sm md:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20"
              >
                Kostenloses Erstgespräch
              </a>
              <Link
                href="/leistungen"
                className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 border border-white/10 hover:border-gold/30 rounded-full text-sm md:text-base text-foreground/70 hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                Alle Leistungen
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ===== TESTIMONIAL VIDEO COMPONENT ===== */
function TestimonialVideo({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "300px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {shouldLoad && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45) saturate(0.4)" }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

/* ===== TRAINING SHOWCASE COMPONENT ===== */
function TrainingShowcase() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Randomize starting video on mount (client-only)
  useEffect(() => {
    setVideoIndex(Math.floor(Math.random() * trainingVideos.length));
  }, []);

  useEffect(() => {
    // Images cycle every 5 seconds (Patrick/Jonas abwechselnd)
    const imageTimer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 5000);

    return () => clearInterval(imageTimer);
  }, []);

  // When video ends, play the next one
  const handleVideoEnded = () => {
    setVideoIndex((prev) => (prev + 1) % trainingVideos.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [videoIndex]);

  // On tab visibility change or page revisit, randomize starting video
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setVideoIndex(Math.floor(Math.random() * trainingVideos.length));
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const slideVariants = {
    enter: { x: 40, opacity: 0, scale: 0.98 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -40, opacity: 0, scale: 0.98 },
  };

  return (
    <section className="py-12 md:py-32 bg-surface/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">
            So trainieren wir <span className="gradient-text-gold">Profis</span>
          </h2>
          <p className="text-muted text-sm md:text-base max-w-xl mx-auto">
            Ein Einblick in unser Training. Jeden Tag arbeiten wir daran, Athleten aufs nächste Level zu bringen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Original Reel Video - Left (same position as before) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-gold/5 bg-surface mx-auto w-full max-w-[260px] md:max-w-[340px]">
              <video
                src="/images/reel.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-[9/16] object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 md:h-8 bg-gold/20 blur-2xl rounded-full" />
          </motion.div>

          {/* Right side - 2 columns: Training Videos + Patrick Slideshow */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3 md:space-y-4"
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Training Videos (replaces Jonas slideshow) */}
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 aspect-[9/16]">
                <video
                  ref={videoRef}
                  key={videoIndex}
                  src={trainingVideos[videoIndex]}
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnded}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Image Slideshow (Patrick & Jonas abwechselnd) */}
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 aspect-[9/16]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`showcase-${imageIndex}`}
                    src={showcaseImages[imageIndex]}
                    alt={`Training ${imageIndex + 1}`}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
            </div>

            <Link
              href="/athletiktraining"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-medium text-sm"
            >
              Mehr über unser Training erfahren
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
