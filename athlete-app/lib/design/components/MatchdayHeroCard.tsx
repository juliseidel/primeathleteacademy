import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { matchdayImageSource } from '@/lib/training/workoutTypes';

type Location = 'home' | 'away' | 'neutral';

type Props = {
  eyebrow: string;
  opponent?: string | null;
  matchTime?: string | null;
  location: Location;
  notes?: string | null;
};

const CARD_HEIGHT = 480;

const LOCATION_LABEL: Record<Location, string> = {
  home: 'HEIM',
  away: 'AUSWÄRTS',
  neutral: 'NEUTRAL',
};

const LOCATION_ICON: Record<Location, keyof typeof Ionicons.glyphMap> = {
  home: 'home-outline',
  away: 'navigate-outline',
  neutral: 'flag-outline',
};

function formatMatchTime(time?: string | null): string | null {
  if (!time) return null;
  // DB time format is "HH:MM:SS" or "HH:MM" — show "HH:MM Uhr"
  const parts = time.split(':');
  if (parts.length < 2) return null;
  return `${parts[0]}:${parts[1]} Uhr`;
}

export function MatchdayHeroCard({
  eyebrow,
  opponent,
  matchTime,
  location,
  notes,
}: Props) {
  const timeLabel = formatMatchTime(matchTime);
  const titleText = opponent && opponent.trim().length > 0 ? opponent : 'Spieltag';

  return (
    <View style={styles.card}>
      <View style={styles.darkBase} />

      <Image
        source={matchdayImageSource()}
        style={[StyleSheet.absoluteFill, styles.image]}
        contentFit="cover"
        transition={250}
        cachePolicy="memory-disk"
      />

      <LinearGradient
        colors={['rgba(10,10,10,0.62)', 'rgba(10,10,10,0.18)', 'rgba(10,10,10,0)']}
        locations={[0, 0.5, 1]}
        style={styles.topGradient}
      />

      <LinearGradient
        colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.58)', 'rgba(10,10,10,0.94)']}
        locations={[0, 0.5, 1]}
        style={styles.bottomGradient}
      />

      <View style={styles.topOverlay}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{titleText}</Text>
        {opponent && opponent.trim().length > 0 ? (
          <Text style={styles.subtitle}>Spieltag</Text>
        ) : null}
      </View>

      <View style={styles.bottomOverlay}>
        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Ionicons name={LOCATION_ICON[location]} size={12} color="#FFFFFF" />
            <Text style={styles.pillText}>{LOCATION_LABEL[location]}</Text>
          </View>
          {timeLabel ? (
            <View style={styles.pill}>
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text style={styles.pillText}>Anstoß {timeLabel}</Text>
            </View>
          ) : null}
        </View>

        {notes && notes.trim().length > 0 ? (
          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={14} color={color.gold} />
            <Text style={styles.noteText} numberOfLines={3}>
              {notes}
            </Text>
          </View>
        ) : null}
      </View>

      <View pointerEvents="none" style={styles.border} />
    </View>
  );
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
    opacity: 0.82,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
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
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 3.0,
    marginBottom: space[3],
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  title: {
    fontFamily: displaySerif as string,
    fontSize: 38,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 42,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
  subtitle: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.78)',
    letterSpacing: 1.4,
    marginTop: space[2],
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: space[5],
    gap: space[3],
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
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
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[3],
    paddingHorizontal: space[3],
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
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
});
