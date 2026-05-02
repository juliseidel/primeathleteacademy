import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/lib/design/components/GlassCard';
import { color, font, space } from '@/lib/design/tokens';
import { HISTORY, WORKOUT_TYPE_LABEL } from '@/lib/training/mockData';

export function TrainingHistorie() {
  const insets = useSafeAreaInsets();

  // Group by week
  const byWeek = HISTORY.reduce<Record<number, typeof HISTORY>>((acc, s) => {
    if (!acc[s.weekNumber]) acc[s.weekNumber] = [];
    acc[s.weekNumber].push(s);
    return acc;
  }, {});
  const weekNumbers = Object.keys(byWeek).map(Number).sort((a, b) => b - a);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[4], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>HISTORIE</Text>
      <Text style={styles.headline}>Was du bisher gemacht hast</Text>

      {weekNumbers.map((wn) => (
        <View key={wn} style={styles.weekBlock}>
          <Text style={styles.weekLabel}>KW {wn}</Text>
          <View style={styles.list}>
            {byWeek[wn].map((s) => (
              <GlassCard key={s.id} variant="standard" style={styles.card}>
                <View style={styles.dateRow}>
                  <Text style={styles.date}>{s.date}</Text>
                  <Text style={styles.typeLabel}>{WORKOUT_TYPE_LABEL[s.type]}</Text>
                </View>
                <Text style={styles.title}>{s.title}</Text>
                <View style={styles.statsRow}>
                  <Stat icon="time-outline" label={`${s.durationMin} Min`} />
                  {s.totalVolumeKg ? (
                    <Stat icon="barbell-outline" label={`${s.totalVolumeKg.toLocaleString('de-DE')} kg`} />
                  ) : null}
                  <Stat
                    icon="checkmark-circle-outline"
                    label={`${s.setsCompleted}/${s.setsTotal} Sätze`}
                  />
                  {s.rpe ? <Stat icon="speedometer-outline" label={`RPE ${s.rpe}`} /> : null}
                </View>
                {s.coachReaction ? (
                  <View style={styles.coachReact}>
                    <Ionicons name="chatbubble-ellipses" size={14} color={color.gold} />
                    <Text style={styles.coachText} numberOfLines={2}>
                      &ldquo;{s.coachReaction}&rdquo;
                    </Text>
                  </View>
                ) : null}
              </GlassCard>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Stat({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={13} color={color.textMuted} />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
    gap: space[4],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 3.2,
  },
  headline: {
    fontFamily: font.family,
    fontSize: 30,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
    marginBottom: space[3],
    letterSpacing: -0.4,
  },
  weekBlock: { gap: space[2] },
  weekLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.4,
    marginTop: space[2],
    marginBottom: space[1],
  },
  list: { gap: space[2] },
  card: {
    width: '100%',
    padding: space[4],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space[2],
  },
  date: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  typeLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 1.6,
  },
  title: {
    fontFamily: font.family,
    fontSize: 17,
    fontWeight: '700',
    color: color.text,
    marginBottom: space[3],
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[3],
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.2,
  },
  coachReact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    marginTop: space[3],
    paddingTop: space[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(197,165,90,0.15)',
  },
  coachText: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 13,
    fontStyle: 'italic',
    color: color.text,
    lineHeight: 18,
  },
});
