import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutWithExercises } from '@/lib/data/workouts';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { workoutImageSource } from '@/lib/training/workoutTypes';

type Props = {
  workout: WorkoutWithExercises;
  weekday: string;
  onPress: () => void;
};

const CARD_HEIGHT = 460;

export function CompletedWorkoutCard({ workout, weekday, onPress }: Props) {
  const totals = useMemo(() => {
    let setsTotal = 0;
    let setsDone = 0;
    let totalVolumeKg = 0;
    for (const ex of workout.exercises) {
      for (const s of ex.sets) {
        setsTotal += 1;
        if (s.completed) setsDone += 1;
        if (s.actual_reps && s.actual_load_kg) {
          totalVolumeKg += s.actual_reps * Number(s.actual_load_kg);
        }
      }
    }
    return { setsTotal, setsDone, totalVolumeKg };
  }, [workout.exercises]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.94 }]}
    >
      <View style={styles.darkBase} />

      <Image
        source={workoutImageSource(workout.type)}
        style={[StyleSheet.absoluteFill, styles.image]}
        contentFit="cover"
        transition={250}
        cachePolicy="memory-disk"
      />

      <LinearGradient
        colors={['rgba(10,10,10,0.65)', 'rgba(10,10,10,0.25)', 'rgba(10,10,10,0)']}
        locations={[0, 0.5, 1]}
        style={styles.topGradient}
      />

      <LinearGradient
        colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.65)', 'rgba(10,10,10,0.94)']}
        locations={[0, 0.45, 1]}
        style={styles.bottomGradient}
      />

      <View style={styles.topOverlay}>
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Ionicons name="checkmark" size={18} color={color.bg} />
          </View>
          <Text style={styles.eyebrow}>
            {weekday.toUpperCase()} · ABGESCHLOSSEN
          </Text>
        </View>
        <Text style={styles.title}>{workout.title}</Text>
      </View>

      <View style={styles.bottomOverlay}>
        <View style={styles.statsGrid}>
          <StatBlock
            label="Dauer"
            value={workout.actual_duration_min ? `${workout.actual_duration_min}` : '–'}
            unit={workout.actual_duration_min ? 'Min' : ''}
          />
          <StatBlock
            label="Sätze"
            value={`${totals.setsDone}`}
            unit={`/ ${totals.setsTotal}`}
          />
          {workout.athlete_rpe ? (
            <StatBlock label="RPE" value={`${workout.athlete_rpe}`} unit="/ 10" />
          ) : null}
        </View>

        {totals.totalVolumeKg > 0 ? (
          <Text style={styles.volume}>
            {formatKg(totals.totalVolumeKg)} kg Gesamtvolumen
          </Text>
        ) : null}

        {workout.athlete_summary_notes ? (
          <View style={styles.note}>
            <Ionicons name="chatbox-ellipses-outline" size={13} color={color.gold} />
            <Text style={styles.noteText} numberOfLines={2}>
              {workout.athlete_summary_notes}
            </Text>
          </View>
        ) : null}

        <View style={styles.cta}>
          <Text style={styles.ctaLabel}>Werte ansehen oder anpassen</Text>
          <Ionicons name="arrow-forward" size={14} color={color.gold} />
        </View>
      </View>

      <View pointerEvents="none" style={styles.border} />
    </Pressable>
  );
}

function StatBlock({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={styles.statBlock}>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{value}</Text>
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </View>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </View>
  );
}

function formatKg(n: number): string {
  return n.toLocaleString('de-DE');
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: color.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 14,
  },
  darkBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A0A',
  },
  image: {
    opacity: 0.62,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '62%',
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.goldA30,
  },

  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: space[5],
    paddingTop: space[6],
    gap: space[4],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.6,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  title: {
    fontFamily: displaySerif as string,
    fontSize: 36,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.7,
    lineHeight: 40,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },

  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: space[5],
    gap: space[3],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: space[3],
    paddingVertical: space[3],
    paddingHorizontal: space[3],
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontFamily: displaySerif as string,
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.gold,
    letterSpacing: -0.4,
  },
  statUnit: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
  },
  statLabel: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 1.6,
  },
  volume: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: color.goldA20,
  },
  noteText: {
    flex: 1,
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 13,
    color: color.text,
    lineHeight: 19,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: space[1],
  },
  ctaLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 0.4,
  },
});
