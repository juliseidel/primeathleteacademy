"use client";

import { motion } from "framer-motion";
import { contact } from "@/lib/constants";

export default function DatenschutzPage() {
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
            Datenschutz
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
            {/* 1. Verantwortlicher */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Verantwortlicher
              </h2>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p className="mt-3">
                Prime Athlete Academy GbR
                <br />
                Jonas Kehl &amp; Patrick Scheder
                <br />
                {contact.location}
                <br />
                <br />
                E-Mail:{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  {contact.email}
                </a>
              </p>
            </div>

            {/* 2. Hosting */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. Hosting</h2>
              <p>
                Diese Website wird extern gehostet. Die personenbezogenen Daten,
                die auf dieser Website erfasst werden, werden auf den Servern des
                Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen,
                Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten,
                Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über
                eine Website generiert werden, handeln.
              </p>
              <p className="mt-3">
                Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung
                gegenüber unseren potenziellen und bestehenden Kunden (Art. 6 Abs.
                1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und
                effizienten Bereitstellung unseres Online-Angebots durch einen
                professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
              </p>
            </div>

            {/* 3. Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. Cookies</h2>
              <p>
                Unsere Website verwendet Cookies. Cookies sind kleine Textdateien,
                die auf Ihrem Endgerät gespeichert werden und die Ihr Browser
                speichert. Die meisten der von uns verwendeten Cookies sind
                sogenannte Session-Cookies, die nach Ende Ihres Besuchs
                automatisch gelöscht werden. Andere Cookies bleiben auf Ihrem
                Endgerät gespeichert, bis Sie diese löschen.
              </p>
              <p className="mt-3">
                Technisch notwendige Cookies werden auf Grundlage von Art. 6 Abs.
                1 lit. f DSGVO gespeichert. Der Websitebetreiber hat ein
                berechtigtes Interesse an der Speicherung von Cookies zur
                technisch fehlerfreien und optimierten Bereitstellung seiner
                Dienste. Soweit andere Cookies (z. B. Cookies zur Analyse Ihres
                Surfverhaltens) gespeichert werden, werden diese in dieser
                Datenschutzerklärung gesondert behandelt.
              </p>
            </div>

            {/* 4. Server-Log-Dateien */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Server-Log-Dateien
              </h2>
              <p>
                Der Provider der Seiten erhebt und speichert automatisch
                Informationen in so genannten Server-Log-Dateien, die Ihr Browser
                automatisch an uns übermittelt. Dies sind:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>Browsertyp und Browserversion</li>
                <li>verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              <p className="mt-3">
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
                nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf
                Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </div>

            {/* 5. Kontaktformular */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                5. Kontaktaufnahme
              </h2>
              <p>
                Wenn Sie uns per E-Mail oder über soziale Medien kontaktieren,
                wird Ihre Anfrage inklusive aller daraus hervorgehenden
                personenbezogenen Daten (Name, Anfrage) zum Zwecke der
                Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet.
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
              <p className="mt-3">
                Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
                Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines
                Vertrags zusammenhängt oder zur Durchführung vorvertraglicher
                Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die
                Verarbeitung auf unserem berechtigten Interesse an der effektiven
                Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f
                DSGVO).
              </p>
            </div>

            {/* 6. Externe Dienste */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                6. Externe Dienste
              </h2>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">
                Calendly
              </h3>
              <p>
                Wir nutzen den Dienst Calendly für die Terminbuchung. Anbieter
                ist Calendly LLC, 3423 Piedmont Road NE, Atlanta, GA 30305, USA.
                Wenn Sie über Calendly einen Termin buchen, werden Ihre
                eingegebenen Daten (Name, E-Mail, ggf. Telefonnummer) an Calendly
                übermittelt und dort gespeichert.
              </p>
              <p className="mt-3">
                Die Nutzung von Calendly erfolgt auf Grundlage von Art. 6 Abs. 1
                lit. b DSGVO (Vertragserfüllung) bzw. Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse an einer effizienten Terminplanung).
              </p>

              <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                Instagram
              </h3>
              <p>
                Auf dieser Website sind Funktionen des Dienstes Instagram
                eingebunden. Diese Funktionen werden angeboten durch die Meta
                Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5,
                Irland. Die Speicherung und Analyse der Daten erfolgt auf
                Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
              </p>
            </div>

            {/* 7. Google Analytics (optional) */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                7. Google Analytics (optional)
              </h2>
              <p>
                Sofern aktiviert, verwendet diese Website Google Analytics, einen
                Webanalysedienst der Google Ireland Limited, Gordon House, Barrow
                Street, Dublin 4, Irland. Google Analytics verwendet Cookies, die
                eine Analyse Ihrer Benutzung der Website ermöglichen.
              </p>
              <p className="mt-3">
                Die durch das Cookie erzeugten Informationen über Ihre Benutzung
                dieser Website werden in der Regel an einen Server von Google in
                den USA übertragen und dort gespeichert. Wir haben die
                IP-Anonymisierung aktiviert, sodass Ihre IP-Adresse von Google
                innerhalb der EU gekürzt wird. Die Nutzung erfolgt auf Grundlage
                von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
              </p>
            </div>

            {/* 8. Rechte der Betroffenen */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                8. Rechte der Betroffenen
              </h2>
              <p>Sie haben folgende Rechte gegenüber uns:</p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>Recht auf Auskunft über Ihre gespeicherten Daten</li>
                <li>Recht auf Berichtigung unrichtiger Daten</li>
                <li>Recht auf Löschung Ihrer Daten</li>
                <li>Recht auf Einschränkung der Verarbeitung</li>
                <li>Recht auf Datenübertragbarkeit</li>
                <li>
                  Widerspruchsrecht gegen die Verarbeitung Ihrer Daten
                </li>
                <li>
                  Recht auf Widerruf einer erteilten Einwilligung jederzeit für
                  die Zukunft
                </li>
                <li>
                  Beschwerderecht bei einer Aufsichtsbehörde
                </li>
              </ul>
              <p className="mt-3">
                Wenn Sie Fragen zum Datenschutz haben, können Sie sich jederzeit
                an uns wenden:{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  {contact.email}
                </a>
              </p>
            </div>

            {/* Stand */}
            <div className="border-t border-white/5 pt-8">
              <p className="text-muted text-sm">
                Stand: März 2026 | Diese Datenschutzerklärung wird regelmäßig
                aktualisiert.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
