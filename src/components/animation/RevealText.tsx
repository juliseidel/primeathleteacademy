"use client";

import { motion } from "framer-motion";
import { wordRevealContainer, wordReveal } from "@/lib/animations";

interface RevealTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
}

export default function RevealText({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: RevealTextProps) {
  const words = text.split(" ");

  return (
    <motion.div
      variants={wordRevealContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span variants={wordReveal} className="inline-block">
              {word}&nbsp;
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
