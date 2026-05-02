import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  { title: 'Meine Coaches', icon: 'people-outline', hint: 'Jonas Kehl & Patrick Schetter' },
  { title: 'Einstellungen', icon: 'settings-outline', hint: 'Push, Sprache, Account' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

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
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>RH</Text>
          </View>
          <Text style={styles.name}>Robin Heußer</Text>
          <Text style={styles.subline}>Mittelfeld · Eintracht Braunschweig · 2. BL</Text>

          <View style={styles.statsRow}>
            <Stat label="Trainings" value="48" />
            <Stat label="Streak" value="12" />
            <Stat label="Spiele" value="6" />
          </View>
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
      </ScrollView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: color.surfaceLight,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[3],
  },
  avatarText: {
    fontFamily: font.family,
    fontSize: 24,
    fontWeight: '700',
    color: color.gold,
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
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: space[5],
    paddingTop: space[4],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.gold,
  },
  statLabel: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
    letterSpacing: 1.2,
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
});
