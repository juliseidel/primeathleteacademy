/**
 * Nutrition Data Layer — Supabase-Queries via TanStack Query.
 *
 * Ablauf für „Heute":
 *   1. useTodayWorkoutCount + useTodayHasMatch + useTomorrowHasMatch
 *      → deriveDayType() liefert NutritionDayType
 *   2. useNutritionTemplate(dayType) → Template + Slots + Components + Snacks
 *   3. useTodaySupplementChecks → welche Daily-Routine-Items abgehakt sind
 *   4. useTodayWaterTotal → mL Summe
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Enums, Tables } from '@/lib/database.types';
import { localIso, todayLocalIso } from '@/lib/data/dates';
import { supabase } from '@/lib/supabase';

import type { NutritionDayType } from './dayType';

export type CoachFood = Tables<'coach_food_database'>;
export type DayTemplate = Tables<'nutrition_day_templates'>;
export type TemplateMeal = Tables<'nutrition_template_meals'>;
export type TemplateComponent = Tables<'nutrition_template_meal_components'> & {
  food: CoachFood | null;
};
export type TemplateSnack = Tables<'nutrition_template_snacks'> & {
  food: CoachFood | null;
};
export type DailySupplement = Tables<'nutrition_daily_supplements'>;
export type WaterLog = Tables<'athlete_water_log'>;

export type FullMeal = TemplateMeal & {
  components: TemplateComponent[];
  snacks: TemplateSnack[];
};

export type FullTemplate = DayTemplate & {
  meals: FullMeal[];
};

// ─────────────────────────────────────────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────────────────────────────────────────

/** Anzahl Trainingseinheiten heute (PAA + Team gezählt) */
export function useTodayWorkoutCount(athleteId: string | undefined) {
  const today = todayLocalIso();
  return useQuery<number>({
    queryKey: ['nutrition', 'workout-count', athleteId, today],
    enabled: !!athleteId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('workouts')
        .select('id', { count: 'exact', head: true })
        .eq('athlete_id', athleteId!)
        .eq('planned_date', today);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

/** Match an einem bestimmten Datum? */
export function useHasMatchOn(athleteId: string | undefined, dateIso: string) {
  return useQuery<boolean>({
    queryKey: ['nutrition', 'match', athleteId, dateIso],
    enabled: !!athleteId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('matches')
        .select('id', { count: 'exact', head: true })
        .eq('athlete_id', athleteId!)
        .eq('match_date', dateIso);
      if (error) throw error;
      return (count ?? 0) > 0;
    },
  });
}

/** Coach-Override für heute (kein Eintrag = auto) */
export function useTodayDayOverride(athleteId: string | undefined) {
  const today = todayLocalIso();
  return useQuery<NutritionDayType | null>({
    queryKey: ['nutrition', 'day-override', athleteId, today],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_nutrition_day')
        .select('override_template_type')
        .eq('athlete_id', athleteId!)
        .eq('plan_date', today)
        .maybeSingle();
      if (error) throw error;
      return (data?.override_template_type ?? null) as NutritionDayType | null;
    },
  });
}

/** Vollständiges Template für einen Tagestyp (inkl. Slots + Komponenten + Snacks + Foods) */
export function useNutritionTemplate(athleteId: string | undefined, dayType: NutritionDayType | undefined) {
  return useQuery<FullTemplate | null>({
    queryKey: ['nutrition', 'template', athleteId, dayType],
    enabled: !!athleteId && !!dayType,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nutrition_day_templates')
        .select(
          `
          *,
          meals:nutrition_template_meals(
            *,
            components:nutrition_template_meal_components(
              *,
              food:coach_food_database(*)
            ),
            snacks:nutrition_template_snacks(
              *,
              food:coach_food_database(*)
            )
          )
        `,
        )
        .eq('athlete_id', athleteId!)
        .eq('template_type', dayType!)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const t = data as unknown as FullTemplate;
      // Sortieren: Slots nach slot_order, Components nach (category, category_order),
      // Snacks nach snack_order
      return {
        ...t,
        meals: (t.meals ?? [])
          .slice()
          .sort((a, b) => a.slot_order - b.slot_order)
          .map((m) => ({
            ...m,
            components: (m.components ?? []).slice().sort((a, b) => {
              if (a.category !== b.category) {
                return CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
              }
              return a.category_order - b.category_order;
            }),
            snacks: (m.snacks ?? []).slice().sort((a, b) => a.snack_order - b.snack_order),
          })),
      };
    },
  });
}

