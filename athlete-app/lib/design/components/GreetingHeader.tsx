import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { displaySerif, light, lightSpace } from '@/lib/design/light';
import { color, font } from '@/lib/design/tokens';

type Variant = 'light' | 'dark';

type Props = {
  firstName: string;
  initials: string;
  avatarUrl?: string | null;
  variant?: Variant;
  onProfilePress?: () => void;
  onCalendarPress?: () => void;
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 17) return 'Guten Mittag';
  if (h < 22) return 'Guten Abend';
  return 'Gute Nacht';
}

export function GreetingHeader({
  firstName,
  initials,
  variant = 'light',
  onProfilePress,
  onCalendarPress,
}: Props) {
  const palette = variant === 'light' ? lightPalette : darkPalette;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onProfilePress}
        style={({ pressed }) => [styles.left, pressed && { opacity: 0.7 }]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: palette.avatarBg, borderColor: palette.avatarBorder },
          ]}
        >
          <Text style={[styles.avatarText, { color: palette.avatarText }]}>{initials}</Text>
        </View>
        <View style={styles.greetingBlock}>
          <Text style={[styles.greeting, { color: palette.greeting }]}>{getGreeting()}</Text>
          <Text style={[styles.name, { color: palette.name, fontFamily: palette.nameFont }]}>
            {firstName}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onCalendarPress}
        style={({ pressed }) => [
          styles.actionBtn,
          { backgroundColor: palette.actionBg, borderColor: palette.actionBorder },
          pressed && { opacity: 0.6 },
        ]}
        hitSlop={8}
      >
        <Ionicons name="calendar-outline" size={18} color={palette.actionIcon} />
      </Pressable>
    </View>
  );
}

const darkPalette = {
  avatarBg: color.surfaceLight,
  avatarBorder: color.goldA30,
  avatarText: color.gold,
  greeting: color.textMuted,
  name: color.text,
  nameFont: font.family,
  actionBg: 'rgba(255,255,255,0.04)',
  actionBorder: 'rgba(255,255,255,0.08)',
  actionIcon: color.text,
} as const;

const lightPalette = {
  avatarBg: '#FFFFFF',
  avatarBorder: light.borderGold,
  avatarText: light.gold,
  greeting: light.textTertiary,
  name: light.text,
  // Display serif italic for the name — FEELY-style premium touch
  nameFont: displaySerif as string,
  actionBg: '#FFFFFF',
  actionBorder: light.border,
  actionIcon: light.text,
} as const;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: lightSpace.screenPadding,
    paddingVertical: lightSpace.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: lightSpace.md,
    flex: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  greetingBlock: {
    flex: 1,
  },
  greeting: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  name: {
    fontSize: 26,
    fontWeight: '400',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
