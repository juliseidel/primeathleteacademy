/**
 * Cream-Card-Palette
 *
 * Helle Premium-Cards die auf dem dunklen App-Background "leuchten" wie Inseln.
 * Inspiriert von FEELY's Vital-Card-Style. Wird für alle hochwertigen Widgets verwendet
 * (Mini-Kalender, Workout-Body, Übungs-Cards) damit der dunkle Background nicht alle
 * Inhalte schluckt.
 */

export const cream = {
  // App background — warm cream
  bg:           '#EDE4CF',
  bgTop:        '#F0E8D5',
  bgBottom:     '#E5DAC0',

  // Cards — visibly lighter than the app background, almost white
  cardBg:       '#FCFAF3',
  cardBgTop:    '#FFFFFF',
  cardBgBottom: '#F7F2E5',

  text:         '#1F1A12',
  textMuted:    '#6E5F3D',
  textDim:      '#998B6E',

  gold:         '#A88B3D',
  goldAccent:   '#C5A55A',
  goldBg:       'rgba(168, 139, 61, 0.10)',
  goldBgStrong: 'rgba(168, 139, 61, 0.18)',

  border:       'rgba(168, 139, 61, 0.22)',
  borderSubtle: 'rgba(168, 139, 61, 0.12)',

  divider:      'rgba(31, 26, 18, 0.08)',
} as const;