const CATEGORY_ORDER: Enums<'nutrition_food_category'>[] = [
  'protein',
  'carb',
  'fat',
  'vegetable',
  'fruit',
  'sauce',
  'snack',
  'other',
];

/** Daily Routine ("The Difference") — globale + athlet-spezifische Items */
export function useDailySupplements(athleteId: string | undefined) {
  return useQuery<DailySupplement[]>({
    queryKey: ['nutrition', 'supplements', athleteId],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nutrition_daily_supplements')
        .select('*')
        .or(`athlete_id.is.null,athlete_id.eq.${athleteId!}`)
        .eq('is_archived', false)
        .order('priority', { ascending: true })
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Häkchen heute pro Supplement */
export function useTodaySupplementChecks(athleteId: string | undefined) {
  const today = todayLocalIso();
  return useQuery<Set<string>>({
    queryKey: ['nutrition', 'supplement-checks', athleteId, today],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_supplement_check')
        .select('supplement_id')
        .eq('athlete_id', athleteId!)
        .eq('check_date', today);
      if (error) throw error;
      return new Set((data ?? []).map((d) => d.supplement_id));
    },
  });
}

/** Toggle Supplement-Häkchen */
export function useToggleSupplementCheck(athleteId: string | undefined) {
  const qc = useQueryClient();
  const today = todayLocalIso();
  return useMutation({
    mutationFn: async ({ supplementId, checked }: { supplementId: string; checked: boolean }) => {
      if (!athleteId) throw new Error('Kein Athlete-ID');
      if (checked) {
        const { error } = await supabase.from('athlete_supplement_check').insert({
          athlete_id: athleteId,
          supplement_id: supplementId,
          check_date: today,
        });
        if (error && error.code !== '23505') throw error; // 23505 = unique violation = bereits gesetzt
      } else {
        const { error } = await supabase
          .from('athlete_supplement_check')
          .delete()
          .eq('athlete_id', athleteId)
          .eq('supplement_id', supplementId)
          .eq('check_date', today);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nutrition', 'supplement-checks', athleteId, today] });
    },
  });
}

/** Wasser-Tracker: Summe heute */
export function useTodayWaterTotal(athleteId: string | undefined) {
  const today = todayLocalIso();
  return useQuery<number>({
    queryKey: ['nutrition', 'water', athleteId, today],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_water_log')
        .select('amount_ml')
        .eq('athlete_id', athleteId!)
        .eq('log_date', today);
      if (error) throw error;
      return (data ?? []).reduce((acc, w) => acc + (w.amount_ml ?? 0), 0);
    },
  });
}

/** Wasser hinzufügen (250ml / 500ml / custom) */
export function useAddWater(athleteId: string | undefined) {
  const qc = useQueryClient();
  const today = todayLocalIso();
  return useMutation({
    mutationFn: async (amount_ml: number) => {
      if (!athleteId) throw new Error('Kein Athlete-ID');
      const { error } = await supabase.from('athlete_water_log').insert({
        athlete_id: athleteId,
        log_date: today,
        amount_ml,
        drink_type: 'water',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nutrition', 'water', athleteId, today] });
    },
  });
}

/** Wasser-Eintrag löschen — wird genutzt um zuletzt addierte Mengen zurückzunehmen */
export function useRemoveLastWater(athleteId: string | undefined) {
  const qc = useQueryClient();
  const today = todayLocalIso();
  return useMutation({
    mutationFn: async () => {
      if (!athleteId) throw new Error('Kein Athlete-ID');
      const { data, error } = await supabase
        .from('athlete_water_log')
        .select('id')
        .eq('athlete_id', athleteId)
        .eq('log_date', today)
        .order('log_time', { ascending: false })
        .limit(1);
      if (error) throw error;
      const last = data?.[0];
      if (!last) return;
      const { error: delErr } = await supabase.from('athlete_water_log').delete().eq('id', last.id);
      if (delErr) throw delErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nutrition', 'water', athleteId, today] });
    },
  });
}

/** Datum-Helper für die View — heute als "Mittwoch, 3. Mai" */
const WEEKDAYS_FULL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] as const;
const MONTHS_FULL = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
] as const;

export function formatDateLong(date: Date): string {
  return `${WEEKDAYS_FULL[date.getDay()]}, ${date.getDate()}. ${MONTHS_FULL[date.getMonth()]}`;
}

export function tomorrowIso(): string {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return localIso(t);
}
