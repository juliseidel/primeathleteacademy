/**
 * LightGlassCard — FEELY-style premium card with translucent white glass.
 *
 * BlurView light-tint + 72% white frost + subtle white border + gold-tinted shadow.
 * Direkte Recipe aus VitalDesign.js GLASS_STYLES.card (FEELY).
 */

import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { light, lightRadius, lightShadow } from '@/lib/design/light';

type Variant = 'standard' | 'light' | 'accent';

type Props = {
  variant?: Variant;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function LightGlassCard({
  variant = 'standard',
  borderRadius = lightRadius.xl,
  style,
  children,
}: Props) {
  const v = variants[variant];

  if (Platform.OS === 'android') {
    // Android fallback — no real backdrop blur, use solid frost
    return (
      <View
        style={[
          {
            backgroundColor: variant === 'accent' ? '#F5EFE2' : '#FFFFFF',
            borderRadius,
            borderWidth: 1,
            borderColor: v.border,
          },
          lightShadow.glass,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, lightShadow.glass, style]}>
      <BlurView
        intensity={60}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: v.bg,
            borderRadius,
            borderWidth: 1,
            borderColor: v.border,
          },
        ]}
      />
      {children}
    </View>
  );
}

const variants = {
  standard: {
    bg: light.glassBg,
    border: light.glassBorder,
  },
  light: {
    bg: light.glassBgLight,
    border: light.glassBorder,
  },
  accent: {
    bg: light.glassBgAccent,
    border: light.glassBorderAccent,
  },
} as const;
