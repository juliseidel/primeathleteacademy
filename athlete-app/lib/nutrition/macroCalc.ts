/**
 * Macro-Berechnung aus Komponenten und Snacks.
 *
 * Eingabe-Konvention: Coach-Datenbank pflegt Werte per 100g. Komponente speichert
 * `amount_g`. Ergebnis = (food.kcal_per_100g * amount_g / 100).
 *
 * Komponenten ohne food_id (food_name_override) werden auf 0 gesetzt — der
 * Coach hat sie als Freitext-Hinweis hinterlegt, ohne quantifizierbare Makros.
 */

export type MacroBundle = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodMacros = {
  kcal_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
};

export const ZERO_MACROS: MacroBundle = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

export function calcComponentMacros(food: FoodMacros | null, amount_g: number): MacroBundle {
  if (!food || !amount_g) return ZERO_MACROS;
  const factor = amount_g / 100;
  return {
    kcal: round1(food.kcal_per_100g * factor),
    protein: round1(food.protein_per_100g * factor),
    carbs: round1(food.carbs_per_100g * factor),
    fat: round1(food.fat_per_100g * factor),
  };
}

export function sumMacros(items: MacroBundle[]): MacroBundle {
  return items.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    ZERO_MACROS,
  );
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function pct(actual: number, target: number | null | undefined): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((actual / target) * 100));
}
