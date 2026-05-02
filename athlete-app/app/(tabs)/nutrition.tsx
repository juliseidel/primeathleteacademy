import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/lib/design/components/GlassCard';
import { color, font, radius, space } from '@/lib/design/tokens';

const SUB_TABS = ['Heute', 'Plan', 'Matchday', 'Historie'] as const;

export default function NutritionScreen() {
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
        <Text style={styles.eyebrow}>ERNÄHRUNG</Text>
        <Text style={styles.headline}>Heute</Text>

        <Pills tabs={SUB_TABS} active={0} />

        <GlassCard variant="premium" style={styles.cardWide}>
          <Text style={styles.cardEyebrow}>TAGES-ZIEL</Text>
          <Text style={styles.kcal}>2.450<Text style={styles.kcalUnit}> kcal</Text></Text>

          <View style={styles.macroRow}>
            <Macro label="Protein" value="180g" pct={62} />
            <Macro label="Kohlenh." value="240g" pct={45} />
            <Macro label="Fette" value="80g" pct={30} />
          </View>
        </GlassCard>

        <GlassCard variant="standard" style={styles.cardWide}>
          <View style={styles.iconRow}>
            <View style={styles.iconBox}>
              <Ionicons name="camera" size={18} color={color.gold} />
            </View>
            <Text style={styles.cardEyebrow}>MAHLZEIT TRACKEN</Text>
          </View>
          <Text style={styles.cardTitle}>Foto vom Teller</Text>
          <Text style={styles.cardMeta}>KI schätzt die Makros · du passt an</Text>
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

function Macro({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <View style={styles.macro}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
      <View style={styles.macroBar}>
        <View style={[styles.macroBarFill, { width: `${pct}%` }]} />
      </View>
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
  pills: { flexDirection: 'row', gap: space[2], marginBottom: space[2], flexWrap: 'wrap' },
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
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
  },
  cardMeta: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    marginTop: space[1],
  },
  kcal: {
    fontFamily: font.family,
    fontSize: 48,
    fontWeight: '700',
    color: color.text,
    marginTop: space[3],
    letterSpacing: -1,
  },
  kcalUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: color.textMuted,
  },
  macroRow: { flexDirection: 'row', gap: space[4], marginTop: space[5] },
  macro: { flex: 1 },
  macroLabel: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    letterSpacing: 1.2,
  },
  macroValue: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
    marginTop: space[1],
  },
  macroBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    marginTop: space[2],
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    backgroundColor: color.gold,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
