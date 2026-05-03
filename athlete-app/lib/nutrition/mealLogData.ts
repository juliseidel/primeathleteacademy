/**
 * Meal Log Data Layer — getrackte Mahlzeiten in `athlete_meal_log`.
 *
 * Logik: jeder Slot (breakfast / lunch / dinner / snack-N) ist ein virtueller
 * Container. Der Slot-Key wird im Log als prefix in display_name verwendet
 * (z.B. "snack-1:Whey Protein") UND als notes-Feld gespeichert,
 * damit wir pro Slot filtern können.
 *
 * Quellen für Items im Detail-Screen:
 *   1. Coach-Plan (template_meal) — read-only, Athlet kann übernehmen
 *   2. Athlete-Meal-Log (athlete_meal_log) — selbst hinzugefügte/getauschte
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export type MealLog = Tables<'athlete_meal_log'>;

export type SlotKey = string; // 'breakfast' | 'lunch' | 'dinner' | 'snack-1' | 'snack-2' | …

const SLOT_NOTE_PREFIX = '__slot__:';

function slotNoteFor(slotKey: SlotKey): string {
  return `${SLOT_NOTE_PREFIX}${slotKey}`;
}

export function useMealLogForSlot(athleteId: string | undefined, dateIso: string, slotKey: SlotKey) {
  return useQuery<MealLog[]>({
    queryKey: ['meal-log', athleteId, dateIso, slotKey],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_meal_log')
        .select('*')
        .eq('athlete_id', athleteId!)
        .eq('log_date', dateIso)
        .eq('is_deleted', false)
        .ilike('notes', `%${slotNoteFor(slotKey)}%`)
        .order('log_time', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useMealLogForDate(athleteId: string | undefined, dateIso: string) {
  return useQuery<MealLog[]>({
    queryKey: ['meal-log', athleteId, dateIso, 'all'],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_meal_log')
        .select('*')
        .eq('athlete_id', athleteId!)
        .eq('log_date', dateIso)
        .eq('is_deleted', false);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export type AddMealArgs = {
  slotKey: SlotKey;
  displayName: string;
  source: 'coach_plan' | 'photo' | 'barcode' | 'search' | 'manual';
  templateMealId?: string | null;
  amountG: number;
  servings?: number; // multiplier; default 1
  /** Makros pro 100g — wir rechnen pro amountG */
  macrosPer100g: { kcal: number; protein: number; carbs: number; fat: number };
  notes?: string | null;
};

export function useAddMealLog(athleteId: string | undefined, dateIso: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: AddMealArgs) => {
      if (!athleteId) throw new Error('Athlete-ID fehlt');
      const factor = (args.amountG / 100) * (args.servings ?? 1);
      const totals = {
        total_kcal: round1(args.macrosPer100g.kcal * factor),
        total_protein_g: round1(args.macrosPer100g.protein * factor),
        total_carbs_g: round1(args.macrosPer100g.carbs * factor),
        total_fat_g: round1(args.macrosPer100g.fat * factor),
      };
      const notes = `${slotNoteFor(args.slotKey)}${args.notes ? ' · ' + args.notes : ''}`;
      const { error } = await supabase.from('athlete_meal_log').insert({
        athlete_id: athleteId,
        log_date: dateIso,
        log_time: new Date().toTimeString().slice(0, 8),
        source: args.source,
        template_meal_id: args.templateMealId ?? null,
        swapped_from_original: !!args.templateMealId,
        display_name: args.displayName,
        components: [
          {
            name: args.displayName,
            amount_g: args.amountG,
            servings: args.servings ?? 1,
            macros_per_100g: args.macrosPer100g,
          },
        ],
        ...totals,
        notes,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meal-log', athleteId, dateIso] });
    },
  });
}

export type UpdateMealLogArgs = {
  logId: string;
  amountG: number;
  servings?: number;
  macrosPer100g: { kcal: number; protein: number; carbs: number; fat: number };
};

export function useUpdateMealLog(athleteId: string | undefined, dateIso: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: UpdateMealLogArgs) => {
      if (!athleteId) throw new Error('Athlete-ID fehlt');
      const factor = (args.amountG / 100) * (args.servings ?? 1);
      const totals = {
        total_kcal: round1(args.macrosPer100g.kcal * factor),
        total_protein_g: round1(args.macrosPer100g.protein * factor),
        total_carbs_g: round1(args.macrosPer100g.carbs * factor),
        total_fat_g: round1(args.macrosPer100g.fat * factor),
      };
      const { error } = await supabase
        .from('athlete_meal_log')
        .update({
          ...totals,
          components: [
            {
              amount_g: args.amountG,
              servings: args.servings ?? 1,
              macros_per_100g: args.macrosPer100g,
            },
          ],
        })
        .eq('id', args.logId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meal-log', athleteId, dateIso] });
    },
  });
}

export function useDeleteMealLog(athleteId: string | undefined, dateIso: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('athlete_meal_log')
        .update({ is_deleted: true })
        .eq('id', logId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meal-log', athleteId, dateIso] });
    },
  });
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Helper: extract amount_g + macros from a logged meal */
export function extractLogMeta(log: MealLog): { amountG: number; servings: number; macrosPer100g: { kcal: number; protein: number; carbs: number; fat: number } } | null {
  const comps = log.components as
    | { amount_g?: number; servings?: number; macros_per_100g?: { kcal: number; protein: number; carbs: number; fat: number } }[]
    | null;
  if (!comps || comps.length === 0) return null;
  const c = comps[0];
  if (!c.macros_per_100g) return null;
  return {
    amountG: c.amount_g ?? 100,
    servings: c.servings ?? 1,
    macrosPer100g: c.macros_per_100g,
  };
}
