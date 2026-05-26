"use client";

import { motion } from "framer-motion";
import { contact } from "@/lib/constants";

export default function AgbPage() {
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
            className="text-4xl md:text-7xl font-black gradient-text-gold"
          >
            AGB &amp; Widerruf
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-sm md:text-base max-w-2xl mx-auto mt-5"
          >
            Allgemeine Geschäftsbedingungen für den Verkauf digitaler Produkte
            sowie Widerrufsbelehrung.
          </motion.p>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="py-16 md:py-28 bg-surface/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10 text-muted leading-relaxed text-sm md:text-base"
          >
            {/* §1 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 1 Geltungsbereich &amp; Anbieter
              </h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle
                Verträge über den Kauf digitaler Produkte (insbesondere
                PDF-Trainings- und Ernährungspläne) über die Website
                primeathleteacademy.com zwischen
              </p>
              <p className="mt-3">
                Prime Athlete Academy GbR
                <br />
                Jonas Kehl &amp; Patrick Scheder
                <br />
                {contact.location}
                <br />
                E-Mail:{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  {contact.email}
                </a>
              </p>
              <p className="mt-3">
                (nachfolgend „Anbieter") und dem Kunden (nachfolgend „Kunde").
              </p>
            </div>

            {/* §2 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 2 Vertragsgegenstand
              </h2>
              <p>
                Gegenstand des Vertrags ist die Bereitstellung digitaler Inhalte,
                insbesondere des „Off-Season Plan 2026 (Elite Edition)" als
                herunterladbare PDF-Datei. Der Inhalt dient ausschließlich
                Informations- und Trainingszwecken und ersetzt keine
                medizinische, physiotherapeutische oder ernährungswissenschaftliche
                Beratung. Die Umsetzung erfolgt auf eigene Verantwortung des Kunden.
              </p>
            </div>

            {/* §3 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 3 Vertragsschluss
              </h2>
              <p>
                Die Darstellung der Produkte auf der Website stellt kein rechtlich
                bindendes Angebot dar, sondern eine Aufforderung zur Bestellung.
                Mit dem Anklicken des Buttons „Jetzt sichern" und dem Abschluss des
                Bezahlvorgangs gibt der Kunde ein verbindliches Angebot zum
                Vertragsabschluss ab. Der Vertrag kommt mit der Bestätigung der
                Zahlung zustande.
              </p>
            </div>

            {/* §4 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 4 Preise und Zahlung
              </h2>
              <p>
                Alle Preise verstehen sich inklusive der gesetzlichen
                Mehrwertsteuer. Die Zahlung erfolgt über den Zahlungsdienstleister
                Stripe (Stripe Payments Europe Ltd.). Je nach Auswahl stehen
                verschiedene Zahlungsarten zur Verfügung (z. B. Kreditkarte, Apple
                Pay, Google Pay, PayPal, Klarna, SEPA-Lastschrift). Eine Rechnung
                mit ausgewiesener Mehrwertsteuer wird automatisch per E-Mail
                bereitgestellt.
              </p>
            </div>

            {/* §5 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 5 Lieferung &amp; Bereitstellung
              </h2>
              <p>
                Die Bereitstellung des digitalen Produkts erfolgt unmittelbar nach
                erfolgreicher Zahlung. Der Kunde erhält direkt im Anschluss einen
                Download-Link auf der Bestätigungsseite sowie zusätzlich per E-Mail.
                Der Download-Link ist 30 Tage gültig. Es wird empfohlen, die Datei
                nach dem Download lokal zu speichern.
              </p>
            </div>

            {/* §6 Widerrufsbelehrung */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 6 Widerrufsbelehrung
              </h2>
              <p className="font-semibold text-foreground/90">Widerrufsrecht</p>
              <p className="mt-2">
                Verbrauchern steht grundsätzlich ein gesetzliches Widerrufsrecht
                zu. Ein Verbraucher ist jede natürliche Person, die ein
                Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer
                gewerblichen noch ihrer selbständigen beruflichen Tätigkeit
                zugerechnet werden können.
              </p>
              <p className="mt-3">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
                diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
                Tage ab dem Tag des Vertragsabschlusses.
              </p>
              <p className="mt-3">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Prime Athlete
                Academy GbR, {contact.location}, {contact.email}) mittels einer
                eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder
                eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
                informieren. Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie
                die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
                Widerrufsfrist absenden.
              </p>

              <p className="mt-5 font-semibold text-foreground/90">
                Vorzeitiges Erlöschen des Widerrufsrechts
              </p>
              <p className="mt-2 bg-gold/5 border border-gold/20 rounded-xl p-4">
                Das Widerrufsrecht erlischt bei einem Vertrag über die Lieferung
                von nicht auf einem körperlichen Datenträger befindlichen digitalen
                Inhalten vorzeitig, wenn der Anbieter mit der Ausführung des
                Vertrags begonnen hat, nachdem der Kunde
                <br />
                (1) ausdrücklich zugestimmt hat, dass der Anbieter mit der
                Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnt, und
                <br />
                (2) seine Kenntnis davon bestätigt hat, dass er durch seine
                Zustimmung mit Beginn der Ausführung des Vertrags sein
                Widerrufsrecht verliert.
              </p>
              <p className="mt-3">
                Mit dem Setzen des entsprechenden Häkchens im Bestellprozess und dem
                anschließenden Download des Produkts erteilt der Kunde diese
                ausdrückliche Zustimmung. Das Widerrufsrecht erlischt damit mit
                Beginn des Downloads.
              </p>

              <p className="mt-5 font-semibold text-foreground/90">
                Muster-Widerrufsformular
              </p>
              <p className="mt-2">
                (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses
                Formular aus und senden Sie es zurück.)
              </p>
              <div className="mt-3 bg-background/60 border border-white/10 rounded-xl p-4 text-sm text-muted/90">
                <p>An: Prime Athlete Academy GbR, {contact.location}, {contact.email}</p>
                <p className="mt-2">
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                  abgeschlossenen Vertrag über den Kauf der folgenden digitalen
                  Inhalte:
                </p>
                <p className="mt-2">
                  — Bestellt am: __________
                  <br />— Name des/der Verbraucher(s): __________
                  <br />— Anschrift des/der Verbraucher(s): __________
                  <br />— Datum: __________
                </p>
                <p className="mt-2">(*) Unzutreffendes streichen.</p>
              </div>
            </div>

            {/* §7 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 7 Nutzungsrechte
              </h2>
              <p>
                Der Kunde erhält ein einfaches, nicht übertragbares Nutzungsrecht
                an den erworbenen digitalen Inhalten ausschließlich für den eigenen,
                privaten Gebrauch. Die Weitergabe, Vervielfältigung,
                Veröffentlichung oder der Weiterverkauf der Inhalte – ganz oder in
                Teilen – an Dritte ist ohne ausdrückliche schriftliche Zustimmung
                des Anbieters nicht gestattet.
              </p>
            </div>

            {/* §8 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 8 Haftung &amp; Gesundheitshinweis
              </h2>
              <p>
                Die im Produkt enthaltenen Trainings- und Ernährungsempfehlungen
                wurden mit größtmöglicher Sorgfalt erstellt, ersetzen jedoch keine
                ärztliche oder therapeutische Beratung. Vor Beginn eines
                Trainings- oder Ernährungsprogramms wird empfohlen, ärztlichen Rat
                einzuholen. Der Anbieter haftet nicht für Schäden, die aus der
                eigenverantwortlichen Umsetzung der Inhalte entstehen, soweit nicht
                Vorsatz oder grobe Fahrlässigkeit vorliegt.
              </p>
            </div>

            {/* §9 */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                § 9 Schlussbestimmungen
              </h2>
              <p>
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
                des UN-Kaufrechts. Sollten einzelne Bestimmungen dieser AGB
                unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen
                unberührt. Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                . Zur Teilnahme an einem Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht
                bereit.
              </p>
            </div>

            <p className="text-xs text-muted/60 pt-4 border-t border-white/5">
              Stand: Mai 2026
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
