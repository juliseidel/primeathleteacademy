"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface SectionHeaderProps {
  tag: string;
  title: string;
  titleMuted?: string;
  description?: string;
  align?: "center" | "left";
}

export default function SectionHeader({
  tag,
  title,
  titleMuted,
  description,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">
        {tag}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">
        {title}
        {titleMuted && (
          <>
            <br />
            <span className="text-gray-500">{titleMuted}</span>
          </>
        )}
      </h2>
      {description && (
        <p
          className={`text-gray-400 text-lg leading-relaxed ${
            align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
