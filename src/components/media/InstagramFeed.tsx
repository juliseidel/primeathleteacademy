"use client";

import { useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowButton from "@/components/ui/GlowButton";
import { contact } from "@/lib/constants";
import { Instagram } from "lucide-react";

interface InstagramFeedProps {
  postUrls: string[];
  showHeader?: boolean;
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export default function InstagramFeed({
  postUrls,
  showHeader = true,
}: InstagramFeedProps) {
  useEffect(() => {
    // Load Instagram embed script
    if (typeof window !== "undefined" && !window.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => window.instgrm?.Embeds?.process();
    } else {
      window.instgrm?.Embeds?.process();
    }
  }, [postUrls]);

  // Filter out example URLs
  const validUrls = postUrls.filter((url) => !url.includes("EXAMPLE"));

  if (validUrls.length === 0) {
    // Placeholder when no real URLs configured
    return (
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6">
          {showHeader && (
            <SectionHeader
              tag="Social Media"
              title="Folge uns auf Instagram"
              description="Tägliche Einblicke in unser Training, Tipps und Motivation."
            />
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-900/50 border border-gray-800/50 rounded-lg flex items-center justify-center group hover:border-gold/20 transition-colors"
              >
                <Instagram className="w-8 h-8 text-gray-700 group-hover:text-gold/50 transition-colors" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <GlowButton
              href={contact.instagramUrl}
              variant="secondary"
              external
              showArrow
            >
              {contact.instagramHandle}
            </GlowButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {showHeader && (
          <SectionHeader
            tag="Social Media"
            title="Folge uns auf Instagram"
            description="Tägliche Einblicke in unser Training, Tipps und Motivation."
          />
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {validUrls.map((url) => (
            <div key={url} className="rounded-xl overflow-hidden">
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink={url}
                style={{
                  background: "#0a0a0a",
                  border: 0,
                  borderRadius: "12px",
                  margin: 0,
                  maxWidth: "100%",
                  width: "100%",
                }}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <GlowButton
            href={contact.instagramUrl}
            variant="secondary"
            external
            showArrow
          >
            {contact.instagramHandle}
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
