import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime Athlete Academy | Elite Athletik-Coaching für Profifußballer",
  description:
    "Individuelles Athletik- und Ernährungscoaching von Profifußballern für Profifußballer. Gegründet von Jonas Kehl (Ex-FC Bayern) und Patrick Scheder.",
  keywords: [
    "Athletiktraining",
    "Fußball",
    "Coaching",
    "Ernährungscoaching",
    "Profifußball",
    "Personal Training",
    "Prime Athlete Academy",
  ],
  openGraph: {
    title: "Prime Athlete Academy | Elite Athletik-Coaching",
    description:
      "Individuelles Athletik- und Ernährungscoaching von Profifußballern für Profifußballer.",
    type: "website",
    locale: "de_DE",
    url: "https://primeathleteacademy.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
