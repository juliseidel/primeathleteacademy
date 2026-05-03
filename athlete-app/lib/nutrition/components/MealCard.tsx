import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { calcComponentMacros, sumMacros, type MacroBundle } from '@/lib/nutrition/macroCalc';
import type { FullMeal, TemplateComponent, TemplateSnack } from '@/lib/nutrition/nutritionData';

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  protein: 'fitness-outline',
  carb: 'flame-outline',
  fat: 'water-outline',
  vegetable: 'leaf-outline',
  fruit: 'nutrition-outline',
  sauce: 'cafe-outline',
  snack: 'cafe-outline',
  other: 'ellipsis-horizontal',
};

const CATEGORY_LABEL: Record<string, string> = {
  protein: 'Protein',
  carb: 'Carbs',
  fat: 'Fett',
  vegetable: 'Gemüse',
  fruit: 'Obst',
  sauce: 'Soße',
  snack: 'Snack',
  other: 'Sonstiges',
};

export function MealCard({ meal, slotIndex }: { meal: FullMeal; slotIndex: number }) {
  const componentMacros = meal.components.map((c) => calcComponentMacros(c.food, Number(c.amount_g)));
  const snackMacros = meal.snacks.map((s) => calcComponentMacros(s.food, Number(s.amount_g)));
  const totalMacros = sumMacros([...componentMacros, ...snackMacros]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerMain}>
          <Text style={styles.slotIndex}>{String(slotIndex).padStart(2, '0')}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.slotLabel}>{meal.slot_label}</Text>
            {meal.timing_hint ? <Text style={styles.timing}>{meal.timing_hint}</Text> : null}
          </View>
        </View>
        {totalMacros.kcal > 0 ? (
          <View style={styles.kcalBadge}>
            <Text style={styles.kcalNumber}>{Math.round(totalMacros.kcal)}</Text>
            <Text style={styles.kcalUnit}>kcal</Text>
          </View>
        ) : null}
      </View>

      {meal.notes ? (
        <View style={styles.noteBox}>
          <Ionicons name="information-circle-outline" size={13} color={color.gold} />
          <Text style={styles.noteText}>{meal.notes}</Text>
        </View>
      ) : null}

      {/* Empty state — Matchday-Abendessen "nach Gelüsten" hat 0 Komponenten */}
      {meal.components.length === 0 && meal.snacks.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Ionicons name="moon-outline" size={16} color={color.textMuted} />
          <Text style={styles.emptyText}>Frei nach Gelüsten — keine Vorgabe</Text>
        </View>
      ) : null}

      {meal.components.length > 0 ? (
        <View style={styles.componentList}>
          {meal.components.map((c, i) => (
            <ComponentRow key={c.id} component={c} macros={componentMacros[i]} />
          ))}
        </View>
      ) : null}

      {meal.snacks.length > 0 ? (
        <View style={styles.componentList}>
          {meal.snacks.map((s, i) => (
            <SnackRow key={s.id} snack={s} macros={snackMacros[i]} />
          ))}
        </View>
      ) : null}

      {totalMacros.kcal > 0 ? (
        <View style={styles.macroFooter}>
          <MacroFootValue label="P" value={totalMacros.protein} unit="g" />
          <MacroFootValue label="C" value={totalMacros.carbs} unit="g" />
          <MacroFootValue label="F" value={totalMacros.fat} unit="g" />
        </View>
      ) : null}

      {meal.swap_hint ? (
        <View style={styles.swapHint}>
          <Ionicons name="swap-horizontal" size={11} color={color.textDim} />
          <Text style={styles.swapText}>{meal.swap_hint}</Text>
        </View>
      ) : null}
    </View>
  );
}

function ComponentRow({ component, macros }: { component: TemplateComponent; macros: MacroBundle }) {
  const name = component.food?.name ?? component.food_name_override ?? '—';
  const amount = component.amount_display ?? `${Number(component.amount_g)}g`;
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Ionicons name={CATEGORY_ICON[component.category] ?? 'ellipsis-horizontal'} size={13} color={color.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{CATEGORY_LABEL[component.category]}</Text>
        <Text style={styles.rowName}>{name}</Text>
        {component.notes ? <Text style={styles.rowNote}>{component.notes}</Text> : null}
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowAmount}>{amount}</Text>
        {macros.kcal > 0 ? <Text style={styles.rowKcal}>{Math.round(macros.kcal)} kcal</Text> : null}
      </View>
    </View>
  );
}

function SnackRow({ snack, macros }: { snack: TemplateSnack; macros: MacroBundle }) {
  const name = snack.food?.name ?? snack.food_name_override ?? '—';
  const amount = snack.amount_display ?? (Number(snack.amount_g) > 0 ? `${Number(snack.amount_g)}g` : '');
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Ionicons name="cafe-outline" size={13} color={color.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>Snack {snack.snack_order}</Text>
        <Text style={styles.rowName}>{name}</Text>
        {snack.hint ? <Text style={styles.rowNote}>{snack.hint}</Text> : null}
      </View>
      <View style={styles.rowRight}>
        {amount ? <Text style={styles.rowAmount}>{amount}</Text> : null}
        {macros.kcal > 0 ? <Text style={styles.rowKcal}>{Math.round(macros.kcal)} kcal</Text> : null}
      </View>
    </View>
  );
}

function MacroFootValue({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <View style={styles.macroFootItem}>
      <Text style={styles.macroFootLabel}>{label}</Text>
      <Text style={styles.macroFootValue}>
        {Math.round(value)}
        <Text style={styles.macroFootUnit}>{unit}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  headerMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  slotIndex: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 1.2,
    minWidth: 22,
  },
  slotLabel: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    color: color.text,
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  timing: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 0.4,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  kcalBadge: {
    alignItems: 'flex-end',
  },
  kcalNumber: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
  },
  kcalUnit: {
    fontFamily: font.family,
    fontSize: 10,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    borderRadius: radius.sm,
    backgroundColor: color.goldA04,
    borderWidth: 1,
    borderColor: color.goldA20,
  },
  noteText: {
    flex: 1,
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 13,
    color: color.text,
    lineHeight: 18,
  },
  emptyBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[2],
  },
  emptyText: {
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 14,
    color: color.textMuted,
  },
  componentList: {
    gap: space[1],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: space[2],
    gap: space[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    backgroundColor: color.goldA10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  rowLabel: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 1.6,
  },
  rowName: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '500',
    color: color.text,
    marginTop: 2,
  },
  rowNote: {
    fontFamily: font.family,
    fontSize: 11,
    fontStyle: 'italic',
    color: color.textMuted,
    marginTop: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  rowAmount: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.text,
  },
  rowKcal: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  macroFooter: {
    flexDirection: 'row',
    gap: space[5],
    paddingTop: space[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.goldA20,
  },
  macroFootItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[1],
  },
  macroFootLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 1.2,
  },
  macroFootValue: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.text,
  },
  macroFootUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
  },
  swapHint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingTop: space[2],
  },
  swapText: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 11,
    color: color.textDim,
    fontStyle: 'italic',
    lineHeight: 15,
  },
});
