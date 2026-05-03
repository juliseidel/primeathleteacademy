/**
 * BLS Service — lokale Bundeslebensmittelschlüssel-Datenbank (~170 Foods)
 *
 * Schnelle Volltextsuche über Name + Synonyme + Tags.
 * Quelle: aus FEELY portiert (data/bls_database.json).
 */

import blsDatabase from './bls_database.json';

export type BlsPortion = { name: string; grams: number };

export type BlsFood = {
  id: string;
  name: string;
  synonyms: string[];
  category: string;
  nutrients_per_100g: {
    energy_kcal: number;
    protein: number;
    carbs: number;
    sugar?: number;
    fat: number;
    saturated_fat?: number;
    fiber?: number;
    salt?: number;
  };
  portions?: BlsPortion[];
  gi?: number;
  tags?: string[];
};

const ALL_FOODS = blsDatabase as BlsFood[];

export function getAllBlsFoods(): BlsFood[] {
  return ALL_FOODS;
}

export function searchBls(query: string, limit = 10): BlsFood[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const matches = ALL_FOODS.filter((food) => {
    if (food.name.toLowerCase().includes(q)) return true;
    if (food.synonyms?.some((s) => s.toLowerCase().includes(q))) return true;
    if (food.tags?.some((t) => t.toLowerCase().includes(q))) return true;
    return false;
  });

  // Prio: exakter Name-Start > Name enthält > Synonym-Match
  return matches
    .sort((a, b) => {
      const aStart = a.name.toLowerCase().startsWith(q);
      const bStart = b.name.toLowerCase().startsWith(q);
      if (aStart !== bStart) return aStart ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function findBlsById(id: string): BlsFood | null {
  return ALL_FOODS.find((f) => f.id === id) ?? null;
}
