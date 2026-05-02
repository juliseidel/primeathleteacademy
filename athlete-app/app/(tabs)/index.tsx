import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { localIso } from '@/lib/data/dates';
import { useWeekMatches, type MatchRow } from '@/lib/data/matches';
import { firstName, initialsFor, useMyAthleteProfile, useMyProfile } from '@/lib/data/profile';
import {
  useCompletedWorkoutsCount,
  useTodayWorkouts,
  useWeekWorkouts,
} from '@/lib/data/workouts';
import { useEntrance } from '@/lib/design/animations/useEntrance';
import { HomeHeroCard, type HeroStat } from '@/lib/design/components/HomeHeroCard';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { workoutShortLabel } from '@/lib/training/workoutTypes';

const WEEKDAYS_FULL = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
] as const;
const MONTHS_FULL = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;

  const profileQuery = useMyProfile(userId);
  const athleteQuery = useMyAthleteProfile(userId);
  const todayQuery = useTodayWorkouts(userId);
  const weekQuery = useWeekWorkouts(userId);
  const matchesQuery = useWeekMatches(userId);
  const completedCountQuery = useCompletedWorkoutsCount(userId);

  const profile = profileQuery.data;
  const athlete = athleteQuery.data;
  const todayWorkouts = todayQuery.data ?? [];
  const weekWorkouts = weekQuery.data ?? [];
  const weekMatches = matchesQuery.data ?? [];
  const completedTotal = completedCountQuery.data ?? 0;

  const today = useMemo(() => new Date(), []);
  const todayIso = localIso(today);

  const dateLabel = useMemo(() => {
    const wd = WEEKDAYS_FULL[today.getDay()];
    const day = today.getDate();
    const month = MONTHS_FULL[today.getMonth()];
    return `${wd}, ${day}. ${month}`;
  }, [today]);

  const greeting = useMemo(() => {
    const h = today.getHours();
    if (h < 11) return 'Guten Morgen';
    if (h < 17) return 'Guten Mittag';
    return 'Guten Abend';
  }, [today]);

  // ── Stats berechnen ─────────────────────────────────────────────────────

  const todayMatch = weekMatches.find((m) => m.match_date === todayIso);
  const nextMatch = useMemo<MatchRow | null>(() => {
    return (
      weekMatches.find((m) => m.match_date >= todayIso) ?? null
    );
  }, [weekMatches, todayIso]);

  const trainingsCompletedThisWeek = weekWorkouts.filter((w) => w.status === 'completed').length;
  const trainingsTotalThisWeek = weekWorkouts.length;

  const stats = useMemo<HeroStat[]>(() => {
    const list: HeroStat[] = [];

    // 1. HEUTE — featured
    if (todayMatch) {
      list.push({
        icon: 'trophy-outline',
        eyebrow: 'HEUTE',
        value: 'Matchday',
        unit: formatMatchTime(todayMatch.match_time) ?? undefined,
        featured: true,
      });
    } else if (todayWorkouts.length > 0) {
      const first = todayWorkouts[0];
      const remaining = todayWorkouts.length > 1 ? ` +${todayWorkouts.length - 1}` : '';
      list.push({
        icon: 'barbell-outline',
        eyebrow: 'HEUTE',
        value: workoutShortLabel(first.type) + remaining,
        unit: first.estimated_duration_min ? `${first.estimated_duration_min} Min` : undefined,
        featured: true,
      });
    } else {
      list.push({
        icon: 'moon-outline',
        eyebrow: 'HEUTE',
        value: 'Ruhetag',
        featured: true,
      });
    }

    // 2. NÄCHSTER MATCH — featured
    if (nextMatch && nextMatch.match_date !== todayIso) {
      const days = daysBetween(todayIso, nextMatch.match_date);
      list.push({
        icon: 'flag-outline',
        eyebrow: 'NÄCHSTER MATCH',
        value: days === 1 ? '1' : `${days}`,
        unit: days === 1 ? 'Tag' : 'Tage',
        featured: true,
      });
    } else if (!todayMatch) {
      list.push({
        icon: 'flag-outline',
        eyebrow: 'NÄCHSTER MATCH',
        value: '—',
        featured: true,
      });
    }

    // 3. WOCHE — secondary
    list.push({
      icon: 'stats-chart-outline',
      eyebrow: 'DIESE WOCHE',
      value: `${trainingsCompletedThisWeek} / ${trainingsTotalThisWeek}`,
      unit: 'Trainings',
    });

    // 4. SESSIONS GESAMT — secondary
    list.push({
      icon: 'flame-outline',
      eyebrow: 'SESSIONS GESAMT',
      value: `${completedTotal}`,
      unit: 'absolviert',
    });

    return list.slice(0, 4);
  }, [todayMatch, todayWorkouts, nextMatch, todayIso, trainingsCompletedThisWeek, trainingsTotalThisWeek, completedTotal]);

  // ── Briefing aus heutigem Workout ─────────────────────────────────────

  const briefingMessage = useMemo(() => {
    const noted = todayWorkouts.find((w) => w.coach_global_note);
    if (noted?.coach_global_note) return noted.coach_global_note;
    if (todayMatch) return 'Heute Matchday — Routine, Fokus, Vertrauen. Du bist bereit.';
    if (todayWorkouts.length === 0) return 'Heute Ruhetag. Erholung gehört dazu — schlaf gut, iss sauber.';
    return null;
  }, [todayWorkouts, todayMatch]);

  // ── Entrance Animations ───────────────────────────────────────────────

  const heroEntrance = useEntrance(0);
  const briefingEntrance = useEntrance(120);
  const detailsEntrance = useEntrance(220);

  // ── Profile-Daten ─────────────────────────────────────────────────────

  const fName = profile ? firstName(profile.full_name) : '…';
  const initials = profile ? initialsFor(profile.full_name) : '–';

  const isLoading =
    profileQuery.isLoading ||
    athleteQuery.isLoading ||
    todayQuery.isLoading ||
    weekQuery.isLoading ||
    matchesQuery.isLoading;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + space[3],
          paddingBottom: 160,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.padded}>
          <Text style={styles.greeting}>
            {greeting}, <Text style={styles.greetingName}>{fName}</Text>
          </Text>
        </View>

        {isLoading ? (
          <View style={[styles.padded, styles.loadingBox]}>
            <ActivityIndicator color={color.gold} />
          </View>
        ) : (
          <>
            <Animated.View style={heroEntrance}>
              <HomeHeroCard
                eyebrow={`HEUTE · ${dateLabel.toUpperCase()}`}
                avatarDataUri={athlete?.avatar_data_uri ?? null}
                initials={initials}
                stats={stats}
                onCreateAvatar={() => router.push('/onboarding/avatar')}
              />
            </Animated.View>

            <View style={[styles.padded, styles.afterHero]}>
              {briefingMessage ? (
                <Animated.View style={[briefingEntrance, styles.briefingBlock]}>
                  <Text style={styles.briefingEyebrow}>BRIEFING · PATRICK</Text>
                  <Text style={styles.briefingMessage}>{briefingMessage}</Text>
                </Animated.View>
              ) : null}

              <Animated.View style={[detailsEntrance, styles.detailsList]}>
                {todayWorkouts.map((w) => (
                  <DetailCard
                    key={w.id}
                    icon="barbell"
                    eyebrow={`TRAINING · ${workoutShortLabel(w.type)}`}
                    title={w.title}
                    meta={[
                      w.estimated_duration_min ? `~${w.estimated_duration_min} Min` : null,
                      `${w.exercises.length} Übungen`,
                      w.rpe_target ? `RPE ${w.rpe_target}` : null,
                    ]}
                    onPress={() => router.push(`/session/${w.id}`)}
                  />
                ))}

                {nextMatch ? (
                  <DetailCard
                    icon="trophy"
                    eyebrow={
                      todayMatch === nextMatch
                        ? 'HEUTE · MATCHDAY'
                        : `NÄCHSTER MATCH · ${daysBetween(todayIso, nextMatch.match_date)} TAG${daysBetween(todayIso, nextMatch.match_date) === 1 ? '' : 'E'}`
                    }
                    title={
                      nextMatch.opponent && nextMatch.opponent.trim().length > 0
                        ? nextMatch.opponent
                        : 'Spieltag'
                    }
                    meta={[
                      locationLabel(nextMatch.location),
                      formatMatchTime(nextMatch.match_time),
                      formatMatchDate(nextMatch.match_date),
                    ]}
                  />
                ) : null}
              </Animated.View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Sub Components ───────────────────────────────────────────────────────

function DetailCard({
  icon,
  eyebrow,
  title,
  meta,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  eyebrow: string;
  title: string;
  meta: (string | null | undefined)[];
  onPress?: () => void;
}) {
  const inner = (
    <>
      <View style={styles.detailIconRow}>
        <View style={styles.detailIconBox}>
          <Ionicons name={icon} size={16} color={color.gold} />
        </View>
        <Text style={styles.detailEyebrow}>{eyebrow}</Text>
      </View>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailMeta}>
        {meta.filter((m): m is string => !!m).join(' · ')}
      </Text>
      {onPress ? (
        <View style={styles.detailChevron}>
          <Ionicons name="chevron-forward" size={16} color={color.gold} />
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.detailCard, pressed && { opacity: 0.94 }]}
      >
        {inner}
      </Pressable>
    );
  }
  return <View style={styles.detailCard}>{inner}</View>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso);
  const b = new Date(toIso);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatMatchTime(t: string | null): string | null {
  if (!t) return null;
  const parts = t.split(':');
  if (parts.length < 2) return null;
  return `${parts[0]}:${parts[1]} Uhr`;
}

