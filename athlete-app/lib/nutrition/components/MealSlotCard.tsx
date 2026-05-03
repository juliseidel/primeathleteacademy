/**
 * MealSlotCard — Mahlzeit-Karte FEELY-Style.
 *
 * Layout:
 *   Header: Slot-Name links + "X kcal" + Plus-Button rechts
 *   Body:   Items (Coach-Plan + Athleten-Logs) mit colored Macro-Dots
 *   Footer: Hinzufügen-Hinweis ODER "Noch nichts geplant"
 *
 * Total = Coach-Plan + Athleten-Logs (Coach zählt automatisch).
 */

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';
import { calcComponentMacros, sumMacros } from '@/lib/nutrition/macroCalc';
import { extractLogMeta, type MealLog } from '@/lib/nutrition/mealLogData';
import type { FullMeal } from '@/lib/nutrition/nutritionData';

type Props = {
  index: number;
  slotLabel: string;
  meal: FullMeal | null;
  loggedItems: MealLog[];
  /** Skip-Set: Coach-Items mit IDs in diesen Sets werden ausgeblendet */
  coachSkips?: { comp: Set<string>; snack: Set<string> };
  /** Check-Set: Coach-Items mit IDs in diesen Sets sind abgehakt (gelten als konsumiert) */
  coachChecks?: { comp: Set<string>; snack: Set<string> };
  onAdd?: () => void;
  onOpen?: () => void;
  onItemPress?: (itemId: string, kind: 'coach' | 'log') => void;
  onItemDelete?: (itemId: string, kind: 'coach-comp' | 'coach-snack' | 'log') => void;
  onItemCheckToggle?: (itemId: string, kind: 'coach-comp' | 'coach-snack', nowChecked: boolean) => void;
};

type Row = {
  key: string;
  itemId: string;
  kind: 'coach' | 'log';
  deleteKind: 'coach-comp' | 'coach-snack' | 'log';
  name: string;
  amount: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  isCoach: boolean;
  /** Coach-Items only: abgehakt? */
  checked: boolean;
};

