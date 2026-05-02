/**
 * DarkGlassCard — premium dark glass card on dark backgrounds.
 *
 * Echter BlurView mit dark tint + warm-tinted overlay + subtile Gold-Border + soft shadow.
 * Wird auf der dunklen App benutzt für Kalender, Coach-Notes, Übungs-Liste etc.
 */

import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { color, radius } from '@/lib/design/tokens';

type Variant = 'standard' | 'subtle' | 'premium';

type Props = {
  variant?: Variant;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function DarkGlassCard({
  variant = 'standard',
  borderRadius = radius.xl,
  style,
  children,
}: Props) {
  const v = variants[variant];

  if (Platform.OS === 'android') {
    // Android fallback — no real backdrop blur, use opaquer dark surface
    return (
      <View
        style={[
          {
            borderRadius,
            backgroundColor: 'rgba(28, 24, 18, 0.94)',
            borderWidth: 1,
            borderColor: v.border,
          },
          shadowStyle,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, shadowStyle, style]}>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
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
      {/* Subtle inner top highlight — mimics light catching the glass edge */}
      {variant === 'premium' ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255,255,255,0.06)',
            },
          ]}
        />
      ) : null}
      {children}
    </View>
  );
}

const variants = {
  subtle: {
    bg: 'rgba(20, 18, 14, 0.40)',
    border: 'rgba(197, 165, 90, 0.10)',
  },
  standard: {
    bg: 'rgba(22, 20, 16, 0.62)',
    border: 'rgba(197, 165, 90, 0.18)',
  },
  premium: {
    bg: 'rgba(26, 22, 16, 0.72)',
    border: 'rgba(197, 165, 90, 0.28)',
  },
} as const;

const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.40,
  shadowRadius: 18,
  elevation: 6,
};

export default DarkGlassCard;
