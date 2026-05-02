import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

type Props = {
  secondsLeft: number;
  totalSec: number;
  context?: 'within_block' | 'between_blocks';
  onSkip?: () => void;
};

/**
 * Inline Pause-Card — wird zwischen den Übungen / am Block-Ende eingeblendet.
 * Visuell kompakter als die alte floating-Variante, semantisch verortet im
 * Lese-Fluss: Pause steht da wo sie hingehört (zwischen Sätzen).
 */
export function RestTimerCard({ secondsLeft, totalSec, context = 'within_block', onSkip }: Props) {
  const ready = secondsLeft <= 0;
  const display = formatTime(Math.max(0, secondsLeft));
  const progress = totalSec > 0 ? Math.min(1, Math.max(0, 1 - secondsLeft / totalSec)) : 1;

  const eyebrow =
    context === 'between_blocks'
      ? ready ? 'BEREIT FÜR NÄCHSTEN BLOCK' : 'BLOCK-PAUSE'
      : ready ? 'BEREIT' : 'PAUSE';

  return (
    <Animated.View entering={FadeIn.duration(280)} exiting={FadeOut.duration(180)} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.dot, { backgroundColor: color.gold }]} />
        <Text style={styles.eyebrow}>{eyebrow}</Text>
      </View>

      <View style={styles.contentRow}>
        <Text style={styles.counter}>{display}</Text>
        <Pressable
          onPress={onSkip}
          hitSlop={8}
          style={({ pressed }) => [styles.skipBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.skipLabel}>{ready ? 'Weitermachen' : 'Überspringen'}</Text>
        </Pressable>
      </View>

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${progress * 100}%` },
          ]}
        />
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
  card: {
    backgroundColor: 'rgba(20, 20, 20, 0.65)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.goldA20,
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    gap: space[2],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    fontFamily: displaySerif as string,
    fontSize: 38,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.gold,
    letterSpacing: -1,
    lineHeight: 42,
  },
  skipBtn: {
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  skipLabel: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.4,
  },
  barTrack: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: color.gold,
  },
});
