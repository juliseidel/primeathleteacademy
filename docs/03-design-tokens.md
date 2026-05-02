# PAA — Design Tokens (Phase 2b Foundation)

> **Status:** Entwurf zur Freigabe.
> **Stand:** 2026-05-02
> **Strategie:** Brand-Identität aus Landing-Page (Farben, Typografie, Patterns) + Glasmorphism-Technik aus FEELY (Pearl-Look, Blur, Animations) — kombiniert zu einem dunkel-sportlich-edlen Premium-Look mit Gold-Akzent.
> **Nächster Schritt:** Phase 2b — Hi-Fi Onboarding-Mockups auf Basis dieser Tokens.

---

## 1. Brand Foundations

Die PAA-App-Identität kommt aus der Live-Landing-Page (`src/`). Diese Tokens sind die Single Source of Truth — sie werden in der Athleten-App, im Coach-Web und in jedem zukünftigen PAA-Touchpoint verwendet.

### 1.1 Color Tokens

```ts
// PRIMARY — die Säulen der Marke
const color = {
  // Backgrounds (dunkel, sportlich)
  bg:            '#0A0A0A',  // Page-Background, fast schwarz
  surface:       '#1A1A1A',  // Card / Container Standard
  surfaceLight:  '#252525',  // Card mit Akzent / Hover-State
  surfaceDeep:   '#050505',  // Hero / besonders tiefer Hintergrund

  // Foreground (Text)
  text:          '#F5F5F5',  // Standard-Text Off-White
  textMuted:     '#888888',  // Sekundär-Text, Captions
  textDim:       '#5A5A5A',  // Dezent (Disabled, Hints)

  // BRAND — Gold
  gold:          '#C5A55A',  // Primary Gold — CTAs, Active States, Accent
  goldDark:      '#A88B3D',  // Hover, Pressed
  goldLight:     '#D4B96E',  // Highlights, Glow-Mid

  // Gold-Alphas (für Glows, Borders, Tints)
  goldAlpha:     'rgba(197, 165, 90, ALPHA)',
  // Konkrete Stops:
  // 0.04 → ultra-subtiler Tint
  // 0.10 → leichter Glow
  // 0.20 → sichtbarer Border / Glow
  // 0.30 → Active Border
  // 0.50 → Hover Glow

  // Semantik (sparsam einsetzen)
  success:       '#3EB590',  // Grün (z.B. Training abgehakt)
  warning:       '#E6A23C',  // Bernstein (z.B. Spieltag-Reminder)
  danger:        '#E55A4C',  // Rot (z.B. Account-Löschen-Confirm)
};
```

**Code-Quelle:** `src/app/globals.css` Zeilen 3–13 (Tailwind v4 `@theme inline`)

### 1.2 Typography

Die Landing-Page verwendet **eine einzige Font-Familie: Inter**. Kein Serif, kein Editorial-Bruch — die Premium-Wirkung entsteht durch **Letter-Spacing + Weights + Color-Hierarchie**, nicht durch Schrift-Mix. Das übernehmen wir 1:1.

```ts
const font = {
  family:        'Inter',          // Google Fonts, lokal via expo-font
  fallback:      'System',         // iOS: SF Pro / Android: Roboto

  weight: {
    medium:      '500',
    semibold:    '600',
    bold:        '700',
    black:       '900',            // für Display-Headlines
  },

  size: {
    xs:          12,
    sm:          14,
    base:        16,
    lg:          18,
    xl:          20,
    '2xl':       24,
    '3xl':       30,
    '4xl':       36,
    '5xl':       48,
    '6xl':       60,
    '7xl':       72,
  },

  lineHeight: {
    tight:       1.1,              // Display Headlines
    normal:      1.4,
    relaxed:     1.6,              // Body
  },

  letterSpacing: {
    tight:       -0.4,             // Display
    normal:       0,
    wide:         0.4,
    wider:        1.2,
    widest:       2.4,             // Tags / Labels (entspricht tracking-[0.15em])
    hero:         3.2,             // Premium-Tags (entspricht tracking-[0.2em])
  },
};
```

