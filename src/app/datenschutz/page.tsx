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
            <p className="text-sm italic">
              Datenschutzerklärung der PAA Prime Athlete Academy GmbH &amp; Co. KG
            </p>

            {/* 1. Information über die Erhebung personenbezogener Daten */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Information über die Erhebung personenbezogener Daten
              </h2>

              <p>
                (1) Im Folgenden informieren wir über die Erhebung personenbezogener
                Daten bei Nutzung unserer Angebote und unserer Website.
                Personenbezogene Daten sind alle Daten, die auf Sie persönlich
                beziehbar sind, z.&nbsp;B. Name, Adresse, E-Mail-Adressen,
                Nutzerverhalten. Wir verarbeiten personenbezogene Daten im Einklang
                mit den Bestimmungen der EU-Datenschutzgrundverordnung (DSGVO) und
                dem Bundesdatenschutzgesetz (BDSG) ausschließlich zur Erfüllung von
                vertraglichen Pflichten (Art. 6 Abs. 1 b DSGVO), aufgrund Ihrer
                Einwilligung (Art. 6 Abs. 1 a DSGVO) oder aufgrund gesetzlicher
                Vorgaben (Art. 6 Abs. 1 c DSGVO).
              </p>

              <p className="mt-3">
                (2) Verantwortlicher gem. Art. 4 Abs. 7 EU-Datenschutz-Grundverordnung
                (DS-GVO) ist die PAA Prime Athlete Academy GmbH &amp; Co. KG, Am
                Aubach 4, 95448 Bayreuth, vertreten durch die PAA Prime Athlete
                Academy Verwaltung GmbH, diese vertreten durch Patrick Scheder und
                Jonas Kehl (siehe unser{" "}
                <a
                  href="/impressum"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  Impressum
                </a>
                ).
              </p>

              <p className="mt-3">
                (3) Die Verarbeitung von Daten erfolgt zur Begründung von Verträgen
                für vertragliche Leistungen, die Erfüllung von vertraglichen
                Verpflichtungen der Leistungserbringung im Rahmen des
                Leistungsangebotes zur Büroorganisation sowie zur Erfüllung
                steuerrechtlicher Verpflichtungen. Die Zwecke der Datenverarbeitung
                richten sich in erster Linie nach der konkreten Dienstleistung.
                Soweit erforderlich, verarbeiten wir Ihre Daten über die eigentliche
                Erfüllung des Vertrages hinaus zur Wahrung berechtigter Interessen
                von uns (z.B. Geltendmachung rechtlicher Ansprüche und Verteidigung
                bei rechtlichen Streitigkeiten).
              </p>

              <p className="mt-3">
                (4) Die PAA Prime Athlete Academy GmbH &amp; Co. KG verarbeitet
                folgende Kategorien Ihrer Daten: Name, Adresse, Telefon, E-Mail,
                IP-Adresse, Bankdaten.
              </p>
            </div>

            {/* 2. Betroffenenrechte */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                2. Betroffenenrechte
              </h2>

              <p>
                Wir informieren Sie hiermit über Ihre nachfolgend aufgeführten Rechte
                als Betroffene der Datenverarbeitung:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>
                  Bestehen eines Rechts auf Auskunft nach den Voraussetzungen von
                  Art. 15 DSGVO, Berichtigung nach Maßgabe von Art. 16 DSGVO,
                  Löschung nach Maßgabe von Art. 17 DSGVO, Einschränkung der
                  Verarbeitung nach den Voraussetzungen von Art. 18 DSGVO oder eines
                  Widerspruchsrechts gegen die Verarbeitung nach Maßgabe von Art. 21
                  DSGVO bei einem berechtigten Interesse sowie des Rechts auf
                  Datenübertragbarkeit nach den Voraussetzungen von Art. 20 DSGVO.
                </li>
                <li>
                  Bestehen eines Rechts, die datenschutzrechtliche Einwilligung im
                  Sinne von Art. 6 Abs. 1 lit. a oder Art. 9 Abs. 2 lit. a jederzeit
                  ohne Angabe von Gründen und ohne Wahrung einer Form zu widerrufen,
                  ohne dass die Rechtmäßigkeit der aufgrund der Einwilligung bis zum
                  Widerruf erfolgten Verarbeitung berührt wird.
                </li>
                <li>
                  Jeder Betroffene hat bei Datenschutzrechtsverstößen des
                  Verantwortlichen oder einer seiner Auftragsdatenverarbeiter das
                  Recht zur Beschwerde bei der zuständigen Behörde. Dies ist:
                  <br />
                  <br />
                  Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
                  <br />
                  Promenade 18
                  <br />
                  91522 Ansbach
                  <br />
                  <a
                    href="https://www.lda.bayern.de/de/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold-light transition-colors"
                  >
                    https://www.lda.bayern.de/de/index.html
                  </a>
                  <br />
                  <br />
                  Darüber hinaus haben Betroffene die Möglichkeit, sich an die
                  Aufsichtsbehörde an ihrem gewöhnlichen Aufenthaltsort (Wohnort) zu
                  wenden.
                </li>
              </ul>
            </div>

            {/* 3. Sicherheitsmaßnahmen */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                3. Sicherheitsmaßnahmen
              </h2>
              <p>
                Wir treffen organisatorische, vertragliche und technische
                Sicherheitsmaßnahmen entsprechend dem Stand der Technik, um
                sicherzustellen, dass die Vorschriften der Datenschutzgesetze
                eingehalten werden, und um damit die durch uns verarbeiteten Daten
                gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung
                oder gegen den Zugriff unberechtigter Personen zu schützen. Zu den
                Sicherheitsmaßnahmen gehört insbesondere die verschlüsselte
                Übertragung von Daten zwischen Ihrem Browser und unserem Server.
              </p>
            </div>

            {/* 4. Löschkonzept */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Löschkonzept
              </h2>
              <p>
                Wir löschen rechnungsrelevante Daten nach 10 Jahren, im Übrigen
                löschen wir Daten binnen einer Frist von 4 Wochen nach Ablauf einer
                Frist von drei Jahren beginnend mit dem Ende des Jahres in dem die
                letzte vertragliche Leistung erbracht worden ist.
              </p>
            </div>

            {/* 5. Erhebung personenbezogener Daten bei Besuch unserer Website */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                5. Erhebung personenbezogener Daten bei Besuch unserer Website
              </h2>

              <p>
                (1) Bei der bloß informatorischen Nutzung der Website, also wenn Sie
                sich nicht registrieren oder uns anderweitig Informationen übermitteln,
                erheben wir nur die personenbezogenen Daten, die Ihr Browser an
                unseren Server übermittelt. Wenn Sie unsere Website betrachten möchten,
                erheben wir die folgenden Daten, die für uns technisch erforderlich
                sind, um Ihnen unsere Website anzuzeigen und die Stabilität und
                Sicherheit zu gewährleisten (Rechtsgrundlage ist Art. 6 Abs. 1 S. 1
                lit. f DS-GVO):
              </p>
              <ul className="list-disc list-inside mt-3 space-y-1">
                <li>IP-Adresse</li>
                <li>Datum und Uhrzeit der Anfrage</li>
                <li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
                <li>Inhalt der Anforderung (konkrete Seite)</li>
                <li>Zugriffsstatus / HTTP-Statuscode</li>
                <li>jeweils übertragene Datenmenge</li>
                <li>Website, von der die Anforderung kommt</li>
                <li>Browser</li>
                <li>Betriebssystem und dessen Oberfläche</li>
                <li>Sprache und Version der Browsersoftware</li>
              </ul>

              <p className="mt-3">
                (2) Bei Ihrer Kontaktaufnahme mit uns per E-Mail oder über ein
                Kontaktformular werden die von Ihnen mitgeteilten Daten (Ihre
                E-Mail-Adresse, ggf. Ihr Name und Ihre Telefonnummer) von uns
                gespeichert, um Ihre Fragen zu beantworten. Die in diesem
                Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung
                nicht mehr erforderlich ist, oder schränken die Verarbeitung ein,
                falls gesetzliche Aufbewahrungspflichten bestehen.
              </p>

              <p className="mt-3">
                (3) Das Hosting unserer Website erfolgt durch die Squarespace Ireland
                Limited, Squarespace House, Ship Street Great, Dublin 8, D08 N12C.
                Die Datenschutzerklärung finden Sie hier:{" "}
                <a
                  href="https://de.squarespace.com/datenschutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  https://de.squarespace.com/datenschutz
                </a>
              </p>
            </div>

            {/* 6. Auftragsverarbeiter */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                6. Auftragsverarbeiter
              </h2>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">
                Hosting
              </h3>
              <p>
                Das Hosting unserer Website erfolgt durch die Squarespace Ireland
                Limited, Squarespace House, Ship Street Great, Dublin 8, D08 N12C.
                Die Datenschutzerklärung finden Sie hier:{" "}
                <a
                  href="https://de.squarespace.com/datenschutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  https://de.squarespace.com/datenschutz
                </a>
              </p>

              <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                Google Workspace
              </h3>
              <p>
                Wir nutzen Google Workspace, konkret Google Drive und Google Mail zur
                Organisation unserer Bürotätigkeiten, sowie zum Mailversand. Die
                Dienste werden bereitgestellt von Google Ireland Limited, Gordon House,
                Barrow Street, Dublin 4, Irland.
              </p>
              <p className="mt-3">
                Google Drive ist ein Cloudspeicher, wir nutzen den Dienst zur Ablage
                und Koordination unserer internen Dokumente sowie zur Strukturierung
                von Kundendaten. Google Mail (Gmail) nutzen wir für unsere
                geschäftlichen E-Mail-Kommunikation. Nachrichten, deren Inhalt und
                Metadaten werden auf Servern von Google gespeichert.
              </p>
              <p className="mt-3">
                Die Verwendung der Google Workspace-Dienste erfolgt auf Grundlage von
                Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der
                effizienten und gut zugänglichen, gleichwohl sicheren Organisation
                unserer Bürotätigkeiten. Die Google Ireland Limited ist eine
                Tochterfirma der Google LLC. mit Sitz in Amerika. Die Google LLC. ist
                zertifiziert nach dem EU-US Data Privacy Framework. Mit der Google
                Ireland Limited wurde außerdem ein Auftragsverarbeitungsvertrag
                geschlossen, der die Standardvertragsklauseln der EU enthält.
              </p>
            </div>

            {/* Kontakt */}
            <div className="border-t border-white/5 pt-8">
              <p>
                Wenn Sie Fragen zum Datenschutz haben, können Sie sich jederzeit an
                uns wenden:{" "}
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
