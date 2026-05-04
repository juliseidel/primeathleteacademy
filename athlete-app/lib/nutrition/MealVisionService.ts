/**
 * MealVisionService — Gemini-basierte Mahlzeit-Foto-Analyse für PAA.
 *
 * Pipeline (aus FEELY services/GeminiVisionService.js portiert + an PAA-Daten-
 * modell adaptiert):
 *   1. User fotografiert die Mahlzeit (oder wählt Bild aus Mediathek)
 *   2. Optional: User nimmt Sprachnotiz auf ("ich hatte 200g Reis dazu")
 *   3. Bild + Audio (beides Base64) gehen multimodal an gemini-2.5-flash
 *   4. Gemini liefert structured JSON mit Komponenten + Macros
 *   5. UI zeigt Result, User bestätigt → Komponenten landen als einzelne
 *      Logs in athlete_meal_log mit source='photo'
 *
 * Direkt-API-Call (kein Edge-Function-Layer) — gleiche Strategie wie
 * AvatarService. API-Key kommt aus EXPO_PUBLIC_GEMINI_API_KEY.
 */

const VISION_MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${VISION_MODEL}:generateContent`;

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error('Missing EXPO_PUBLIC_GEMINI_API_KEY in athlete-app/.env.local');
  }
  return key;
}

// ─── Public Types ───────────────────────────────────────────────────────────

export type MealComponent = {
  name: string;
  weight_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  /** Gemini-Confidence 0..1 — niedrige Werte sollte UI als unsicher markieren */
  confidence: number;
};

export type MealAnalysis = {
  dish_name: string;
  components: MealComponent[];
  total: { calories: number; protein: number; carbs: number; fat: number };
  meal_type_suggestion: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  notes: string | null;
};

// ─── Foto-Analyse (Bild + optional Voice-Note multimodal) ───────────────────

const FOOD_ANALYSIS_PROMPT = `Du bist ein erfahrener Sport-Ernährungsexperte und analysierst Mahlzeit-Fotos für die Prime Athlete Academy App.

AUFGABE:
Analysiere das Foto dieser Mahlzeit sehr genau. Erkenne ALLE sichtbaren Lebensmittel und Komponenten einzeln.

FÜR JEDE KOMPONENTE SCHÄTZE:
- Name auf Deutsch (möglichst spezifisch, z.B. "Hähnchenbrust gegrillt" statt nur "Fleisch")
- Geschätzte Menge in Gramm
- Kalorien (kcal)
- Protein (g)
- Kohlenhydrate (g)
- Fett (g)
- Confidence 0.0–1.0 (wie sicher bist du dir?)

REGELN:
1. Sei so präzise wie möglich bei der Mengen-Abschätzung — nutze sichtbare Referenzpunkte (Teller-Größe, Besteck, Hände)
2. Berücksichtige typische Portionsgrößen für sportliche Athleten (eher größere Portionen)
3. Erkenne auch Zutaten die nicht direkt sichtbar sind (z.B. Öl beim Anbraten, Sauce, Dressing)
4. Bei mehreren Komponenten auf einem Teller: jede einzeln auflisten, NICHT zu einer Pauschal-Schätzung zusammenfassen
5. Wenn eine Sprachnotiz mitgeschickt wird: nutze sie als Korrektur/Ergänzung deiner Foto-Analyse (z.B. "ich hatte 200g Reis" → übernimm 200g, ignoriere deine ursprüngliche Schätzung)

