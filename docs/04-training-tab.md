# PAA — Training-Tab Spezifikation (Phase 4-Build erster Block)

> **Status:** Entwurf zur Umsetzung.
> **Stand:** 2026-05-02
> **Basiert auf:** [docs/01-konzept.md](./01-konzept.md), [docs/02-information-architecture.md](./02-information-architecture.md), [docs/03-design-tokens.md](./03-design-tokens.md)
> **Liefert:** Architektur + Datenmodell + UX-Flow + Charts-Konzept für den Training-Tab der Athleten-App

---

## 1. Sub-Mode-Pattern (gilt für ganze App, nicht nur Training)

Beim Tap auf einen Top-Level-Tab (Training oder Ernährung) **morpht die Bottom-Bar** zu Sub-Tabs für die jeweilige Welt. Center-Button wird zum Home-Button. Beim Tap auf Center-Home → zurück zum Main-Mode. Übergänge mit kurzem Welcome-Splash (~500ms).

```
MAIN-MODE
┌────────────────────────────────────────────────────────┐
│  💪 Training   🍽️ Ernährung   [🏠]   💬 Coach   👤 Profil│
└────────────────────────────────────────────────────────┘
                       ↓ Tap "Training"
              [Splash: "TRAINING" 500ms]
                       ↓
TRAINING-SUB-MODE
┌────────────────────────────────────────────────────────┐
│   Heute     Woche      [🏠]      Historie   Fortschritt│
└────────────────────────────────────────────────────────┘
                       ↓ Tap [🏠]
              [Splash: "HEUTE" 500ms]
                       ↓
              Zurück zu MAIN-MODE → Home-Screen
```

**State-Architektur:**
- `AthleteNavContext` mit:
  - `mode: 'main' | 'training-sub' | 'nutrition-sub'`
  - `trainingSubTab: 'heute' | 'woche' | 'historie' | 'fortschritt'`
  - `nutritionSubTab: 'heute' | 'plan' | 'matchday' | 'historie'`
  - Actions: `enterTrainingSub()`, `enterNutritionSub()`, `exitToMain()`, `setTrainingSub(tab)`
- `AthleteTabBar` liest Context und rendert je nach `mode` Main- oder Sub-Tabs
- `TrainingWorld` Container-Screen liest `trainingSubTab` und rendert entsprechenden Sub-Screen

---

## 2. Training-Tab Sub-Struktur

### 2.1 Vier Sub-Tabs

| Sub-Tab | Was passiert |
|---------|--------------|
| **Heute** | Tages-Workout-Übersicht, Übungen abhaken, Live-Session-Tracking |
| **Woche** | 7-Tage-Plan-Übersicht (Mo–So), Workout-Typ pro Tag |
| **Historie** | Vergangene Sessions mit allen getrackten Werten + Coach-Kommentaren |
| **Fortschritt** | Dynamische Charts basierend auf Athleten-Trainings-Historie |

---

## 3. Tab "Heute"

### 3.1 Empty-State (kein Workout geplant)
```
[Eyebrow] HEUTE
[Headline] Ruhetag

[Glass-Card]
  💤 "Heute steht keine Einheit an."
  "Erholung ist Teil des Trainings — geh früh schlafen, iss sauber."
  
  [Sub: nächstes Training in 1 Tag — Krafttraining Oberkörper]
```

### 3.2 Mit Workout (Default)
```
[Eyebrow] HEUTE
[Headline] Krafttraining · Unterkörper

[Hero-Workout-Card mit Themenbild]
  [Background: passendes Foto + Dark Gradient Overlay]
  [Foto-Mapping siehe Section 6]
  
  [Coach-Avatar JK] "Geh's locker an — Reduktions-Tag"
  
  ⏱ ~45 Min   ·  📊 4 Übungen  ·  RPE 7
  
  [Big CTA Button]: "Session starten"  oder "Session fortsetzen"

[Übungs-Liste — kompakte Cards, eine pro Übung]
  ▢ 1. Squat                    4 × 8 · 80kg     ❯
  ▢ 2. Romanian Deadlift        3 × 10           ❯
  ▢ 3. Bulgarian Split Squat    3 × 10/Bein      ❯
  ▢ 4. Calf Raise               4 × 15           ❯

  ✓ schon erledigte Übungen sind tickbar markiert
```

