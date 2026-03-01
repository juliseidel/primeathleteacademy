"use client";

import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-gold font-bold text-xl">PAA</span>
            <span className="text-gray-600 text-sm">
              Prime Athlete Academy
            </span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/primeathleteacademy/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold/30 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Prime Athlete Academy. Alle Rechte
            vorbehalten.
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-8 pt-6 border-t border-gray-800/30 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
          <a href="#" className="hover:text-gray-400 transition-colors">
            Impressum
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            Datenschutz
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            AGB
          </a>
        </div>
      </div>
    </footer>
  );
}
