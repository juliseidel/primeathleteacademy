import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Tables, TablesUpdate } from '@/lib/database.types';
import { addDays, localIso, startOfWeek, todayLocalIso } from '@/lib/data/dates';
import { supabase } from '@/lib/supabase';

export type LibraryRow = Tables<'exercise_library'>;
export type SetRow = Tables<'workout_exercise_sets'>;
export type ExerciseRow = Tables<'workout_exercises'> & {
  library: LibraryRow;
  sets: SetRow[];
};
export type WorkoutRow = Tables<'workouts'>;
export type WorkoutWithExercises = WorkoutRow & {
  exercises: ExerciseRow[];
};

function startOfWeekIso(date: Date = new Date()): string {
  return localIso(startOfWeek(date));
}

function addDaysIso(iso: string, days: number): string {
  // iso "YYYY-MM-DD" → parse als lokales Datum (nicht UTC!)
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d);
  return localIso(addDays(date, days));
}

async function fetchWorkoutsRange(athleteId: string, fromIso: string, toIso: string): Promise<WorkoutWithExercises[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      exercises:workout_exercises(
        *,
        library:exercise_library(*),
        sets:workout_exercise_sets(*)
      )
    `)
    .eq('athlete_id', athleteId)
    .eq('day_role', 'paa_training')
    .gte('planned_date', fromIso)
    .lte('planned_date', toIso)
    .order('planned_date', { ascending: true })
    .order('day_session_order', { ascending: true });

  if (error) throw error;

  const list = (data ?? []) as unknown as WorkoutWithExercises[];
  return list.map((w) => ({
    ...w,
    exercises: (w.exercises ?? [])
      .filter((e) => !e.is_archived)
      .slice()
      .sort((a, b) => a.order_index - b.order_index)
      .map((e) => ({
        ...e,
        sets: (e.sets ?? []).slice().sort((a, b) => a.set_number - b.set_number),
      })),
  }));
}

export function useTodayWorkouts(athleteId: string | undefined) {
  const today = todayLocalIso();
  return useQuery<WorkoutWithExercises[]>({
    queryKey: ['workouts', 'day', athleteId, today],
    enabled: !!athleteId,
    queryFn: () => fetchWorkoutsRange(athleteId!, today, today),
  });
}

export function useCompletedWorkoutsCount(athleteId: string | undefined) {
  return useQuery<number>({
    queryKey: ['workouts', 'completed-count', athleteId],
    enabled: !!athleteId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from('workouts')
        .select('id', { count: 'exact', head: true })
        .eq('athlete_id', athleteId!)
        .eq('status', 'completed');
      if (error) throw error;
      return count ?? 0;
    },
  });
}

export function useWeekWorkouts(athleteId: string | undefined, anchorDate?: Date) {
  const monday = startOfWeekIso(anchorDate);
  const sunday = addDaysIso(monday, 6);
  return useQuery<WorkoutWithExercises[]>({
    queryKey: ['workouts', 'week', athleteId, monday],
    enabled: !!athleteId,
    queryFn: () => fetchWorkoutsRange(athleteId!, monday, sunday),
  });
}

export function useWorkoutDetail(workoutId: string | undefined) {
  return useQuery<WorkoutWithExercises>({
    queryKey: ['workouts', 'detail', workoutId],
    enabled: !!workoutId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises:workout_exercises(
            *,
            library:exercise_library(*),
            sets:workout_exercise_sets(*)
          )
        `)
        .eq('id', workoutId!)
        .single();
      if (error) throw error;
      const w = data as unknown as WorkoutWithExercises;
      return {
        ...w,
        exercises: (w.exercises ?? [])
          .filter((e) => !e.is_archived)
          .slice()
          .sort((a, b) => a.order_index - b.order_index)
          .map((e) => ({
            ...e,
            sets: (e.sets ?? []).slice().sort((a, b) => a.set_number - b.set_number),
          })),
      };
    },
  });
}

