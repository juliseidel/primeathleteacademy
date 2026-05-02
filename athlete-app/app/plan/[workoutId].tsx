import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWorkoutDetail, type ExerciseRow, type SetRow } from '@/lib/data/workouts';
import { CoachQuoteCard } from '@/lib/design/components/CoachQuoteCard';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { getBlocks, type Block } from '@/lib/session/blocks';
import { workoutImageSource, workoutShortLabel } from '@/lib/training/workoutTypes';

export default function PlanRoute() {
  const params = useLocalSearchParams<{ workoutId: string }>();
  const workoutId = params.workoutId!;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: workout, isLoading, error } = useWorkoutDetail(workoutId);

  const blocks = useMemo<Block[]>(() => {
    if (!workout) return [];
    return getBlocks(workout.exercises);
  }, [workout]);

  if (isLoading || !workout) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={color.gold} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top + space[8] }]}>
        <Text style={styles.errorText}>Plan konnte nicht geladen werden.</Text>
        <Pressable onPress={() => router.back()} style={styles.errorBtn}>
          <Text style={styles.errorBtnLabel}>Zurück</Text>
        </Pressable>
      </View>
    );
  }

  const eyebrowText = workoutShortLabel(workout.type);
  const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets.length, 0);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + space[8] }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroDarkBase} />
          <Image
            source={workoutImageSource(workout.type)}
            style={[StyleSheet.absoluteFill, styles.heroImage]}
            contentFit="cover"
            transition={250}
            cachePolicy="memory-disk"
          />
          <LinearGradient
            colors={['rgba(10,10,10,0.55)', 'rgba(10,10,10,0.10)', 'rgba(10,10,10,0)']}
            locations={[0, 0.4, 1]}
            style={styles.heroTopGradient}
          />
          <LinearGradient
            colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.65)', 'rgba(10,10,10,0.96)']}
            locations={[0, 0.55, 1]}
            style={styles.heroBottomGradient}
          />

          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { top: insets.top + space[3] }]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>{eyebrowText}</Text>
            <Text style={styles.heroTitle}>{workout.title}</Text>

            <View style={styles.pillRow}>
              {workout.estimated_duration_min ? (
                <Pill icon="time-outline" label={`${workout.estimated_duration_min} Min`} />
              ) : null}
              <Pill icon="list-outline" label={`${workout.exercises.length} Übungen`} />
              <Pill icon="layers-outline" label={`${totalSets} Sätze`} />
              {workout.rpe_target ? (
                <Pill icon="flame-outline" label={`RPE ${workout.rpe_target}`} />
              ) : null}
            </View>
          </View>

          <View pointerEvents="none" style={styles.heroBorder} />
        </View>

        <View style={styles.body}>
          {workout.coach_global_note ? (
            <CoachQuoteCard
              coachName="Patrick"
              coachInitials="PS"
              message={workout.coach_global_note}
            />
          ) : null}

          {blocks.map((block, idx) => (
            <BlockSection key={block.label ?? `standalone-${idx}`} block={block} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Pill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={12} color="#FFFFFF" />
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

function BlockSection({ block }: { block: Block }) {
  return (
    <View style={styles.blockSection}>
      {block.label ? (
        <View style={styles.blockHeader}>
          <Text style={styles.blockLabel}>BLOCK {block.label}</Text>
          {block.isSuperset ? (
            <>
              <View style={styles.blockDot} />
              <Text style={styles.blockSubLabel}>SUPERSATZ</Text>
            </>
          ) : null}
        </View>
      ) : null}

      {block.exercises.map((ex) => (
        <ExerciseRowView key={ex.id} exercise={ex} />
      ))}
    </View>
  );
}

function ExerciseRowView({ exercise }: { exercise: ExerciseRow }) {
  const setCount = exercise.sets.length;
  const uniform = setsAreUniform(exercise.sets);

  return (
    <View style={styles.exerciseRow}>
      <View style={styles.exerciseHeader}>
        {exercise.group_label ? (
          <Text style={styles.exerciseGroupLabel}>{exercise.group_label}</Text>
        ) : null}
        {exercise.focus ? (
          <>
            <View style={styles.headerDot} />
            <Text style={styles.exerciseFocus}>{exercise.focus.toUpperCase()}</Text>
          </>
        ) : null}
      </View>

      <Text style={styles.exerciseName}>{exercise.library.name}</Text>

      {setCount > 0 ? (
        uniform ? (
          <Text style={styles.uniformPlanLine}>{formatUniformPlan(exercise.sets[0], setCount)}</Text>
        ) : (
          <View style={styles.setsTable}>
            {exercise.sets.map((s) => (
              <SetRowView key={s.id} set={s} />
            ))}
          </View>
        )
      ) : null}

      {exercise.coach_notes ? (
        <View style={styles.coachNote}>
          <Ionicons name="chatbox-ellipses-outline" size={13} color={color.gold} />
          <Text style={styles.coachNoteText}>{exercise.coach_notes}</Text>
        </View>
      ) : null}
    </View>
  );
}

function SetRowView({ set }: { set: SetRow }) {
  const reps = formatReps(set);
  const load = formatLoad(set);
  const rest = formatRest(set.planned_rest_sec);
  const time = formatTime(set.planned_time_sec);
  const distance = formatDistance(set.planned_distance_m);
  const tempo = set.planned_tempo;
  const sideLabel = formatSide(set.side);

  return (
    <View style={styles.setRow}>
      <Text style={styles.setNumber}>Satz {set.set_number}{sideLabel ? ` · ${sideLabel}` : ''}</Text>
      <View style={styles.setValuesWrap}>
        {reps ? <Text style={styles.setValue}>{reps} Wdh</Text> : null}
        {load ? <Text style={styles.setValue}>{load}</Text> : null}
        {time ? <Text style={styles.setValue}>{time}</Text> : null}
        {distance ? <Text style={styles.setValue}>{distance}</Text> : null}
        {tempo ? <Text style={styles.setValue}>Tempo {tempo}</Text> : null}
        {rest ? <Text style={styles.setValueDim}>Pause {rest}</Text> : null}
      </View>
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function formatReps(set: SetRow): string {
  if (set.planned_reps_label) return set.planned_reps_label;
  const min = set.planned_reps_min;
  const max = set.planned_reps_max;
  if (min && max && min !== max) return `${min}–${max}`;
  if (min) return `${min}`;
  if (max) return `${max}`;
  return '';
}

function formatLoad(set: SetRow): string {
  if (set.planned_load_display) return set.planned_load_display;
  if (set.planned_load_kg != null) return `${Number(set.planned_load_kg)} kg`;
  return '';
}

function formatRest(sec: number | null): string {
  if (!sec) return '';
  if (sec < 60) return `${sec}s`;
  if (sec % 60 === 0) return `${sec / 60} min`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? `0${s}` : s} min`;
}

function formatTime(sec: number | null): string {
  if (!sec) return '';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? `0${s}` : s}`;
}

function formatDistance(m: number | null): string {
  if (!m) return '';
  if (m >= 1000) return `${(m / 1000).toFixed(2)} km`;
  return `${m} m`;
}

function formatSide(side: 'both' | 'left' | 'right' | null): string {
  if (side === 'left') return 'Links';
  if (side === 'right') return 'Rechts';
  return '';
}

function setsAreUniform(sets: SetRow[]): boolean {
  if (sets.length <= 1) return true;
  const first = sets[0];
  return sets.every(
    (s) =>
      s.planned_reps_min === first.planned_reps_min &&
      s.planned_reps_max === first.planned_reps_max &&
      s.planned_reps_label === first.planned_reps_label &&
      String(s.planned_load_kg ?? '') === String(first.planned_load_kg ?? '') &&
      s.planned_load_display === first.planned_load_display &&
      s.planned_rest_sec === first.planned_rest_sec &&
      s.planned_time_sec === first.planned_time_sec &&
      s.planned_distance_m === first.planned_distance_m &&
      s.planned_tempo === first.planned_tempo &&
      s.side === first.side,
  );
}

function formatUniformPlan(set: SetRow, setCount: number): string {
  const reps = formatReps(set);
  const load = formatLoad(set);
  const rest = formatRest(set.planned_rest_sec);
  const time = formatTime(set.planned_time_sec);
  const distance = formatDistance(set.planned_distance_m);
  const sideLabel = formatSide(set.side);

  const bits: string[] = [];

  // Sätze × wdh oder Sätze × distance/zeit
  if (reps) bits.push(`${setCount} × ${reps} Wdh`);
  else if (distance && time) bits.push(`${setCount} × ${distance} / ${time}`);
  else if (distance) bits.push(`${setCount} × ${distance}`);
  else if (time) bits.push(`${setCount} × ${time}`);
  else bits.push(`${setCount} Sätze`);

  if (load) bits.push(load);
  if (sideLabel) bits.push(`pro Seite (${sideLabel.toLowerCase()})`);
  if (set.planned_tempo) bits.push(`Tempo ${set.planned_tempo}`);
  if (rest) bits.push(`Pause ${rest}`);

  return bits.join(' · ');
}

// ─── Styles ─────────────────────────────────────────────────────

const HERO_HEIGHT = 360;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingBottom: space[8],
  },
  errorText: {
    fontFamily: font.family,
    fontSize: 15,
    color: color.danger,
  },
  errorBtn: {
    marginTop: space[5],
    paddingHorizontal: space[6],
    paddingVertical: space[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.goldA20,
  },
  errorBtnLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },

  hero: {
    width: '100%',
    height: HERO_HEIGHT,
    backgroundColor: color.bg,
    overflow: 'hidden',
  },
  heroDarkBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A0A',
  },
  heroImage: {
    opacity: 0.82,
  },
  heroTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  heroBottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  heroBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: color.goldA30,
  },
  backBtn: {
    position: 'absolute',
    left: space[4],
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,10,10,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: space[5],
    paddingBottom: space[6],
    gap: space[3],
  },
  heroEyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 3.0,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  heroTitle: {
    fontFamily: displaySerif as string,
    fontSize: 34,
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: -0.7,
    lineHeight: 38,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
    marginTop: space[2],
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.50)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  pillText: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  body: {
    paddingHorizontal: space[5],
    paddingTop: space[5],
    gap: space[6],
  },

  blockSection: {
    gap: space[4],
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  blockLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.6,
  },
  blockSubLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.2,
  },
  blockDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: color.textDim,
  },

  exerciseRow: {
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    borderRadius: radius.md,
    backgroundColor: 'rgba(20,20,20,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: space[2],
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  exerciseGroupLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 1.8,
  },
  headerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: color.textDim,
  },
  exerciseFocus: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 1.6,
  },
  exerciseName: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  uniformPlanLine: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
    lineHeight: 19,
  },
  setsTable: {
    gap: 6,
    marginTop: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  setNumber: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 0.4,
    width: 70,
    paddingTop: 1,
  },
  setValuesWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
    rowGap: 4,
  },
  setValue: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.2,
  },
  setValueDim: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '500',
    color: color.textMuted,
    letterSpacing: 0.2,
  },

  coachNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    marginTop: 4,
    borderRadius: radius.sm,
    backgroundColor: color.goldA04,
    borderWidth: 1,
    borderColor: color.goldA20,
  },
  coachNoteText: {
    flex: 1,
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 13,
    color: color.text,
    lineHeight: 19,
  },
});
