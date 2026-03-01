"use client";

import { motion } from "framer-motion";
import { Calendar, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Kontakt
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Bereit für dein
            <br />
            <span className="text-gold">nächstes Level?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Buch dir jetzt dein kostenloses Erstgespräch und lass uns gemeinsam
            schauen, wie wir dich nach vorne bringen.
          </p>
        </motion.div>

        {/* CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 sm:p-12 text-center max-w-2xl mx-auto"
        >
          <Calendar className="w-12 h-12 text-gold mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-3">Kostenloses Erstgespräch</h3>
          <p className="text-gray-400 mb-8">
            30 Minuten, in denen wir über deine Ziele sprechen und dir zeigen,
            wie wir dich unterstützen können. Unverbindlich und kostenlos.
          </p>

          <a
            href="https://calendly.com/primeathleteacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-gray-950 font-bold text-lg rounded hover:bg-gold-light transition-all duration-200 hover:scale-105"
          >
            Termin buchen
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500"
        >
          <a
            href="mailto:primeathleteacademy@primeathleteacademy.com"
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">
              primeathleteacademy@primeathleteacademy.com
            </span>
          </a>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">95448 Bayreuth</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