**Premium-Pattern aus Landing-Page:** Tags mit `letterSpacing: hero` + `text-gold` + `font-medium` (Beispiel: "ATHLETIK & ERNÄHRUNG" oben in Sektionen). Das ist ein wiederkehrendes Marken-Element.

### 1.3 Spacing-Scale

4px-Base-Unit, Standard Tailwind-Scale. Kein Custom-Spacing nötig.

```ts
const space = {
  1:  4,    2:  8,    3:  12,   4:  16,   5:  20,
  6:  24,   8:  32,   10: 40,   12: 48,   16: 64,
  20: 80,   24: 96,   32: 128,  40: 160,  48: 192,
};
```

**Sektion-Standard** (aus Landing-Page abgeleitet): vertikales Padding `space.24` (96 px) auf großen Screens, `space.16` (64 px) auf Mobile.

### 1.4 Border-Radii

```ts
const radius = {
  sm:    8,    // kleine Badges, Pills
  md:   12,    // Inputs, Buttons, Icon-Boxen
  lg:   16,    // Cards (Standard von GlowCard)
  xl:   24,    // Premium-Cards, Sheet-Edges
  '2xl': 32,   // Glass-Cards (FEELY-Inspiration)
  pill: 9999,  // Circles, Status-Pills
};
```

---

## 2. Glasmorphism Recipe — der Kern (von FEELY adaptiert)

FEELY's Glass-Card ist Light-Mode (weißes Frost). Für PAA adaptieren wir das auf **Dark-Mode** mit Gold-Akzent-Tinten. Die Technik bleibt identisch, die Farben drehen sich.

### 2.1 Standard Glass Card (Dark-Pearl)

```ts
const glass = {
  // Layer 1: Backdrop-Blur
  blurIntensity:   40,                        // expo-blur, Skala 0-100
  blurTint:        'systemMaterialDark',      // iOS native dark frost (statt Light bei FEELY)

  // Layer 2: Frost-Overlay
  background:      'rgba(20, 20, 20, 0.55)',  // Dark-Frost (statt rgba(255,255,255,0.55) bei FEELY)

  // Layer 3: Border (Gold-Tint statt White)
  borderWidth:     1,
  borderColor:     'rgba(197, 165, 90, 0.20)',// Gold-Border, sehr subtil

  // Layer 4: Inner-Tint (optional, für besondere Cards)
  innerTint:       'rgba(197, 165, 90, 0.04)',// ultra-subtiler Gold-Wash

  // Geometrie
  borderRadius:    24,                         // radius.xl (FEELY nutzt 40, wir gehen kompakter)

  // Android-Fallback (kein echter Backdrop-Blur)
  androidBackground: 'rgba(26, 26, 26, 0.92)', // opaquerer Dark-Surface
  androidElevation:  4,
};
```

**Drei Glass-Variants** (für unterschiedliche Hierarchie-Levels):

| Variant | Hintergrund | Border | Verwendung |
|---------|-------------|--------|------------|
| **Glass Subtle** | `rgba(20,20,20,0.40)` | `rgba(197,165,90,0.10)` | Sekundäre Cards, Listen-Items |
| **Glass Standard** | `rgba(20,20,20,0.55)` | `rgba(197,165,90,0.20)` | Standard-Cards (Daily Briefing, Mahlzeit-Cards) |
| **Glass Premium** | `rgba(20,20,20,0.65)` + Gloss | `rgba(197,165,90,0.30)` | Hero-Cards, Onboarding-Welcome |

### 2.2 Pearl Highlight (Gloss-Overlay für Premium-Glass)

Aus FEELY's Center-Button-Recipe. Macht den "satinierten Pearl"-Eindruck.

```ts
const pearlGloss = {
  // Top-Highlight (oben heller Schein)
  gradientColors: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)'],
  gradientHeight: '50%',                       // nur obere Hälfte
  gradientStart:  { x: 0.5, y: 0 },
  gradientEnd:    { x: 0.5, y: 1 },
};
```

**Anwendung:** als absoluter Overlay-Layer auf Premium-Glass-Cards drauflegen. Erzeugt den Eindruck von einfallendem Licht von oben.

---

## 3. Shadows & Glows

### 3.1 Elevation-Schatten (4 Stufen, neutrale Tiefe)