ANTWORTE NUR MIT VALIDEM JSON (kein Markdown-Codeblock, kein Text drumherum):
{
  "dish_name": "Name des gesamten Gerichts",
  "components": [
    {
      "name": "Komponente 1",
      "weight_g": 150,
      "calories": 165,
      "protein": 31,
      "carbs": 0,
      "fat": 3.6,
      "confidence": 0.9
    }
  ],
  "total": {
    "calories": 520,
    "protein": 45,
    "carbs": 30,
    "fat": 12
  },
  "meal_type_suggestion": "lunch",
  "notes": "kurze Anmerkung wenn etwas unsicher ist, sonst null"
}`;

type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  error?: { message?: string };
};

export async function analyzeMealPhoto(
  imageBase64: string,
  audioBase64?: string,
): Promise<{ success: true; analysis: MealAnalysis } | { success: false; error: string }> {
  const apiKey = getApiKey();

  let prompt = FOOD_ANALYSIS_PROMPT;
  if (audioBase64) {
    prompt +=
      '\n\nWICHTIG: Der Athlet hat eine Sprachnotiz hinzugefügt. ' +
      'Höre die Notiz an und nutze sie als Korrektur oder Ergänzung deiner Foto-Analyse.';
  }

  const parts: GeminiPart[] = [
    { text: prompt },
    { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
  ];
  if (audioBase64) {
    parts.push({ inline_data: { mime_type: 'audio/m4a', data: audioBase64 } });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 2048,
          topP: 0.8,
          topK: 40,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { success: false, error: `Gemini API ${res.status}: ${body.slice(0, 200)}` };
    }

    const data = (await res.json()) as GeminiResponse;
    if (data.error) {
      return { success: false, error: data.error.message ?? 'Gemini-Fehler' };
    }

    const textPart = data.candidates?.[0]?.content?.parts?.find((p) => p.text && !p.thought);
    if (!textPart?.text) {
      return { success: false, error: 'Leere Antwort von Gemini' };
    }

    return parseAnalysis(textPart.text);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, error: 'Zeitüberschreitung — bitte nochmal versuchen' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Netzwerkfehler' };
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseAnalysis(
  text: string,
): { success: true; analysis: MealAnalysis } | { success: false; error: string } {
  // Gemini returnt manchmal trotz responseMimeType=json einen Markdown-Block.
  // Wir säubern defensiv.
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return { success: false, error: 'Gemini-Antwort konnte nicht geparst werden' };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { success: false, error: 'Unerwartetes Antwort-Format' };
  }
  const obj = parsed as Record<string, unknown>;
  const components = Array.isArray(obj.components) ? obj.components : [];

  const validComponents: MealComponent[] = components
    .map((c) => {
      const comp = c as Record<string, unknown>;
      return {
        name: String(comp.name ?? '').trim(),
        weight_g: Math.max(0, Number(comp.weight_g) || 0),
        calories: Math.max(0, Number(comp.calories) || 0),
        protein: Math.max(0, Number(comp.protein) || 0),
        carbs: Math.max(0, Number(comp.carbs) || 0),
        fat: Math.max(0, Number(comp.fat) || 0),
        confidence: Math.min(1, Math.max(0, Number(comp.confidence) || 0.7)),
      };
    })
    .filter((c) => c.name.length > 0 && c.calories > 0);

  if (validComponents.length === 0) {
    return { success: false, error: 'Keine Komponenten erkannt — bitte schärferes Foto' };
  }

  // Totals neu berechnen aus validierten Komponenten (Gemini-Totals oft inkonsistent)
  const total = validComponents.reduce(
    (acc, c) => ({
      calories: acc.calories + c.calories,
      protein: acc.protein + c.protein,
      carbs: acc.carbs + c.carbs,
      fat: acc.fat + c.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const mealTypeRaw = obj.meal_type_suggestion;
  const mealType =
    mealTypeRaw === 'breakfast' || mealTypeRaw === 'lunch' || mealTypeRaw === 'dinner' || mealTypeRaw === 'snack'
      ? mealTypeRaw
      : null;

  return {
    success: true,
    analysis: {
      dish_name: String(obj.dish_name ?? 'Mahlzeit').trim() || 'Mahlzeit',
      components: validComponents,
      total: {
        calories: round1(total.calories),
        protein: round1(total.protein),
        carbs: round1(total.carbs),
        fat: round1(total.fat),
      },
      meal_type_suggestion: mealType,
      notes: typeof obj.notes === 'string' && obj.notes.trim() ? obj.notes.trim() : null,
    },
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// ─── Helpers für Image/Audio → Base64 ───────────────────────────────────────

export async function fileUriToBase64(uri: string): Promise<string> {
  const res = await fetch(uri);
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip "data:<mime>;base64,"
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error('Konnte Datei nicht lesen'));
    reader.readAsDataURL(blob);
  });
}
