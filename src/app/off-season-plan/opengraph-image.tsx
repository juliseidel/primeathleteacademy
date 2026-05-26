import { ImageResponse } from "next/og";

export const alt = "Off-Season Plan 2026 — Prime Athlete Academy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Social-Sharing-Vorschaubild für /off-season-plan (WhatsApp, Instagram,
// X, LinkedIn etc.). Brand: Gold #C5A55A auf dunklem Grund.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at center, #1a1a1a 0%, #0A0A0A 70%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Gold glow top */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: 300,
            width: 600,
            height: 600,
            background: "rgba(197,165,90,0.18)",
            filter: "blur(120px)",
            borderRadius: 9999,
            display: "flex",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 22px",
            border: "1px solid rgba(197,165,90,0.4)",
            borderRadius: 9999,
            color: "#C5A55A",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 34,
          }}
        >
          Limitiert · Sommer 2026
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          <div style={{ display: "flex", fontSize: 118, fontWeight: 900, color: "#C5A55A" }}>
            OFF-SEASON
          </div>
          <div style={{ display: "flex", fontSize: 118, fontWeight: 900, color: "#F5F5F5", marginTop: 4 }}>
            PLAN 2026
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "rgba(197,165,90,0.85)",
            marginTop: 28,
          }}
        >
          Elite Edition
        </div>

        {/* Bottom row: brand + price */}
        <div
          style={{
            position: "absolute",
            bottom: 54,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 70px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(245,245,245,0.55)",
              fontWeight: 700,
            }}
          >
            Prime Athlete Academy
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <div style={{ display: "flex", fontSize: 64, fontWeight: 900, color: "#C5A55A" }}>
              99
            </div>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 900, color: "#C5A55A" }}>
              €
            </div>
          </div>
        </div>

        {/* Top gold accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, transparent, #C5A55A, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
