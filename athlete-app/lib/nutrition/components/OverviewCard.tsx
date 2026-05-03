/**
 * OverviewCard — "Übersicht" 1:1 wie FEELY in Schwarz/Gold-Premium.
 *
 * Layout: Settings-Icon rechts oben, semicircle-Gauge mit
 * Gegessen / Übrig / Verbrannt + 3 Macro-Bars unten.
 * Gauge wird IMMER angezeigt (auch bei Matchday — Fallback-Goal 2500).
 *
 * Premium-Detail: Macro-Bars haben subtile Gold-Variation
 * (Eiweiß = goldLight, Carbs = gold, Fett = goldDark) für hochwertigen Look.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, glow, radius, space } from '@/lib/design/tokens';
import { pct, type MacroBundle } from '@/lib/nutrition/macroCalc';

import { SemiCircleProgress } from './SemiCircleProgress';

const FALLBACK_KCAL = 2500;
const FALLBACK_PROTEIN = 150;
const FALLBACK_CARBS = 220;
const FALLBACK_FAT = 90;

type Props = {
  eaten: MacroBundle;
  burned: number;
  goal: { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null };
  onSettingsPress?: () => void;
};

export function OverviewCard({ eaten, burned, goal, onSettingsPress }: Props) {
  const goalKcal = goal.kcal ?? FALLBACK_KCAL;
  const goalProtein = goal.protein ?? FALLBACK_PROTEIN;
  const goalCarbs = goal.carbs ?? FALLBACK_CARBS;
  const goalFat = goal.fat ?? FALLBACK_FAT;

  return (
    <View style={styles.cardOuter}>
      <LinearGradient
        colors={['rgba(197,165,90,0.08)', 'rgba(197,165,90,0.02)', 'rgba(197,165,90,0)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.cardInner}>
        <View style={styles.header}>
          <Text style={styles.title}>Übersicht</Text>
          {onSettingsPress ? (
            <Pressable
              onPress={onSettingsPress}
              hitSlop={8}
              style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.6 }]}
            >
              <Ionicons name="settings-outline" size={16} color={color.gold} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.gaugeRow}>
          <View style={styles.sideStat}>
            <Text style={styles.sideValue}>{Math.round(eaten.kcal).toLocaleString('de-DE')}</Text>
            <Text style={styles.sideLabel}>Gegessen</Text>
          </View>

          <View style={styles.gaugeWrap}>
            <SemiCircleProgress current={eaten.kcal} goal={goalKcal} size={180} strokeWidth={12} />
          </View>

          <View style={styles.sideStat}>
            <Text style={styles.sideValue}>{Math.round(burned).toLocaleString('de-DE')}</Text>
            <Text style={styles.sideLabel}>Verbrannt</Text>
          </View>
        </View>

        <View style={styles.macroRow}>
          <Macro label="Eiweiß" current={eaten.protein} goal={goalProtein} accent={color.goldLight} />
          <Macro label="Kohlenhydrate" current={eaten.carbs} goal={goalCarbs} accent={color.gold} />
          <Macro label="Fett" current={eaten.fat} goal={goalFat} accent={color.goldDark} />
        </View>
      </View>
    </View>
  );
}

function Macro({
  label,
  current,
  goal,
  accent,
}: {
  label: string;
  current: number;
  goal: number;
  accent: string;
}) {
  const percent = pct(current, goal);
  return (
    <View style={styles.macro}>
      <View style={styles.macroValueRow}>
        <Text style={styles.macroCurrent}>{Math.round(current)}</Text>
        <Text style={styles.macroTarget}> / {goal}g</Text>
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.goldA30,
    backgroundColor: 'rgba(20,20,20,0.65)',
    ...glow.goldSoft,
  },
  cardInner: {
    padding: space[5],
    gap: space[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
  },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA30,
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space[2],
  },
  sideStat: {
    flex: 1,
    alignItems: 'center',
  },
  sideValue: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '600',
    color: color.text,
    letterSpacing: -0.4,
  },
  sideLabel: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 4,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  gaugeWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  macroRow: {
    flexDirection: 'row',
    gap: space[4],
    paddingTop: space[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.goldA20,
  },
  macro: {
    flex: 1,
    gap: space[1],
  },
  macroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  macroCurrent: {
    fontFamily: font.family,
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
  },
  macroTarget: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '500',
    color: color.textMuted,
  },
  macroLabel: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  bar: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