```ts
const shadow = {
  sm: {  // Card subtle
    offset: { width: 0, height: 2 },
    opacity: 0.10,
    radius: 6,
    color: '#000000',
    elevation: 2,                 // Android
  },
  md: {  // Card standard
    offset: { width: 0, height: 4 },
    opacity: 0.20,
    radius: 12,
    color: '#000000',
    elevation: 4,
  },
  lg: {  // Floating elements (FAB, Bottom-Sheets)
    offset: { width: 0, height: 8 },
    opacity: 0.30,
    radius: 20,
    color: '#000000',
    elevation: 8,
  },
  xl: {  // Center-Button, Modals
    offset: { width: 0, height: 12 },
    opacity: 0.40,
    radius: 28,
    color: '#000000',
    elevation: 12,
  },
};
```

### 3.2 Gold-Glows (die Marken-Signature)

Aus Landing-Page übernommen. Nur sparsam einsetzen — auf CTAs, Active-States, Premium-Akzente.

```ts
const glow = {
  goldSoft: {  // GlowButton primary default
    shadowColor: '#C5A55A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 20,
  },
  goldStrong: {  // GlowButton primary hover/pressed
    shadowColor: '#C5A55A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.50,
    shadowRadius: 40,
    // + zweite Layer:
    secondShadow: {
      shadowOpacity: 0.20,
      shadowRadius: 100,
    },
  },
  goldHalo: {  // Hero-Elemente, Center-Button
    // Doppel-Layer-Glow als View-Stack
    inner: { shadowOpacity: 0.30, shadowRadius: 30 },
    outer: { shadowOpacity: 0.10, shadowRadius: 80 },
  },
};
```

**Ambient Glow Orbs** (Hintergrund-Beleuchtung für Hero-Sektionen, aus Landing-Page):

```ts
const ambientOrb = {
  size:        300,                    // bis 900 px je nach Sektion
  background:  'rgba(197,165,90,0.07)',// Gold mit ~7% Opacity
  blur:        100,                    // bis 200 (CSS blur-px Äquivalent)
  position:    'absolute',
  // Tip: 3-4 Orbs pro Hero-Screen, an Eckpunkten verteilt
};
```

