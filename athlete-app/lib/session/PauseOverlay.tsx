import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

type Props = {
  secondsLeft: number;
  totalSec: number;
  context?: 'within_block' | 'between_blocks';
  onSkip?: () => void;
};

/**
 * Premium Pause-Overlay: liegt über dem aktiven Block (Übungen werden
 * abgedunkelt + leicht geblurrt), zentrierter Editorial-Counter im Vordergrund.
 */
export function PauseOverlay({ secondsLeft, totalSec, context = 'within_block', onSkip }: Props) {
  const ready = secondsLeft <= 0;
  const display = formatTime(Math.max(0, secondsLeft));
  const progress = totalSec > 0 ? Math.min(1, Math.max(0, 1 - secondsLeft / totalSec)) : 1;

  const eyebrow = ready
    ? 'BEREIT'
    : context === 'between_blocks'
      ? 'BLOCK-PAUSE'
      : 'PAUSE';

  const counterScale = useSharedValue(0.94);
  const overlayOpacity = useSharedValue(0);
  const breathing = useSharedValue(1);

  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) });
    counterScale.value = withSpring(1, { damping: 14, stiffness: 130, mass: 0.9 });
    breathing.value = withRepeat(
      withTiming(1.04, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const counterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value * (ready ? 1 : breathing.value) }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.wrap, overlayStyle]} pointerEvents="auto">
      <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(10, 10, 10, 0.78)', 'rgba(10, 10, 10, 0.92)']}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* subtle gold halo */}
      <View pointerEvents="none" style={styles.halo} />

      <View style={styles.center}>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>

        <Animated.Text style={[styles.counter, counterStyle, ready && { color: color.gold }]}>
          {display}
        </Animated.Text>

        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
        </View>

        {ready ? (
          <Text style={styles.readyHint}>Mach den nächsten Satz.</Text>
        ) : null}

        <Pressable
          onPress={onSkip}
          style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.skipLabel}>{ready ? 'Weitermachen' : 'Pause überspringen'}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: color.goldA10,
    top: '50%',
    left: '50%',
    marginTop: -160,
    marginLeft: -160,
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 80,
    opacity: 0.7,
  },
  center: {
    alignItems: 'center',
    paddingHorizontal: space[6],
    gap: space[3],
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.gold,
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 3.0,
  },
  counter: {
    fontFamily: displaySerif as string,
    fontSize: 92,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -2.5,
    lineHeight: 100,
    marginTop: space[1],
    includeFontPadding: false,
  },
  barTrack: {
    width: 220,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    overflow: 'hidden',
    marginTop: space[2],
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: color.gold,
  },
  readyHint: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.gold,
    letterSpacing: 0.4,
    marginTop: space[1],
  },
  skipBtn: {
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginTop: space[3],
  },
  skipLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.4,
  },
});
