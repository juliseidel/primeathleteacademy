"use client";

import FadeInView from "@/components/animation/FadeInView";
import GlowButton from "@/components/ui/GlowButton";
import GoldGlow from "@/components/effects/GoldGlow";
import { contact } from "@/lib/constants";
import { Calendar, Mail, MapPin } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="py-24 sm:py-32 relative">
      {/* Section separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative max-w-3xl mx-auto px-6">
        <GoldGlow size="lg" position="center" className="opacity-40" />

        <FadeInView>
          <div className="relative overflow-hidden bg-[#141414]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-10 sm:p-16 text-center hover:border-gold/25 hover:shadow-[0_0_60px_rgba(197,165,90,0.1)] transition-all duration-700">
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            {/* Inner glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-40 bg-gradient-to-b from-gold/[0.04] to-transparent pointer-events-none" />

            <Calendar className="w-12 h-12 text-gold mx-auto mb-8" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Bereit für dein
              <br />
              <span className="text-gold glow-gold-text">nächstes Level?</span>
            </h2>
            <p className="text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed">
              Buch dir jetzt dein kostenloses Erstgespräch und lass uns gemeinsam
              schauen, wie wir dich nach vorne bringen.
            </p>

            <GlowButton
              href={contact.calendlyUrl}
              variant="primary"
              size="large"
              external
              showArrow
            >
              Termin buchen
            </GlowButton>

            {/* Contact info */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-500 text-sm">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{contact.email}</span>
              </a>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {contact.location}
              </span>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
