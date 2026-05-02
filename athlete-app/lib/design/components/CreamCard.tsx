import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { cream } from '@/lib/design/cream';
import { radius } from '@/lib/design/tokens';

type Props = {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  borderRadius?: number;
  withGradient?: boolean;
};

export function CreamCard({
  style,
  children,
  borderRadius = radius.xl,
  withGradient = true,
}: Props) {
  return (
    <View
      style={[
        {
          borderRadius,
          overflow: 'hidden',
          backgroundColor: cream.cardBg,
          borderWidth: 1,
          borderColor: cream.border,
        },
        styles.shadow,
        style,
      ]}
    >
      {withGradient ? (
        <LinearGradient
          colors={[cream.cardBgTop, cream.cardBg, cream.cardBgBottom]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 6,
  },
});
