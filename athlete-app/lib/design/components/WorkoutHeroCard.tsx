import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';
import { displaySerif } from '@/lib/design/light';
import { workoutImageSource, workoutShortLabel, type WorkoutTypeDb } from '@/lib/training/workoutTypes';

type MetaPill = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

type Props = {
  type: WorkoutTypeDb;
  title: string;
  eyebrow?: string;
  pills?: MetaPill[];
  ctaLabel?: string;
  onCtaPress?: () => void;
};

const CARD_HEIGHT = 540;

export function WorkoutHeroCard({
  type,
  title,
  eyebrow,
  pills,
  ctaLabel = 'Session starten',
  onCtaPress,
}: Props) {
  const eyebrowText = eyebrow ?? workoutShortLabel(type);

  return (
    <View style={styles.card}>
      {/* Dark base — shows through the semi-transparent image */}
      <View style={styles.darkBase} />

      {/* Background image — semi-transparent to let dark base bleed through */}
      <Image
        source={workoutImageSource(type)}
        style={[StyleSheet.absoluteFill, styles.image]}
        contentFit="cover"
        transition={250}
        cachePolicy="memory-disk"
      />

      {/* Top dark wash — strong enough that the title is always crisp */}
      <LinearGradient
        colors={['rgba(10,10,10,0.78)', 'rgba(10,10,10,0.30)', 'rgba(10,10,10,0)']}
        locations={[0, 0.45, 1]}
        style={styles.topGradient}
      />

      {/* Bottom dark wash — for the action area */}
      <LinearGradient
        colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.65)', 'rgba(10,10,10,0.96)']}
        locations={[0, 0.55, 1]}
        style={styles.bottomGradient}
      />

      {/* Top text overlay */}
      <View style={styles.topOverlay}>
        <Text style={styles.eyebrow}>{eyebrowText}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Bottom action area — pills + CTA */}
      <View style={styles.bottomOverlay}>
        {pills && pills.length > 0 ? (
          <View style={styles.pillRow}>
            {pills.map((p) => (
              <View key={p.label} style={styles.pill}>
                <Ionicons name={p.icon} size={12} color="#FFFFFF" />
                <Text style={styles.pillText}>{p.label}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Pressable
          onPress={onCtaPress}
          style={({ pressed }) => [styles.cta, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
          <View style={styles.ctaIcon}>
            <Ionicons name="play" size={14} color={color.bg} />
          </View>
        </Pressable>
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
    opacity: 0.72,
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
    height: '50%',
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(197,165,90,0.22)',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: space[5],
    paddingTop: space[6],
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: space[5],
    gap: space[4],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: '#D4B96E',
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
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingVertical: 16,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  ctaLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  ctaIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(10,10,10,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
