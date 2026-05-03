/**
 * MealSlotCard — Mahlzeit-Karte FEELY-Style mit vorausgefüllten Coach-Items.
 *
 * Layout:
 *   Header: Index-Pill (gold) + Slot-Name + Timing-Hint + Plus-Button rechts
 *   Body:   Items vom Coach-Plan (Bullet + Name + Menge/kcal rechts)
 *   Footer: kcal-Summe + "+ Hinzufügen"
 *
 * Premium: gold-tinted Background-Hint, gold Hairline für Items.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';
import { calcComponentMacros, sumMacros } from '@/lib/nutrition/macroCalc';
import type { FullMeal } from '@/lib/nutrition/nutritionData';

type Props = {
  index: number;
  slotLabel: string;
  meal: FullMeal | null;
  loggedKcal?: number;
  onAdd?: () => void;
  onOpen?: () => void;
};

export function MealSlotCard({ index, slotLabel, meal, loggedKcal = 0, onAdd, onOpen }: Props) {
  const componentMacros =
    meal?.components.map((c) => calcComponentMacros(c.food, Number(c.amount_g))) ?? [];
  const snackMacros =
    meal?.snacks.map((s) => calcComponentMacros(s.food, Number(s.amount_g))) ?? [];
  const total = sumMacros([...componentMacros, ...snackMacros]);
  const hasItems = (meal?.components.length ?? 0) + (meal?.snacks.length ?? 0) > 0;

  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.cardOuter, pressed && { opacity: 0.92 }]}>
      <LinearGradient
        colors={['rgba(197,165,90,0.05)', 'rgba(197,165,90,0)']}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.cardInner}>
        <View style={styles.header}>
          <View style={styles.indexPill}>
            <Text style={styles.indexText}>{String(index).padStart(2, '0')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.slotLabel}>{slotLabel}</Text>
            {meal?.timing_hint || (meal?.slot_label && meal.slot_label !== slotLabel) ? (
              <Text style={styles.timing}>
                {[meal?.slot_label !== slotLabel ? meal?.slot_label : null, meal?.timing_hint]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={onAdd}
            style={({ pressed }) => [styles.plusBtn, pressed && { opacity: 0.7 }]}
            hitSlop={6}
          >
            <Ionicons name="add" size={22} color={color.bg} />
          </Pressable>
        </View>

        {hasItems && meal ? (
          <View style={styles.itemsBlock}>
            {meal.components.map((c, i) => {
              const name = c.food?.name ?? c.food_name_override ?? '—';
              const amt = c.amount_display ?? `${Number(c.amount_g)}g`;
              const kcal = Math.round(componentMacros[i].kcal);
              return (
                <View key={c.id} style={styles.itemRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.itemName} numberOfLines={1}>
                    {name}
                  </Text>
                  <Text style={styles.itemAmount}>{amt}</Text>
                  {kcal > 0 ? <Text style={styles.itemKcal}>· {kcal} kcal</Text> : null}
                </View>
              );
            })}
            {meal.snacks.map((s, i) => {
              const name = s.food?.name ?? s.food_name_override ?? '—';
              const amt = s.amount_display ?? (Number(s.amount_g) > 0 ? `${Number(s.amount_g)}g` : '');
              const kcal = Math.round(snackMacros[i].kcal);
              return (
                <View key={s.id} style={styles.itemRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.itemName} numberOfLines={1}>
                    {name}
                  </Text>
                  {amt ? <Text style={styles.itemAmount}>{amt}</Text> : null}
                  {kcal > 0 ? <Text style={styles.itemKcal}>· {kcal} kcal</Text> : null}
                </View>
              );
            })}

            {meal.notes ? (
              <View style={styles.coachNote}>
                <Ionicons name="chatbox-ellipses" size={11} color={color.gold} />
                <Text style={styles.coachNoteText}>{meal.notes}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {loggedKcal > 0 ? (
              <Text style={styles.totalKcal}>
                {Math.round(loggedKcal)} <Text style={styles.totalKcalUnit}>kcal getrackt</Text>
              </Text>
            ) : total.kcal > 0 ? (
              <>
                <Text style={styles.totalKcal}>
                  {Math.round(total.kcal)} <Text style={styles.totalKcalUnit}>kcal Vorgabe</Text>
                </Text>
                <Text style={styles.totalMacros}>
                  {Math.round(total.protein)}P · {Math.round(total.carbs)}C · {Math.round(total.fat)}F
                </Text>
              </>
            ) : (
              <Text style={styles.emptyHint}>Noch nichts vom Coach geplant</Text>
            )}
          </View>
          <Pressable onPress={onAdd} hitSlop={6} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
            <Text style={styles.addLabel}>+ Hinzufügen</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.goldA20,
    backgroundColor: 'rgba(20,20,20,0.55)',
  },
  cardInner: {
    padding: space[5],
    gap: space[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  indexPill: {
    minWidth: 36,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 1.2,
  },
  slotLabel: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
  },
  timing: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 0.6,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsBlock: {
    gap: space[2],
    paddingTop: space[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.goldA20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: color.gold,
  },
  itemName: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '500',
    color: color.text,
    letterSpacing: 0.1,
  },
  itemAmount: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.text,
  },
  itemKcal: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
  },
  coachNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    borderRadius: radius.sm,
    backgroundColor: color.goldA04,
    borderWidth: 1,
    borderColor: color.goldA20,
    marginTop: space[1],
  },
  coachNoteText: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 11,
    fontStyle: 'italic',
    color: color.textMuted,
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  footerLeft: {
    flex: 1,
  },
  totalKcal: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.2,
  },
  totalKcalUnit: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  totalMacros: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  emptyHint: {
    fontFamily: font.family,
    fontSize: 12,
    fontStyle: 'italic',
    color: color.textDim,
  },
  addLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.2,
  },
});
