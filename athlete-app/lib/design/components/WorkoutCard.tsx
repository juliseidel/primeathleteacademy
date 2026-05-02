import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';
import { WORKOUT_IMAGE_URL, WORKOUT_TYPE_LABEL, type WorkoutType } from '@/lib/training/mockData';

type Props = {
  type: WorkoutType;
  title: string;
  metaLeft?: string;
  metaRight?: string;
  cta?: string;
  onPress?: () => void;
  isMatchday?: boolean;
  isToday?: boolean;
  style?: ViewStyle;
  height?: number;
};

export function WorkoutCard({
  type,
  title,
  metaLeft,
  metaRight,
  cta,
  onPress,
  isMatchday,
  isToday,
  style,
  height = 200,
}: Props) {
  const eyebrow = isMatchday
    ? 'SPIELTAG'
    : isToday
      ? 'HEUTE'
      : WORKOUT_TYPE_LABEL[type].toUpperCase();

  const Container = onPress ? Pressable : View;

  return (
    <Container onPress={onPress} style={[styles.card, { height }, style]}>
      <Image
        source={WORKOUT_IMAGE_URL[type]}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <LinearGradient
        colors={['rgba(8,8,8,0.20)', 'rgba(8,8,8,0.60)', 'rgba(8,8,8,0.92)']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle gold border */}
      <View pointerEvents="none" style={styles.border} />

      <View style={styles.content}>
        <View style={styles.eyebrowRow}>
          {isMatchday ? (
            <Ionicons name="trophy" size={12} color={color.gold} style={{ marginRight: 6 }} />
          ) : null}
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {metaLeft || metaRight ? (
          <View style={styles.metaRow}>
            {metaLeft ? <Text style={styles.meta}>{metaLeft}</Text> : null}
            {metaLeft && metaRight ? <Text style={styles.metaSep}>·</Text> : null}
            {metaRight ? <Text style={styles.meta}>{metaRight}</Text> : null}
          </View>
        ) : null}

        {cta ? (
          <View style={styles.ctaRow}>
            <Text style={styles.cta}>{cta}</Text>
            <Ionicons name="chevron-forward" size={18} color={color.gold} />
          </View>
        ) : null}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: color.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(197,165,90,0.18)',
  },
  content: {
    flex: 1,
    padding: space[5],
    justifyContent: 'flex-end',
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 2.4,
  },
  title: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: space[2],
    flexWrap: 'wrap',
  },
  meta: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  metaSep: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textDim,
    marginHorizontal: 6,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space[4],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(197,165,90,0.20)',
  },
  cta: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 0.4,
  },
});
