import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { localIso, startOfWeek } from '@/lib/data/dates';
import { useWeekMatches, type MatchRow } from '@/lib/data/matches';
import { firstName, initialsFor, useMyProfile } from '@/lib/data/profile';
import { useWeekWorkouts, type WorkoutWithExercises } from '@/lib/data/workouts';
import { useEntrance } from '@/lib/design/animations/useEntrance';
import { CoachQuoteCard } from '@/lib/design/components/CoachQuoteCard';
import { CompletedWorkoutCard } from '@/lib/design/components/CompletedWorkoutCard';
import { DarkGlassCard } from '@/lib/design/components/DarkGlassCard';
import { GreetingHeader } from '@/lib/design/components/GreetingHeader';
import { MatchdayHeroCard } from '@/lib/design/components/MatchdayHeroCard';
import { WeekStrip, type DayCell } from '@/lib/design/components/WeekStrip';
import { WorkoutHeroCard } from '@/lib/design/components/WorkoutHeroCard';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { workoutShortLabel } from '@/lib/training/workoutTypes';

const WEEKDAYS_DE = ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'] as const;
const WEEKDAYS_FULL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] as const;
const MONTH_DE = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];

type DayItem =
  | {
      kind: 'workout';
      sortKey: number;
      workout: WorkoutWithExercises;
      workoutIndex: number;
      workoutTotal: number;
    }
  | { kind: 'match'; sortKey: number; match: MatchRow };

function parseTimeToMinutes(t: string | null | undefined): number | null {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function TrainingHeute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;

  const profileQuery = useMyProfile(userId);
  const weekQuery = useWeekWorkouts(userId);
  const matchesQuery = useWeekMatches(userId);

  const today = useMemo(() => new Date(), []);
  const todayIso = localIso(today);
  const weekStart = useMemo(() => startOfWeek(today), [today]);

  const [selectedKey, setSelectedKey] = useState<string>(`${WEEKDAYS_DE[today.getDay()]}-${today.getDate()}`);

  const weekCells: DayCell[] = useMemo(() => {
    const workouts: WorkoutWithExercises[] = weekQuery.data ?? [];
    const matches: MatchRow[] = matchesQuery.data ?? [];
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const iso = localIso(d);
      const dayWorkouts = workouts.filter((w: WorkoutWithExercises) => w.planned_date === iso);
      const dayMatches = matches.filter((m: MatchRow) => m.match_date === iso);

      let status: DayCell['status'] = 'rest';
      if (dayMatches.length > 0) {
        // Match überlagert Workout-Status — der Spieltag ist visuell der Anker
        status = 'matchday';
      } else if (dayWorkouts.length > 0) {
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
  }, [weekQuery.data, matchesQuery.data, weekStart, todayIso]);

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

  const selectedItems: DayItem[] = useMemo(() => {
    const dateIso = localIso(selectedDate);
    const workouts = (weekQuery.data ?? []).filter(
      (w: WorkoutWithExercises) => w.planned_date === dateIso
    );
    const matches = (matchesQuery.data ?? []).filter(
      (m: MatchRow) => m.match_date === dateIso
    );

    const totalWorkouts = workouts.length;
    const items: DayItem[] = [];

    workouts.forEach((w, idx) => {
      items.push({
        kind: 'workout',
        sortKey: (w.day_session_order ?? idx + 1) * 60,
        workout: w,
        workoutIndex: idx,
        workoutTotal: totalWorkouts,
      });
    });

    for (const m of matches) {
      items.push({
        kind: 'match',
        sortKey: parseTimeToMinutes(m.match_time) ?? 24 * 60,
        match: m,
      });
    }

    return items.sort((a, b) => a.sortKey - b.sortKey);
  }, [weekQuery.data, matchesQuery.data, selectedDate]);

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

        {weekQuery.isLoading || matchesQuery.isLoading ? (
          <LoadingHero />
        ) : weekQuery.error ? (
          <ErrorHero message="Konnte Workouts nicht laden." />
        ) : selectedItems.length > 0 ? (
          <>
            {selectedItems.map((item, idx) => {
              const isFirst = idx === 0;

              if (item.kind === 'match') {
                const m = item.match;
                return (
                  <View key={`match-${m.id}`} style={styles.workoutBlock}>
                    <Animated.View style={isFirst ? heroEntrance : undefined}>
                      <MatchdayHeroCard
                        eyebrow={`${WEEKDAYS_FULL[selectedDate.getDay()].toUpperCase()} · MATCHDAY`}
                        opponent={m.opponent}
                        matchTime={m.match_time}
                        location={m.location}
                        notes={m.notes}
                      />
                    </Animated.View>
                  </View>
                );
              }

              const w = item.workout;
              return (
                <View key={`workout-${w.id}`} style={styles.workoutBlock}>
                  {item.workoutTotal > 1 ? (
                    <Text style={styles.reizLabel}>
                      TRAININGSREIZ {item.workoutIndex + 1} / {item.workoutTotal}
                    </Text>
                  ) : null}
                  <Animated.View style={isFirst ? heroEntrance : undefined}>
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
                        onCtaPress={() =>
                          router.push(
                            isShowingToday || w.status === 'in_progress'
                              ? `/session/${w.id}`
                              : `/plan/${w.id}`,
                          )
                        }
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
              );
            })}
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
});