### 3.3 Übungs-Detail-Screen (eigene Route, vollbild)

```
[Header: ← zurück, Übungs-Name, Übung X/Y]

[Demo-Video Embed — 16:9, autoplay loop, mute, Tap = Sound an]

[Coach-Anweisung Card]
  "Saubere Tiefe wichtiger als Gewicht. Stoppe wenn Form bricht."

[Sätze-Tracker]
  ┌──────────────────────────────────────────────┐
  │ Satz │ Soll        │ Ist                      │
  ├──────────────────────────────────────────────┤
  │  1   │ 8 × 80kg    │ ✓ 8 × 80kg     14:32    │
  │  2   │ 8 × 80kg    │ ✓ 8 × 80kg     14:36    │
  │  3   │ 8 × 80kg    │ → AKTIV  [_8_] × [_80_] │
  │  4   │ 8 × 80kg    │                          │
  └──────────────────────────────────────────────┘

  [Pro aktivem Satz]
    Reps:    [- ]  8  [ +]
    Gewicht: [- ] 80  [ +]   kg
    RPE (optional): [○○○○○○●○○○]  6/10
    Notiz:   [optional kurzer Text]
    
    [Big Button] "Satz speichern"

[Pause-Timer (erscheint nach Satz-Speichern, prominent)]
  ⏱ Pause läuft
  ╭───────────╮
  │   01:32   │  ← großer animierter Counter
  ╰───────────╯
  Vorgabe: 90s · [Pause stoppen] [+30s]
  
  Wenn Pause durch: Anzeige "Bereit für Satz 4"

[Übung abschließen Button — wenn alle Sätze ✓]
  [Big Button] "Übung abgeschlossen → Nächste Übung"
```

### 3.4 Session-Summary (am Ende aller Übungen)

```
[Konfetti-mäßiger sanfter Premium-Effekt — kein Gimmick, edel]

[Headline] Session abgeschlossen 🎯

[Stats-Card]
  Dauer:    47 Min (Vorgabe 45)
  Volumen:  3.840 kg gesamt
  Sätze:    14 von 14 ✓
  Notizen:  3

[Wie war's? — RPE-Slider 1-10]
[Energie-Level — Slider 1-10]
[Notiz an Coach (optional)]

[Speichern → Coach wird benachrichtigt]
```

---

## 4. Tab "Woche"

```
[Eyebrow] WOCHE
[Headline] Diese Woche

[Wochen-Switcher]: ← Vorwoche · Diese Woche · Nächste Woche →

[7 Cards untereinander — Mo bis So]
  Heute (Mo)   Krafttraining · Unterkörper        ✓ in Bearbeitung
  Di           Athletik · Sprung & Schnelligkeit  ○ geplant
  Mi           Ruhetag                            —
  Do           Krafttraining · Oberkörper         ○ geplant
  Fr           Conditioning · Position-spezifisch ○ geplant
  Sa           SPIELTAG · Auswärts in Braunschweig  🏆
  So           Recovery · Mobility & Stretching   ○ geplant

  Tap auf Card → Workout-Detail (gleicher Screen wie "Heute" aber für anderen Tag)
```

---

## 5. Tab "Historie"

```
[Eyebrow] HISTORIE
[Headline] Was du bisher gemacht hast

[Filter-Pills]: Alle · Krafttraining · Athletik · Ausdauer · Mobility

[Liste — vergangene Sessions, gruppiert nach Woche]
  
  KW 18
  ┌─────────────────────────────────────────────────┐
  │ Sa, 26. Apr  Krafttraining · Oberkörper          │
  │ 52 Min · Volumen 4.120 kg · RPE 8                 │
  │ Coach-Reaktion: "Saubere Session, Bench gut!"     │
  └─────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────┐
  │ Do, 24. Apr  Athletik · Plyometrie               │
  │ 38 Min · 12 Sätze · RPE 7                        │
  └─────────────────────────────────────────────────┘
  
  KW 17
  ...
```

---

## 6. Tab "Fortschritt" (Charts)

