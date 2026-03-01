import Link from "next/link";
import { Instagram, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { navLinks, contact } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-8 border-t border-white/[0.04]">
      {/* Top gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-gold font-bold text-2xl glow-gold-text">
                PAA
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Elite Athletik- und Ernährungscoaching von Profifußballern für
              Profifußballer.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#141414] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold/30 hover:shadow-[0_0_15px_rgba(197,165,90,0.1)] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Seiten */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">
              Seiten
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Leistungen */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">
              Leistungen
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/athletiktraining"
                  className="text-sm text-gray-500 hover:text-gold transition-colors"
                >
                  Athletiktraining
                </Link>
              </li>
              <li>
                <Link
                  href="/ernaehrung"
                  className="text-sm text-gray-500 hover:text-gold transition-colors"
                >
                  Ernährungscoaching
                </Link>
              </li>
              <li>
                <Link
                  href="/leistungen"
                  className="text-sm text-gray-500 hover:text-gold transition-colors"
                >
                  Alle Leistungen
                </Link>
              </li>
              <li>
                <Link
                  href="/referenzen"
                  className="text-sm text-gray-500 hover:text-gold transition-colors"
                >
                  Referenzen
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 tracking-wide">
              Kontakt
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-2 text-sm text-gray-500 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="break-all">{contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{contact.location}</span>
              </li>
              <li>
                <a
                  href={contact.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-light transition-colors mt-2"
                >
                  Termin buchen
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Prime Athlete Academy. Alle Rechte
            vorbehalten.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <Link
              href="/impressum"
              className="hover:text-gray-400 transition-colors"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="hover:text-gray-400 transition-colors"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
