"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { offSeasonPlan, coaches } from "@/lib/constants";

export default function OffSeasonPlanPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const startCheckout = async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout/off-season", { method: "POST" });
      if (!res.ok) throw new Error("Checkout konnte nicht gestartet werden.");
      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Unbekannter Fehler. Bitte erneut versuchen."
      );
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 md:py-0">
        {/* Background Video */}
        <HeroBackground />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 md:w-[28rem] h-72 md:h-[28rem] bg-gold/10 rounded-full blur-[100px] md:blur-[140px] z-[3]" />
        <div className="absolute bottom-1/4 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-gold-dark/10 rounded-full blur-[80px] md:blur-[120px] z-[3]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Limited Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 md:mb-7 rounded-full border border-gold/30 bg-gold/5 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-gold" />
            <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-gold font-medium">
              {offSeasonPlan.badge}
            </span>
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-[10px] md:text-sm tracking-[0.3em] uppercase text-white/70 mb-4 md:mb-6"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
          >
            Prime Athlete Academy · Programm
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-black tracking-tight mb-4 md:mb-6"
          >
            <span className="block text-4xl sm:text-6xl md:text-8xl leading-[0.95] gradient-text-gold glow-gold-text">
              OFF-SEASON
            </span>
            <span className="block text-4xl sm:text-6xl md:text-8xl leading-[0.95] text-white/95 mt-1">
              PLAN 2026
            </span>
            <span className="block text-base sm:text-xl md:text-2xl tracking-[0.4em] uppercase text-gold/80 mt-3 md:mt-5">
              Elite Edition
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-sm md:text-lg text-white/80 max-w-2xl mx-auto mb-7 md:mb-10 leading-relaxed px-2"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            {offSeasonPlan.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-14"
          >
            <button
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="group flex items-center gap-2 px-7 py-3.5 md:px-9 md:py-4 bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-background text-sm md:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/30 glow-gold"
            >
              {checkoutLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Lade Checkout…
                </>
              ) : (
                <>
                  Jetzt sichern · {offSeasonPlan.priceLabel}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <a
              href="#was-drin-ist"
              className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 border border-white/10 hover:border-gold/30 rounded-full text-sm md:text-base text-foreground/70 hover:text-foreground transition-all duration-300"
            >
              Was ist drin?
              <ChevronDown size={16} />
            </a>
          </motion.div>

          {checkoutError ? (
            <p className="text-sm text-red-400 mb-6">{checkoutError}</p>
          ) : null}

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-14"
          >
            {offSeasonPlan.heroStats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-4xl font-black text-gold">
                  {stat.value}
                  <span className="text-gold/60">{stat.suffix}</span>
                </div>
                <div className="text-[9px] md:text-xs text-muted tracking-[0.2em] uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 4-WEEK TIMELINE */}
      {/* ============================================================ */}
      <section
        id="was-drin-ist"
        className="relative py-16 md:py-32 bg-surface/40 overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/rasenplatz.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.18) saturate(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <p className="tracking-[0.3em] uppercase text-muted text-xs md:text-sm mb-3">
              Vom Fundament zur Dominanz
            </p>
            <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4">
              Dein Weg in <span className="gradient-text-gold">4 Phasen</span>
            </h2>
            <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
              Sportwissenschaftlich periodisiert. Jede Woche baut auf der vorherigen
              auf – um dich pünktlich zum Saisonstart auf dein Peak zu bringen.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* connecting line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0" />

            {offSeasonPlan.weeks.map((week, i) => (
              <motion.div
                key={week.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative"
              >
                {/* Number badge */}
                <div className="flex justify-center mb-5 md:mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-background border-2 border-gold/40 flex items-center justify-center relative z-10 group-hover:border-gold transition-colors">
                      <div className="absolute inset-1.5 rounded-full bg-gold/5" />
                      <span className="relative text-3xl md:text-4xl font-black gradient-text-gold">
                        {String(week.number).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl" />
                  </div>
                </div>

                <div className="bg-surface/80 backdrop-blur-md border border-white/5 hover:border-gold/25 rounded-2xl p-5 md:p-6 text-center transition-all duration-300 h-full">
                  <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-gold/80 mb-2">
                    Woche {week.number}
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-1">{week.title}</h3>
                  <p className="text-xs md:text-sm text-gold/70 mb-3 md:mb-4 font-medium">
                    {week.subtitle}
                  </p>
                  <p className="text-muted text-xs md:text-sm leading-relaxed mb-4">
                    {week.description}
                  </p>
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] md:text-xs font-mono tracking-wider text-gold/90 bg-gold/10 border border-gold/20">
                    {week.rpe}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* COACH ENDORSEMENT */}
      {/* ============================================================ */}
      <section className="relative py-16 md:py-32 bg-surface/50 overflow-hidden border-y border-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/training/gym.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.22) saturate(0.3)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/80" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
            {/* Coach Avatars */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex md:flex-col gap-3 justify-center"
            >
              {coaches.map((coach, i) => (
                <div
                  key={coach.name}
                  className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-gold/40 shadow-xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i === 0 ? "/images/jonas.jpg" : "/images/patrick.jpg"}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="tracking-[0.3em] uppercase text-gold/80 text-[10px] md:text-xs mb-3">
                Von den Coaches
              </p>
              <blockquote className="text-lg md:text-2xl text-white leading-relaxed font-light italic">
                <span className="text-3xl md:text-4xl text-gold/40 leading-none">&ldquo;</span>
                {offSeasonPlan.coachStatement}
                <span className="text-3xl md:text-4xl text-gold/40 leading-none">&rdquo;</span>
              </blockquote>
              <p className="mt-5 md:mt-6 text-sm md:text-base text-muted">
                <span className="text-foreground">Jonas Kehl</span> & <span className="text-foreground">Patrick Scheder</span>
                {" · "}
                <span className="text-gold/80">Co-Founder · Prime Athlete Academy</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRICE BLOCK */}
      {/* ============================================================ */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gold/5 rounded-full blur-[140px]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-surface to-surface-light border border-gold/25 rounded-2xl md:rounded-3xl overflow-hidden glow-gold shadow-2xl shadow-gold/10"
          >
            {/* gold accent border */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="p-6 sm:p-8 md:p-12">
              <div className="text-center mb-7 md:mb-9">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-1.5">
                  Off-Season Plan 2026
                </h2>
                <p className="text-gold/80 tracking-[0.3em] uppercase text-xs md:text-sm mb-7 md:mb-9">
                  Elite Edition
                </p>

                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl md:text-7xl font-black gradient-text-gold glow-gold-text">
                    99
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-gold">€</span>
                </div>
                <p className="text-muted text-xs md:text-sm">{offSeasonPlan.priceNote}</p>
              </div>

              <ul className="space-y-2.5 md:space-y-3 mb-8 md:mb-10 max-w-md mx-auto">
                {offSeasonPlan.whatYouGet.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-gold" />
                    </span>
                    <span className="text-foreground/90 text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={startCheckout}
                disabled={checkoutLoading}
                className="group w-full flex items-center justify-center gap-2 px-7 py-4 md:px-9 md:py-5 bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-background text-base md:text-lg font-bold rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold/30"
              >
                {checkoutLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Lade Checkout…
                  </>
                ) : (
                  <>
                    Jetzt sichern · 99 €
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {checkoutError ? (
                <p className="text-center text-sm text-red-400 mt-4">{checkoutError}</p>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ */}
      {/* ============================================================ */}
      <section className="py-16 md:py-32 bg-surface/40 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-14"
          >
            <p className="tracking-[0.3em] uppercase text-muted text-xs md:text-sm mb-3">
              Häufige Fragen
            </p>
            <h2 className="text-3xl md:text-5xl font-black">
              Noch <span className="gradient-text-gold">Fragen</span>?
            </h2>
          </motion.div>

          <div className="space-y-3 md:space-y-4">
            {offSeasonPlan.faq.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

/* ============================================================ */
/* HERO BACKGROUND — subtle blurred training video               */
/* ============================================================ */
const heroVideos = [
  "/videos/training-1.mp4",
  "/videos/training-2.mp4",
  "/videos/training-3.mp4",
];

function HeroBackground() {
  const [idx, setIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdx(Math.floor(Math.random() * heroVideos.length));
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [idx]);

  const handleEnded = () => setIdx((p) => (p + 1) % heroVideos.length);

  return (
    <>
      {/* Deep dark base */}
      <div className="absolute inset-0 bg-background" />

      {/* Blurred training video — Text-Overlays werden durch Blur unkenntlich */}
      <video
        ref={videoRef}
        key={idx}
        src={heroVideos[idx]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        style={{ filter: "brightness(0.32) saturate(0.45) blur(6px)" }}
      />

      {/* Dark gradient overlays (top/bottom + sides) */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />

      {/* Subtle gold radial highlight behind the title */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(197,165,90,0.08) 0%, transparent 60%)",
        }}
      />
    </>
  );
}

/* ============================================================ */
/* FAQ ITEM                                                      */
/* ============================================================ */
function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface border border-white/5 hover:border-gold/20 rounded-xl md:rounded-2xl overflow-hidden transition-colors"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
        aria-expanded={open}
      >
        <span className="text-sm md:text-base font-semibold text-white">{question}</span>
        <ChevronDown
          size={20}
          className={`text-gold flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 text-muted text-sm md:text-base leading-relaxed">
              {answer}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
