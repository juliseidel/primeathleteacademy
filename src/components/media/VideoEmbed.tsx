"use client";

import FadeInView from "@/components/animation/FadeInView";

interface VideoEmbedProps {
  type: "youtube" | "instagram";
  url: string;
  title?: string;
  aspectRatio?: "16/9" | "9/16" | "1/1";
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/
  );
  return match ? match[1] : null;
}

function getInstagramId(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);
  return match ? match[1] : null;
}

export default function VideoEmbed({
  type,
  url,
  title,
  aspectRatio = "16/9",
}: VideoEmbedProps) {
  const aspectClasses =
    aspectRatio === "9/16"
      ? "aspect-[9/16] max-w-[320px]"
      : aspectRatio === "1/1"
      ? "aspect-square"
      : "aspect-video";

  if (type === "youtube") {
    const videoId = getYouTubeId(url);
    if (!videoId) return null;

    return (
      <FadeInView direction="up">
        <div
          className={`${aspectClasses} w-full rounded-xl overflow-hidden border border-gray-800/50 hover:border-gold/20 transition-colors`}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
          />
        </div>
      </FadeInView>
    );
  }

  if (type === "instagram") {
    const reelId = getInstagramId(url);
    if (!reelId) return null;

    return (
      <FadeInView direction="up">
        <div
          className={`${aspectClasses} w-full rounded-xl overflow-hidden border border-gray-800/50 hover:border-gold/20 transition-colors`}
        >
          <iframe
            src={`https://www.instagram.com/reel/${reelId}/embed/`}
            title={title || "Instagram Reel"}
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
          />
        </div>
      </FadeInView>
    );
  }

  return null;
}
