"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buttonHover, buttonTap } from "@/lib/animations";
import { ArrowUpRight } from "lucide-react";

interface GlowButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  size?: "default" | "large";
  external?: boolean;
  showArrow?: boolean;
  className?: string;
}

export default function GlowButton({
  children,
  href,
  variant = "primary",
  size = "default",
  external = false,
  showArrow = false,
  className = "",
}: GlowButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300";

  const sizeClasses =
    size === "large" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";

  const variantClasses =
    variant === "primary"
      ? "bg-gold text-gray-950 shadow-[0_0_20px_rgba(197,165,90,0.2)] hover:bg-gold-light hover:shadow-[0_0_40px_rgba(197,165,90,0.5),0_0_100px_rgba(197,165,90,0.2)]"
      : "border border-gold/30 text-gold bg-gold/[0.04] hover:bg-gold/10 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(197,165,90,0.15)]";

  const classes = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  const content = (
    <>
      {children}
      {showArrow && <ArrowUpRight className="w-4 h-4" />}
    </>
  );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        whileHover={buttonHover}
        whileTap={buttonTap}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a className={classes} whileHover={buttonHover} whileTap={buttonTap}>
        {content}
      </motion.a>
    </Link>
  );
}
