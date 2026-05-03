/**
 * NutritionHeute — FEELY-Tracker-Layout in Premium-Schwarz/Gold.
 *
 * Reihenfolge:
 *   1. Header: ERNÄHRUNG + Quick-Actions (Wasser, Foto, Barcode)
 *   2. WeekCalendar (swipeable)
 *   3. Übersicht-Card (Gauge + Macro-Bars in Gold-Variation)
 *   4. "Kalorienziel anpassen"-Banner
 *   5. Mahlzeiten — Frühstück / Mittagessen / Abendessen + N Snacks,
 *      automatisch aus dem Coach-Plan vorausgefüllt
 *   6. Daily Routine ("The Difference") als Bonus
 *
 * Slot-Mapping: jeder Coach-Slot wird einer Standard-Mahlzeit zugeordnet
 * (Frühstück/Mittag/Abendessen) — Rest wird zu Snack 1, Snack 2, ...
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { todayLocalIso } from '@/lib/data/dates';
import { color, font, radius, space } from '@/lib/design/tokens';
import { deriveDayType } from '@/lib/nutrition/dayType';
import { sumMacros } from '@/lib/nutrition/macroCalc';
import { DailyRoutineCard } from '@/lib/nutrition/components/DailyRoutineCard';
import { MealSlotCard } from '@/lib/nutrition/components/MealSlotCard';
import { OverviewCard } from '@/lib/nutrition/components/OverviewCard';
import { WeekCalendar } from '@/lib/nutrition/components/WeekCalendar';
import { useMealLogForDate } from '@/lib/nutrition/mealLogData';
import {
  useAddWater,
  useDailySupplements,
  useHasMatchOn,
  useNutritionTemplate,
  useTodayDayOverride,
  useTodaySupplementChecks,
  useTodayWaterTotal,
  useTodayWorkoutCount,
  useToggleSupplementCheck,
  type FullMeal,
} from '@/lib/nutrition/nutritionData';

export function NutritionHeute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id;

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  });
  const [weekOffset, setWeekOffset] = useState(0);
  const todayIso = todayLocalIso();

  const workoutCountQuery = useTodayWorkoutCount(userId);
  const todayMatchQuery = useHasMatchOn(userId, isoOf(selectedDate));
  const tomorrowMatchQuery = useHasMatchOn(userId, isoOf(addDays(selectedDate, 1)));
  const overrideQuery = useTodayDayOverride(userId);

  const dayType = useMemo(() => {
    if (
      workoutCountQuery.isLoading ||
      todayMatchQuery.isLoading ||
      tomorrowMatchQuery.isLoading ||
      overrideQuery.isLoading
    ) {
      return undefined;
    }
    return deriveDayType({
      workoutCount: workoutCountQuery.data ?? 0,
      hasMatchToday: todayMatchQuery.data ?? false,
      hasMatchTomorrow: tomorrowMatchQuery.data ?? false,
      override: overrideQuery.data ?? null,
    });
  }, [
    workoutCountQuery.isLoading,
    workoutCountQuery.data,
    todayMatchQuery.isLoading,
    todayMatchQuery.data,
    tomorrowMatchQuery.isLoading,
    tomorrowMatchQuery.data,
    overrideQuery.isLoading,
    overrideQuery.data,
  ]);

  const templateQuery = useNutritionTemplate(userId, dayType);
  const supplementsQuery = useDailySupplements(userId);
  const supplementChecksQuery = useTodaySupplementChecks(userId);
  const waterQuery = useTodayWaterTotal(userId);
  const addWaterMut = useAddWater(userId);
  const toggleSuppMut = useToggleSupplementCheck(userId);
  const mealLogQuery = useMealLogForDate(userId, todayIso);

  const template = templateQuery.data;

  const standardSlots = useMemo(() => mapToStandardSlots(template?.meals ?? []), [template]);

  // Aggregierte Tages-Macros aus athlete_meal_log
  const eatenMacros = useMemo(() => {
    return sumMacros(
      (mealLogQuery.data ?? []).map((l) => ({
        kcal: Number(l.total_kcal ?? 0),
        protein: Number(l.total_protein_g ?? 0),
        carbs: Number(l.total_carbs_g ?? 0),
        fat: Number(l.total_fat_g ?? 0),
      })),
    );
  }, [mealLogQuery.data]);

  // Pro Slot: kcal getrackt
  const kcalBySlot = useMemo(() => {
    const map = new Map<string, number>();
    for (const log of mealLogQuery.data ?? []) {
      const noteMatch = (log.notes ?? '').match(/__slot__:([\w-]+)/);
      const key = noteMatch?.[1];
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + Number(log.total_kcal ?? 0));
    }
    return map;
  }, [mealLogQuery.data]);

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingTop: insets.top + space[3], paddingBottom: 160 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>ERNÄHRUNG</Text>
        <View style={styles.headerActions}>
          <WaterQuickAction totalMl={waterQuery.data ?? 0} onPress={() => addWaterMut.mutate(250)} />
          <ActionButton
            icon="camera"
            onPress={() =>
              Alert.alert('Foto-Tracking', 'Kommt in Welle 2 — Gemini-Vision-Analyse aus FEELY-Pipeline.')
            }
          />
          <ActionButton
            icon="barcode-outline"
            onPress={() =>
              Alert.alert('Barcode-Scanner', 'Kommt in Welle 2 — Open Food Facts ist schon eingebunden.')
            }
          />
        </View>
      </View>

      {/* 2. Week Calendar */}
      <View style={styles.section}>
        <WeekCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          weekOffset={weekOffset}
          onWeekChange={setWeekOffset}
        />
      </View>

      {/* 3. Übersicht */}
      <View style={styles.section}>
        <OverviewCard
          eaten={eatenMacros}
          goal={{
            kcal: template?.target_kcal ?? null,
            protein: template?.target_protein_g ?? null,
            carbs: template?.target_carbs_g ?? null,
            fat: template?.target_fat_g ?? null,
          }}
        />
      </View>

      {/* 4. Mahlzeiten */}
      <View style={styles.mealsSection}>
        <Text style={styles.mealsTitle}>Mahlzeiten</Text>
        <View style={styles.mealsList}>
          {standardSlots.map((slot, idx) => {
            const slotKey = slotKeyFor(slot.label, idx);
            const goToDetail = () =>
              router.push({
                pathname: '/nutrition/meal/[slotKey]',
                params: {
                  slotKey,
                  label: slot.label,
                  coachMealId: slot.coachMeal?.id ?? '',
                },
              });
            return (
              <MealSlotCard
                key={`${slot.label}-${idx}`}
                index={idx + 1}
                slotLabel={slot.label}
                meal={slot.coachMeal}
                loggedKcal={kcalBySlot.get(slotKey) ?? 0}
                onOpen={goToDetail}
                onAdd={goToDetail}
              />
            );
          })}
        </View>
      </View>

      {/* 6. Daily Routine */}
      {(supplementsQuery.data ?? []).length > 0 ? (
        <View style={styles.section}>
          <DailyRoutineCard
            supplements={supplementsQuery.data ?? []}
            checkedIds={supplementChecksQuery.data ?? new Set()}
            onToggle={(id, checked) => toggleSuppMut.mutate({ supplementId: id, checked })}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

// ─── Slot-Mapping ────────────────────────────────────────────────────
//
// Vom Coach kommen pro Tagestyp 4-5 Slots mit eigenen Namen
// (Frühstück, Mittag, Pre-Match Meal, Abendessen, Snacks, Meal Prep).
// Wir mappen das auf das Standard-FEELY-Layout:
//   Frühstück → Frühstück
//   Mittag oder Pre-Match Meal → Mittagessen
//   Abendessen → Abendessen
//   Rest (Snacks, Meal Prep, etc.) → Snack 1, Snack 2, …

type StandardSlot = {
  label: string;
  coachMeal: FullMeal | null;
};

function slotKeyFor(label: string, idx: number): string {
  if (label === 'Frühstück') return 'breakfast';
  if (label === 'Mittagessen') return 'lunch';
  if (label === 'Abendessen') return 'dinner';
  if (label.startsWith('Snack')) return label.toLowerCase().replace(' ', '-');
  return `slot-${idx + 1}`;
}

function mapToStandardSlots(coachMeals: FullMeal[]): StandardSlot[] {
  const result: StandardSlot[] = [
    { label: 'Frühstück', coachMeal: null },
    { label: 'Mittagessen', coachMeal: null },
    { label: 'Abendessen', coachMeal: null },
  ];
  const remaining: FullMeal[] = [];

  for (const meal of coachMeals) {
    const lower = meal.slot_label.toLowerCase();
    if (lower.includes('frühstück') && !result[0].coachMeal) {
      result[0].coachMeal = meal;
    } else if ((lower.includes('mittag') || lower.includes('pre-match')) && !result[1].coachMeal) {
      result[1].coachMeal = meal;
    } else if (lower.includes('abendessen') && !result[2].coachMeal) {
      result[2].coachMeal = meal;
    } else {
      remaining.push(meal);
    }
  }

  remaining.forEach((meal, i) => {
    result.push({ label: `Snack ${i + 1}`, coachMeal: meal });
  });

  return result;
}

// ─── Header-Components ─────────────────────────────────────────────

function WaterQuickAction({ totalMl, onPress }: { totalMl: number; onPress: () => void }) {
  const liters = (totalMl / 1000).toFixed(1).replace('.', ',');
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.waterPill, pressed && { opacity: 0.7 }]}>
      <Ionicons name="water" size={14} color={color.text} />
      <Text style={styles.waterText}>{totalMl > 0 ? `${liters} L` : '0'}</Text>
    </Pressable>
  );
}

function ActionButton({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]} hitSlop={6}>
      <Ionicons name={icon} size={18} color={color.text} />
    </Pressable>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function isoOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space[5],
  },
  headerTitle: {
    fontFamily: font.family,
    fontSize: 20,
    fontWeight: '900',
    color: color.text,
    letterSpacing: 0.4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  waterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space[3],
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: color.whiteA08,
    borderWidth: 1,
    borderColor: color.whiteA15,
  },
  waterText: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 0.2,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  section: {
    marginBottom: space[5],
  },
  mealsSection: {
    marginBottom: space[5],
    gap: space[3],
  },
  mealsTitle: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.4,
    marginTop: space[2],
  },
  mealsList: {
    gap: space[3],
  },
});
