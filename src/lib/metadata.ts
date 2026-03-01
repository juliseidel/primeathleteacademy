import type { Metadata } from "next";

interface PageMetaParams {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
}: PageMetaParams): Metadata {
  const url = `https://primeathleteacademy.com${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Prime Athlete Academy`,
      description,
      url,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
      type: "website",
      locale: "de_DE",
      siteName: "Prime Athlete Academy",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Prime Athlete Academy`,
      description,
    },
  };
}
