"use client";

import { motion } from "framer-motion";
import { cardHover } from "@/lib/animations";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "default" | "large" | "none";
}

export default function GlowCard({
  children,
  className = "",
  hover = true,
  padding = "default",
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
        relative bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl
        transition-all duration-300
        ${hover ? "hover:border-gold/25 hover:bg-gray-900/50 hover:shadow-[0_0_30px_rgba(197,165,90,0.1)]" : ""}
        ${paddingClasses}
        ${className}
      `}
      whileHover={hover ? cardHover : undefined}
    >
      {/* Subtle gold gradient on top edge */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </motion.div>
  );
}
