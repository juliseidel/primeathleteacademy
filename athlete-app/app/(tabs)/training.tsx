import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/lib/design/components/GlassCard';
import { color, font, radius, space } from '@/lib/design/tokens';

const SUB_TABS = ['Heute', 'Woche', 'Historie'] as const;

export default function TrainingScreen() {
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
        <Text style={styles.eyebrow}>TRAINING</Text>
        <Text style={styles.headline}>Unterkörper · Kraft</Text>

        <Pills tabs={SUB_TABS} active={0} />

        <GlassCard variant="standard" style={styles.cardWide}>
          <Text style={styles.cardEyebrow}>WORKOUT 1 · 4 ÜBUNGEN</Text>
          <Text style={styles.cardTitle}>Heutige Einheit</Text>
          <Text style={styles.cardMeta}>~45 Minuten · RPE 7</Text>

          <View style={styles.exerciseList}>
            <ExerciseRow name="Squat" detail="4 × 8 · 80% 1RM" />
            <ExerciseRow name="Romanian Deadlift" detail="3 × 10" />
            <ExerciseRow name="Bulgarian Split Squat" detail="3 × 10 / Bein" />
            <ExerciseRow name="Calf Raise" detail="4 × 15" />
          </View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

function Pills({ tabs, active }: { tabs: readonly string[]; active: number }) {
  return (
    <View style={styles.pills}>
      {tabs.map((t, i) => {
        const focused = i === active;
        return (
          <View
            key={t}
            style={[
              styles.pill,
              focused
                ? { backgroundColor: color.goldA10, borderColor: color.goldA30 }
                : { borderColor: 'rgba(255,255,255,0.08)' },
            ]}
          >
            <Text
              style={{
                fontFamily: font.family,
                fontSize: 13,
                fontWeight: focused ? '600' : '500',
                color: focused ? color.gold : color.textMuted,
                letterSpacing: 0.4,
              }}
            >
              {t}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function ExerciseRow({ name, detail }: { name: string; detail: string }) {
  return (
    <View style={styles.exerciseRow}>
      <View style={styles.checkbox}>
        <Ionicons name="ellipse-outline" size={20} color={color.textMuted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.exerciseName}>{name}</Text>
        <Text style={styles.exerciseDetail}>{detail}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={22} color={color.gold} />
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
  },
  headline: {
    fontFamily: font.family,
    fontSize: 32,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
    marginBottom: space[4],
    letterSpacing: -0.4,
  },
  pills: { flexDirection: 'row', gap: space[2], marginBottom: space[2] },
  pill: {
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  cardWide: { width: '100%', padding: space[5] },
  cardEyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.4,
  },
  cardTitle: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
  },
  cardMeta: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    marginTop: space[1],
    marginBottom: space[4],
  },
  exerciseList: { gap: space[3] },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  checkbox: { width: 24, alignItems: 'center' },
  exerciseName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
  },
  exerciseDetail: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    marginTop: 2,
  },
});
