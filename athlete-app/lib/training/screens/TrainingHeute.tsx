import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { localIso, startOfWeek } from '@/lib/data/dates';
import { firstName, initialsFor, useMyProfile } from '@/lib/data/profile';
import { useWeekWorkouts, type WorkoutWithExercises } from '@/lib/data/workouts';
import { useEntrance } from '@/lib/design/animations/useEntrance';
import { CoachQuoteCard } from '@/lib/design/components/CoachQuoteCard';
import { DarkGlassCard } from '@/lib/design/components/DarkGlassCard';
import { GreetingHeader } from '@/lib/design/components/GreetingHeader';
import { WeekStrip, type DayCell } from '@/lib/design/components/WeekStrip';
import { WorkoutHeroCard } from '@/lib/design/components/WorkoutHeroCard';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { workoutShortLabel } from '@/lib/training/workoutTypes';

const WEEKDAYS_DE = ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'] as const;
const WEEKDAYS_FULL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] as const;
const MONTH_DE = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];

export function TrainingHeute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;

  const profileQuery = useMyProfile(userId);
  const weekQuery = useWeekWorkouts(userId);

  const today = useMemo(() => new Date(), []);
  const todayIso = localIso(today);
  const weekStart = useMemo(() => startOfWeek(today), [today]);

  const [selectedKey, setSelectedKey] = useState<string>(`${WEEKDAYS_DE[today.getDay()]}-${today.getDate()}`);

  const weekCells: DayCell[] = useMemo(() => {
    const workouts: WorkoutWithExercises[] = weekQuery.data ?? [];
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const iso = localIso(d);
      const dayWorkouts = workouts.filter((w: WorkoutWithExercises) => w.planned_date === iso);

      let status: DayCell['status'] = 'rest';
      if (dayWorkouts.length > 0) {
        const allCompleted = dayWorkouts.every((w: WorkoutWithExercises) => w.status === 'completed');
        const anyInProgress = dayWorkouts.some((w: WorkoutWithExercises) => w.status === 'in_progress');
        const allSkipped = dayWorkouts.every((w: WorkoutWithExercises) => w.status === 'skipped');
        if (allCompleted) status = 'completed';
        else if (anyInProgress) status = 'in_progress';
        else if (allSkipped) status = 'skipped';
        else status = 'planned';
      }

      return {
        weekday: WEEKDAYS_DE[d.getDay()],
        dayNumber: d.getDate(),
        isToday: iso === todayIso,
        isInPast: d < new Date(todayIso),
        status,
      };
    });
  }, [weekQuery.data, weekStart, todayIso]);

  const monthLabel = useMemo(() => {
    const start = weekStart;
    const end = new Date(weekStart);
    end.setDate(start.getDate() + 6);
    if (start.getMonth() === end.getMonth()) {
      return `${MONTH_DE[start.getMonth()]} ${start.getFullYear()}`;
    }
    return `${MONTH_DE[start.getMonth()]} – ${MONTH_DE[end.getMonth()]} ${end.getFullYear()}`;
  }, [weekStart]);

  const selectedDay = weekCells.find(
    (d) => `${d.weekday}-${d.dayNumber}` === selectedKey
  ) ?? weekCells[today.getDay() === 0 ? 6 : today.getDay() - 1];

  const selectedDate = useMemo(() => {
    const d = new Date(weekStart);
    const idx = WEEKDAYS_DE.indexOf(selectedDay.weekday as (typeof WEEKDAYS_DE)[number]);
    if (idx === -1) return d;
    const dayOfWeek = idx === 0 ? 6 : idx - 1; // Mo=0 anchor
    d.setDate(weekStart.getDate() + dayOfWeek);
    return d;
  }, [selectedDay, weekStart]);

  const selectedWorkouts: WorkoutWithExercises[] = useMemo(() => {
    const workouts: WorkoutWithExercises[] = weekQuery.data ?? [];
    return workouts.filter((w: WorkoutWithExercises) => w.planned_date === localIso(selectedDate));
  }, [weekQuery.data, selectedDate]);

  const isShowingToday = selectedDay.isToday === true;

  const headerEntrance = useEntrance(0);
  const calendarEntrance = useEntrance(80);
  const heroEntrance = useEntrance(160);

  const profile = profileQuery.data;
  const fName = profile ? firstName(profile.full_name) : '…';
  const initials = profile ? initialsFor(profile.full_name) : '–';

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[2], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={headerEntrance}>
        <GreetingHeader firstName={fName} initials={initials} variant="dark" />
      </Animated.View>

      <View style={styles.body}>
        <Animated.View style={calendarEntrance}>
          <WeekStrip
            monthLabel={monthLabel}
            days={weekCells}
            selectedKey={`${selectedDay.weekday}-${selectedDay.dayNumber}`}
            onDayPress={(d) => setSelectedKey(`${d.weekday}-${d.dayNumber}`)}
          />
        </Animated.View>

        {weekQuery.isLoading ? (
          <LoadingHero />
        ) : weekQuery.error ? (
          <ErrorHero message="Konnte Workouts nicht laden." />
        ) : selectedWorkouts.length > 0 ? (
          <>
            {selectedWorkouts.map((w, idx) => (
              <View key={w.id} style={styles.workoutBlock}>
                {selectedWorkouts.length > 1 ? (
                  <Text style={styles.reizLabel}>
                    TRAININGSREIZ {idx + 1} / {selectedWorkouts.length}
                  </Text>
                ) : null}
                <Animated.View style={idx === 0 ? heroEntrance : undefined}>
                  {w.status === 'completed' ? (
                    <CompletedWorkoutCard
                      workout={w}
                      weekday={WEEKDAYS_FULL[selectedDate.getDay()]}
                      onPress={() => router.push(`/session/${w.id}`)}
                    />
                  ) : (
                    <WorkoutHeroCard
                      type={w.type}
                      title={w.title}
                      eyebrow={`${WEEKDAYS_FULL[selectedDate.getDay()].toUpperCase()} · ${workoutShortLabel(w.type)}`}
                      pills={buildPills(w)}
                      ctaLabel={
                        w.status === 'in_progress'
                          ? 'Session fortsetzen'
                          : isShowingToday
                            ? 'Session starten'
                            : 'Plan ansehen'
                      }
                      onCtaPress={() => router.push(`/session/${w.id}`)}
                    />
                  )}
                </Animated.View>

                {w.status !== 'completed' && w.coach_global_note ? (
                  <CoachQuoteCard
                    coachName="Patrick"
                    coachInitials="PS"
                    message={w.coach_global_note}
                  />
                ) : null}
              </View>
            ))}
          </>
        ) : (
          <Animated.View style={heroEntrance}>
            <RestDayCard date={selectedDate} isToday={isShowingToday} />
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
}

function buildPills(w: WorkoutWithExercises) {
  const pills: { icon: 'time-outline' | 'list-outline' | 'flame-outline'; label: string }[] = [];
  if (w.estimated_duration_min) {
    pills.push({ icon: 'time-outline', label: `${w.estimated_duration_min} Min` });
  }
  pills.push({ icon: 'list-outline', label: `${w.exercises.length} Übungen` });
  if (w.rpe_target) {
    pills.push({ icon: 'flame-outline', label: `RPE ${w.rpe_target}` });
  }
  return pills;
}

function LoadingHero() {
  return (
    <DarkGlassCard variant="standard" borderRadius={radius.xl}>
      <View style={styles.loadingBody}>
        <ActivityIndicator color={color.gold} />
      </View>
    </DarkGlassCard>
  );
}

function ErrorHero({ message }: { message: string }) {
  return (
    <DarkGlassCard variant="standard" borderRadius={radius.xl}>
      <View style={styles.errorBody}>
        <Ionicons name="alert-circle-outline" size={20} color={color.danger} />
        <Text style={styles.errorText}>{message}</Text>
      </View>
    </DarkGlassCard>
  );
}

function RestDayCard({ date, isToday }: { date: Date; isToday: boolean }) {
  const dayLabel = WEEKDAYS_FULL[date.getDay()];
  return (
    <DarkGlassCard variant="premium" borderRadius={radius.xl}>
      <View style={styles.restBody}>
        <Text style={styles.restEyebrow}>
          {dayLabel.toUpperCase()} · {date.getDate()}.
        </Text>
        <Text style={styles.restTitle}>{isToday ? 'Ruhetag' : 'Kein Training geplant'}</Text>
        <Text style={styles.restBodyText}>
          {isToday
            ? 'Heute kein PAA-Training. Erholung gehört dazu — schlaf gut, iss sauber.'
            : 'An diesem Tag steht kein PAA-Training auf dem Plan.'}
        </Text>
      </View>
    </DarkGlassCard>
  );
}

function CompletedWorkoutCard({
  workout,
  weekday,
  onPress,
}: {
  workout: WorkoutWithExercises;
  weekday: string;
  onPress: () => void;
}) {
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
    <Pressable onPress={onPress} style={({ pressed }) => [styles.completedCard, pressed && { opacity: 0.92 }]}>
      <View style={styles.completedHeader}>
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark" size={18} color={color.bg} />
        </View>
        <Text style={styles.completedEyebrow}>
          {weekday.toUpperCase()} · ABGESCHLOSSEN
        </Text>
      </View>

      <Text style={styles.completedTitle}>{workout.title}</Text>

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
        <Text style={styles.completedVolume}>
          {formatKg(totals.totalVolumeKg)} kg Gesamtvolumen
        </Text>
      ) : null}

      {workout.athlete_summary_notes ? (
        <View style={styles.completedNote}>
          <Ionicons name="chatbox-ellipses-outline" size={13} color={color.gold} />
          <Text style={styles.completedNoteText} numberOfLines={2}>
            {workout.athlete_summary_notes}
          </Text>
        </View>
      ) : null}

      <View style={styles.completedCta}>
        <Text style={styles.completedCtaLabel}>Werte ansehen oder anpassen</Text>
        <Ionicons name="arrow-forward" size={14} color={color.gold} />
      </View>
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
  scroll: {
    paddingHorizontal: 0,
  },
  body: {
    paddingHorizontal: space[5],
    gap: space[4],
    marginTop: space[3],
  },
  loadingBody: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    padding: space[5],
  },
  errorText: {
    fontFamily: font.family,
    fontSize: 14,
    color: color.danger,
  },
  restBody: {
    padding: space[5],
  },
  restEyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 2.6,
    marginBottom: space[2],
  },
  restTitle: {
    fontFamily: displaySerif as string,
    fontSize: 28,
    fontWeight: '400',
    fontStyle: 'italic',
    color: color.text,
    letterSpacing: -0.5,
    marginBottom: space[2],
  },
  restBodyText: {
    fontFamily: font.family,
    fontSize: 14,
    color: color.textMuted,
    lineHeight: 21,
  },
  workoutBlock: {
    gap: space[3],
    marginTop: space[3],
  },
  reizLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.6,
    paddingHorizontal: space[2],
    marginTop: space[2],
  },

  // Completed-Workout-Card
  completedCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.65)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.goldA30,
    paddingVertical: space[6],
    paddingHorizontal: space[5],
    gap: space[4],
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  completedBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedEyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.6,
  },
  completedTitle: {
    fontFamily: displaySerif as string,
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: space[3],
    paddingVertical: space[3],
    paddingHorizontal: space[3],
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
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
  completedVolume: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  completedNote: {
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
  completedNoteText: {
    flex: 1,
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 13,
    color: color.text,
    lineHeight: 19,
  },
  completedCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: space[2],
  },
  completedCtaLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 0.4,
  },
});
