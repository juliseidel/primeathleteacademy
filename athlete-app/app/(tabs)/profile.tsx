import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { initialsFor, useMyAthleteProfile, useMyProfile } from '@/lib/data/profile';
import { GlassCard } from '@/lib/design/components/GlassCard';
import { color, font, radius, space } from '@/lib/design/tokens';

const SECTIONS: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  hint: string;
}[] = [
  { title: 'Mein Profil', icon: 'person-circle-outline', hint: 'Stammdaten, Sport, Position' },
  { title: 'Spieltermine', icon: 'calendar-outline', hint: 'Kommende & vergangene' },
  { title: 'Mein Fortschritt', icon: 'trending-up-outline', hint: 'Stats, Streak, Historie' },
  { title: 'Meine Coaches', icon: 'people-outline', hint: 'Jonas Kehl & Patrick Scheder' },
  { title: 'Einstellungen', icon: 'settings-outline', hint: 'Push, Sprache, Account' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session, signOut } = useAuth();
  const userId = session?.user.id;

  const profileQuery = useMyProfile(userId);
  const athleteQuery = useMyAthleteProfile(userId);

  const profile = profileQuery.data;
  const athlete = athleteQuery.data;

  const fullName = profile?.full_name ?? '...';
  const initials = profile ? initialsFor(profile.full_name) : '–';

  const subline = athlete
    ? [athlete.position, athlete.club, athlete.league].filter(Boolean).join(' · ')
    : '';

  const hasAvatar = !!athlete?.avatar_data_uri;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + space[4], paddingBottom: 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>PROFIL</Text>

        <GlassCard variant="premium" style={styles.headerCard}>
          <Pressable
            onPress={() => router.push('/onboarding/avatar')}
            style={({ pressed }) => [styles.avatarWrap, pressed && { opacity: 0.85 }]}
          >
            {hasAvatar ? (
              <Image source={{ uri: athlete!.avatar_data_uri! }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <View style={styles.avatarBadge}>
              <Ionicons
                name={hasAvatar ? 'pencil' : 'sparkles'}
                size={12}
                color={color.bg}
              />
            </View>
          </Pressable>
          <Text style={styles.name}>{fullName}</Text>
          {subline ? <Text style={styles.subline}>{subline}</Text> : null}
          {!hasAvatar ? (
            <Pressable
              onPress={() => router.push('/onboarding/avatar')}
              style={({ pressed }) => [styles.createAvatarBtn, pressed && { opacity: 0.92 }]}
            >
              <Ionicons name="sparkles" size={14} color={color.bg} />
              <Text style={styles.createAvatarLabel}>Avatar erstellen</Text>
            </Pressable>
          ) : null}
        </GlassCard>

        <View style={styles.list}>
          {SECTIONS.map((s) => (
            <GlassCard key={s.title} variant="standard" style={styles.row}>
              <View style={styles.iconBox}>
                <Ionicons name={s.icon} size={20} color={color.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{s.title}</Text>
                <Text style={styles.rowHint}>{s.hint}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={color.textDim} />
            </GlassCard>
          ))}
        </View>

        <Pressable
          onPress={() => signOut()}
          style={({ pressed }) => [styles.signOut, pressed && { opacity: 0.6 }]}
        >
          <Ionicons name="log-out-outline" size={18} color={color.danger} />
          <Text style={styles.signOutLabel}>Abmelden</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  scroll: { paddingHorizontal: space[5], gap: space[4] },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 3.2,
    marginBottom: space[4],
  },
  headerCard: {
    width: '100%',
    padding: space[6],
    alignItems: 'center',
  },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: space[3],
    position: 'relative',
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: color.surfaceLight,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: color.goldA50,
    backgroundColor: '#0A0A0A',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.gold,
    borderWidth: 2,
    borderColor: color.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: font.family,
    fontSize: 28,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.4,
  },
  createAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: space[3],
    paddingVertical: 10,
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  createAvatarLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  name: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
  },
  subline: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    marginTop: space[1],
    textAlign: 'center',
  },
  list: { gap: space[3] },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    padding: space[4],
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
  },
  rowHint: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    marginTop: 2,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    paddingVertical: space[4],
    marginTop: space[5],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(229, 90, 76, 0.25)',
  },
  signOutLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.danger,
    letterSpacing: 0.4,
  },
});
