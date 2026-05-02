import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { glass } from '@/lib/design/tokens';

type Variant = 'subtle' | 'standard' | 'premium';

type Props = {
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function GlassCard({ variant = 'standard', style, children }: Props) {
  const v = glass.variant[variant];

  const containerStyle: ViewStyle = {
    borderRadius: v.borderRadius,
    overflow: 'hidden',
  };

  if (Platform.OS === 'android') {
    return (
      <View
        style={[
          containerStyle,
          {
            backgroundColor: glass.androidFallback.background,
            borderColor: v.border,
            borderWidth: v.borderWidth,
            elevation: glass.androidFallback.elevation,
          },
          style,
        ]}
      >
        {variant === 'premium' ? <PearlGloss /> : null}
        {children}
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <BlurView
        intensity={glass.blurIntensity}
        tint={glass.blurTintIOS}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: v.background,
            borderColor: v.border,
            borderWidth: v.borderWidth,
            borderRadius: v.borderRadius,
          },
        ]}
      />
      {variant === 'premium' ? <PearlGloss /> : null}
      {children}
    </View>
  );
}

function PearlGloss() {
  return (
    <LinearGradient
      colors={[...glass.pearlGloss.colors]}
      locations={[...glass.pearlGloss.locations]}
      start={glass.pearlGloss.start}
      end={glass.pearlGloss.end}
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { height: '50%' }]}
    />
  );
}