export function MealSlotCard({
  slotLabel,
  meal,
  loggedItems,
  coachSkips,
  coachChecks,
  onAdd,
  onOpen,
  onItemPress,
  onItemDelete,
  onItemCheckToggle,
}: Props) {
  const skipComp = coachSkips?.comp ?? new Set<string>();
  const skipSnack = coachSkips?.snack ?? new Set<string>();
  const checkComp = coachChecks?.comp ?? new Set<string>();
  const checkSnack = coachChecks?.snack ?? new Set<string>();

  // Coach-Macros (visible only)
  const componentRows: Row[] =
    meal?.components
      .filter((c) => !skipComp.has(c.id))
      .map((c) => {
        const macros = calcComponentMacros(c.food, Number(c.amount_g));
        return {
          key: `comp-${c.id}`,
          itemId: c.id,
          kind: 'coach' as const,
          deleteKind: 'coach-comp' as const,
          name: c.food?.name ?? c.food_name_override ?? '—',
          amount: c.amount_display ?? `${Number(c.amount_g)}g`,
          kcal: macros.kcal,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          isCoach: true,
          checked: checkComp.has(c.id),
        };
      }) ?? [];
  const snackRows: Row[] =
    meal?.snacks
      .filter((s) => !skipSnack.has(s.id))
      .map((s) => {
        const macros = calcComponentMacros(s.food, Number(s.amount_g));
        return {
          key: `snack-${s.id}`,
          itemId: s.id,
          kind: 'coach' as const,
          deleteKind: 'coach-snack' as const,
          name: s.food?.name ?? s.food_name_override ?? '—',
          amount: s.amount_display ?? (Number(s.amount_g) > 0 ? `${Number(s.amount_g)}g` : ''),
          kcal: macros.kcal,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          isCoach: true,
          checked: checkSnack.has(s.id),
        };
      }) ?? [];

  // Athleten-Logs (zeigen ALLE Items, auch wenn 0 macros)
  const logRows: Row[] = loggedItems.map((log) => {
    const meta = extractLogMeta(log);
    const amt = meta ? `${meta.amountG}g${meta.servings > 1 ? ` × ${meta.servings}` : ''}` : '';
    return {
      key: `log-${log.id}`,
      itemId: log.id,
      kind: 'log' as const,
      deleteKind: 'log' as const,
      name: log.display_name,
      amount: amt,
      kcal: Number(log.total_kcal ?? 0),
      protein: Number(log.total_protein_g ?? 0),
      carbs: Number(log.total_carbs_g ?? 0),
      fat: Number(log.total_fat_g ?? 0),
      isCoach: false,
      checked: true, // Selbst getrackte Items zählen immer
    };
  });

  const allRows = [...componentRows, ...snackRows, ...logRows];
  // kcal-Total = nur Items die gegessen wurden (Coach abgehakt + alle Logs)
  const consumedRows = allRows.filter((r) => r.checked);
  const totals = sumMacros(consumedRows);
  const totalKcal = Math.round(totals.kcal);
  const hasItems = allRows.length > 0;

  return (
    <View style={styles.card}>
      <Pressable onPress={onOpen} style={({ pressed }) => [styles.header, pressed && { opacity: 0.7 }]}>
        <Text style={styles.slotLabel}>{slotLabel}</Text>
        <View style={styles.headerRight}>
          {totalKcal > 0 ? (
            <Text style={styles.totalKcal}>{totalKcal} kcal</Text>
          ) : null}
          <Pressable
            onPress={onAdd}
            style={({ pressed }) => [styles.plusBtn, pressed && { opacity: 0.7 }]}
            hitSlop={6}
          >
            <Ionicons name="add" size={20} color={color.bg} />
          </Pressable>
        </View>
      </Pressable>

      {hasItems ? (
        <View style={styles.itemsList}>
          {allRows.map((row, i) => {
            const isCoachUnchecked = row.isCoach && !row.checked;
            return (
              <View key={row.key} style={[styles.itemBlockOuter, i > 0 && styles.itemBlockDivider]}>
                {row.isCoach && onItemCheckToggle ? (
                  <Pressable
                    onPress={() =>
                      onItemCheckToggle(row.itemId, row.deleteKind as 'coach-comp' | 'coach-snack', !row.checked)
                    }
                    hitSlop={8}
                    style={({ pressed }) => [styles.itemCheckbox, pressed && { opacity: 0.5 }]}
                  >
                    <Ionicons
                      name={row.checked ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={row.checked ? color.macroProtein : color.textMuted}
                    />
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={() => onItemPress?.(row.itemId, row.kind)}
                  style={({ pressed }) => [styles.itemBlock, pressed && { opacity: 0.6 }]}
                >
                  <View style={styles.itemHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.itemName, isCoachUnchecked && styles.itemNamePlanned]}
                        numberOfLines={1}
                      >
                        {row.name}
                      </Text>
                      {row.amount ? (
                        <Text style={styles.itemAmount}>
                          {row.amount}
                          {isCoachUnchecked ? ' · geplant' : ''}
                        </Text>
                      ) : null}
                    </View>
                    {row.kcal > 0 ? (
                      <View style={styles.itemKcalWrap}>
                        <Text style={[styles.itemKcal, isCoachUnchecked && styles.itemKcalPlanned]}>
                          {Math.round(row.kcal)}
                        </Text>
                        <Text style={styles.itemKcalUnit}>kcal</Text>
                      </View>
                    ) : null}
                  </View>
                  {row.protein + row.carbs + row.fat > 0 ? (
                    <View style={styles.itemDots}>
                      <MacroDot color={color.macroProtein} value={`${Math.round(row.protein)}g`} />
                      <MacroDot color={color.macroCarbs} value={`${Math.round(row.carbs)}g`} />
                      <MacroDot color={color.macroFat} value={`${Math.round(row.fat)}g`} />
                    </View>
                  ) : null}
                </Pressable>
                {onItemDelete ? (
                  <Pressable
                    onPress={() => onItemDelete(row.itemId, row.deleteKind)}
                    hitSlop={10}
                    style={({ pressed }) => [styles.itemDeleteBtn, pressed && { opacity: 0.5 }]}
                  >
                    <Ionicons name="close-circle" size={22} color={color.textMuted} />
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        <Pressable onPress={onAdd} hitSlop={6} style={styles.emptyHintWrap}>
          <Text style={styles.emptyHint}>+ Hinzufügen</Text>
        </Pressable>
      )}
    </View>
  );
}

function MacroDot({ color: c, value }: { color: string; value: string }) {
  return (
    <View style={styles.macroDotWrap}>
      <View style={[styles.macroDot, { backgroundColor: c }]} />
      <Text style={styles.macroDotValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space[5],
    borderRadius: radius.lg,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  slotLabel: {
    fontFamily: font.family,
    fontSize: 20,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
  },
  totalKcal: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 0.1,
  },
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: color.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsList: {
    gap: 0,
  },
  itemBlockOuter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemBlock: {
    flex: 1,
    paddingVertical: space[3],
    gap: 6,
  },
  itemBlockDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  itemDeleteBtn: {
    paddingVertical: space[3],
    paddingLeft: space[2],
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  itemCheckbox: {
    paddingVertical: space[3],
    paddingRight: space[2],
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  itemNamePlanned: {
    color: color.textMuted,
  },
  itemKcalPlanned: {
    color: color.textMuted,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
    letterSpacing: -0.1,
  },
  itemAmount: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    marginTop: 2,
  },
  itemKcalWrap: {
    alignItems: 'flex-end',
    paddingLeft: space[3],
  },
  itemKcal: {
    fontFamily: font.family,
    fontSize: 17,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.3,
  },
  itemKcalUnit: {
    fontFamily: font.family,
    fontSize: 10,
    color: color.textMuted,
    marginTop: -2,
  },
  itemDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  macroDotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroDotValue: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.1,
  },
  emptyHintWrap: {
    paddingVertical: space[2],
  },
  emptyHint: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.macroProtein,
    letterSpacing: 0.1,
  },
});
