import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { matchdayImageSource, workoutImageSource, type WorkoutTypeDb } from '@/lib/training/workoutTypes';

type Location = 'home' | 'away' | 'neutral';
type WorkoutStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

type WorkoutProps = {
  kind: 'workout';
  workoutType: WorkoutTypeDb;
  title: string;
  status: WorkoutStatus;
  reizLabel?: string;
  durationMin?: number | null;
  exerciseCount?: number;
};

type MatchProps = {
  kind: 'match';
  opponent?: string | null;
  matchTime?: string | null;
  location: Location;
};

type Props = (WorkoutProps | MatchProps) & {
  isToday?: boolean;
  onPress?: () => void;
};

const CARD_HEIGHT = 144;

const LOCATION_LABEL: Record<Location, string> = {
  home: 'Heim',
  away: 'Auswärts',
  neutral: 'Neutral',
};

function formatMatchTime(time?: string | null): string | null {
  if (!time) return null;
  const parts = time.split(':');
  if (parts.length < 2) return null;
  return `${parts[0]}:${parts[1]} Uhr`;
}

function workoutTypeShort(type: WorkoutTypeDb): string {
  if (type === 'krafttraining_oberkoerper') return 'OBERKÖRPER';
  if (type === 'krafttraining_unterkoerper') return 'UNTERKÖRPER';
  return type.toUpperCase();
}

export function WeekRowCard(props: Props) {
  const { isToday, onPress } = props;
  const isPressable = typeof onPress === 'function';
  const Container = isPressable ? Pressable : View;

  const isCompleted = props.kind === 'workout' && props.status === 'completed';
  const isInProgress = props.kind === 'workout' && props.status === 'in_progress';

  const imageSource =
    props.kind === 'match'
      ? matchdayImageSource()
      : workoutImageSource(props.workoutType);

  const imageOpacity = isCompleted ? 0.58 : 0.82;

  return (
    <Container
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [
        styles.card,
        isToday && styles.cardToday,
        pressed && isPressable && { opacity: 0.93 },
      ]}
    >
      <View style={styles.darkBase} />

      <Image
        source={imageSource}
        style={[StyleSheet.absoluteFill, { opacity: imageOpacity }]}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <LinearGradient
        colors={['rgba(10,10,10,0.18)', 'rgba(10,10,10,0.50)', 'rgba(10,10,10,0.86)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.eyebrowRow}>
          <Eyebrow {...props} isCompleted={isCompleted} isInProgress={isInProgress} />
        </View>

        <Text
          style={[styles.title, isCompleted && { color: 'rgba(255,255,255,0.78)' }]}
          numberOfLines={2}
        >
          {props.kind === 'match'
            ? props.opponent && props.opponent.trim().length > 0
              ? props.opponent
              : 'Spieltag'
            : props.title}
        </Text>

        <MetaRow {...props} />
      </View>

      <View pointerEvents="none" style={[styles.border, isToday && styles.borderToday]} />

      {isPressable ? (
        <View pointerEvents="none" style={styles.chevron}>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.55)" />
        </View>
      ) : null}
    </Container>
  );
}

function Eyebrow(
  props: (WorkoutProps | MatchProps) & { isCompleted: boolean; isInProgress: boolean }
) {
  if (props.kind === 'match') {
    const time = formatMatchTime(props.matchTime);
    return (
      <Text style={styles.eyebrow} numberOfLines={1}>
        {time ? `MATCHDAY · ${time.replace(' Uhr', '')}` : 'MATCHDAY'}
      </Text>
    );
  }

  const parts: string[] = [];
  if (props.reizLabel) parts.push(props.reizLabel);
  parts.push(workoutTypeShort(props.workoutType));
  if (props.isCompleted) parts.push('ABGESCHLOSSEN');
  else if (props.isInProgress) parts.push('IN ARBEIT');

  return (
    <Text style={styles.eyebrow} numberOfLines={1}>
      {parts.join(' · ')}
    </Text>
  );
}

function MetaRow(props: WorkoutProps | MatchProps) {
  if (props.kind === 'match') {
    return (
      <View style={styles.metaRow}>
        <Ionicons
          name={
            props.location === 'home'
              ? 'home-outline'
              : props.location === 'away'
                ? 'navigate-outline'
                : 'flag-outline'
          }
          size={11}
          color="rgba(255,255,255,0.78)"
        />
        <Text style={styles.metaText}>{LOCATION_LABEL[props.location]}</Text>
      </View>
    );
  }

  const bits: string[] = [];
  if (props.durationMin) bits.push(`${props.durationMin} Min`);
  if (typeof props.exerciseCount === 'number' && props.exerciseCount > 0) {
    bits.push(`${props.exerciseCount} Übungen`);
  }
  if (bits.length === 0) return null;

  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaText}>{bits.join(' · ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: color.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 8,
  },
  cardToday: {
    shadowColor: color.gold,
    shadowOpacity: 0.45,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
  },
  darkBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A0A',
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(197,165,90,0.18)',
  },
  borderToday: {
    borderColor: color.goldA50,
    borderWidth: 1.5,
  },
  content: {
    flex: 1,
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    paddingRight: space[6],
    justifyContent: 'flex-end',
    gap: space[2],
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.4,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  title: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 26,
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  chevron: {
    position: 'absolute',
    right: space[4],
    top: '50%',
    marginTop: -8,
  },
});
