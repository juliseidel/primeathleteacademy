/**
 * Prime Athlete Academy — Design Tokens
 *
 * Single Source of Truth für alle Farben, Typografie, Spacing, Animations
 * und Glasmorphism-Recipes. Spec-Quelle: docs/03-design-tokens.md
 *
 * Brand: aus Landing-Page (src/app/globals.css)
 * Glasmorphism-Technik: aus FEELY (EchtGesund_NEU3) adaptiert auf Dark + Gold
 */

import { Platform } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────────────────────────────────────

export const color = {
  // Backgrounds
  bg:           '#0A0A0A',
  surface:      '#1A1A1A',
  surfaceLight: '#252525',
  surfaceDeep:  '#050505',

  // Text
  text:         '#F5F5F5',
  textMuted:    '#888888',
  textDim:      '#5A5A5A',

  // Brand Gold
  gold:         '#C5A55A',
  goldDark:     '#A88B3D',
  goldLight:    '#D4B96E',

  // Semantik (sparsam einsetzen)
  success:      '#3EB590',
  warning:      '#E6A23C',
  danger:       '#E55A4C',

  // Makro-Farben (FEELY 1:1 — Eiweiß grün / Kohlenhydrate amber / Fett violett)
  macroProtein:     '#10B981',
  macroProteinDark: '#059669',
  macroProteinA15:  'rgba(16, 185, 129, 0.15)',
  macroProteinA08:  'rgba(16, 185, 129, 0.08)',

  macroCarbs:       '#F59E0B',
  macroCarbsDark:   '#D97706',
  macroCarbsA15:    'rgba(245, 158, 11, 0.15)',
  macroCarbsA08:    'rgba(245, 158, 11, 0.08)',

  macroFat:         '#8B5CF6',
  macroFatDark:     '#7C3AED',
  macroFatA15:      'rgba(139, 92, 246, 0.15)',
  macroFatA08:      'rgba(139, 92, 246, 0.08)',

  // Static rgba helpers (häufig genutzte Stops)
  goldA04:      'rgba(197, 165, 90, 0.04)',
  goldA10:      'rgba(197, 165, 90, 0.10)',
  goldA20:      'rgba(197, 165, 90, 0.20)',
  goldA27:      'rgba(197, 165, 90, 0.27)',
  goldA30:      'rgba(197, 165, 90, 0.30)',
  goldA50:      'rgba(197, 165, 90, 0.50)',

  white:        '#FFFFFF',
  whiteA08:     'rgba(255, 255, 255, 0.08)',
  whiteA15:     'rgba(255, 255, 255, 0.15)',
  whiteA30:     'rgba(255, 255, 255, 0.30)',

  black:        '#000000',
  blackA40:     'rgba(20, 20, 20, 0.40)',
  blackA55:     'rgba(20, 20, 20, 0.55)',
  blackA65:     'rgba(20, 20, 20, 0.65)',
} as const;

// Alpha-Helper für dynamische Gold-Werte
export const goldAlpha = (alpha: number): string =>
  `rgba(197, 165, 90, ${alpha})`;

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────

export const font = {
  family: 'Inter',
  fallback: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'sans-serif',
  }),

  weight: {
    medium:   '500',
    semibold: '600',
    bold:     '700',
    black:    '900',
  },

  size: {
    xs:    12,
    sm:    14,
    base:  16,
    lg:    18,
    xl:    20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
  },

  lineHeight: {
    tight:   1.1,
    normal:  1.4,
    relaxed: 1.6,
  },

  letterSpacing: {
    tight:   -0.4,
    normal:   0,
    wide:     0.4,
    wider:    1.2,
    widest:   2.4,  // tracking-[0.15em] Equivalent
    hero:     3.2,  // tracking-[0.2em] — Premium-Tags
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SPACING & RADII
// ─────────────────────────────────────────────────────────────────────────────

export const space = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
} as const;