function formatMatchDate(iso: string): string {
  const d = new Date(iso);
  const wd = WEEKDAYS_FULL[d.getDay()];
  return `${wd}, ${d.getDate()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.`;
}

function locationLabel(loc: 'home' | 'away' | 'neutral'): string {
  if (loc === 'home') return 'Heim';
  if (loc === 'away') return 'Auswärts';
  return 'Neutral';
}

// ─── Styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  padded: {
    paddingHorizontal: space[5],
  },
  afterHero: {
    gap: space[4],
    marginTop: space[2],
  },
  greeting: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.textMuted,
    letterSpacing: -0.3,
    marginBottom: space[3],
  },
  greetingName: {
    color: color.text,
  },
  loadingBox: {
    paddingVertical: space[8],
    alignItems: 'center',
  },
  detailsList: {
    gap: space[3],
  },
  detailCard: {
    paddingVertical: space[4],
    paddingHorizontal: space[5],
    borderRadius: radius.lg,
    backgroundColor: 'rgba(20,20,20,0.55)',
    borderWidth: 1,
    borderColor: color.goldA20,
    gap: space[2],
    position: 'relative',
  },
  detailIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  detailIconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailEyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.4,
  },
  detailTitle: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.4,
    lineHeight: 26,
    marginTop: space[1],
  },
  detailMeta: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  detailChevron: {
    position: 'absolute',
    right: space[4],
    top: '50%',
    marginTop: -8,
  },

  // Briefing als reiner Text-Block (kein Card)
  briefingBlock: {
    gap: space[2],
    paddingVertical: space[2],
    marginBottom: space[3],
  },
  briefingEyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.6,
  },
  briefingMessage: {
    fontFamily: displaySerif as string,
    fontSize: 19,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    lineHeight: 27,
    letterSpacing: -0.2,
  },
});
