"use client";

import Link from "next/link";
import { Instagram, Mail, MapPin, ArrowUp } from "lucide-react";
import { navLinks, contact } from "@/lib/constants";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-surface border-t border-white/5">
      {/* Back to top */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 bg-gold/20 hover:bg-gold/40 border border-gold/30 rounded-full flex items-center justify-center text-gold transition-all duration-300 hover:scale-110"
          aria-label="Zurück nach oben"
        >
          <ArrowUp size={18} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black tracking-wider gradient-text-gold mb-4">
              PAA
            </h3>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Individuelles Athletik- und Ernährungscoaching von Profifußballern für Profifußballer.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-foreground/50 mb-4">
              Seiten
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Leistungen */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-foreground/50 mb-4">
              Leistungen
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/athletiktraining" className="text-sm text-muted hover:text-gold transition-colors duration-300">
                Athletiktraining
              </Link>
              <Link href="/ernaehrung" className="text-sm text-muted hover:text-gold transition-colors duration-300">
                Ernährungscoaching
              </Link>
              <Link href="/leistungen" className="text-sm text-muted hover:text-gold transition-colors duration-300">
                Alle Leistungen
              </Link>
              <Link href="/referenzen" className="text-sm text-muted hover:text-gold transition-colors duration-300">
                Referenzen
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-foreground/50 mb-4">
              Kontakt
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted hover:text-gold transition-colors duration-300 group"
              >
                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
                {contact.instagramHandle}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-sm text-muted hover:text-gold transition-colors duration-300 group"
              >
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
                E-Mail
              </a>
              <div className="flex items-center gap-3 text-sm text-muted">
                <MapPin size={18} />
                {contact.location}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Prime Athlete Academy. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="text-xs text-muted hover:text-gold transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-xs text-muted hover:text-gold transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
