import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEntrance } from '@/lib/design/animations/useEntrance';
import { CoachQuoteCard } from '@/lib/design/components/CoachQuoteCard';
import { DarkGlassCard } from '@/lib/design/components/DarkGlassCard';
import { GreetingHeader } from '@/lib/design/components/GreetingHeader';
import { WeekStrip, type DayCell } from '@/lib/design/components/WeekStrip';
import { WorkoutHeroCard } from '@/lib/design/components/WorkoutHeroCard';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { TODAY_WORKOUT } from '@/lib/training/mockData';

const WEEK_DAYS: DayCell[] = [
  { weekday: 'MO', dayNumber: 27, isInPast: true,  status: 'completed' },
  { weekday: 'DI', dayNumber: 28, isInPast: true,  status: 'completed' },
  { weekday: 'MI', dayNumber: 29, isInPast: true,  status: 'rest' },
  { weekday: 'DO', dayNumber: 30, isInPast: true,  status: 'completed' },
  { weekday: 'FR', dayNumber: 1,  isInPast: true,  status: 'completed' },
  { weekday: 'SA', dayNumber: 2,  isToday: true,   status: 'planned' },
  { weekday: 'SO', dayNumber: 3,  isInPast: false, status: 'rest' },
];

const dayKey = (d: DayCell) => `${d.weekday}-${d.dayNumber}`;

export function TrainingHeute() {
  const insets = useSafeAreaInsets();

  const todayDay = useMemo(() => WEEK_DAYS.find((d) => d.isToday) ?? WEEK_DAYS[0], []);
  const [selectedKey, setSelectedKey] = useState<string>(dayKey(todayDay));
  const selectedDay = useMemo(
    () => WEEK_DAYS.find((d) => dayKey(d) === selectedKey) ?? todayDay,
    [selectedKey, todayDay]
  );

  const isShowingToday = selectedDay.isToday === true;

  const headerEntrance = useEntrance(0);
  const calendarEntrance = useEntrance(80);
  const heroEntrance = useEntrance(160);
  const coachEntrance = useEntrance(260);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[2], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={headerEntrance}>
        <GreetingHeader firstName="Robin" initials="RH" variant="dark" />
      </Animated.View>

      <View style={styles.body}>
        <Animated.View style={calendarEntrance}>
          <WeekStrip
            monthLabel="APR – MAI 2026"
            days={WEEK_DAYS}
            selectedKey={selectedKey}
            onDayPress={(d) => setSelectedKey(dayKey(d))}
          />
        </Animated.View>

        <Animated.View style={heroEntrance}>
          {isShowingToday ? (
            <WorkoutHeroCard
              type={TODAY_WORKOUT.type}
              title={TODAY_WORKOUT.title}
              eyebrow={`SAMSTAG · ${TODAY_WORKOUT.type.toUpperCase()}`}
              pills={[
                { icon: 'time-outline', label: `${TODAY_WORKOUT.estimatedDurationMin} Min` },
                { icon: 'list-outline', label: `${TODAY_WORKOUT.exercises.length} Übungen` },
                ...(TODAY_WORKOUT.rpeTarget
                  ? [{ icon: 'flame-outline' as const, label: `RPE ${TODAY_WORKOUT.rpeTarget}` }]
                  : []),
              ]}
              ctaLabel="Session starten"
            />
          ) : (
            <OtherDayPreview day={selectedDay} />
          )}
        </Animated.View>

        {isShowingToday && TODAY_WORKOUT.coachNotes ? (
          <Animated.View style={coachEntrance}>
            <CoachQuoteCard
              coachName="Jonas"
              coachInitials="JK"
              message={TODAY_WORKOUT.coachNotes}
            />
          </Animated.View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function OtherDayPreview({ day }: { day: DayCell }) {
  const isRest = day.status === 'rest';
  const labelMap: Record<string, string> = {
    MO: 'Montag', DI: 'Dienstag', MI: 'Mittwoch', DO: 'Donnerstag',
    FR: 'Freitag', SA: 'Samstag', SO: 'Sonntag',
  };
  const fullDay = labelMap[day.weekday] ?? day.weekday;

  return (
    <DarkGlassCard variant="premium" borderRadius={radius.xl}>
      <View style={styles.previewBody}>
        <Text style={styles.previewEyebrow}>{fullDay.toUpperCase()} · {day.dayNumber}.</Text>
        <Text style={styles.previewTitle}>
          {isRest
            ? 'Ruhetag'
            : day.status === 'completed'
              ? 'Bereits trainiert'
              : day.status === 'matchday'
                ? 'Spieltag'
                : 'Geplant'}
        </Text>
        <Text style={styles.previewBodyText}>
          {isRest
            ? 'Erholung gehört zum Plan. Schlaf gut, iss sauber.'
            : day.status === 'completed'
              ? 'Schau dir die Details in der Historie an.'
              : 'Workout-Details werden vom Coach erstellt.'}
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
  previewBody: {
    padding: space[5],
  },
  previewEyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 2.6,
    marginBottom: space[2],
  },
  previewTitle: {
    fontFamily: displaySerif as string,
    fontSize: 28,
    fontWeight: '400',
    fontStyle: 'italic',
    color: color.text,
    letterSpacing: -0.5,
    marginBottom: space[2],
  },
  previewBodyText: {
    fontFamily: font.family,
    fontSize: 14,
    color: color.textMuted,
    lineHeight: 21,
  },
});
