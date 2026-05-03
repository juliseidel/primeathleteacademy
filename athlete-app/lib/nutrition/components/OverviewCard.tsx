/**
 * OverviewCard — FEELY-1:1-Layout in Dark.
 *
 * Layout (FEELY-konform, ohne "Verbrannt"):
 *   ┌──────────────────────────────────────┐
 *   │ Übersicht                       ⚙   │
 *   │                                       │
 *   │     Gegessen   ╭─────╮   Tagesziel  │
 *   │       905     │ 1495 │     2.400    │
 *   │              ╰─ übrig ╯              │
 *   │                                       │
 *   │  ───────────────────────────────────  │
 *   │  42 / 150g    64 / 240g    54 / 80g  │
 *   │  Eiweiß        Carbs         Fett    │
 *   │  ─grün──        ─amber──      ─lila─  │
 *   └──────────────────────────────────────┘
 */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';
import { pct, type MacroBundle } from '@/lib/nutrition/macroCalc';

import { SemiCircleProgress } from './SemiCircleProgress';

const FALLBACK_KCAL = 2500;
const FALLBACK_PROTEIN = 150;
const FALLBACK_CARBS = 220;
const FALLBACK_FAT = 90;

type Props = {
  eaten: MacroBundle;
  goal: { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null };
  onSettingsPress?: () => void;
};

export function OverviewCard({ eaten, goal, onSettingsPress }: Props) {
  const goalKcal = goal.kcal ?? FALLBACK_KCAL;
  const goalProtein = goal.protein ?? FALLBACK_PROTEIN;
  const goalCarbs = goal.carbs ?? FALLBACK_CARBS;
  const goalFat = goal.fat ?? FALLBACK_FAT;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Übersicht</Text>
        {onSettingsPress ? (
          <Pressable
            onPress={onSettingsPress}
            hitSlop={8}
            style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="settings-outline" size={18} color={color.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.gaugeRow}>
        <View style={styles.sideStat}>
          <Text style={styles.sideValue}>{Math.round(eaten.kcal).toLocaleString('de-DE')}</Text>
          <Text style={styles.sideLabel}>Gegessen</Text>
        </View>

        <View style={styles.gaugeWrap}>
          <SemiCircleProgress current={eaten.kcal} goal={goalKcal} size={200} strokeWidth={14} />
        </View>

        <View style={styles.sideStat}>
          <Text style={styles.sideValue}>{goalKcal.toLocaleString('de-DE')}</Text>
          <Text style={styles.sideLabel}>Tagesziel</Text>
        </View>
      </View>

      <View style={styles.macroRow}>
        <Macro
          label="Eiweiß"
          current={eaten.protein}
          goal={goalProtein}
          accent={color.macroProtein}
          trackBg={color.macroProteinA08}
        />
        <Macro
          label="Kohlenhydrate"
          current={eaten.carbs}
          goal={goalCarbs}
          accent={color.macroCarbs}
          trackBg={color.macroCarbsA08}
        />
        <Macro
          label="Fett"
          current={eaten.fat}
          goal={goalFat}
          accent={color.macroFat}
          trackBg={color.macroFatA08}
        />
      </View>
    </View>
  );
}

function Macro({
  label,
  current,
  goal,
  accent,
  trackBg,
}: {
  label: string;
  current: number;
  goal: number;
  accent: string;
  trackBg: string;
}) {
  const percent = pct(current, goal);
  return (
    <View style={styles.macro}>
      <View style={styles.macroValueRow}>
        <Text style={styles.macroCurrent}>{Math.round(current)}</Text>
        <Text style={styles.macroTarget}> / {goal}g</Text>
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={[styles.bar, { backgroundColor: trackBg }]}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: space[5],
    backgroundColor: color.blackA40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
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
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: space[2],
  },
  sideStat: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: space[1],
  },
  sideValue: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
  },
  sideLabel: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 4,
    letterSpacing: 0.2,
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
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  macro: {
    flex: 1,
    gap: 2,
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
    letterSpacing: 0.3,
  },
  bar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
