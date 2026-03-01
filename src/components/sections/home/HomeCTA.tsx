"use client";

import FadeInView from "@/components/animation/FadeInView";
import GlowButton from "@/components/ui/GlowButton";
import GoldGlow from "@/components/effects/GoldGlow";
import { contact } from "@/lib/constants";
import { Calendar, Mail, MapPin } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative max-w-3xl mx-auto px-6">
        <GoldGlow size="lg" position="center" className="opacity-30" />

        <FadeInView>
          <div className="relative bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 sm:p-14 text-center backdrop-blur-sm hover:border-gold/20 transition-colors duration-500">
            {/* Glow line on top */}
            <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <Calendar className="w-12 h-12 text-gold mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Bereit für dein
              <br />
              <span className="text-gold glow-gold-text">nächstes Level?</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
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
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-500 text-sm">
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
