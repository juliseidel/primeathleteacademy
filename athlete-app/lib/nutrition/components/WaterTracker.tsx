import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';

const DAILY_TARGET_ML = 3000;

type Props = {
  totalMl: number;
  onAdd: (amountMl: number) => void;
  onRemoveLast: () => void;
  busy?: boolean;
};

export function WaterTracker({ totalMl, onAdd, onRemoveLast, busy }: Props) {
  const liters = (totalMl / 1000).toFixed(1).replace('.', ',');
  const targetL = (DAILY_TARGET_ML / 1000).toFixed(1).replace('.', ',');
  const percent = Math.min(100, Math.round((totalMl / DAILY_TARGET_ML) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Ionicons name="water" size={16} color={color.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>WASSER</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amount}>
              {liters}
              <Text style={styles.amountUnit}> L</Text>
            </Text>
            <Text style={styles.amountTarget}>/ {targetL} L</Text>
          </View>
        </View>
        {totalMl > 0 ? (
          <Pressable
            onPress={onRemoveLast}
            disabled={busy}
            hitSlop={8}
            style={({ pressed }) => [styles.undoBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="arrow-undo" size={14} color={color.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.bar}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.btnRow}>
        <QuickButton label="+250 ml" onPress={() => onAdd(250)} disabled={busy} />
        <QuickButton label="+500 ml" onPress={() => onAdd(500)} disabled={busy} />
        <QuickButton label="+1 L" onPress={() => onAdd(1000)} disabled={busy} />
      </View>
    </View>
  );
}

function QuickButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.quickBtn, pressed && { opacity: 0.7 }, disabled && { opacity: 0.5 }]}
    >
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: color.goldA20,
    gap: space[3],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: color.goldA10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  amount: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
  },
  amountUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: color.textMuted,
  },
  amountTarget: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textDim,
  },
  undoBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: color.gold,
    borderRadius: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: space[2],
  },
  quickBtn: {
    flex: 1,
    paddingVertical: space[3],
    borderRadius: radius.pill,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
  },
  quickLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 0.4,
  },
});
