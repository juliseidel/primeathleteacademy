"use client";

import { motion } from "framer-motion";
import { cardHover } from "@/lib/animations";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "default" | "large" | "none";
  glow?: boolean;
}

export default function GlowCard({
  children,
  className = "",
  hover = true,
  padding = "default",
  glow = false,
}: GlowCardProps) {
  const paddingClasses =
    padding === "large"
      ? "p-8 sm:p-10"
      : padding === "none"
      ? ""
      : "p-6";

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-[#141414]/90 backdrop-blur-xl
        border border-white/[0.08]
        transition-all duration-500
        ${hover ? "hover:border-gold/30 hover:bg-[#1a1a1a] hover:shadow-[0_0_40px_rgba(197,165,90,0.12),0_0_80px_rgba(197,165,90,0.04)]" : ""}
        ${glow ? "shadow-[0_0_30px_rgba(197,165,90,0.1),0_0_60px_rgba(197,165,90,0.04)] border-gold/15" : ""}
        ${paddingClasses}
        ${className}
      `}
      whileHover={hover ? cardHover : undefined}
    >
      {/* Top edge gold gradient line - always visible */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      {/* Subtle inner glow at top */}
      <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-gradient-to-b from-gold/[0.03] to-transparent pointer-events-none" />

      {children}
    </motion.div>
  );
}
