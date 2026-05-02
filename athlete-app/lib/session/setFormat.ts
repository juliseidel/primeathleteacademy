import type { Tables } from '@/lib/database.types';

export type SetRow = Tables<'workout_exercise_sets'>;
export type LibraryRow = Tables<'exercise_library'>;

/**
 * Plan-Anzeige-Helpers — wandeln eine geplante Spezifikation in einen
 * lesbaren Text um, wie der Coach ihn geschrieben hat.
 */

export function formatPlannedReps(s: SetRow): string {
  if (s.planned_reps_label) return s.planned_reps_label;
  if (s.planned_reps_min != null && s.planned_reps_max != null) {
    return s.planned_reps_min === s.planned_reps_max
      ? String(s.planned_reps_min)
      : `${s.planned_reps_min}-${s.planned_reps_max}`;
  }
  if (s.planned_reps_min != null) return String(s.planned_reps_min);
  return '';
}

export function formatPlannedLoad(s: SetRow): string | null {
  if (s.planned_load_display) return s.planned_load_display;
  if (s.planned_load_kg != null) return `${formatNumber(s.planned_load_kg)}kg`;
  return null;
}

export function formatPlannedTime(s: SetRow): string | null {
  if (s.planned_time_sec == null) return null;
  if (s.planned_time_sec < 60) return `${s.planned_time_sec}s`;
  const min = Math.floor(s.planned_time_sec / 60);
  const sec = s.planned_time_sec % 60;
  return sec === 0 ? `${min}min` : `${min}:${String(sec).padStart(2, '0')}min`;
}

export function formatPlannedDistance(s: SetRow): string | null {
  if (s.planned_distance_m == null) return null;
  return `${formatNumber(s.planned_distance_m)}m`;
}

export function formatPlannedRest(s: SetRow): string | null {
  if (s.planned_rest_sec == null || s.planned_rest_sec === 0) return null;
  if (s.planned_rest_sec < 60) return `${s.planned_rest_sec}s`;
  const min = Math.floor(s.planned_rest_sec / 60);
  const sec = s.planned_rest_sec % 60;
  return sec === 0 ? `${min}min` : `${min}:${String(sec).padStart(2, '0')}min`;
}

/**
 * Eine kompakte Zeile, wie der Coach sie geschrieben hat —
 * "8 × 80kg" oder "5/5" (pro Seite) oder "30m / 4.12s"
 */
export function formatPlanCompact(s: SetRow, lib: LibraryRow): string {
  const reps = formatPlannedReps(s);
  const load = formatPlannedLoad(s);
  const time = formatPlannedTime(s);
  const dist = formatPlannedDistance(s);
  const perSide = lib.tracks_per_side;

  switch (lib.measurement_type) {
    case 'reps_weight':
      return load ? `${reps} × ${load}` : reps;
    case 'reps_only':
      return perSide ? `${reps}/${reps}` : reps;
    case 'time':
      return time ?? '';
    case 'distance':
      return dist ?? '';
    case 'distance_time':
      return [dist, time].filter(Boolean).join(' · ');
    case 'rounds':
      return `${reps} Runden`;
    case 'cardio':
      return time ?? '';
    default:
      return [reps, load, time, dist].filter(Boolean).join(' · ');
  }
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(n).replace('.', ',');
}