**Wichtigster Punkt:** Charts sind **dynamisch pro Athlet**. Wir hardcoden NICHTS. Die App leitet ab:
- Welche Übungen kommen in den letzten 12 Wochen vor? → das sind die "Hauptübungen" für den Athleten
- Hat Coach Athletik-Tests eingeplant? → dann zeige Test-Section, sonst nicht
- Trainings-Blöcke aus Coach-Notes ableitbar? → dann Block-Auswertung, sonst nicht

### 6.1 Section: Persönliche Bestleistungen

Top 5–8 Bestleistungen aus den Übungen die der Athlet macht. Sport-agnostisch.

```
[Eyebrow] BESTLEISTUNGEN

[PR-Cards horizontal scrollable]
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ Squat        │  │ Bench        │  │ 30m Sprint   │
  │ 120kg × 5    │  │ 90kg × 6     │  │ 4.12s        │
  │ ↑ +5kg / 6T  │  │ — gehalten   │  │ ↓ -0.08s/1T  │
  │ vor 6 Tagen  │  │ vor 22 Tagen │  │ gestern  🆕   │
  └──────────────┘  └──────────────┘  └──────────────┘

  Neue PRs (letzte 7 Tage) bekommen Gold-Highlight + 🆕 Badge
```

### 6.2 Section: Übungs-Trends mit Drill-Down

Liste der Hauptübungen. Tap öffnet großen Chart.

```
[Eyebrow] DEINE ÜBUNGEN

[Liste mit Mini-Sparklines]
  Squat              ─────╱╲──╱   ↗ +12% (3 Mo)
  Bench Press        ──╱─╲───╱─   ↗ +6% (3 Mo)
  Romanian Deadlift  ─────╲──╱─   → stabil
  30m Sprint         ╲──╲─╲───    ↘ verbessert
  Box Jump           ─╱──╱──╱─    ↗ +8cm

  Tap → Detail-Chart-Screen mit Toggle:
    • Top-Gewicht (oder Top-Zeit / Top-Distanz / Top-Höhe)
    • Volumen (Sätze × Wdh × kg)
    • Reps bei Referenzgewicht (z.B. 80kg → wieviele Wdh schaffst du heute vs vor 3 Mo)
```

### 6.3 Section: Athletik-Tests (nur wenn Coach welche geplant hat)

```
[Eyebrow] TESTS

  Falls keine Tests geplant: Section nicht sichtbar.

  Sonst:
  ┌─────────────────────────────────────────────────┐
  │ 30m Sprint                                       │
  │ Vor 3 Monaten:  4.32s   →   Heute: 4.12s         │
  │ ↓ 0.20s schneller                                │
  │ [Mini-Linien-Chart Verlauf der Testdaten]        │
  └─────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────┐
  │ Vertical Jump                                    │
  │ Vor 3 Monaten:  64cm    →   Heute: 72cm          │
  │ ↑ 8cm höher                                      │
  └─────────────────────────────────────────────────┘
```

### 6.4 Section: Block-Auswertung

```
[Eyebrow] AKTUELLE PHASE

  Falls Coach Phasen-Marker setzt (Block-Tags), sonst nicht sichtbar.

  ┌─────────────────────────────────────────────────┐
  │ 📊 Aufbauphase (April 2026)                      │
  │ 6 Wochen · 22 Sessions · 3 PRs                   │
  │                                                   │
  │ +8% Squat 1RM                                    │
  │ +12% Bench 1RM                                   │
  │ -0.05s 30m Sprint                                │
  │                                                   │
  │ Coach-Note: "Fokus war Maximalkraft Beine"       │
  └─────────────────────────────────────────────────┘
```

---

## 7. Datenmodell

### 7.1 Workout (Plan + Tracking)

```ts
type WorkoutType =
  | 'krafttraining' | 'athletik' | 'schnelligkeit'
  | 'ausdauer' | 'plyometrie' | 'mobility'
  | 'technik' | 'spielform' | 'recovery' | 'mixed';

type WorkoutStatus = 'planned' | 'in_progress' | 'completed' | 'skipped' | 'postponed';

type Workout = {
  id: string;
  athleteId: string;
  date: string;             // ISO Datum
  title: string;            // "Krafttraining · Unterkörper"
  type: WorkoutType;
  status: WorkoutStatus;
  estimatedDurationMin: number;
  rpeTarget?: number;
  coachNotes?: string;
  blockTag?: string;        // z.B. "Aufbauphase April 2026"
  startedAt?: string;
  completedAt?: string;
  actualDurationMin?: number;
  athleteSummaryNotes?: string;
  athleteRpe?: number;
  athleteEnergy?: number;
  exercises: WorkoutExercise[];
};
```