**Mobile-Implementation:** statt CSS-blur (gibt's auf RN nicht) → expo-linear-gradient mit RadialGradient-Approximation oder pre-rendered PNG-Asset mit Soft-Edges.

---

## 4. Animation Tokens

### 4.1 Spring-Presets (aus FEELY HubTabBar)

```ts
const spring = {
  // Press-Feedback (Buttons, Tabs)
  press: { tension: 250, friction: 10 },

  // Standard-Entry (Cards, Modals)
  entry: { tension: 100, friction: 15 },

  // Bouncy (Center-Button-Pop, Bottom-Sheets)
  bouncy: { tension: 120, friction: 7 },

  // Smooth (große Layout-Bewegungen)
  smooth: { tension: 50, friction: 10 },
};
```

### 4.2 Timing-Presets (Easings + Durations)

```ts
const timing = {
  // Aus Landing-Page (framer-motion smoothTransition)
  smoothCubicBezier: [0.25, 0.46, 0.45, 0.94] as const,  // edler Ease-Out

  duration: {
    instant: 100,    // Tap-Feedback, Color-Flash
    fast:    200,    // Tab-Crossfade, Sub-Mode-Switch
    normal:  300,    // Standard-Transitions
    slow:    600,    // Hero-Animationen, Reveal-Effects
    splash:  800,    // Welcome-Splash-Overlay
    pulse:  2000,    // Breathing-Pulse (Center-Button)
  },
};
```

### 4.3 Stagger-Tokens

```ts
const stagger = {
  fast:    60,    // Listen mit vielen Items
  normal: 120,    // Standard-Stagger (Cards, Tabs)
  slow:   200,    // Hero-Reveal
};
```

### 4.4 Haptics-Pattern (aus FEELY)

```ts
import * as Haptics from 'expo-haptics';

const haptic = {
  tab:    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  cta:    () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};
```

---

## 5. Center-Button Pearl Recipe (Athleten-App Home-Tab)

Der wichtigste Brand-Moment der App. 6-Layer-Stack, von hinten nach vorn:

```ts
// LAYER 1 — Affordance Ring (äußerster Pulse)
{
  position: 'absolute',
  border: '2px solid #C5A55A',          // Gold statt FEELY-Smaragd
  borderRadius: pill,
  size: 62,
  animation: {
    scale:   [1, 1.45],     // pulst nach außen
    opacity: [0.5, 0],      // fadet aus
    duration: 1800,
    easing:  'easeOut',
    loop:    true,
  },
}

// LAYER 2 — Glow Ring (sanftes inneres Pulsing)
{
  position: 'absolute',
  background: 'rgba(197,165,90,0.27)',  // goldAlpha mit ~27% (entspricht #C5A55A45)
  borderRadius: pill,
  size: 62,
  animation: {
    opacity: [0.25, 0.50],
    duration: 2000,
    loop: true,
  },
}

// LAYER 3 — Emerald Ring → wird zu Gold Ring
{
  border: '1.5px solid #C5A55A',
  borderRadius: pill,
  size: 62,
  shadow: {
    color: '#A88B3D',                   // dunkleres Gold für Glow-Tint
    offset: { width: 0, height: 0 },
    opacity: 0.9,
    radius: 6,
  },
}

// LAYER 4 — Pearl-Black-Inner-Button (Hauptfläche)
{
  background: LinearGradient([
    '#1A1A1A',                          // surface (FEELY: #0F1612)
    '#0A0A0A',                          // bg (FEELY: #0B0F0D)
    '#050505',                          // surfaceDeep (FEELY: #070A08)
  ]),
  gradientDirection: { x: 0.3, y: 0, x2: 0.7, y2: 1 },
  borderRadius: pill,
  size: 58,
  border: '2px solid #FFFFFF',          // ganz dünner weißer Rand
  shadow: shadow.xl,
}

// LAYER 5 — Inner Gold Glow (warm leuchtender Innenkern)
{
  position: 'absolute',
  top: -10, left: -10,
  size: '80%',
  background: 'rgba(197,165,90,0.22)',  // goldAlpha 22%
  borderRadius: pill,
  // simulierter Blur via opacity-fade (RN hat keine echten inner blurs)
}

// LAYER 6 — Top Gloss (Pearl-Highlight)
{
  position: 'absolute',
  top: 0, left: 0, right: 0,
  height: '50%',                         // nur obere Hälfte
  background: LinearGradient([
    'rgba(255,255,255,0.15)',
    'rgba(255,255,255,0)',
  ]),
}

// VORDERGRUND — Icon
{
  // Haus-SVG, weiß, ~24px, zentriert
}
```

**Press-Animation:**
```ts
sequence([
  timing({ value: 0.90, duration: 80 }),      // schnell runter
  spring({ value: 1, tension: 250, friction: 10 }),  // bouncy zurück
])
```

---

## 6. Brand Patterns (Marken-Signature-Elemente)

Diese drei Patterns aus der Landing-Page machen PAA wiedererkennbar. Sparsam einsetzen — nicht jeder Screen braucht alle.

### 6.1 Football Field Lines

- SVG-Overlay mit Fußballfeld-Markierungen (Mittellinie, Mittelkreis, Strafräume)
- Stroke-Color: `rgba(197, 165, 90, 0.04)` — extrem subtil
- Verwendung: Hero-Sektionen, Onboarding-Welcome, Profil-Background
- **Code-Quelle:** `src/components/effects/FootballFieldLines.tsx`

### 6.2 Speed Lines

- 3-5 diagonale Linien, Rotation `-15deg`
- Gradient: `transparent → rgba(197,165,90,0.30) → transparent`
- Animation: stagger fade-in mit `delay: i * 1500ms`
- Verwendung: Training-Screens, Spieltag-Reminder, "Du legst gerade los"-Momente
- **Code-Quelle:** `src/components/effects/SpeedLines.tsx`

### 6.3 Gold Glow Orbs

- Große, diffuse Gold-Kreise als Hintergrund-Beleuchtung
- 3-4 Orbs pro Screen, an Ecken verteilt
- Sizes: 300px / 500px / 700px / 900px
- Opacities: 0.04 / 0.07 / 0.10
- Verwendung: nahezu jeder Hauptscreen — sorgen für die warme Tiefe
- **Code-Quelle:** `src/components/effects/GoldGlow.tsx`

---

## 7. Token-Implementation (Vorschlag)

### 7.1 Athleten-App (React Native + Expo)

Ein zentrales `tokens.ts` File:

```
athlete-app/
└── lib/
    └── design/
        ├── tokens.ts          ← alle Konstanten oben
        ├── glass.ts           ← GlassCard-Komponente (Wrapper um expo-blur)
        ├── animations.ts      ← Spring/Timing-Presets als Reanimated-Configs
        └── patterns/
            ├── FieldLines.tsx
            ├── SpeedLines.tsx
            └── GoldGlowOrb.tsx
```

**NativeWind (Tailwind for RN) optional:** wenn wir das wollen, können wir die Tokens auch in einer `tailwind.config.js` exportieren — dann lassen sich Coach-Web (Tailwind v4) und Athleten-App von der gleichen Quelle nähren.

### 7.2 Coach-Web (Next.js + Tailwind v4)

Existierende Token-Definition in `coach-dashboard/src/app/globals.css` als `@theme inline` — identische Hex-Werte wie hier. Token-Sync wird manuell beim Build sichergestellt.

---

## 8. Adaptions-Plan FEELY → PAA (konkrete Hex-Mappings)

| FEELY-Wert | PAA-Wert | Begründung |
|------------|----------|------------|
| `#0B0F0D` (Pearl Black) | `#0A0A0A` (PAA bg) | Gleiche Tiefe, neutraler |
| `#0F1612` (Pearl Mid) | `#1A1A1A` (PAA surface) | Hellere Mid-Stufe für besseren Kontrast |
| `#070A08` (Pearl Deep) | `#050505` (PAA surfaceDeep) | Tiefer Schwarz für Hero |
| `#3EB590` (Smaragd) | `#C5A55A` (PAA gold) | Komplette Marken-Adaption |
| `#0B6B4F` (Smaragd Deep) | `#A88B3D` (PAA goldDark) | Gold-Glow-Tint |
| `#3EB59045` (Glow Alpha) | `rgba(197,165,90,0.27)` (Gold Alpha) | Selber Alpha-Wert, Gold-RGB |
| `rgba(255,255,255,0.55)` (Light-Frost) | `rgba(20,20,20,0.55)` (Dark-Frost) | Mode-Inversion |
| `rgba(255,255,255,0.30)` (White-Border) | `rgba(197,165,90,0.20)` (Gold-Border) | Gold-statt-White-Border |
| Border-Radius 40 (FEELY GlassCard) | 24 (PAA Glass) | Kompakter, moderner |

**Was 1:1 bleibt:** Spring-Configs, Blur-Intensity (40), Gloss-Layer-Recipe, Animation-Sequences, Haptics-Pattern.

---

## 9. Was NICHT von der Landing-Page übernommen wird

- **Cursor-Following Glow** — Mobile hat keinen Cursor, irrelevant
- **Scroll-Progress-Bar** — Mobile-Apps haben kein Equivalent (nur in langen Reading-Views vielleicht)
- **Hover-States** — Mobile hat Press-States stattdessen
- **Ticker-Animation** (laufende Marquee) — passt nicht zur App-UX

---

## 10. Offene Punkte für Mockups

1. **Inter-Subset-Größe** — laden wir alle Weights (500/600/700/900) oder nur 500+700? (Bundle-Size)
2. **Icon-Library** — Lucide-React-Native, custom SVGs, oder Mix? Empfehlung: Lucide für Standard, Custom-SVG für Tab-Bar-Icons (Hantel, Teller, Haus, Chat-Bubble, Person)
3. **Status-Bar-Tönung** — light-content (weiße Icons) auf dunklem Background — auf jeden Fall
4. **Splash-Screen** — Welche Animation, welcher Übergang in den Onboarding-Flow?
5. **Empty-States-Ton** — wie spricht die App, wenn nichts da ist? ("Dein Coach erstellt gerade deinen Plan" vs. "Noch keine Daten")
6. **Dark-Mode-only oder auch Light-Mode** — meine Empfehlung: dark-only im MVP, das passt zu Brand und reduziert Komplexität