export const radius = {
  sm:    8,
  md:   12,
  lg:   16,
  xl:   24,
  '2xl': 32,
  pill: 9999,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// GLASMORPHISM (3 Hierarchie-Stufen)
// ─────────────────────────────────────────────────────────────────────────────

export const glass = {
  blurIntensity: 40,
  blurTintIOS: 'systemMaterialDark' as const,

  variant: {
    subtle: {
      background: 'rgba(20, 20, 20, 0.40)',
      border:     'rgba(197, 165, 90, 0.10)',
      borderWidth: 1,
      borderRadius: radius.xl,
    },
    standard: {
      background: 'rgba(20, 20, 20, 0.55)',
      border:     'rgba(197, 165, 90, 0.20)',
      borderWidth: 1,
      borderRadius: radius.xl,
    },
    premium: {
      background: 'rgba(20, 20, 20, 0.65)',
      border:     'rgba(197, 165, 90, 0.30)',
      borderWidth: 1,
      borderRadius: radius.xl,
      // + pearlGloss-Overlay als zweite View-Schicht
    },
  },

  // Android-Fallback (kein echter Backdrop-Blur)
  androidFallback: {
    background: 'rgba(26, 26, 26, 0.92)',
    elevation: 4,
  },

  // Pearl-Highlight-Gloss (für Premium-Cards als absolute Overlay-Schicht)
  pearlGloss: {
    colors: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)'] as const,
    locations: [0, 1] as const,
    start: { x: 0.5, y: 0 },
    end:   { x: 0.5, y: 1 },
    heightRatio: 0.5,  // nur obere Hälfte
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS & GLOWS
// ─────────────────────────────────────────────────────────────────────────────

export const shadow = {
  sm: {
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: color.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.40,
    shadowRadius: 28,
    elevation: 12,
  },
} as const;

export const glow = {
  goldSoft: {
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
  },
  goldStrong: {
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.50,
    shadowRadius: 40,
  },
  goldHaloInner: {
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30,
    shadowRadius: 30,
  },
  goldHaloOuter: {
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 80,
  },
} as const;

// Ambient-Orb-Spec (Background-Beleuchtung — als prerendered Asset oder gradient view)
export const ambientOrb = {
  background: 'rgba(197, 165, 90, 0.07)',
  blur: 100,                  // CSS-Pixel Equivalent für Vergleich; auf RN als alpha-fade-asset
  // Suggested sizes:
  size: { sm: 300, md: 500, lg: 700, xl: 900 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const spring = {
  press:  { tension: 250, friction: 10 },  // Tap-Feedback
  entry:  { tension: 100, friction: 15 },  // Card / Modal Entry
  bouncy: { tension: 120, friction:  7 },  // Center-Pop, Bottom-Sheets
  smooth: { tension:  50, friction: 10 },  // Layout-Bewegungen
} as const;

export const timing = {
  smoothCubicBezier: [0.25, 0.46, 0.45, 0.94] as const,

  duration: {
    instant: 100,
    fast:    200,
    normal:  300,
    slow:    600,
    splash:  800,
    pulse:  2000,
  },
} as const;

export const stagger = {
  fast:    60,
  normal: 120,
  slow:   200,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CENTER-BUTTON (Pearl-Recipe für AthleteTabBar Home-Button)
// ─────────────────────────────────────────────────────────────────────────────

export const centerButton = {
  size: 62,

  // Layer 1 — Affordance Ring (äußerster Pulse)
  affordanceRing: {
    borderColor: color.gold,
    borderWidth: 2,
    animation: {
      scale: [1, 1.45] as const,
      opacity: [0.5, 0] as const,
      duration: 1800,
      loop: true,
    },
  },

  // Layer 2 — Glow Ring (sanftes inneres Pulsing)
  glowRing: {
    background: color.goldA27,
    animation: {
      opacity: [0.25, 0.50] as const,
      duration: 2000,
      loop: true,
    },
  },

  // Layer 3 — Gold Border Ring (fest)
  goldBorder: {
    borderColor: color.gold,
    borderWidth: 1.5,
    shadowColor: color.goldDark,
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },

  // Layer 4 — Pearl-Black Inner Button
  pearlInner: {
    gradientColors: [color.surface, color.bg, color.surfaceDeep] as const,
    gradientStart: { x: 0.3, y: 0 },
    gradientEnd:   { x: 0.7, y: 1 },
    borderColor: color.white,
    borderWidth: 2,
    size: 58,
  },

  // Layer 5 — Inner Gold Glow (warm leuchtender Innenkern)
  innerGlow: {
    background: color.goldA27,  // ~22% — hier 27% als nächst-passender constant
    sizeRatio: 0.8,
  },

  // Layer 6 — Top Gloss
  topGloss: glass.pearlGloss,

  // Press-Animation
  pressSequence: {
    down:   { value: 0.90, duration: 80 },
    bounce: spring.press,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const tokens = {
  color,
  font,
  space,
  radius,
  glass,
  shadow,
  glow,
  ambientOrb,
  spring,
  timing,
  stagger,
  centerButton,
} as const;

export default tokens;
