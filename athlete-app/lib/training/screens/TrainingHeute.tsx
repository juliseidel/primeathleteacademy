import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/lib/design/components/GlassCard';
import { WorkoutCard } from '@/lib/design/components/WorkoutCard';
import { color, font, radius, space } from '@/lib/design/tokens';
import { TODAY_WORKOUT } from '@/lib/training/mockData';

const DATE_LABEL = new Date().toLocaleDateString('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export function TrainingHeute() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[4], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>HEUTE</Text>
      <Text style={styles.headline}>{capitalize(DATE_LABEL)}</Text>

      <WorkoutCard
        type={TODAY_WORKOUT.type}
        title={TODAY_WORKOUT.title}
        metaLeft={`${TODAY_WORKOUT.exercises.length} Übungen`}
        metaRight={`~${TODAY_WORKOUT.estimatedDurationMin} Min · RPE ${TODAY_WORKOUT.rpeTarget ?? '—'}`}
        cta="Session starten"
        height={210}
      />

      {TODAY_WORKOUT.coachNotes ? (
        <GlassCard variant="standard" style={styles.coachCard}>
          <View style={styles.coachRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JK</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.coachName}>Jonas</Text>
              <Text style={styles.coachStatus}>dein Coach</Text>
            </View>
          </View>
          <Text style={styles.coachMessage}>{TODAY_WORKOUT.coachNotes}</Text>
        </GlassCard>
      ) : null}

      <Text style={styles.sectionLabel}>ÜBUNGEN</Text>

      <View style={styles.exerciseList}>
        {TODAY_WORKOUT.exercises.map((ex, i) => (
          <GlassCard key={ex.id} variant="standard" style={styles.exerciseCard}>
            <View style={styles.exerciseRow}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {summarizeExercise(ex)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={color.textDim} />
            </View>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}

function summarizeExercise(ex: typeof TODAY_WORKOUT.exercises[number]) {
  const setCount = ex.sets.length;
  const first = ex.sets[0];
  if (!first) return `${setCount} Sätze`;

  if (first.plannedReps && first.plannedLoadKg) {
    return `${setCount} × ${first.plannedReps} Wdh · ${first.plannedLoadKg} kg`;
  }
  if (first.plannedReps) {
    return `${setCount} × ${first.plannedReps} Wdh`;
  }
  if (first.plannedDistanceM) {
    return `${setCount} × ${first.plannedDistanceM} m`;
  }
  if (first.plannedTimeSec) {
    return `${setCount} × ${first.plannedTimeSec} s`;
  }
  return `${setCount} Sätze`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
    gap: space[4],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 3.2,
  },
  headline: {
    fontFamily: font.family,
    fontSize: 30,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
    marginBottom: space[3],
    letterSpacing: -0.4,
  },
  coachCard: {
    width: '100%',
    padding: space[4],
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginBottom: space[3],
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: color.surfaceLight,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.4,
  },
  coachName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
  },
  coachStatus: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 1,
  },
  coachMessage: {
    fontFamily: font.family,
    fontSize: 14,
    lineHeight: 20,
    color: color.text,
  },
  sectionLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.4,
    marginTop: space[3],
  },
  exerciseList: { gap: space[2] },
  exerciseCard: {
    width: '100%',
    padding: space[4],
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.gold,
  },
  exerciseName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
  },
  exerciseDetail: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  exerciseRadiusFix: {
    borderRadius: radius.lg,
  },
});