### 7.2 Übung im Workout

```ts
type WorkoutExercise = {
  id: string;
  workoutId: string;
  exerciseLibraryId: string;
  order: number;
  coachNotes?: string;
  sets: WorkoutExerciseSet[];
};
```

### 7.3 Satz (das Herzstück, flexibel)

```ts
type WorkoutExerciseSet = {
  id: string;
  setNumber: number;
  
  // Plan (vom Coach gesetzt) — ALLE optional, Coach setzt was passt
  plannedReps?: number | string;     // 8 oder "8-10" oder "AMRAP"
  plannedLoadKg?: number;
  plannedLoadRpe?: number;
  plannedLoadPercent1RM?: number;
  plannedLoadType?: 'kg' | 'rpe' | 'percent_1rm' | 'bodyweight' | 'band';
  plannedDistanceM?: number;
  plannedTimeSec?: number;
  plannedRestSec?: number;
  
  // Ist (vom Athlet getrackt)
  completed: boolean;
  completedAt?: string;
  actualReps?: number;
  actualLoadKg?: number;
  actualDistanceM?: number;
  actualTimeSec?: number;
  actualRpe?: number;
  athleteNotes?: string;
};
```

### 7.4 Übungs-Library (Coach erstellt)

```ts
type MeasurementType =
  | 'reps_weight'    // Sätze × Wdh × Gewicht (klassisches Krafttraining)
  | 'reps_only'      // Sätze × Wdh (Liegestütz, Klimmzug ohne Zusatzgewicht)
  | 'time'           // Sätze × Sekunden (Plank, Halteübungen)
  | 'distance'       // Strecke (Sprints, Läufe)
  | 'distance_time'  // Strecke + Zeit (Sprint mit Zeitmessung)
  | 'rounds'         // Runden × Stations (Komplexe Drills, Circuits)
  | 'mixed';         // Gemischt (z.B. Drill mit unterschiedlichen Stationen)

type ExerciseLibrary = {
  id: string;
  coachId: string;          // welcher Coach hat angelegt (Jonas oder Patrick — beide sehen alle)
  name: string;
  description?: string;
  demoVideoUrl?: string;
  tags: string[];           // z.B. ['Krafttraining', 'Unterkörper', 'Stange']
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  measurementType: MeasurementType;
  defaultRestSec?: number;
};
```

---

## 8. Workout-Card-Bilder (Image-Mapping)

Jede Workout-Card auf "Heute" und "Woche" hat ein themen-passendes Hero-Bild als Background. Curated Premium-Fotos, dunkel, athletisch.

```ts
const WORKOUT_IMAGE: Record<WorkoutType, string> = {
  krafttraining:  '<unsplash-id>',  // Hantel-Foto, dunkel
  athletik:       '<unsplash-id>',  // Athleten-Sprung
  schnelligkeit:  '<unsplash-id>',  // Sprintbahn / Startblock
  ausdauer:       '<unsplash-id>',  // Laufstrecke
  plyometrie:     '<unsplash-id>',  // Box Jump
  mobility:       '<unsplash-id>',  // Stretching
  technik:        '<unsplash-id>',  // Ball / Platz
  spielform:      '<unsplash-id>',  // Spielsituation
  recovery:       '<unsplash-id>',  // Sauna / Stretching
  mixed:          '<unsplash-id>',  // Generisch Athlet
};
```

Drüber: `LinearGradient` von transparent oben nach `rgba(10,10,10,0.85)` unten — Text bleibt lesbar, Foto schimmert noch durch.

---

## 9. Audio-/Background-Strategy

**Anforderung:** Spotify (oder andere Background-Musik) darf NIE unterbrochen werden.

**Implementation (expo-av Audio.setAudioModeAsync):**
```ts
{
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: false,
  interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
  interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
  allowsRecordingIOS: false,
}
```

Pause-Timer-Endsignal: **kein Sound**, **keine Vibration**. Visuell: großer Counter pulsiert sanft, wechselt von Gold auf Grün, "Bereit"-Text erscheint. Reicht.

