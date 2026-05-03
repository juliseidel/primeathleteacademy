import { StyleSheet, Text, View } from 'react-native';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { pct, type MacroBundle } from '@/lib/nutrition/macroCalc';

type Props = {
  /** Tagesziel — null bei Matchday (frei) */
  target: { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null };
  /** Aktueller Plan-Wert (Coach-Vorgabe Summe) */
  planned: MacroBundle;
  /** Optionale Notiz (z.B. "Glykogenspeicher füllen") */
  note?: string | null;
};

export function MacroProgress({ target, planned, note }: Props) {
  const isFree = !target.kcal;

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>TAGES-ZIEL</Text>

      {isFree ? (
        <>
          <Text style={styles.kcalFree}>Frei</Text>
          <Text style={styles.kcalUnitFree}>nach Gelüsten essen</Text>
        </>
      ) : (
        <>
          <View style={styles.kcalRow}>
            <Text style={styles.kcal}>{Math.round(planned.kcal).toLocaleString('de-DE')}</Text>
            <Text style={styles.kcalSeparator}>/</Text>
            <Text style={styles.kcalTarget}>{target.kcal?.toLocaleString('de-DE')}</Text>
            <Text style={styles.kcalUnit}>kcal</Text>
          </View>

          <View style={styles.macroRow}>
            <Macro label="Protein" planned={planned.protein} target={target.protein} unit="g" />
            <Macro label="Carbs" planned={planned.carbs} target={target.carbs} unit="g" />
            <Macro label="Fette" planned={planned.fat} target={target.fat} unit="g" />
          </View>
        </>
      )}

      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

function Macro({
  label,
  planned,
  target,
  unit,
}: {
  label: string;
  planned: number;
  target: number | null;
  unit: string;
}) {
  const percent = pct(planned, target);
  return (
    <View style={styles.macro}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>
        {Math.round(planned)}
        <Text style={styles.macroUnit}>{unit}</Text>
        {target ? <Text style={styles.macroTarget}> / {target}</Text> : null}
      </Text>
      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: color.goldA30,
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.6,
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: space[3],
    gap: 4,
  },
  kcal: {
    fontFamily: font.family,
    fontSize: 44,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -1.2,
  },
  kcalSeparator: {
    fontFamily: font.family,
    fontSize: 28,
    fontWeight: '300',
    color: color.textDim,
    paddingHorizontal: 4,
  },
  kcalTarget: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '500',
    color: color.textMuted,
  },
  kcalUnit: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '500',
    color: color.textMuted,
    marginLeft: space[2],
  },
  kcalFree: {
    fontFamily: displaySerif as string,
    fontSize: 36,
    fontStyle: 'italic',
    color: color.text,
    marginTop: space[3],
    letterSpacing: -0.6,
  },
  kcalUnitFree: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    marginTop: space[1],
  },
  macroRow: {
    flexDirection: 'row',
    gap: space[4],
    marginTop: space[5],
  },
  macro: { flex: 1 },
  macroLabel: {
    fontFamily: font.family,
    fontSize: 10,
    color: color.textMuted,
    letterSpacing: 1.4,
    fontWeight: '600',
  },
  macroValue: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
    marginTop: 4,
  },
  macroUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: color.textMuted,
  },
  macroTarget: {
    fontSize: 11,
    fontWeight: '500',
    color: color.textDim,
  },
  bar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    marginTop: space[2],
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: color.gold,
    borderRadius: 2,
  },
  note: {
    fontFamily: displaySerif as string,
    fontSize: 14,
    fontStyle: 'italic',
    color: color.gold,
    marginTop: space[4],
    letterSpacing: 0.2,
  },
});
