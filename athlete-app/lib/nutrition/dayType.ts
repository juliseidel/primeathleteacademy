/**
 * Tagestyp-Auto-Logik
 *
 * Leitet aus Trainingsplan + Spielterminen den passenden Ernährungs-Template-Typ
 * für einen Tag ab. Coach kann via athlete_nutrition_day.override_template_type
 * manuell überschreiben.
 *
 * Logik (Prio von oben nach unten):
 *   1. Match an diesem Tag → 'matchday'
 *   2. Match am Folgetag    → 'matchday_minus1'
 *   3. 2+ Trainingseinheiten an diesem Tag → 'two_sessions'
 *   4. 1 Trainingseinheit                   → 'one_session'
 *   5. Sonst                                → 'offday'
 *
 * Trainingseinheit zählt: jeder workout-Eintrag (egal ob day_role = paa_training,
 * teamtraining_vm oder teamtraining_nm). Einheit = Einheit.
 */

import type { Enums } from '@/lib/database.types';

export type NutritionDayType = Enums<'nutrition_day_type'>;

export type DayTypeInput = {
  /** Wie viele Trainingseinheiten (PAA + Team) an diesem Tag stehen */
  workoutCount: number;
  /** Match an diesem Datum geplant? */
  hasMatchToday: boolean;
  /** Match am Folgetag geplant? */
  hasMatchTomorrow: boolean;
  /** Coach-Override (NULL = auto) */
  override?: NutritionDayType | null;
};

export function deriveDayType(input: DayTypeInput): NutritionDayType {
  if (input.override) return input.override;
  if (input.hasMatchToday) return 'matchday';
  if (input.hasMatchTomorrow) return 'matchday_minus1';
  if (input.workoutCount >= 2) return 'two_sessions';
  if (input.workoutCount === 1) return 'one_session';
  return 'offday';
}

export const DAY_TYPE_LABEL: Record<NutritionDayType, string> = {
  offday: 'Ruhetag',
  one_session: '1 Trainingseinheit',
  two_sessions: '2 Trainingseinheiten',
  matchday_minus1: 'Tag vor Matchday',
  matchday: 'Matchday',
};

export const DAY_TYPE_SHORT: Record<NutritionDayType, string> = {
  offday: 'OFFDAY',
  one_session: '1 EINHEIT',
  two_sessions: '2 EINHEITEN',
  matchday_minus1: 'MATCHDAY -1',
  matchday: 'MATCHDAY',
};
