import type { Variants, Transition } from "framer-motion";

// ===== TRANSITIONS =====
export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
};

export const smoothTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const fastTransition: Transition = {
  duration: 0.3,
  ease: "easeOut",
};

// ===== FADE IN VARIANTS =====
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: smoothTransition },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: smoothTransition },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: smoothTransition },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: smoothTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: smoothTransition },
};

// ===== SCALE VARIANTS =====
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: smoothTransition },
};

export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: springTransition },
};

// ===== STAGGER CONTAINERS =====
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

// ===== TEXT REVEAL =====
export const wordRevealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ===== PAGE TRANSITION =====
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// ===== GLOW PULSE =====
export const glowPulse: Variants = {
  hidden: { boxShadow: "0 0 0px rgba(197,165,90,0)" },
  visible: {
    boxShadow: [
      "0 0 20px rgba(197,165,90,0.3)",
      "0 0 40px rgba(197,165,90,0.5)",
      "0 0 20px rgba(197,165,90,0.3)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

// ===== SLIDE IN WITH FADE =====
export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ===== HOVER ANIMATIONS =====
export const cardHover = {
  y: -4,
  transition: { duration: 0.2, ease: "easeOut" as const },
};

export const buttonTap = {
  scale: 0.97,
};

export const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.2, ease: "easeOut" as const },
};
