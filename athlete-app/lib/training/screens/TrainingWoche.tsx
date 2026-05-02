import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { addDays, localIso, startOfWeek } from '@/lib/data/dates';
import { useWeekMatches, type MatchRow } from '@/lib/data/matches';
import { useWeekWorkouts, type WorkoutWithExercises } from '@/lib/data/workouts';
import { WeekRowCard } from '@/lib/design/components/WeekRowCard';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

const WEEKDAYS_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as const;

type DayItem =
  | {
      kind: 'workout';
      sortKey: number;
      workout: WorkoutWithExercises;
      reizIndex: number;
      reizTotal: number;
    }
  | { kind: 'match'; sortKey: number; match: MatchRow };

type DayGroup = {
  iso: string;
  date: Date;
  weekday: string;
  dayLabel: string;
  isToday: boolean;
  isInPast: boolean;
  items: DayItem[];
};

function parseTimeToMinutes(t: string | null | undefined): number | null {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function TrainingWoche() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;

  const weekQuery = useWeekWorkouts(userId);
  const matchesQuery = useWeekMatches(userId);

  const today = useMemo(() => new Date(), []);
  const todayIso = localIso(today);
  const weekStart = useMemo(() => startOfWeek(today), [today]);

  const days: DayGroup[] = useMemo(() => {
    const workouts = weekQuery.data ?? [];
    const matches = matchesQuery.data ?? [];

    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(weekStart, i);
      const iso = localIso(d);
      const dayWorkouts = workouts.filter((w) => w.planned_date === iso);
      const dayMatches = matches.filter((m) => m.match_date === iso);

      const items: DayItem[] = [];
      const reizTotal = dayWorkouts.length;

      dayWorkouts.forEach((w, idx) => {
        items.push({
          kind: 'workout',
          sortKey: (w.day_session_order ?? idx + 1) * 60,
          workout: w,
          reizIndex: idx,
          reizTotal,
        });
      });

      for (const m of dayMatches) {
        items.push({
          kind: 'match',
          sortKey: parseTimeToMinutes(m.match_time) ?? 24 * 60,
          match: m,
        });
      }

      items.sort((a, b) => a.sortKey - b.sortKey);

      return {
        iso,
        date: d,
        weekday: WEEKDAYS_SHORT[d.getDay()],
        dayLabel: `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.`,
        isToday: iso === todayIso,
        isInPast: iso < todayIso,
        items,
      };
    });
  }, [weekQuery.data, matchesQuery.data, weekStart, todayIso]);

  const isLoading = weekQuery.isLoading || matchesQuery.isLoading;
  const isError = weekQuery.error;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[4], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>WOCHE</Text>
        <Text style={styles.headline}>Diese Woche</Text>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={color.gold} />
        </View>
      ) : isError ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={18} color={color.danger} />
          <Text style={styles.errorText}>Konnte Wochenplan nicht laden.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {days.map((day) => (
            <DayGroupRow
              key={day.iso}
              day={day}
              onPressWorkout={(w) => router.push(`/plan/${w.id}`)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function DayGroupRow({
  day,
  onPressWorkout,
}: {
  day: DayGroup;
  onPressWorkout: (w: WorkoutWithExercises) => void;
}) {
  return (
    <View style={styles.dayGroup}>
      <DayBadge
        weekday={day.weekday}
        dayLabel={day.dayLabel}
        isToday={day.isToday}
        isInPast={day.isInPast}
      />

      <View style={styles.dayContent}>
        {day.items.length === 0 ? (
          <RestCard />
        ) : (
          day.items.map((item) =>
            item.kind === 'match' ? (
              <WeekRowCard
                key={`match-${item.match.id}`}
                kind="match"
                opponent={item.match.opponent}
                matchTime={item.match.match_time}
                location={item.match.location}
                isToday={day.isToday}
              />
            ) : (
              <WeekRowCard
                key={`workout-${item.workout.id}`}
                kind="workout"
                workoutType={item.workout.type}
                title={item.workout.title}
                status={item.workout.status as 'planned' | 'in_progress' | 'completed' | 'skipped'}
                reizLabel={
                  item.reizTotal > 1
                    ? `TRAININGSREIZ ${item.reizIndex + 1} / ${item.reizTotal}`
                    : undefined
                }
                durationMin={item.workout.estimated_duration_min}
                exerciseCount={item.workout.exercises.length}
                isToday={day.isToday}
                onPress={() => onPressWorkout(item.workout)}
              />
            )
          )
        )}
      </View>
    </View>
  );
}

function DayBadge({
  weekday,
  dayLabel,
  isToday,
  isInPast,
}: {
  weekday: string;
  dayLabel: string;
  isToday: boolean;
  isInPast: boolean;
}) {
  return (
    <View style={styles.dayBadge}>
      <Text
        style={[
          styles.dayWeekday,
          isToday && { color: color.gold },
          isInPast && !isToday && { color: color.textDim },
        ]}
      >
        {weekday}
      </Text>
      <Text
        style={[
          styles.dayDate,
          isToday && { color: color.gold },
          isInPast && !isToday && { color: color.textDim, opacity: 0.7 },
        ]}
      >
        {dayLabel}
      </Text>
      {isToday ? <View style={styles.todayDot} /> : null}
    </View>
  );
}

function RestCard() {
  return (
    <View style={styles.restCard}>
      <Ionicons name="moon-outline" size={16} color={color.textMuted} />
      <Text style={styles.restText}>Ruhetag</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
    gap: space[4],
  },
  header: {
    marginBottom: space[2],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 3.2,
  },
  headline: {
    fontFamily: displaySerif as string,
    fontSize: 34,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    marginTop: space[2],
    letterSpacing: -0.6,
  },
  loading: {
    paddingVertical: space[8],
    alignItems: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[5],
    paddingHorizontal: space[4],
    borderRadius: radius.md,
    backgroundColor: 'rgba(220, 60, 60, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(220, 60, 60, 0.30)',
  },
  errorText: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.danger,
  },
  list: {
    gap: 0,
  },
  dayGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    paddingVertical: space[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  dayBadge: {
    width: 52,
    paddingTop: space[3],
    alignItems: 'center',
  },
  dayWeekday: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 0.6,
  },
  dayDate: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: color.gold,
    marginTop: 6,
  },
  dayContent: {
    flex: 1,
    gap: space[2],
  },
  restCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(20,20,20,0.4)',
  },
  restText: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
});
