/**
 * Expo-Template-kompatibler Theme-Wrapper.
 *
 * Re-exportiert das volle PAA-Design-System aus `lib/design/tokens.ts` und
 * stellt zusätzlich die von Expo-Boilerplate-Komponenten erwarteten
 * `Colors`- und `Fonts`-Shapes bereit.
 *
 * Für neue Komponenten direkt aus `lib/design/tokens.ts` importieren —
 * das hier ist nur Compat-Schicht.
 */

import { Platform } from 'react-native';
import { color, font } from '@/lib/design/tokens';

export { tokens } from '@/lib/design/tokens';

// PAA ist Dark-Only im MVP. Light-Mode-Werte spiegeln Dark, damit Expo-Templates
// die kein Theme-Switching machen, trotzdem PAA-Farben zeigen.
const palette = {
  text: color.text,
  background: color.bg,
  tint: color.gold,
  icon: color.textMuted,
  tabIconDefault: color.textMuted,
  tabIconSelected: color.gold,
};

export const Colors = {
  light: palette,
  dark: palette,
};

export const Fonts = Platform.select({
  ios: {
    sans: font.family,
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: font.family,
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: `${font.family}, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});
