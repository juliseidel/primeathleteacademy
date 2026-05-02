/**
 * useEntrance — FEELY-style screen/widget entry animation.
 *
 * Pattern: opacity 0→1 (fade) + translateY 16→0 (gentle slide up via spring).
 * Direkte Adaption aus VitalHeuteTab.js (EchtGesund_NEU3).
 *
 * Verwendung:
 *   const enter = useEntrance(0);     // sofort
 *   const enter2 = useEntrance(80);   // 80ms delay (für stagger)
 *   <Animated.View style={enter}>...</Animated.View>
 */

import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function useEntrance(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 550,
        easing: Easing.out(Easing.cubic),
      })
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 22,
        stiffness: 85,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}
