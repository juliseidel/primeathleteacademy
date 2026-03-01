"use client";

import { motion, type Variants } from "framer-motion";
import { fadeInUp, fadeInDown, fadeInLeft, fadeInRight, fadeIn, scaleIn } from "@/lib/animations";

const directionMap: Record<string, Variants> = {
  up: fadeInUp,
  down: fadeInDown,
  left: fadeInLeft,
  right: fadeInRight,
  none: fadeIn,
  scale: scaleIn,
};

interface FadeInViewProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none" | "scale";
  delay?: number;
  className?: string;
  once?: boolean;
}

export default function FadeInView({
  children,
  direction = "up",
  delay = 0,
  className = "",
  once = true,
}: FadeInViewProps) {
  return (
    <motion.div
      variants={directionMap[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
