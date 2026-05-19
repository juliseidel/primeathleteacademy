"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Shield,
  Flame,
  Trophy,
  Clipboard,
  Dumbbell,
  Apple,
  Leaf,
  ShoppingCart,
  TrendingUp,
  Moon,
  Download,
  ChevronDown,
  Star,
  Lock,
  Zap,
  Sparkles,
} from "lucide-react";
import { offSeasonPlan, coaches } from "@/lib/constants";

const goalIcons: Record<string, React.ReactNode> = {
  shield: <Shield className="w-7 h-7 text-gold" />,
  flame: <Flame className="w-7 h-7 text-gold" />,
  trophy: <Trophy className="w-7 h-7 text-gold" />,
};

const featureIcons: Record<string, React.ReactNode> = {
  clipboard: <Clipboard className="w-5 h-5 text-gold" />,
  dumbbell: <Dumbbell className="w-5 h-5 text-gold" />,
  apple: <Apple className="w-5 h-5 text-gold" />,
  leaf: <Leaf className="w-5 h-5 text-gold" />,
  shoppingCart: <ShoppingCart className="w-5 h-5 text-gold" />,
  trendingUp: <TrendingUp className="w-5 h-5 text-gold" />,
  moon: <Moon className="w-5 h-5 text-gold" />,
  download: <Download className="w-5 h-5 text-gold" />,
};

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
      {/* INTRO / WHY */}
      {/* ============================================================ */}
      <section className="relative py-16 md:py-32 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A55A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="tracking-[0.3em] uppercase text-muted text-xs md:text-sm mb-3 md:mb-4"
          >
            Warum die Off-Season entscheidet
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-black mb-5 md:mb-7 leading-tight"
          >
            Neue Saison. <span className="gradient-text-gold">Neue Chance.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-base md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Die Saison ist vorbei, die Karten werden neu gemischt. Während andere
            zurückblicken oder komplett abschalten, nutzt du das einzige Zeitfenster
            im Jahr, in dem du <span className="text-foreground/90">echte athletische Fortschritte</span> machst –
            ohne Rücksicht auf den nächsten Spieltag.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          >
            {offSeasonPlan.coreGoals.map((goal, i) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="group relative bg-surface border border-white/5 hover:border-gold/25 rounded-2xl p-6 md:p-7 text-left transition-all duration-300 overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/0 group-hover:bg-gold/5 rounded-full blur-2xl transition-all duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-4 md:mb-5">
                    {goalIcons[goal.icon]}
                  </div>
                  <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-gold/70 mb-1.5">
                    {goal.title}
                  </p>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 leading-tight">
                    {goal.headline}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">{goal.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
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
      {/* FEATURE GRID — WHAT'S INSIDE */}
      {/* ============================================================ */}
      <section className="py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <p className="tracking-[0.3em] uppercase text-muted text-xs md:text-sm mb-3">
              67 Seiten · Athletik + Nutrition
            </p>
            <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4">
              Was alles <span className="gradient-text-gold">drinsteckt</span>
            </h2>
            <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
              Kein PDF-Lückenfüller. Jede Seite hat einen Zweck.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {offSeasonPlan.features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.08 }}
                className="group bg-surface border border-white/5 hover:border-gold/25 rounded-xl md:rounded-2xl p-5 md:p-6 transition-all duration-300 hover:bg-surface-light"
              >
                <div className="w-10 h-10 md:w-11 md:h-11 bg-gold/10 rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:bg-gold/15 transition-colors">
                  {featureIcons[feature.icon] || <Star className="w-5 h-5 text-gold" />}
                </div>
                <h3 className="text-sm md:text-base font-bold text-white mb-1.5 md:mb-2 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-muted text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-gold/30 bg-gold/5">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-gold font-medium">
                    Limitiertes Drop
                  </span>
                </div>
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

              {/* Trust row */}
              <div className="mt-7 md:mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[10px] md:text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-gold/70" />
                  Sichere Zahlung via Stripe
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-gold/70" />
                  Sofortiger Download
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-gold/70" />
                  USt-Rechnung inklusive
                </span>
              </div>

              {/* Payment methods */}
              <div className="mt-5 md:mt-7 flex items-center justify-center gap-3 flex-wrap">
                {["Visa", "Mastercard", "Apple Pay", "Google Pay", "Klarna", "SEPA"].map((m) => (
                  <span
                    key={m}
                    className="text-[10px] md:text-xs tracking-wider uppercase text-muted/70 px-2.5 py-1 rounded-md border border-white/5"
                  >
                    {m}
                  </span>
                ))}
              </div>
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

      {/* ============================================================ */}
      {/* FINAL CTA */}
      {/* ============================================================ */}
      <section className="py-16 md:py-32 bg-gradient-to-b from-background to-surface/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6">
              Wer jetzt arbeitet,
              <br />
              <span className="gradient-text-gold">dominiert später.</span>
            </h2>
            <p className="text-muted text-base md:text-lg mb-7 md:mb-10 max-w-xl mx-auto">
              4 Wochen Disziplin entscheiden über deine gesamte Hinrunde.
              Die Vorbereitung startet heute.
            </p>
            <button
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="group inline-flex items-center gap-2 px-7 py-4 md:px-9 md:py-5 bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-background text-base md:text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/30"
            >
              {checkoutLoading ? "Lade Checkout…" : `Plan sichern · 99 €`}
              {!checkoutLoading && (
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ============================================================ */
/* HERO BACKGROUND — premium static, no video                    */
/* ============================================================ */
function HeroBackground() {
  return (
    <>
      {/* Deep dark base with subtle vertical gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/35 to-background" />

      {/* Subtle gold diamond pattern (texture, not noise) */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A55A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Top + bottom edge fade for premium framing */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Very subtle radial highlight behind the title (centered, soft) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(197,165,90,0.06) 0%, transparent 60%)",
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
