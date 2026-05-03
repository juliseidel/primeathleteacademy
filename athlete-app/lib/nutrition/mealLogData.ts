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
const SKIP_NOTE_PREFIX = '__skip__:';

function slotNoteFor(slotKey: SlotKey): string {
  return `${SLOT_NOTE_PREFIX}${slotKey}`;
}

function skipNoteFor(kind: 'comp' | 'snack', itemId: string, slotKey: SlotKey): string {
  return `${SKIP_NOTE_PREFIX}${kind}:${itemId} ${slotNoteFor(slotKey)}`;
}

function parseSkipFromNotes(notes: string | null): { kind: 'comp' | 'snack'; itemId: string } | null {
  if (!notes) return null;
  const m = notes.match(/__skip__:(comp|snack):([\w-]+)/);
  if (!m) return null;
  return { kind: m[1] as 'comp' | 'snack', itemId: m[2] };
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
        .not('notes', 'ilike', `%${SKIP_NOTE_PREFIX}%`)
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
        .eq('is_deleted', false)
        .not('notes', 'ilike', `%${SKIP_NOTE_PREFIX}%`);
      if (error) throw error;
      return data ?? [];
    },
  });
}

/**
 * Set der vom Athlet "weggeskippten" Coach-Items für ein Datum.
 * Wird in NutritionHeute + MealDetail genutzt um geskippte Items
 * aus der Anzeige + Macro-Summe zu filtern.
 */
export function useCoachSkipsForDate(athleteId: string | undefined, dateIso: string) {
  return useQuery<{ comp: Set<string>; snack: Set<string> }>({
    queryKey: ['meal-log', athleteId, dateIso, 'skips'],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_meal_log')
        .select('notes')
        .eq('athlete_id', athleteId!)
        .eq('log_date', dateIso)
        .eq('is_deleted', false)
        .ilike('notes', `%${SKIP_NOTE_PREFIX}%`);
      if (error) throw error;
      const comp = new Set<string>();
      const snack = new Set<string>();
      for (const row of data ?? []) {
        const parsed = parseSkipFromNotes(row.notes);
        if (!parsed) continue;
        if (parsed.kind === 'comp') comp.add(parsed.itemId);
        else snack.add(parsed.itemId);
      }
      return { comp, snack };
    },
  });
}

export function useSkipCoachItem(athleteId: string | undefined, dateIso: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { slotKey: SlotKey; kind: 'comp' | 'snack'; itemId: string }) => {
      if (!athleteId) throw new Error('Athlete-ID fehlt');
      const notes = skipNoteFor(args.kind, args.itemId, args.slotKey);
      const { error } = await supabase.from('athlete_meal_log').insert({
        athlete_id: athleteId,
        log_date: dateIso,
        log_time: new Date().toTimeString().slice(0, 8),
        source: 'manual',
        display_name: '— Coach-Item übersprungen —',
        components: [],
        total_kcal: 0,
        total_protein_g: 0,
        total_carbs_g: 0,
        total_fat_g: 0,
        notes,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meal-log', athleteId, dateIso] });
    },
  });
}

/** Skip rückgängig machen (Coach-Item wieder anzeigen). */
export function useUnskipCoachItem(athleteId: string | undefined, dateIso: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { kind: 'comp' | 'snack'; itemId: string }) => {
      if (!athleteId) throw new Error('Athlete-ID fehlt');
      const skipFragment = `${SKIP_NOTE_PREFIX}${args.kind}:${args.itemId}`;
      const { error } = await supabase
        .from('athlete_meal_log')
        .update({ is_deleted: true })
        .eq('athlete_id', athleteId)
        .eq('log_date', dateIso)
        .ilike('notes', `%${skipFragment}%`);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meal-log', athleteId, dateIso] });
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

// ─────────────────────────────────────────────────────────────────────────────
// FEELY-Style "Zuletzt" + "Häufig" Tabs
// ─────────────────────────────────────────────────────────────────────────────

export type QuickPickItem = {
  displayName: string;
  source: MealLog['source'];
  macrosPer100g: { kcal: number; protein: number; carbs: number; fat: number };
  defaultAmountG: number;
  count?: number; // nur bei "frequent"
};

/** Letzte N einzigartige Logs (Deduplikation by display_name, neuester zuerst) */
export function useRecentLogs(athleteId: string | undefined, limit = 30) {
  return useQuery<QuickPickItem[]>({
    queryKey: ['meal-log', athleteId, 'recent', limit],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_meal_log')
        .select('*')
        .eq('athlete_id', athleteId!)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(150);
      if (error) throw error;
      const seen = new Set<string>();
      const out: QuickPickItem[] = [];
      for (const log of data ?? []) {
        const key = log.display_name.toLowerCase();
        if (seen.has(key)) continue;
        const meta = extractLogMeta(log);
        if (!meta) continue;
        seen.add(key);
        out.push({
          displayName: log.display_name,
          source: log.source,
          macrosPer100g: meta.macrosPer100g,
          defaultAmountG: meta.amountG,
        });
        if (out.length >= limit) break;
      }
      return out;
    },
  });
}

/** Häufigste N Logs (Gruppierung nach display_name, sortiert nach count) */
export function useFrequentLogs(athleteId: string | undefined, limit = 30) {
  return useQuery<QuickPickItem[]>({
    queryKey: ['meal-log', athleteId, 'frequent', limit],
    enabled: !!athleteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_meal_log')
        .select('*')
        .eq('athlete_id', athleteId!)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      const groups = new Map<string, { item: QuickPickItem; count: number }>();
      for (const log of data ?? []) {
        const key = log.display_name.toLowerCase();
        const existing = groups.get(key);
        if (existing) {
          existing.count += 1;
          continue;
        }
        const meta = extractLogMeta(log);
        if (!meta) continue;
        groups.set(key, {
          item: {
            displayName: log.display_name,
            source: log.source,
            macrosPer100g: meta.macrosPer100g,
            defaultAmountG: meta.amountG,
          },
          count: 1,
        });
      }
      return [...groups.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
        .map((g) => ({ ...g.item, count: g.count }));
    },
  });
}
