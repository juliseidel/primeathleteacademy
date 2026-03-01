import { generatePageMetadata } from "@/lib/metadata";
import PageHero from "@/components/layout/PageHero";
import FadeInView from "@/components/animation/FadeInView";
import { contact } from "@/lib/constants";

export const metadata = generatePageMetadata({
  title: "Datenschutz",
  description:
    "Datenschutzerklärung der Prime Athlete Academy – Informationen zum Datenschutz gemäß DSGVO.",
  path: "/datenschutz",
});

export default function DatenschutzPage() {
  return (
    <>
      <PageHero tag="Rechtliches" title="Datenschutz" />

      <section className="relative py-24">
        <div className="max-w-3xl mx-auto px-6">
          <FadeInView>
            <div className="prose prose-invert prose-gold max-w-none space-y-10 text-gray-400">
              {/* 1. Datenschutz auf einen Blick */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. Datenschutz auf einen Blick
                </h2>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Allgemeine Hinweise
                </h3>
                <p>
                  Die folgenden Hinweise geben einen einfachen Überblick darüber,
                  was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
                  Website besuchen. Personenbezogene Daten sind alle Daten, mit
                  denen Sie persönlich identifiziert werden können. Ausführliche
                  Informationen zum Thema Datenschutz entnehmen Sie unserer unter
                  diesem Text aufgeführten Datenschutzerklärung.
                </p>

                <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                  Datenerfassung auf dieser Website
                </h3>
                <p className="font-medium text-gray-300">
                  Wer ist verantwortlich für die Datenerfassung auf dieser
                  Website?
                </p>
                <p>
                  Die Datenverarbeitung auf dieser Website erfolgt durch den
                  Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt
                  &ldquo;Hinweis zur verantwortlichen Stelle&rdquo; in dieser
                  Datenschutzerklärung entnehmen.
                </p>

                <p className="font-medium text-gray-300 mt-4">
                  Wie erfassen wir Ihre Daten?
                </p>
                <p>
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
                  mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie
                  in ein Kontaktformular eingeben. Andere Daten werden
                  automatisch oder nach Ihrer Einwilligung beim Besuch der
                  Website durch unsere IT-Systeme erfasst. Das sind vor allem
                  technische Daten (z. B. Internetbrowser, Betriebssystem oder
                  Uhrzeit des Seitenaufrufs).
                </p>

                <p className="font-medium text-gray-300 mt-4">
                  Wofür nutzen wir Ihre Daten?
                </p>
                <p>
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie
                  Bereitstellung der Website zu gewährleisten. Andere Daten
                  können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                </p>

                <p className="font-medium text-gray-300 mt-4">
                  Welche Rechte haben Sie bezüglich Ihrer Daten?
                </p>
                <p>
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über
                  Herkunft, Empfänger und Zweck Ihrer gespeicherten
                  personenbezogenen Daten zu erhalten. Sie haben außerdem ein
                  Recht, die Berichtigung oder Löschung dieser Daten zu
                  verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung
                  erteilt haben, können Sie diese Einwilligung jederzeit für die
                  Zukunft widerrufen. Außerdem haben Sie das Recht, unter
                  bestimmten Umständen die Einschränkung der Verarbeitung Ihrer
                  personenbezogenen Daten zu verlangen.
                </p>
              </div>

              {/* 2. Hosting */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. Hosting
                </h2>
                <p>
                  Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
                </p>
                <h3 className="text-lg font-semibold text-white mt-4 mb-2">
                  Externes Hosting
                </h3>
                <p>
                  Diese Website wird extern gehostet. Die personenbezogenen
                  Daten, die auf dieser Website erfasst werden, werden auf den
                  Servern des Hosters gespeichert. Hierbei kann es sich v. a. um
                  IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
                  Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und
                  sonstige Daten, die über eine Website generiert werden, handeln.
                </p>
                <p className="mt-3">
                  Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung
                  gegenüber unseren potenziellen und bestehenden Kunden (Art. 6
                  Abs. 1 lit. b DSGVO) und im Interesse einer sicheren,
                  schnellen und effizienten Bereitstellung unseres
                  Online-Angebots durch einen professionellen Anbieter (Art. 6
                  Abs. 1 lit. f DSGVO).
                </p>
              </div>

              {/* 3. Allgemeine Hinweise und Pflichtinformationen */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. Allgemeine Hinweise und Pflichtinformationen
                </h2>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Datenschutz
                </h3>
                <p>
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer
                  persönlichen Daten sehr ernst. Wir behandeln Ihre
                  personenbezogenen Daten vertraulich und entsprechend den
                  gesetzlichen Datenschutzvorschriften sowie dieser
                  Datenschutzerklärung.
                </p>

                <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                  Hinweis zur verantwortlichen Stelle
                </h3>
                <p>
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser
                  Website ist:
                </p>
                <p className="mt-3">
                  Prime Athlete Academy
                  <br />
                  Jonas Kehl & Patrick Scheder
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
                <p className="mt-3">
                  Verantwortliche Stelle ist die natürliche oder juristische
                  Person, die allein oder gemeinsam mit anderen über die Zwecke
                  und Mittel der Verarbeitung von personenbezogenen Daten (z. B.
                  Namen, E-Mail-Adressen o. Ä.) entscheidet.
                </p>

                <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                  Speicherdauer
                </h3>
                <p>
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere
                  Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen
                  Daten bei uns, bis der Zweck für die Datenverarbeitung
                  entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend
                  machen oder eine Einwilligung zur Datenverarbeitung widerrufen,
                  werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich
                  zulässigen Gründe für die Speicherung Ihrer personenbezogenen
                  Daten haben.
                </p>

                <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                  Widerruf Ihrer Einwilligung zur Datenverarbeitung
                </h3>
                <p>
                  Viele Datenverarbeitungsvorgänge sind nur mit Ihrer
                  ausdrücklichen Einwilligung möglich. Sie können eine bereits
                  erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit
                  der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom
                  Widerruf unberührt.
                </p>

                <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                  Recht auf Datenübertragbarkeit
                </h3>
                <p>
                  Sie haben das Recht, Daten, die wir auf Grundlage Ihrer
                  Einwilligung oder in Erfüllung eines Vertrags automatisiert
                  verarbeiten, an sich oder an einen Dritten in einem gängigen,
                  maschinenlesbaren Format aushändigen zu lassen.
                </p>

                <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                  Auskunft, Löschung und Berichtigung
                </h3>
                <p>
                  Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen
                  jederzeit das Recht auf unentgeltliche Auskunft über Ihre
                  gespeicherten personenbezogenen Daten, deren Herkunft und
                  Empfänger und den Zweck der Datenverarbeitung und ggf. ein
                  Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie
                  zu weiteren Fragen zum Thema personenbezogene Daten können Sie
                  sich jederzeit an uns wenden.
                </p>

                <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                  Recht auf Einschränkung der Verarbeitung
                </h3>
                <p>
                  Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer
                  personenbezogenen Daten zu verlangen. Hierzu können Sie sich
                  jederzeit an uns wenden.
                </p>
              </div>

              {/* 4. Datenerfassung auf dieser Website */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. Datenerfassung auf dieser Website
                </h2>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Server-Log-Dateien
                </h3>
                <p>
                  Der Provider der Seiten erhebt und speichert automatisch
                  Informationen in so genannten Server-Log-Dateien, die Ihr
                  Browser automatisch an uns übermittelt. Dies sind:
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

                <h3 className="text-lg font-semibold text-white mt-6 mb-2">
                  Kontaktaufnahme
                </h3>
                <p>
                  Wenn Sie uns per E-Mail oder über soziale Medien kontaktieren,
                  wird Ihre Anfrage inklusive aller daraus hervorgehenden
                  personenbezogenen Daten (Name, Anfrage) zum Zwecke der
                  Bearbeitung Ihres Anliegens bei uns gespeichert und
                  verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung
                  weiter.
                </p>
                <p className="mt-3">
                  Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6
                  Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung
                  eines Vertrags zusammenhängt oder zur Durchführung
                  vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen
                  Fällen beruht die Verarbeitung auf unserem berechtigten
                  Interesse an der effektiven Bearbeitung der an uns gerichteten
                  Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
              </div>

              {/* 5. Soziale Medien */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. Soziale Medien
                </h2>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Instagram
                </h3>
                <p>
                  Auf dieser Website sind Funktionen des Dienstes Instagram
                  eingebunden. Diese Funktionen werden angeboten durch die Meta
                  Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5,
                  Irland.
                </p>
                <p className="mt-3">
                  Wenn Sie in Ihrem Instagram-Account eingeloggt sind, können Sie
                  durch Anklicken des Instagram-Buttons die Inhalte dieser
                  Website mit Ihrem Instagram-Profil verlinken. Dadurch kann
                  Instagram den Besuch dieser Website Ihrem Benutzerkonto
                  zuordnen.
                </p>
                <p className="mt-3">
                  Die Speicherung und Analyse der Daten erfolgt auf Grundlage von
                  Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen hierzu
                  finden Sie in der Datenschutzerklärung von Instagram.
                </p>
              </div>

              {/* 6. Externe Dienste */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. Externe Dienste
                </h2>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Calendly
                </h3>
                <p>
                  Wir nutzen den Dienst Calendly für die Terminbuchung. Anbieter
                  ist Calendly LLC, 3423 Piedmont Road NE, Atlanta, GA 30305,
                  USA. Wenn Sie über Calendly einen Termin buchen, werden Ihre
                  eingegebenen Daten (Name, E-Mail, ggf. Telefonnummer) an
                  Calendly übermittelt und dort gespeichert.
                </p>
                <p className="mt-3">
                  Die Nutzung von Calendly erfolgt auf Grundlage von Art. 6 Abs.
                  1 lit. b DSGVO (Vertragserfüllung) bzw. Art. 6 Abs. 1 lit. f
                  DSGVO (berechtigtes Interesse an einer effizienten
                  Terminplanung). Weitere Informationen finden Sie in der
                  Datenschutzerklärung von Calendly.
                </p>
              </div>

              {/* Schluss */}
              <div className="border-t border-gray-800/50 pt-8">
                <p className="text-gray-500 text-sm">
                  Stand: März 2026 | Diese Datenschutzerklärung wird
                  regelmäßig aktualisiert.
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>
    </>
  );
}
