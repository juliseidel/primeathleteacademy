/**
 * Open Food Facts Service — Barcode-Lookup + Text-Suche
 *
 * Adaptiert aus FEELY (services/OpenFoodFactsService.js).
 * Public API, kein Key nötig. Returns nutrients per 100g.
 */

const API_BASE = 'https://world.openfoodfacts.org/api/v2';
const SEARCH_BASE = 'https://world.openfoodfacts.org/cgi/search.pl';
const USER_AGENT = 'Prime Athlete Academy - Mobile - https://primeathleteacademy.de';

export type OffNutrients = {
  energy_kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  saturated_fat: number | null;
  sugar: number | null;
  fiber: number | null;
  salt: number | null;
};

export type OffProduct = {
  barcode: string;
  name: string;
  brand: string;
  quantity: string;
  image: string | null;
  imageSmall: string | null;
  nutrients: OffNutrients;
  nutriscore_grade: string | null;
  nova_group: number | null;
  ingredients_text: string;
  allergens_tags: string[];
};

export type OffSearchResult = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  energy_kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  salt: number;
  nutri_score: string | null;
  nova_group: number | null;
  _source: 'openfoodfacts';
};

export async function getProductByBarcode(
  barcode: string,
): Promise<{ success: true; product: OffProduct } | { success: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/product/${barcode}.json`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok) return { success: false, error: `API ${res.status}` };

    const data = await res.json();
    if (data.status !== 1 || !data.product) {
      return { success: false, error: 'Produkt nicht in Datenbank gefunden' };
    }

    const p = data.product;
    return {
      success: true,
      product: {
        barcode,
        name: p.product_name_de || p.product_name || 'Unbekanntes Produkt',
        brand: p.brands || '',
        quantity: p.quantity || '',
        image: p.image_front_url || p.image_url || null,
        imageSmall: p.image_front_small_url || p.image_small_url || null,
        nutrients: {
          energy_kcal: p.nutriments?.['energy-kcal_100g'] ?? null,
          protein: p.nutriments?.proteins_100g ?? null,
          carbs: p.nutriments?.carbohydrates_100g ?? null,
          fat: p.nutriments?.fat_100g ?? null,
          saturated_fat: p.nutriments?.['saturated-fat_100g'] ?? null,
          sugar: p.nutriments?.sugars_100g ?? null,
          fiber: p.nutriments?.fiber_100g ?? null,
          salt: p.nutriments?.salt_100g ?? null,
        },
        nutriscore_grade: p.nutriscore_grade?.toUpperCase() || null,
        nova_group: p.nova_group ?? null,
        ingredients_text: p.ingredients_text_de || p.ingredients_text || '',
        allergens_tags: p.allergens_tags || [],
      },
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Netzwerkfehler' };
  }
}

export async function searchProducts(
  query: string,
  page = 1,
  pageSize = 20,
): Promise<{ success: true; products: OffSearchResult[]; total: number } | { success: false; error: string }> {
  if (!query || query.length < 2) return { success: false, error: 'Suchbegriff zu kurz' };

  try {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: '1',
      action: 'process',
      json: '1',
      page: String(page),
      page_size: String(pageSize),
      fields: 'code,product_name,product_name_de,brands,nutriments,nutriscore_grade,nova_group',
    });

    const res = await fetch(`${SEARCH_BASE}?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok) return { success: false, error: `API ${res.status}` };

    const data = await res.json();
    const products: OffSearchResult[] = (data.products || [])
      .map((p: Record<string, unknown>) => {
        const n = (p.nutriments ?? {}) as Record<string, number | undefined>;
        return {
          id: String(p.code ?? ''),
          barcode: String(p.code ?? ''),
          name: (p.product_name_de as string) || (p.product_name as string) || 'Unbekanntes Produkt',
          brand: (p.brands as string) || '',
          energy_kcal: n['energy-kcal_100g'] ?? 0,
          protein: n.proteins_100g ?? 0,
          carbs: n.carbohydrates_100g ?? 0,
          fat: n.fat_100g ?? 0,
          sugar: n.sugars_100g ?? 0,
          salt: n.salt_100g ?? 0,
          nutri_score: ((p.nutriscore_grade as string) || '').toUpperCase() || null,
          nova_group: (p.nova_group as number) ?? null,
          _source: 'openfoodfacts' as const,
        };
      })
      .filter((p: OffSearchResult) => p.name && p.name !== 'Unbekanntes Produkt');

    return { success: true, products, total: data.count || products.length };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Netzwerkfehler' };
  }
}

export function getNutriScoreColor(grade: string | null): string {
  switch (grade?.toUpperCase()) {
    case 'A': return '#16A34A';
    case 'B': return '#84CC16';
    case 'C': return '#EAB308';
    case 'D': return '#F97316';
    case 'E': return '#DC2626';
    default:  return '#A3A3A3';
  }
}