Beim Voice-Memo-Recording (Coach-Tab, später): expo-av temporär mit recording mode → Spotify pausiert kurz automatisch via System.

---

## 10. Session-State + Persistence

### 10.1 In-Memory während Session aktiv
- Zustand in React Context (`SessionContext`)
- Live-Counter, Pause-Timer, aktueller Satz, gespeicherte Sätze

### 10.2 Auto-Save zu AsyncStorage
- Bei jedem Satz-Speichern: kompletter Session-State zu AsyncStorage
- Key: `session:active:{workoutId}`

### 10.3 Recovery beim App-Start
- Beim App-Launch: prüfen ob `session:active:*` existiert
- Wenn ja: Banner auf Home oder Training-Heute-Screen
  ```
  ⚡ Du hast eine offene Session
  Krafttraining · Unterkörper · 14 Min vor abgebrochen
  [Fortsetzen]  [Verwerfen]
  ```

### 10.4 Coach-Updates während Session
- Wenn Athlet Session aktiv hat, ist der Plan **frozen** auf den Stand bei Session-Start
- Coach-Updates an dem Plan erst beim nächsten Workout-Start aktiv
- Coaches arbeiten typisch Sonntags, ändern selten in laufender Woche

---

## 11. Coach-Sichtbarkeit (was Coach sehen muss)

Auch wenn Coach-Dashboard erst später kommt, müssen wir das DATENMODELL jetzt schon richtig anlegen, damit später keine Refactor-Welle kommt. Coach braucht:

- **Plan-vs-Ist-Vergleich pro Satz** (Vorgabe 8×80kg vs Ist 7×80kg → Coach sieht Abweichung)
- **Athleten-Notizen pro Satz** ("Knie hat gezwickt")
- **Session-Summary** (RPE, Energie-Level, Athlet-Notiz an Coach)
- **Verschobene Workouts** (geplant Mi, gemacht Do — Coach sieht beides)
- **Übersprungene Workouts** (geplant Mi, nicht gemacht — Coach sieht "skipped")

Datenmodell oben (Section 7) deckt das ab — `actualX` Felder sind getrennt von `plannedX`, Status-Feld trackt Verschiebungen.

---

## 12. Implementation-Reihenfolge

```
Schritt 1 — Sub-Mode-Switching Architektur
  □ AthleteNavContext.tsx
  □ AthleteTabBar refactor (rendert Sub-Tabs wenn mode != main)
  □ WelcomeSplash.tsx (~500ms)
  □ TrainingWorld.tsx (Container der je nach trainingSubTab den Sub-Screen rendert)
  □ Tab-Layout updaten (training.tsx → TrainingWorld)
  □ Test: tap Training → Splash → Sub-Tabs sichtbar → tap Center → Splash → Main

Schritt 2 — Heute-Sub-Tab mit Mock-Workout
  □ TrainingHeute.tsx mit Hero-Workout-Card
  □ Workout-Card mit Foto-Background (Unsplash)
  □ Übungs-Liste

Schritt 3 — Woche / Historie / Fortschritt-Sub-Tabs als Stubs
  □ Mock-Daten für 7-Tage-Plan
  □ Mock-Daten für Historie (3-4 Sessions)
  □ Fortschritt mit Mock-PRs + Mock-Übungs-Trends

Schritt 4 — Übungs-Detail mit Live-Tracking
  □ ExerciseDetailScreen.tsx
  □ Sätze-Tracker mit Per-Set-Save
  □ Pause-Timer-Component (visuell premium, kein Sound/Vibration)

Schritt 5 — Session-Summary + State-Persistence
  □ SessionSummary.tsx
  □ AsyncStorage-Persistence
  □ Recovery-Banner

Schritt 6 — Charts (Fortschritt-Sub-Tab)
  □ Custom-Chart-Components mit react-native-svg + Reanimated
  □ Linien-Charts für Übungs-Trends
  □ Sparkline-Komponente
```

Schritt 1 ist der größte Architektur-Eingriff. Nach Schritt 1 fühlt sich die App schon ganz anders an — Tab-Wechsel mit Welt-Switch, Splash-Animation. Das ist der "Wow"-Moment.
