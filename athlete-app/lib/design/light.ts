/**
 * PAA Light-Theme Tokens
 *
 * Direkte Adaption von FEELY's Design-System mit PAA-Gold (statt FEELY-Grün) als Akzent.
 * Verwendet 1:1 die Werte aus EchtGesund_NEU3 (HubColors.js, VitalDesign.js) — siehe Report.
 *
 * Strategie: weißer App-Background, warme Surface-Stufen, dunkler Text, Gold als Akzent,
 * Glass-Cards mit BlurView light-tint + warm-tinted Shadows.
 */

import { Platform } from 'react-native';

export const light = {
  // Backgrounds (FEELY's hierarchy: white app bg + warm cream surfaces)
  bg:               '#FFFFFF',
  bgHeader:         '#FDFBF7',
  surface:          '#F8F5F0',
  surfaceElevated:  '#F3EFE9',
  inputBg:          '#F5F2ED',

  // Text (FEELY hierarchy)
  text:             '#1A1715',  // Primary
  textSecondary:    '#5C5549',
  textTertiary:     '#8A8278',
  textMuted:        '#B5AFA6',
  textInverse:      '#FFFFFF',

  // PAA Gold accents (replacing FEELY's emerald)
  gold:             '#A88B3D',  // Primary gold
  goldLight:        '#C5A55A',
  goldBright:       '#D4B96E',
  goldBg:           'rgba(168, 139, 61, 0.10)',
  goldBgStrong:     'rgba(168, 139, 61, 0.18)',
  goldGlow:         'rgba(168, 139, 61, 0.08)',  // for shadows

  // Semantic
  success:          '#2D8B4E',
  warning:          '#D97706',
  danger:           '#C53030',
  info:             '#2563EB',

  // Borders (warm, FEELY-style)
  border:           '#EDE6DB',
  borderLight:      '#F5EDE2',
  borderGold:       'rgba(168, 139, 61, 0.22)',
  separator:        'rgba(0, 0, 0, 0.06)',

  // Glass-Recipe (FEELY-style, light tint)
  glassBg:          'rgba(255, 255, 255, 0.72)',
  glassBgLight:     'rgba(255, 255, 255, 0.35)',
  glassBgAccent:    'rgba(168, 139, 61, 0.08)',
  glassBorder:      'rgba(255, 255, 255, 0.45)',
  glassBorderAccent:'rgba(168, 139, 61, 0.18)',

  // Warm shadow color (FEELY's #C4B8A8)
  shadowWarm:       '#C4B8A8',
} as const;

// Spacing (FEELY HUB_SPACING)
export const lightSpace = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  // Section-specific
  screenPadding:    20,
  cardPadding:      16,
  sectionGap:       32,
  itemGap:          12,
} as const;

// Border-Radii (FEELY HUB_RADIUS)
export const lightRadius = {
  xs:    6,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  pill:  24,
  squircle: 22,
  round: 999,
} as const;

// Shadows (FEELY-style warm-tinted)
export const lightShadow = {
  small: {
    shadowColor: light.shadowWarm,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: light.shadowWarm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: light.shadowWarm,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
  // Premium gold-tinted shadow for glass cards (FEELY's signature)
  glass: {
    shadowColor: light.goldGlow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
  // Floating elements (FAB, modals)
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;

// Display-Serif font (for italic hero headlines, FEELY-style)
export const displaySerif = Platform.select({
  ios: 'Didot',
  android: 'serif',
  default: 'serif',
});
