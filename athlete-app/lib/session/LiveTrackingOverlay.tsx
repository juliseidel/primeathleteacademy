import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Tables } from '@/lib/database.types';
import {
  useAddSet,
  useDeleteSet,
  useFinishWorkout,
  useResetWorkout,
  useSkipWorkout,
  useStartWorkout,
  useSwapExercise,
  useUpdateSet,
  type ExerciseRow,
  type SetRow as SetT,
  type WorkoutWithExercises,
} from '@/lib/data/workouts';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import {
  blockSetsCompleted,
  blockSetsTotal,
  blockTotalRounds,
  findActiveLocation,
  getBlocks,
  isBlockComplete,
  type Block,
} from '@/lib/session/blocks';
import { ExerciseListSheet } from '@/lib/session/ExerciseListSheet';
import { ExerciseLibrarySheet } from '@/lib/session/ExerciseLibrarySheet';
import { PauseOverlay } from '@/lib/session/PauseOverlay';
import { SessionExitSheet } from '@/lib/session/SessionExitSheet';
import { SessionSummaryFlow } from '@/lib/session/SessionSummaryFlow';
import { SetRow } from '@/lib/session/SetRow';
import { useSession } from '@/lib/session/SessionContext';

type Props = {
  workout: WorkoutWithExercises;
  onClose: () => void;
};

type Phase = 'tracking' | 'summary';

