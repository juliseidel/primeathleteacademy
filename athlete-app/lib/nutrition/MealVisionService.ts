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

// gemini-2.5-flash MIT aktivem Thinking — Mittelweg aus Qualität & Kosten.
// Pro wäre besser, aber ~10× teurer; Flash+Thinking liefert nahezu gleiche
// Erkennungs-Qualität bei ~0.1-0.3 Cent pro Foto.
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

const FOOD_ANALYSIS_PROMPT = `Du bist Ernährungsexperte und analysierst ein Foto einer Mahlzeit.

AUFGABE:
Erkenne jedes einzelne sichtbare Lebensmittel und liste es separat auf. Nutze deine Bildanalyse, um Texturen, Farben und Formen zu unterscheiden — Brot, Butter, Sauerkraut, Apfel, Oliven, Eier sind alles eigenständige Lebensmittel und gehören jeweils in einen eigenen Eintrag.

FÜR JEDES LEBENSMITTEL:
- Name auf Deutsch, so spezifisch wie möglich (z.B. "Roggenbrot" statt "Brot", "Hähnchenbrust gegrillt" statt "Fleisch")
- Geschätzte Menge in Gramm (nutze Teller, Besteck, Hände als Größenreferenz)
- Kalorien (kcal)
- Protein (g)
- Kohlenhydrate (g)
- Fett (g)

WICHTIG ZUM NAMEN:
Verwende für jeden Eintrag nur den Basis-Namen der Zutat, ohne Bezug zu anderen Komponenten:
- richtig: "Butter"  — falsch: "Butter auf Brot"
- richtig: "Apfel"  — falsch: "Apfelstücken im Sauerkraut"
- richtig: "Olivenöl"  — falsch: "Olivenöl zum Anbraten"

Auch bei Mischungen wie Salaten, eingelegtem Gemüse oder Müsli: trenne die sichtbaren Bestandteile in eigene Einträge. Sauerkraut und Apfel sind zwei separate Komponenten, auch wenn sie in derselben Schüssel liegen. Müsli, Milch und Banane sind drei Komponenten.

Berücksichtige auch unsichtbare Zutaten wie Öl beim Anbraten oder Dressing am Salat — als eigene Einträge.
Sportliche Athleten essen oft größere Portionen — schätze entsprechend großzügig.

ANTWORTE NUR MIT VALIDEM JSON (kein Markdown, kein Text drumherum):
{
  "dish_name": "Name des Gerichts",
  "components": [
    { "name": "Komponente", "weight_g": 150, "calories": 165, "protein": 31, "carbs": 0, "fat": 3.6 }
  ],
  "total": { "calories": 520, "protein": 45, "carbs": 30, "fat": 12 },
  "meal_type_suggestion": "breakfast | lunch | dinner | snack",
  "notes": null
}`;

type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  error?: { message?: string };
};

export type AnalyzeResult =
  | { success: true; analysis: MealAnalysis }
  | { success: false; error: string; debug?: string };

export async function analyzeMealPhoto(
  imageBase64: string,
  audioBase64?: string,
): Promise<AnalyzeResult> {
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
          maxOutputTokens: 8192,
          topP: 0.8,
          topK: 40,
          // Thinking aktiv lassen — gemini-2.5-pro nutzt das Reasoning, um
          // Lebensmittel sauberer zu trennen (Brot vs. Butter vs. Sauerkraut).
          // Defensives JSON-Parsing fängt die längere Response ab.
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
      console.log('[MealVision] HTTP error', res.status, body.slice(0, 400));
      console.warn('[MealVision] HTTP error', res.status, body.slice(0, 400));
      return {
        success: false,
        error: `Gemini API ${res.status}`,
        debug: body.slice(0, 800),
      };
    }

    const data = (await res.json()) as GeminiResponse;
    if (data.error) {
      console.log('[MealVision] API error', data.error);
      return {
        success: false,
        error: data.error.message ?? 'Gemini-Fehler',
        debug: JSON.stringify(data.error).slice(0, 800),
      };
    }

    // Alle text-parts concatten — Gemini splittet die JSON-Antwort manchmal
    // über mehrere parts auf, find() würde dann ein Fragment zurückgeben.
    const allParts = data.candidates?.[0]?.content?.parts ?? [];
    const fullText = allParts
      .filter((p) => typeof p.text === 'string' && !p.thought)
      .map((p) => p.text as string)
      .join('')
      .trim();

    if (!fullText) {
      const finishReason = (data.candidates?.[0] as { finishReason?: string } | undefined)?.finishReason;
      const rawDump = JSON.stringify(data).slice(0, 800);
      console.log('[MealVision] Empty response. finishReason:', finishReason, 'raw:', rawDump);
      return {
        success: false,
        error: finishReason === 'MAX_TOKENS'
          ? 'Antwort zu lang — bitte schärferes Foto oder weniger Komponenten'
          : `Leere Antwort von Gemini${finishReason ? ` (${finishReason})` : ''}`,
        debug: rawDump,
      };
    }

    console.log('[MealVision] raw text (first 400 chars):', fullText.slice(0, 400));
    return parseAnalysis(fullText);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { success: false, error: 'Zeitüberschreitung — bitte nochmal versuchen' };
    }
    const msg = err instanceof Error ? err.message : 'Netzwerkfehler';
    console.log('[MealVision] exception:', msg, err);
    return {
      success: false,
      error: msg,
      debug: err instanceof Error && err.stack ? err.stack.slice(0, 800) : undefined,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseAnalysis(text: string): AnalyzeResult {
  // Gemini returnt trotz responseMimeType=json gelegentlich Markdown-Fences
  // oder einen erklärenden Vorlauf ("Hier ist die Analyse: {...}").
  // Drei-Stufen-Säuberung: Fences strippen → falls weiterhin nicht-JSON
  // drumherum, ersten { bis letzten } extrahieren.
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  if (!cleaned.startsWith('{')) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log('[MealVision] JSON parse failed:', msg);
    console.log('[MealVision] raw text (first 800):', text.slice(0, 800));
    return {
      success: false,
      error: 'Gemini-Antwort konnte nicht geparst werden',
      debug: `Parse-Error: ${msg}\n\nRAW (erste 800 Zeichen):\n${text.slice(0, 800)}`,
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      success: false,
      error: 'Unerwartetes Antwort-Format',
      debug: `Parsed type: ${typeof parsed}\n\nRAW:\n${text.slice(0, 600)}`,
    };
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
    return {
      success: false,
      error: 'Keine Komponenten erkannt — bitte schärferes Foto',
      debug: `Geparstes JSON hatte ${components.length} components, aber keine valide.\n\nRAW:\n${text.slice(0, 600)}`,
    };
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
