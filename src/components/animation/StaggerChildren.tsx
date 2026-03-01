"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerContainerFast } from "@/lib/animations";

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  fast?: boolean;
}

export default function StaggerChildren({
  children,
  className = "",
  fast = false,
}: StaggerChildrenProps) {
  return (
    <motion.div
      variants={fast ? staggerContainerFast : staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