export function LiveTrackingOverlay({ workout, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const session = useSession();
  const startWorkoutMut = useStartWorkout();
  const updateSetMut = useUpdateSet();
  const finishWorkoutMut = useFinishWorkout();
  const resetWorkoutMut = useResetWorkout();
  const skipWorkoutMut = useSkipWorkout();
  const deleteSetMut = useDeleteSet();
  const addSetMut = useAddSet();
  const swapExerciseMut = useSwapExercise();

  const [phase, setPhase] = useState<Phase>('tracking');
  const [savingSetId, setSavingSetId] = useState<string | null>(null);
  const [tickNow, setTickNow] = useState(Date.now());
  const [showExitSheet, setShowExitSheet] = useState(false);
  const [showListSheet, setShowListSheet] = useState(false);
  const [showSwapSheet, setShowSwapSheet] = useState(false);
  const [manualBlockIdx, setManualBlockIdx] = useState<number | null>(null);
  const [swapTargetExerciseId, setSwapTargetExerciseId] = useState<string | null>(null);

  // Tick
  useEffect(() => {
    const id = setInterval(() => setTickNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Start session
  useEffect(() => {
    if (!session.isActive(workout.id)) {
      session.startSession(workout.id);
    }
    if (workout.status === 'planned') {
      startWorkoutMut.mutate(workout.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout.id]);

  // Build blocks + find active location
  const blocks = useMemo(() => getBlocks(workout.exercises), [workout.exercises]);
  const autoLoc = useMemo(() => findActiveLocation(blocks), [blocks]);

  const activeBlockIdx = manualBlockIdx ?? autoLoc?.blockIdx ?? 0;
  const activeBlock: Block | undefined = blocks[activeBlockIdx];

  // Within a manually-selected block, pick the local active location
  const blockActiveLoc = useMemo(() => {
    if (!activeBlock) return null;
    if (autoLoc && autoLoc.blockIdx === activeBlockIdx) return autoLoc;
    // fallback: find first uncompleted in just this block
    return findActiveLocation([activeBlock]);
  }, [activeBlock, autoLoc, activeBlockIdx]);

  const totals = useMemo(() => computeTotals(workout), [workout]);
  const allDone = totals.setsCompleted >= totals.setsTotal;

  // Reset manualBlockIdx when underlying block completes (so auto-jump to next)
  useEffect(() => {
    if (manualBlockIdx == null) return;
    const b = blocks[manualBlockIdx];
    if (!b || isBlockComplete(b)) {
      setManualBlockIdx(null);
    }
  }, [manualBlockIdx, blocks]);

  // Pause für aktiven Block (key per block)
  const restKey = activeBlock ? `block:${activeBlockIdx}` : '';
  const restLeft = restKey ? session.pauseSecondsLeft(restKey) : 0;

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleSetCommit = async (
    set: SetT,
    block: Block,
    patch: Partial<Tables<'workout_exercise_sets'>>,
  ) => {
    setSavingSetId(set.id);
    try {
      await updateSetMut.mutateAsync({ setId: set.id, patch });
      const rest = set.planned_rest_sec ?? 0;
      if (rest > 0 && activeBlock) {
        session.startPause(`block:${blocks.indexOf(block)}`, rest);
      }
    } finally {
      setSavingSetId(null);
    }
  };

  const handleNextBlock = () => {
    setManualBlockIdx(null);
    // autoLoc will compute next block on its own
    const nextIdx = blocks.findIndex(
      (b, i) => i > activeBlockIdx && !isBlockComplete(b),
    );
    if (nextIdx !== -1) setManualBlockIdx(nextIdx);
  };

  const handlePickFromList = (exIdx: number) => {
    // exIdx ist Index in workout.exercises (flat). Finde zugehörigen Block.
    const targetEx = workout.exercises[exIdx];
    if (!targetEx) return;
    const targetBlockIdx = blocks.findIndex((b) =>
      b.exercises.some((e) => e.id === targetEx.id),
    );
    if (targetBlockIdx !== -1) setManualBlockIdx(targetBlockIdx);
    setShowListSheet(false);
  };

  const handleFinish = async (summary: {
    rpe: number | null;
    energy: number | null;
    notes: string | null;
  }) => {
    const startedAt = session.active?.startedAt ?? Date.now();
    const durationMin = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    await finishWorkoutMut.mutateAsync({
      workoutId: workout.id,
      summary: {
        athlete_rpe: summary.rpe,
        athlete_energy: summary.energy,
        athlete_summary_notes: summary.notes,
        actual_duration_min: durationMin,
      },
    });
    await session.endSession();
    onClose();
  };

  // ── Phase: summary ───────────────────────────────────────────────────────

  if (phase === 'summary') {
    const elapsedSec = Math.floor((tickNow - (session.active?.startedAt ?? tickNow)) / 1000);
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <SessionSummaryFlow
          workoutTitle={workout.title}
          durationMin={Math.max(1, Math.round(elapsedSec / 60))}
          setsCompleted={totals.setsCompleted}
          setsTotal={totals.setsTotal}
          totalVolumeKg={totals.totalVolumeKg || null}
          saving={finishWorkoutMut.isPending}
          onFinish={handleFinish}
          onBack={() => setPhase('tracking')}
        />
      </View>
    );
  }

  if (!activeBlock) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>Keine Übung gefunden.</Text>
      </View>
    );
  }

  const elapsedSec = Math.floor((tickNow - (session.active?.startedAt ?? tickNow)) / 1000);
  const blockDone = isBlockComplete(activeBlock);

  // ── Render tracking ──────────────────────────────────────────────────────

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.headerTop}>
        <Pressable
          onPress={() => setShowExitSheet(true)}
          hitSlop={12}
          style={styles.headerBtn}
        >
          <Ionicons name="chevron-down" size={24} color={color.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEyebrow}>SESSION LÄUFT</Text>
          <Text style={styles.headerTimer}>{formatHMS(elapsedSec)}</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.headerSub}>
        <Text style={styles.counter}>
          {activeBlockIdx + 1} / {blocks.length} {blocks.length > 1 ? 'BLÖCKE' : 'ÜBUNG'}
        </Text>
        <Pressable
          onPress={() => setShowListSheet(true)}
          style={({ pressed }) => [styles.listBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="list-outline" size={16} color={color.text} />
          <Text style={styles.listBtnLabel}>Übungen</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + space[16] },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View key={activeBlock.label ?? `idx-${activeBlockIdx}`} entering={FadeIn.duration(360)}>
            <BlockView
              block={activeBlock}
              activeLoc={blockActiveLoc}
              savingSetId={savingSetId}
              restLeft={restLeft}
              onSetCommit={(set, patch) => handleSetCommit(set, activeBlock, patch)}
              onSetDelete={(setId, setNumber) => {
                Alert.alert(
                  `Satz ${setNumber} löschen?`,
                  'Eingegebene Werte gehen verloren.',
                  [
                    { text: 'Abbrechen', style: 'cancel' },
                    {
                      text: 'Löschen',
                      style: 'destructive',
                      onPress: () => deleteSetMut.mutate(setId),
                    },
                  ],
                );
              }}
              onAddSet={(exId) => addSetMut.mutate({ workoutExerciseId: exId })}
              addingSet={addSetMut.isPending}
              onSwapExercise={(exId) => {
                const ex = activeBlock.exercises.find((e) => e.id === exId);
                if (!ex) return;
                const hasCompletedSets = ex.sets.some((s) => s.completed);
                setSwapTargetExerciseId(exId);
                if (hasCompletedSets) {
                  Alert.alert(
                    'Übung tauschen?',
                    'Diese Übung hat schon getrackte Sätze. Beim Tauschen werden sie für den Coach archiviert.',
                    [
                      { text: 'Abbrechen', style: 'cancel', onPress: () => setSwapTargetExerciseId(null) },
                      { text: 'Tauschen', onPress: () => setShowSwapSheet(true) },
                    ],
                  );
                } else {
                  setShowSwapSheet(true);
                }
              }}
              onSkipPause={() => session.cancelPause(restKey)}
            />
          </Animated.View>

          <View style={styles.actionsRow}>
            {allDone ? (
              <Pressable
                onPress={() => setPhase('summary')}
                style={({ pressed }) => [
                  styles.nextBtn,
                  pressed && styles.nextBtnPressed,
                ]}
              >
                <Ionicons name="arrow-forward" size={18} color={color.bg} />
                <Text style={styles.nextLabel}>Session abschließen</Text>
              </Pressable>
            ) : blockDone ? (
              <Pressable
                onPress={handleNextBlock}
                style={({ pressed }) => [
                  styles.nextBtn,
                  pressed && styles.nextBtnPressed,
                ]}
              >
                <Ionicons name="arrow-forward" size={18} color={color.bg} />
                <Text style={styles.nextLabel}>
                  {activeBlock.isSuperset ? 'Nächster Block' : 'Nächste Übung'}
                </Text>
              </Pressable>
            ) : (
              <View style={styles.hintRow}>
                <Text style={styles.hintText}>
                  Werte eintragen — der Satz wird automatisch gespeichert.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {savingSetId || updateSetMut.isPending ? (
        <View style={styles.savingPill}>
          <ActivityIndicator size="small" color={color.gold} />
        </View>
      ) : null}

      <SessionExitSheet
        visible={showExitSheet}
        hasProgress={totals.setsCompleted > 0}
        onContinue={() => setShowExitSheet(false)}
        onMinimize={() => {
          setShowExitSheet(false);
          onClose();
        }}
        onFinishNow={() => {
          setShowExitSheet(false);
          setPhase('summary');
        }}
        onReset={async () => {
          setShowExitSheet(false);
          await resetWorkoutMut.mutateAsync(workout.id);
          await session.endSession();
        }}
        onSkip={async () => {
          setShowExitSheet(false);
          await skipWorkoutMut.mutateAsync(workout.id);
          await session.endSession();
          onClose();
        }}
      />

      <ExerciseListSheet
        visible={showListSheet}
        exercises={workout.exercises}
        activeIndex={
          activeBlock
            ? workout.exercises.findIndex(
                (e) =>
                  e.id ===
                  activeBlock.exercises[blockActiveLoc?.exerciseIdx ?? 0]?.id,
              )
            : 0
        }
        onPick={handlePickFromList}
        onClose={() => setShowListSheet(false)}
      />

      {swapTargetExerciseId ? (
        <ExerciseLibrarySheet
          visible={showSwapSheet}
          currentLibraryId={
            activeBlock.exercises.find((e) => e.id === swapTargetExerciseId)?.exercise_library_id ??
            ''
          }
          preferredMeasurementType={
            activeBlock.exercises.find((e) => e.id === swapTargetExerciseId)?.library
              .measurement_type
          }
          onClose={() => {
            setShowSwapSheet(false);
            setSwapTargetExerciseId(null);
          }}
          onPick={(newLibraryId) => {
            if (!swapTargetExerciseId) return;
            swapExerciseMut.mutate({
              oldWorkoutExerciseId: swapTargetExerciseId,
              newLibraryId,
              workoutId: workout.id,
            });
            setSwapTargetExerciseId(null);
          }}
        />
      ) : null}
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// BLOCK VIEW — rendert alle Übungen eines Blocks (Supersatz oder Standalone)
// ────────────────────────────────────────────────────────────────────────────

type BlockViewProps = {
  block: Block;
  activeLoc: ReturnType<typeof findActiveLocation> | null;
  savingSetId: string | null;
  restLeft: number;
  onSetCommit: (set: SetT, patch: Partial<Tables<'workout_exercise_sets'>>) => Promise<void> | void;
  onSetDelete: (setId: string, setNumber: number) => void;
  onAddSet: (exerciseId: string) => void;
  addingSet?: boolean;
  onSwapExercise: (exerciseId: string) => void;
  onSkipPause: () => void;
};

function BlockView({
  block,
  activeLoc,
  savingSetId,
  restLeft,
  onSetCommit,
  onSetDelete,
  onAddSet,
  addingSet,
  onSwapExercise,
  onSkipPause,
}: BlockViewProps) {
  const totalRounds = blockTotalRounds(block);
  const setsDone = blockSetsCompleted(block);
  const setsTotal = blockSetsTotal(block);
  const currentRound = Math.min(activeLoc?.roundIdx ?? 0, Math.max(0, totalRounds - 1));

  const activeExerciseIdx = activeLoc?.exerciseIdx ?? 0;
  const lastPlannedRest = lastNonNullRestInBlock(block);

  return (
    <View style={blockStyles.wrap}>
      {block.isSuperset ? (
        <View style={blockStyles.headerRow}>
          <View style={blockStyles.labelBadge}>
            <Text style={blockStyles.labelText}>BLOCK {block.label}</Text>
          </View>
          <Text style={blockStyles.headerMeta}>
            Durchgang {currentRound + 1} / {totalRounds}  ·  {setsDone}/{setsTotal} Sätze
          </Text>
        </View>
      ) : null}

      <View style={blockStyles.exContainer}>
        {block.exercises.map((ex, eIdx) => {
          const isActiveEx = eIdx === activeExerciseIdx;
          return (
            <View key={ex.id} style={[blockStyles.exCard, isActiveEx && blockStyles.exCardActive]}>
              <View style={blockStyles.exHeader}>
                <View style={blockStyles.exTitleRow}>
                  {ex.group_label ? (
                    <View style={blockStyles.groupBadge}>
                      <Text style={blockStyles.groupBadgeText}>{ex.group_label}</Text>
                    </View>
                  ) : null}
                  <Text style={blockStyles.exTitle}>{ex.library.name}</Text>
                </View>
                <Pressable
                  onPress={() => onSwapExercise(ex.id)}
                  hitSlop={6}
                  style={({ pressed }) => [blockStyles.swapBtn, pressed && { opacity: 0.6 }]}
                >
                  <Ionicons name="swap-horizontal" size={14} color={color.textMuted} />
                </Pressable>
              </View>

              {ex.coach_notes ? (
                <View style={blockStyles.coachNote}>
                  <Ionicons name="chatbox-ellipses-outline" size={12} color={color.gold} />
                  <Text style={blockStyles.coachNoteText}>{ex.coach_notes}</Text>
                </View>
              ) : null}

              <View style={blockStyles.setsList}>
                {ex.sets.map((s) => (
                  <SetRow
                    key={s.id}
                    set={s}
                    library={ex.library}
                    saving={savingSetId === s.id}
                    onCommit={(patch) => onSetCommit(s, patch)}
                    onDelete={() => onSetDelete(s.id, s.set_number)}
                  />
                ))}
              </View>

              <Pressable
                onPress={() => onAddSet(ex.id)}
                disabled={addingSet}
                style={({ pressed }) => [blockStyles.addSetBtn, pressed && { opacity: 0.7 }]}
              >
                <Ionicons name="add" size={14} color={color.gold} />
                <Text style={blockStyles.addSetLabel}>
                  {addingSet ? 'Wird hinzugefügt…' : 'Satz hinzufügen'}
                </Text>
              </Pressable>
            </View>
          );
        })}

        {restLeft > 0 ? (
          <PauseOverlay
            secondsLeft={restLeft}
            totalSec={lastPlannedRest ?? 60}
            context={block.isSuperset ? 'within_block' : 'between_blocks'}
            onSkip={onSkipPause}
          />
        ) : null}
      </View>
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

function lastNonNullRestInBlock(block: Block): number | null {
  for (const ex of block.exercises) {
    for (const s of ex.sets) {
      if (s.planned_rest_sec) return s.planned_rest_sec;
    }
  }
  return null;
}

function computeTotals(w: WorkoutWithExercises) {
  let setsTotal = 0;
  let setsCompleted = 0;
  let totalVolumeKg = 0;
  for (const ex of w.exercises) {
    for (const s of ex.sets) {
      setsTotal += 1;
      if (s.completed) setsCompleted += 1;
      if (s.actual_reps && s.actual_load_kg) {
        totalVolumeKg += s.actual_reps * Number(s.actual_load_kg);
      }
    }
  }
  return { setsTotal, setsCompleted, totalVolumeKg };
}

function formatHMS(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ────────────────────────────────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontFamily: font.family,
    fontSize: 15,
    color: color.danger,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[4],
    paddingVertical: space[3],
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerEyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.4,
  },
  headerTimer: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.4,
    marginTop: 2,
  },

  headerSub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingTop: space[3],
    paddingBottom: space[1],
  },
  counter: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  listBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  listBtnLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.3,
  },

  scroll: {
    paddingHorizontal: space[5],
    paddingTop: space[4],
  },

  actionsRow: {
    marginTop: space[5],
  },
  hintRow: {
    paddingVertical: space[2],
    alignItems: 'center',
  },
  hintText: {
    fontFamily: font.family,
    fontSize: 12,
    fontStyle: 'italic',
    color: color.textDim,
    textAlign: 'center',
    paddingHorizontal: space[5],
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    backgroundColor: color.gold,
    borderRadius: radius.md,
    paddingVertical: space[4],
  },
  nextBtnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  nextLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },

  savingPill: {
    position: 'absolute',
    top: 70,
    right: space[5],
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(20, 20, 20, 0.92)',
    borderWidth: 1,
    borderColor: color.goldA20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const blockStyles = StyleSheet.create({
  wrap: {
    gap: space[3],
  },
  exContainer: {
    position: 'relative',
    gap: space[3],
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginBottom: space[1],
  },
  labelBadge: {
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    borderRadius: radius.sm,
    backgroundColor: color.gold,
  },
  labelText: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 1.6,
  },
  headerMeta: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  exCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.55)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    padding: space[4],
    gap: space[3],
  },
  exCardActive: {
    backgroundColor: 'rgba(20, 20, 20, 0.75)',
    borderColor: color.goldA30,
  },
  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
  },
  exTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  groupBadge: {
    minWidth: 32,
    height: 26,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupBadgeText: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.4,
  },
  exTitle: {
    flex: 1,
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.4,
  },
  swapBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    borderRadius: radius.md,
    backgroundColor: color.goldA04,
    borderWidth: 1,
    borderColor: color.goldA20,
  },
  coachNoteText: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 12,
    color: color.text,
    lineHeight: 18,
  },
  setsList: {
    gap: space[2],
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: space[2],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: color.goldA30,
  },
  addSetLabel: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 0.4,
  },
});
