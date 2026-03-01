import { generatePageMetadata } from "@/lib/metadata";
import PageHero from "@/components/layout/PageHero";
import FadeInView from "@/components/animation/FadeInView";
import { contact } from "@/lib/constants";

export const metadata = generatePageMetadata({
  title: "Impressum",
  description:
    "Impressum der Prime Athlete Academy – Angaben gemäß § 5 TMG.",
  path: "/impressum",
});

export default function ImpressumPage() {
  return (
    <>
      <PageHero tag="Rechtliches" title="Impressum" />

      <section className="relative py-24">
        <div className="max-w-3xl mx-auto px-6">
          <FadeInView>
            <div className="prose prose-invert prose-gold max-w-none space-y-10 text-gray-400">
              {/* Angaben gemäß § 5 TMG */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Angaben gemäß § 5 TMG
                </h2>
                <p>
                  Prime Athlete Academy
                  <br />
                  Jonas Kehl & Patrick Scheder GbR
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
                <p>Jonas Kehl & Patrick Scheder</p>
              </div>

              {/* Umsatzsteuer-ID */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Umsatzsteuer-ID
                </h2>
                <p>
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a
                  Umsatzsteuergesetz:
                  <br />
                  [wird nachgetragen]
                </p>
              </div>

              {/* Verantwortlich für den Inhalt */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                </h2>
                <p>
                  Jonas Kehl & Patrick Scheder
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

              {/* Haftung für Inhalte */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Haftung für Inhalte
                </h2>
                <p>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                  Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                  Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                  gespeicherte fremde Informationen zu überwachen oder nach
                  Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                  hinweisen.
                </p>
                <p className="mt-3">
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                  Informationen nach den allgemeinen Gesetzen bleiben hiervon
                  unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
                  Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                  möglich. Bei Bekanntwerden von entsprechenden
                  Rechtsverletzungen werden wir diese Inhalte umgehend
                  entfernen.
                </p>
              </div>

              {/* Haftung für Links */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Haftung für Links
                </h2>
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf
                  deren Inhalte wir keinen Einfluss haben. Deshalb können wir
                  für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                  Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                  oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                  wurden zum Zeitpunkt der Verlinkung auf mögliche
                  Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
                  Zeitpunkt der Verlinkung nicht erkennbar.
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
                  Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
                  der schriftlichen Zustimmung des jeweiligen Autors bzw.
                  Erstellers. Downloads und Kopien dieser Seite sind nur für den
                  privaten, nicht kommerziellen Gebrauch gestattet.
                </p>
                <p className="mt-3">
                  Soweit die Inhalte auf dieser Seite nicht vom Betreiber
                  erstellt wurden, werden die Urheberrechte Dritter beachtet.
                  Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
                  Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
                  werden, bitten wir um einen entsprechenden Hinweis. Bei
                  Bekanntwerden von Rechtsverletzungen werden wir derartige
                  Inhalte umgehend entfernen.
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>
    </>
  );
}
