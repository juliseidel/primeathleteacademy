"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Apple, Trophy, Quote, Instagram, Play } from "lucide-react";
import { coaches, testimonials, stats, contact } from "@/lib/constants";

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-surface" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A55A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold-dark/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8"
          >
            <Image
              src="/images/logo.jpg"
              alt="Prime Athlete Academy Logo"
              width={120}
              height={120}
              className="mx-auto rounded-2xl border border-gold/20 shadow-lg shadow-gold/10"
              priority
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base tracking-[0.3em] uppercase text-muted mb-6"
          >
            Elite Athletik-Coaching
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text-gold glow-gold-text mb-8"
          >
            PRIME ATHLETE
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={contact.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-gold hover:bg-gold-light text-background font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20"
            >
              Kostenloses Erstgespräch
            </a>
            <Link
              href="/leistungen"
              className="flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-gold/30 rounded-full text-foreground/70 hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Was wir bieten
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-gold">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs text-muted tracking-widest uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS TICKER ===== */}
      <div className="w-full overflow-hidden bg-surface/50 border-y border-white/5 py-3">
        <div className="animate-ticker whitespace-nowrap flex">
          {[1, 2, 3].map((repeat) => (
            <span key={repeat} className="text-sm font-mono tracking-widest text-muted mx-4">
              8+ JAHRE FC BAYERN &nbsp;&middot;&nbsp; 150K+ COMMUNITY &nbsp;&middot;&nbsp; 2. BUNDESLIGA KLIENTEN &nbsp;&middot;&nbsp; A-LIZENZ COACHES &nbsp;&middot;&nbsp; INDIVIDUELLES COACHING &nbsp;&middot;&nbsp; WISSENSCHAFTLICH FUNDIERT &nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ===== SERVICES SECTION ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-2">
              Was wir <span className="gradient-text-gold">bieten</span>
            </h2>
            <p className="text-muted mb-10">
              Drei Säulen für deine maximale Performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                description: "Unsere Athleten spielen in der 2. Bundesliga, 3. Liga und darüber hinaus. Messbare Ergebnisse, die für sich sprechen.",
                href: "/referenzen",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Link
                  href={item.href}
                  className="group block bg-surface border border-white/5 hover:border-gold/20 rounded-2xl p-8 transition-all duration-300 hover:bg-surface-light"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                    <item.icon size={24} className="text-gold" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    Mehr erfahren <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VIDEO / TRAINING SHOWCASE ===== */}
      <section className="py-20 md:py-32 bg-surface/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              So trainieren wir <span className="gradient-text-gold">Profis</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Ein Einblick in unser Training. Jeden Tag arbeiten wir daran, Athleten aufs nächste Level zu bringen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Video - autoplay, muted, loop */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-gold/5 bg-surface mx-auto w-full max-w-[340px]">
                <video
                  src="/images/reel.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full aspect-[9/16] object-cover"
                />
              </div>
              {/* Gold glow beneath video */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gold/20 blur-2xl rounded-full" />
            </motion.div>

            {/* Training Images + Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/training-1.jpg"
                  alt="PAA Athletiktraining"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full backdrop-blur-sm border border-gold/20">
                    Athletiktraining
                  </span>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/images/training-2.jpg"
                  alt="PAA Training Session"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full backdrop-blur-sm border border-gold/20">
                    Performance Coaching
                  </span>
                </div>
              </div>

              <Link
                href="/athletiktraining"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-medium"
              >
                Mehr über unser Training erfahren
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== COACHES SECTION ===== */}
      <section className="py-20 md:py-32">
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
            <p className="text-muted max-w-xl mx-auto">
              Zwei aktive Profifußballer. Lizenzierte Coaches. Über ein Jahrzehnt Erfahrung im Leistungssport.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coaches.map((coach, index) => {
              const imgSrc = index === 0 ? "/images/jonas.jpg" : "/images/patrick.jpg";
              return (
                <motion.div
                  key={coach.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                >
                  <Link
                    href="/ueber-uns"
                    className="group block bg-surface hover:bg-surface-light border border-white/5 hover:border-gold/20 rounded-3xl overflow-hidden transition-colors duration-300"
                  >
                    {/* Coach Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={coach.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                    </div>

                    <div className="p-8 pt-4">
                      <h3 className="text-2xl font-black group-hover:text-gold transition-colors mb-1">
                        {coach.name}
                      </h3>
                      <p className="text-sm text-gold/80 mb-4">{coach.role}</p>
                      <p className="text-muted leading-relaxed mb-6 text-sm">
                        {coach.bio}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {coach.highlights.map((h) => (
                          <span
                            key={h.text}
                            className="px-3 py-1 bg-gold/10 text-gold text-xs font-medium rounded-full"
                          >
                            {h.text}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-sm text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                        Mehr erfahren <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 md:py-32 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Was Athleten <span className="gradient-text-gold">sagen</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 4).map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface border border-white/5 rounded-2xl p-8 hover:border-gold/20 transition-colors duration-300"
              >
                <Quote size={24} className="text-gold/30 mb-4" />
                <p className="text-foreground/90 leading-relaxed mb-6 italic">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted">{t.team} &middot; {t.league}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              href="/referenzen"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-gold/30 rounded-full text-sm font-medium text-muted hover:text-gold transition-all duration-300"
            >
              Alle Referenzen ansehen
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== INSTAGRAM SECTION ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Folge uns auf <span className="gradient-text-gold">Instagram</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
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
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-full text-gold font-bold transition-all duration-300 hover:scale-105"
          >
            <Instagram size={20} />
            {contact.instagramHandle}
            <ArrowRight size={16} />
          </motion.a>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-surface/50 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Bereit für dein <span className="gradient-text-gold">nächstes Level</span>?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
              Buche dein kostenloses Erstgespräch und finde heraus, wie wir dich nach vorne bringen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-gold hover:bg-gold-light text-background font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20"
              >
                Kostenloses Erstgespräch
              </a>
              <Link
                href="/leistungen"
                className="flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-gold/30 rounded-full text-foreground/70 hover:text-foreground transition-all duration-300 hover:scale-105"
              >
                Alle Leistungen
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
