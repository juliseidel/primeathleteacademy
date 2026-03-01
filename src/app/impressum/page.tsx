"use client";

import { motion } from "framer-motion";
import { contact } from "@/lib/constants";

export default function ImpressumPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="tracking-[0.3em] uppercase text-muted text-sm mb-4"
          >
            Rechtliches
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black gradient-text-gold"
          >
            Impressum
          </motion.h1>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-20 md:py-32 bg-surface/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10 text-muted"
          >
            {/* Angaben gemaess 5 TMG */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Angaben gemäß &sect; 5 TMG
              </h2>
              <p>
                Prime Athlete Academy GbR
                <br />
                Jonas Kehl &amp; Patrick Scheder
                <br />
                {contact.location}
              </p>
            </div>

            {/* Kontakt */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Kontakt</h2>
              <p>
                E-Mail:{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  {contact.email}
                </a>
              </p>
            </div>

            {/* Vertreten durch */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Vertreten durch
              </h2>
              <p>Jonas Kehl &amp; Patrick Scheder</p>
            </div>

            {/* Umsatzsteuer-ID */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Umsatzsteuer-ID
              </h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß &sect; 27 a
                Umsatzsteuergesetz:
                <br />
                [wird nachgetragen]
              </p>
            </div>

            {/* Verantwortlich fuer den Inhalt */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Verantwortlich für den Inhalt nach &sect; 55 Abs. 2 RStV
              </h2>
              <p>
                Jonas Kehl &amp; Patrick Scheder
                <br />
                {contact.location}
              </p>
            </div>

            {/* Streitschlichtung */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Streitschlichtung
              </h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                .
              </p>
              <p className="mt-3">
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

            {/* Haftung fuer Inhalte */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Haftung für Inhalte
              </h2>
              <p>
                Als Diensteanbieter sind wir gemäß &sect; 7 Abs.1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen.
              </p>
              <p className="mt-3">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                Informationen nach den allgemeinen Gesetzen bleiben hiervon
                unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
                Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
                Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
                diese Inhalte umgehend entfernen.
              </p>
            </div>

            {/* Haftung fuer Links */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Haftung für Links
              </h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich.
              </p>
              <p className="mt-3">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
                jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
                zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
                derartige Links umgehend entfernen.
              </p>
            </div>

            {/* Urheberrecht */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Urheberrecht
              </h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p className="mt-3">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
                wurden, werden die Urheberrechte Dritter beachtet. Sollten Sie
                trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
                Rechtsverletzungen werden wir derartige Inhalte umgehend
                entfernen.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
