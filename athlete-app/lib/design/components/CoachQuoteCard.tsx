import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DarkGlassCard } from './DarkGlassCard';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

type Props = {
  coachName: string;
  coachInitials: string;
  message: string;
  onPress?: () => void;
};

export function CoachQuoteCard({ coachName, coachInitials, message, onPress }: Props) {
  const Wrapper: typeof View | typeof Pressable = onPress ? Pressable : View;

  return (
    <Wrapper onPress={onPress}>
      <DarkGlassCard variant="premium" borderRadius={radius.xl}>
        <View style={styles.inner}>
          {/* Decorative quote mark, premium serif */}
          <Text style={styles.quoteMark}>“</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.divider} />

          <View style={styles.attribution}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{coachInitials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.coachName}>{coachName}</Text>
              <Text style={styles.coachLabel}>dein Coach</Text>
            </View>
          </View>
        </View>
      </DarkGlassCard>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: space[5],
    paddingTop: space[3],
    paddingBottom: space[5],
  },
  quoteMark: {
    fontFamily: displaySerif as string,
    fontSize: 56,
    color: color.gold,
    lineHeight: 56,
    marginBottom: -space[2],
    opacity: 0.85,
  },
  message: {
    fontFamily: displaySerif as string,
    fontSize: 19,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.3,
    lineHeight: 27,
    marginBottom: space[4],
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(197,165,90,0.20)',
    marginBottom: space[4],
  },
  attribution: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.surfaceLight,
    borderWidth: 1.5,
    borderColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.4,
  },
  coachName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.2,
  },
  coachLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
    letterSpacing: 1.4,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
