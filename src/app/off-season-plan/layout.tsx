import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Off-Season Plan 2026 Elite | 4-Wochen-Programm",
  description:
    "Der 4-Wochen Off-Season Plan von Prime Athlete Academy. 67 Seiten periodisierter Athletik- und Ernährungsplan von zwei aktiven Profifußballern. Sofort als PDF — 99 €.",
  keywords: [
    "Off-Season Plan",
    "Fußball Trainingsplan",
    "Athletik PDF",
    "Off Season Fußball",
    "4 Wochen Plan",
    "Prime Athlete Academy",
    "Sommer-Trainingsplan",
    "Fußball Vorbereitung",
  ],
  openGraph: {
    title: "Off-Season Plan 2026 Elite | Prime Athlete Academy",
    description:
      "4 Wochen. 67 Seiten. Von Profis für Profis. Der Plan, der dich physisch dominant in die Saison startet — 99 €.",
    type: "website",
    url: "https://primeathleteacademy.com/off-season-plan",
  },
  alternates: {
    canonical: "https://primeathleteacademy.com/off-season-plan",
  },
};

export default function OffSeasonPlanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
