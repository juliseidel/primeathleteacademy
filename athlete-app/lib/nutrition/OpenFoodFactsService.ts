/**
 * Open Food Facts Service — Barcode-Lookup + Text-Suche
 *
 * Wir nutzen primär den neuen Search-A-Licious-Endpoint
 * (https://search.openfoodfacts.org), weil das alte CGI-Search
 * (cgi/search.pl) regelmäßig mit 503 antwortet. Search-A-Licious
 * ist Elastic-Search-basiert, schneller und stabiler.
 *
 * Für Barcode-Lookups versuchen wir zuerst den klassischen v2-Endpoint
 * (mehr Felder: Bilder, Zutaten, Allergene), fallen bei Fehler auf
 * Search-A-Licious mit `q=code:<barcode>` zurück.
 *
 * Public API, kein Key nötig. Werte sind pro 100g.
 */

const PRODUCT_API = 'https://world.openfoodfacts.org/api/v2';
const SEARCH_API = 'https://search.openfoodfacts.org/search';
const USER_AGENT = 'Prime Athlete Academy - Mobile - https://primeathleteacademy.de';

type SalHit = {
  code?: string;
  product_name?: string;
  product_name_de?: string;
  brands?: string[];
  quantity?: string;
  image_front_url?: string;
  image_front_small_url?: string;
  ingredients_text_de?: string;
  ingredients_text?: string;
  allergens_tags?: string[];
  nutriments?: Record<string, number | undefined>;
  nutriscore_grade?: string;
  nova_groups?: string | number;
};

function brandsToString(brands: string[] | string | undefined): string {
  if (!brands) return '';
  if (typeof brands === 'string') return brands;
  return brands.join(', ');
}

function novaToNumber(nova: string | number | undefined): number | null {
  if (nova == null) return null;
  const n = typeof nova === 'string' ? Number(nova) : nova;
  return Number.isFinite(n) ? n : null;
}

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

function hitToOffProduct(barcode: string, h: SalHit): OffProduct {
  const n = h.nutriments ?? {};
  return {
    barcode,
    name: h.product_name_de || h.product_name || 'Unbekanntes Produkt',
    brand: brandsToString(h.brands),
    quantity: h.quantity || '',
    image: h.image_front_url || null,
    imageSmall: h.image_front_small_url || null,
    nutrients: {
      energy_kcal: n['energy-kcal_100g'] ?? null,
      protein: n.proteins_100g ?? null,
      carbs: n.carbohydrates_100g ?? null,
      fat: n.fat_100g ?? null,
      saturated_fat: n['saturated-fat_100g'] ?? null,
      sugar: n.sugars_100g ?? null,
      fiber: n.fiber_100g ?? null,
      salt: n.salt_100g ?? null,
    },
    nutriscore_grade: h.nutriscore_grade?.toUpperCase() || null,
    nova_group: novaToNumber(h.nova_groups),
    ingredients_text: h.ingredients_text_de || h.ingredients_text || '',
    allergens_tags: h.allergens_tags || [],
  };
}

export async function getProductByBarcode(
  barcode: string,
): Promise<{ success: true; product: OffProduct } | { success: false; error: string }> {
  // Erst der klassische v2-Endpoint (hat mehr Detail-Felder)
  const v2Result = await tryProductV2(barcode);
  if (v2Result.success) return v2Result;

  // Fallback auf Search-A-Licious (stabiler, weniger Felder)
  return tryProductViaSearch(barcode);
}

async function tryProductV2(
  barcode: string,
): Promise<{ success: true; product: OffProduct } | { success: false; error: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${PRODUCT_API}/product/${barcode}.json?lc=de&cc=de`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) return { success: false, error: `API ${res.status}` };

    const data = await res.json();
    if (data.status !== 1 || !data.product) {
      return { success: false, error: 'not-found' };
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
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, error: 'timeout' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'network' };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function tryProductViaSearch(
  barcode: string,
): Promise<{ success: true; product: OffProduct } | { success: false; error: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const url = `${SEARCH_API}?q=code%3A${encodeURIComponent(barcode)}&page_size=1&langs=de`;
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) return { success: false, error: `Search-API ${res.status}` };

    const data = await res.json();
    const hit: SalHit | undefined = data.hits?.[0];
    if (!hit) {
      return { success: false, error: 'Produkt nicht in Datenbank gefunden' };
    }
    return { success: true, product: hitToOffProduct(barcode, hit) };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, error: 'Zeitüberschreitung — bitte nochmal versuchen' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Netzwerkfehler' };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function searchProducts(
  query: string,
  page = 1,
  pageSize = 20,
): Promise<{ success: true; products: OffSearchResult[]; total: number } | { success: false; error: string }> {
  if (!query || query.length < 2) return { success: false, error: 'Suchbegriff zu kurz' };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      page_size: String(pageSize),
      langs: 'de',
    });

    const res = await fetch(`${SEARCH_API}?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) return { success: false, error: `Search-API ${res.status}` };

    const data = await res.json();
    const hits: SalHit[] = data.hits || [];
    const products: OffSearchResult[] = hits
      .map((h) => {
        const n = h.nutriments ?? {};
        return {
          id: String(h.code ?? ''),
          barcode: String(h.code ?? ''),
          name: h.product_name_de || h.product_name || '',
          brand: brandsToString(h.brands),
          energy_kcal: n['energy-kcal_100g'] ?? 0,
          protein: n.proteins_100g ?? 0,
          carbs: n.carbohydrates_100g ?? 0,
          fat: n.fat_100g ?? 0,
          sugar: n.sugars_100g ?? 0,
          salt: n.salt_100g ?? 0,
          nutri_score: (h.nutriscore_grade || '').toUpperCase() || null,
          nova_group: novaToNumber(h.nova_groups),
          _source: 'openfoodfacts' as const,
        };
      })
      // Items ohne Name oder ohne Energie sind nutzlos für Tracking
      .filter((p: OffSearchResult) => p.name.trim().length > 0 && p.energy_kcal > 0);

    return { success: true, products, total: data.count || products.length };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, error: 'Zeitüberschreitung' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Netzwerkfehler' };
  } finally {
    clearTimeout(timeoutId);
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