export function useStartWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (workoutId: string) => {
      const { error } = await supabase
        .from('workouts')
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq('id', workoutId);
      if (error) throw error;
      return workoutId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useUpdateSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { setId: string; patch: TablesUpdate<'workout_exercise_sets'> }) => {
      const { error } = await supabase
        .from('workout_exercise_sets')
        .update(args.patch)
        .eq('id', args.setId);
      if (error) throw error;
      return args.setId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useSwapExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      oldWorkoutExerciseId: string;
      newLibraryId: string;
      workoutId: string;
    }) => {
      // Get old exercise (for plan copy)
      const { data: oldEx, error: getErr } = await supabase
        .from('workout_exercises')
        .select('*, sets:workout_exercise_sets(*)')
        .eq('id', args.oldWorkoutExerciseId)
        .single();
      if (getErr) throw getErr;

      // Insert new workout_exercises row
      const { data: newEx, error: insErr } = await supabase
        .from('workout_exercises')
        .insert({
          workout_id: args.workoutId,
          exercise_library_id: args.newLibraryId,
          order_index: oldEx.order_index,
          group_label: oldEx.group_label,
          focus: oldEx.focus,
          tempo: oldEx.tempo,
          coach_notes: null, // alte Notiz passt evtl. nicht zur neuen Übung
        })
        .select('id')
        .single();
      if (insErr) throw insErr;

      // Copy plan-only sets (no actuals) from old to new exercise
      const oldSets = (oldEx as unknown as { sets: Tables<'workout_exercise_sets'>[] }).sets ?? [];
      if (oldSets.length > 0 && newEx) {
        const newSets = oldSets
          .sort((a, b) => a.set_number - b.set_number)
          .map((s) => ({
            workout_exercise_id: newEx.id,
            set_number: s.set_number,
            side: s.side,
            planned_reps_min: s.planned_reps_min,
            planned_reps_max: s.planned_reps_max,
            planned_reps_label: s.planned_reps_label,
            planned_load_kg: s.planned_load_kg,
            planned_load_display: s.planned_load_display,
            planned_load_type: s.planned_load_type,
            planned_distance_m: s.planned_distance_m,
            planned_time_sec: s.planned_time_sec,
            planned_rest_sec: s.planned_rest_sec,
            planned_tempo: s.planned_tempo,
            completed: false,
          }));
        const { error: setsErr } = await supabase
          .from('workout_exercise_sets')
          .insert(newSets);
        if (setsErr) throw setsErr;
      }

      // Archive old exercise
      const { error: archErr } = await supabase
        .from('workout_exercises')
        .update({
          is_archived: true,
          archived_reason: 'swapped_by_athlete',
          replaced_by_exercise_id: newEx?.id,
          swapped_at: new Date().toISOString(),
          swapped_by: 'athlete',
        })
        .eq('id', args.oldWorkoutExerciseId);
      if (archErr) throw archErr;

      return newEx?.id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useDeleteSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (setId: string) => {
      const { error } = await supabase
        .from('workout_exercise_sets')
        .delete()
        .eq('id', setId);
      if (error) throw error;
      return setId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useAddSet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { workoutExerciseId: string }) => {
      const { data: existing, error: getErr } = await supabase
        .from('workout_exercise_sets')
        .select('*')
        .eq('workout_exercise_id', args.workoutExerciseId)
        .order('set_number', { ascending: false })
        .limit(1);
      if (getErr) throw getErr;

      const last = existing?.[0];
      const nextNum = last ? last.set_number + 1 : 1;

      const { error } = await supabase
        .from('workout_exercise_sets')
        .insert({
          workout_exercise_id: args.workoutExerciseId,
          set_number: nextNum,
          side: 'both',
          completed: false,
          planned_reps_min: last?.planned_reps_min ?? null,
          planned_reps_max: last?.planned_reps_max ?? null,
          planned_reps_label: last?.planned_reps_label ?? null,
          planned_load_kg: last?.planned_load_kg ?? null,
          planned_load_display: last?.planned_load_display ?? null,
          planned_load_type: last?.planned_load_type ?? null,
          planned_distance_m: last?.planned_distance_m ?? null,
          planned_time_sec: last?.planned_time_sec ?? null,
          planned_rest_sec: last?.planned_rest_sec ?? null,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useResetWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (workoutId: string) => {
      // Alle Sets zurück auf uncompleted (actuals bleiben — User kann sehen was er vorher hatte)
      // Plus: actuals löschen, damit komplett neu angefangen wird
      const { data: exData, error: exErr } = await supabase
        .from('workout_exercises')
        .select('id')
        .eq('workout_id', workoutId);
      if (exErr) throw exErr;
      const exerciseIds = (exData ?? []).map((e) => e.id);

      if (exerciseIds.length > 0) {
        const { error: setsErr } = await supabase
          .from('workout_exercise_sets')
          .update({
            completed: false,
            completed_at: null,
            actual_reps: null,
            actual_load_kg: null,
            actual_distance_m: null,
            actual_time_sec: null,
            actual_rpe: null,
            athlete_notes: null,
          })
          .in('workout_exercise_id', exerciseIds);
        if (setsErr) throw setsErr;
      }

      const { error } = await supabase
        .from('workouts')
        .update({ status: 'planned', started_at: null })
        .eq('id', workoutId);
      if (error) throw error;
      return workoutId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useSkipWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (workoutId: string) => {
      const { error } = await supabase
        .from('workouts')
        .update({ status: 'skipped' })
        .eq('id', workoutId);
      if (error) throw error;
      return workoutId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}

export function useFinishWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      workoutId: string;
      summary: Pick<TablesUpdate<'workouts'>, 'athlete_rpe' | 'athlete_energy' | 'athlete_summary_notes' | 'actual_duration_min'>;
    }) => {
      const { error } = await supabase
        .from('workouts')
        .update({
          ...args.summary,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', args.workoutId);
      if (error) throw error;
      return args.workoutId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workouts'] });
    },
  });
}
