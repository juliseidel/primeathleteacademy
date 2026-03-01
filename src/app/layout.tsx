import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://primeathleteacademy.com"),
  title: {
    default: "Prime Athlete Academy | Elite Athletik-Coaching für Profifußballer",
    template: "%s | Prime Athlete Academy",
  },
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
    "Jonas Kehl",
    "Patrick Scheder",
  ],
  openGraph: {
    title: "Prime Athlete Academy | Elite Athletik-Coaching",
    description:
      "Individuelles Athletik- und Ernährungscoaching von Profifußballern für Profifußballer.",
    type: "website",
    locale: "de_DE",
    url: "https://primeathleteacademy.com",
    siteName: "Prime Athlete Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Athlete Academy",
    description: "Elite Athletik-Coaching für Profifußballer",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <ScrollProgress />
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
