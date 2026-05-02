# PAA — Information Architecture Athleten-App (Phase 2a)

> **Status:** Entwurf zur Freigabe.
> **Stand:** 2026-05-02
> **Basiert auf:** [docs/01-konzept.md](./01-konzept.md) + FEELY-Tab-Pattern (Lessons aus EchtGesund_NEU3)
> **Nächster Schritt nach Freigabe:** Phase 2b — Design-System + Hi-Fi Onboarding-Mockups

---

## 1. Inspirations-Quelle: FEELY HubTabBar

FEELY hat ein **Custom Bottom-Tab-Pattern mit Center-Anchor + Mode-Morphing** entwickelt, das wir für PAA adaptieren. Was wir übernehmen:

- **Center-anchored Tab-Bar** mit erhöhtem Center-Button (Pulse-Animation, Akzent-Ring, Glow)
- **Mode-Morphing:** wenn User auf eine "Welt" tippt, morpht die gesamte Bottom-Bar zu Sub-Tabs für diese Welt — kein separater Top-Tab-Bar nötig
- **Pearl-Glasmorphism** Optik, Spring-Animationen, Haptic-Feedback
- **Custom SVG-Icons** statt Standard-Icons, Active/Inactive-Variants
- **Welcome-Splash-Overlay** beim Welt-Wechsel (kurzer Headline-Fade, ~1s)

**Code-Referenz im FEELY-Repo (read-only — wir lesen, kopieren in `athlete-app/`, passen an, kein Import):**
- Hub-Tab-Bar: `EchtGesund_NEU3/components/hub/HubTabBar.js` (Zeilen 151–700+)
- State-Management: `EchtGesund_NEU3/contexts/HubNavContext.js`
- World-Container: `EchtGesund_NEU3/screens/worlds/{Ernaehrung,Training,Community}World.js`
- Icons: `EchtGesund_NEU3/components/hub/{WorldIcons,TabIcons}.js`

---

## 2. PAA-Tab-Struktur Athleten-App

### 2.1 Main-Mode (Default beim App-Start)

5 Positionen, **Home** als erhöhter Center-Button.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    Daily Briefing                       │
│                 (Home-Default-Screen)                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│   💪          🍽️        ╔═══════╗         💬        👤  │
│ Training   Ernährung    ║ 🏠 Home║       Coach    Profil│
│                          ╚═══════╝                      │
└─────────────────────────────────────────────────────────┘
```

| Position | Tab | Icon-Idee | Tap-Verhalten |
|----------|-----|-----------|---------------|
| 1 (links außen) | **Training** | Hantel-SVG | Bar morpht zu Training-Sub-Mode |
| 2 (links innen) | **Ernährung** | Teller/Besteck-SVG | Bar morpht zu Ernährung-Sub-Mode |
| 3 (CENTER, erhöht) | **Home** | Haus-SVG, Pulse-Animation | Default-Screen → Daily Briefing |
| 4 (rechts innen) | **Coach** | Chat-Bubble-SVG | Coach-Chat-Screen (kein Sub-Mode) |
| 5 (rechts außen) | **Profil** | Person-SVG | Profil-Screen mit inline Sections |

**Reihenfolge-Logik:** Inhalts-Welten links (Training, Ernährung), Kommunikation+Persönliches rechts (Coach, Profil), Home als neutraler Anker mittig.

**Center-Button-Design** (FEELY-Adaption, PAA-Akzent):
- Pearl Black Background (`#0B0F0D` aus FEELY)
- Akzent-Ring: **warmes Gold** passend zu PAA-Marke (statt FEELY-Smaragd) — Farbcode in Phase 2b mit Design-System final
- Breathing-Pulse: Skalierung 1.0 → 1.06 in 2s-Zyklen
- Affordance-Ring: äußerer Pulse als Interaktivitäts-Signal
- Größe: ~62pt (normale Tabs ~48pt)

### 2.2 Sub-Modes

Nur **Training** und **Ernährung** haben Sub-Modes (Inhalts-Welten). Coach und Profil bleiben Single-Screen — Sub-Sections inline gescrollt statt in der Bottom-Bar.

#### Training-Sub-Mode

```
┌──────────────────────────────────────────────────┐
│   Heute    Woche      ╔═══════╗      Historie   │
│                       ║ 🏠 Home║                 │
│                       ╚═══════╝                  │
└──────────────────────────────────────────────────┘
```

| Sub-Tab | Inhalt |
|---------|--------|
| **Heute** | Tagestraining, Übungen abhaken, Demo-Videos pro Übung, Notiz-Feld pro Übung |
| **Woche** | Wochen-Übersicht (Mo–So), pro Tag Workout-Typ + Status |
| **Home (Center)** | Zurück zum Main-Mode + Home-Briefing |
| **Historie** | was wurde wann gemacht (mit Coach-Notizen) |

*Phase 2: Form-Check als 4. Sub-Tab oder Sub-Flow vom Heute-Tab.*

#### Ernährung-Sub-Mode

```
┌────────────────────────────────────────────────────────┐
│  Heute    Plan       ╔═══════╗    Matchday   Historie │
│                      ║ 🏠 Home║                        │
│                      ╚═══════╝                        │
└────────────────────────────────────────────────────────┘
```

| Sub-Tab | Inhalt |
|---------|--------|
| **Heute** | Tages-Makros (Soll/Ist), Foto-Mahlzeit-Tracking, Wasser-Counter |
| **Plan** | Coach-Vorgaben (Makros/kcal/Wasser), Beispiel-Mahlzeiten, Supplements |
| **Home (Center)** | Zurück zum Main-Mode |
| **Matchday** | Spieltags-Protokoll (Pre/During/Post). Am Spieltag prominent — sonst "Nächster Spieltag in X Tagen" |
| **Historie** | was wurde wann gegessen (Photo-Stream) |

#### Coach-Tap (kein Sub-Mode)

- Direkt zum 1:1-Chat-Screen mit Lead-Coach
- Bottom-Bar bleibt im Main-Mode (Coach-Tab nur visuell hervorgehoben)
- Header im Chat: Coach-Avatar + Name + Status ("Jonas online" / "zuletzt heute 14:32")
- Compose-Bar unten: Text + Voice-Memo + Foto + Video

#### Profil-Tap (kein Sub-Mode)

- Profil-Screen mit inline Sections (vertikal gescrollt):
  1. **Mein Profil** — Avatar, Stammdaten, Sportart-Profil
  2. **Spieltermine / Wettkämpfe** — kommende + vergangene
  3. **Mein Fortschritt** — Stats, Streak, Trainings-Historie, Gewichts-Verlauf
  4. **Meine Coaches** — Bios Jonas + Patrick (vertraut machen, Tap → Coach-Tab)
  5. **Einstellungen** — Push, Sprache, Privatsphäre, **Account löschen**

### 2.3 Navigation-Verhalten

**Main → Sub:**
- User tappt Training → Bar-Items morphen (Stagger ~200ms + 70ms pro Item, Spring-Animation)
- Welcome-Splash-Overlay ~800ms ("Training"-Headline)
- Sub-Mode-Bar steht
- Center-Button bleibt sichtbar, Icon und Label bleiben "Home"

**Sub → Main:**
- User tappt Center-Home → Reverse-Morph, Welcome-Splash "Home", Default-Briefing-Screen

**Sub-Mode → anderer Top-Level-Tap:**
- User tappt z.B. Coach von Training-Sub aus → erst zurück zu Main, dann Coach öffnet
- Alternativ: direkter Switch (zu testen in Mockups)

**Hardware-Back-Button (Android):**
- Im Sub-Mode → zurück zu Main-Mode
- Im Main-Mode auf Home → App schließt
- Im Main-Mode auf anderem Tab → zurück zu Home

---

## 3. Coach-Web (separates Doc)

Coach-Web ist anderes UX-Pattern (Web mit Sidebar, mehr Daten-Dichte, Multi-Athlet-Übersicht). Wird in `docs/03-coach-web-ia.md` behandelt — nach Athleten-App-Mockups, damit wir die Coach-Sicht aus Athleten-Datenmodell ableiten.

---

## 4. Adaptions-Plan FEELY → PAA

| FEELY-Element | PAA-Adaption | Aufwand |
|---------------|--------------|---------|
| `HubNavContext` | `AthleteNavContext` mit `mode: 'main' \| 'training-sub' \| 'ernaehrung-sub'` | Direkt-Kopie + Renaming |
| `HubTabBar.js` | `AthleteTabBar.tsx` — 90% Re-Use, Icons + Labels + Mode-Definitionen ändern | Mittel |
| `WorldIcons.js` / `TabIcons.js` | `AthleteTabIcons.tsx` — neue SVGs für Training/Ernährung/Home/Coach/Profil | Klein (5 Icons) |
| `ErnaehrungWorld` / `TrainingWorld` | `TrainingWorld.tsx` / `ErnaehrungWorld.tsx` — gleiche Container-Logik, andere Sub-Tabs | Klein |
| Welcome-Splash-Overlay | 1:1 übernehmen, Texte anpassen | Trivial |
| Coach-Center (FEELY) → Home-Center (PAA) | Center-Funktion vereinfacht: immer Home, kein State-abhängiges Verhalten wie bei FEELY | Klein |
| Pearl-Glasmorphism Styling | 1:1 übernehmen, Akzent-Farbe von Smaragd auf PAA-Gold tauschen | Trivial |
| Haptics + Spring-Animations | 1:1 übernehmen | Trivial |
| Multi-Welten-Konzept (5 Welten in FEELY) | Reduziert auf 2 Welten + 2 Single-Screens (Coach, Profil) + Home-Center | — |

---

## 5. Was bewusst NICHT von FEELY übernommen wird

- **Allergen-Layer** im Ernährungs-Tracking
- **Marktplatz / Restaurants / Lokales** Sub-Tabs in Ernährung
- **Stripe-Connect / Bestellungen**
- **FEELY-AI-Agent als eigener Tab** (PAA hat keinen User-AI-Agent — KI ist nur Backend für Briefing/Tracking)
- **Community-Welt**
- **Service-Mode-Switching** (Einkaufsliste / Click&Collect / Lieferung)

---

## 6. Onboarding-Flow (Skizze für Phase 2b)

Wird in Phase 2b mit Hi-Fi-Mockups konkretisiert. Skizze hier nur als IA-Constraint:

```
1. Welcome
   "Willkommen bei Prime Athlete Academy"

2. Code- oder Magic-Link-Eingabe
   "Gib den Einladungs-Code von deinem Coach ein"
   (alternativ: Magic-Link aus E-Mail tappen)

3. Profil-Wahl
   "Was ist dein Sport?"
   ○ Fußball  ○ Kraftsport  ○ Ausdauer  ○ Sonstiges

4. Stammdaten
   Name, Geburtstag, Größe, Gewicht
   + sport-spezifisch (Fußball: Verein, Liga, Position)

5. Foto-Upload (optional)

6. Push-Permission
   "Wir benachrichtigen dich morgens mit deinem Tagesbriefing"

7. Done
   "Du bist drin. Jonas / Patrick wurde benachrichtigt."
   → Main-Mode mit Home-Tab
   → Empty-State falls noch kein Plan: "Dein Coach erstellt gerade deinen Plan"
```

---

## 7. Offene Punkte für Phase 2b

1. **Akzent-Farbe für Center-Button** — warmes Gold (PAA-Brand passend) oder etwas anderes? Klärt sich mit Design-System.
2. **Welcome-Splash-Texte** — wie FEELY ("Ernährung") oder PAA-spezifisch ("Fuel" / "Train" / "Heute")?
3. **Profil-Tab-Section-Reihenfolge** — was steht oben, was unten?
4. **Empty-States** für jeden Tab (kein Plan, keine Mahlzeiten, keine Coach-Nachricht) — eigene Mockups nötig
5. **Spieltermin-Sichtbarkeit** — wie prominent im Home, wie integriert in Ernährung-Matchday
6. **Sub-Mode-Persistenz** — wenn User in Training-Sub-Mode war, App schließt, dann öffnet: zurück zu Main oder zurück zu letztem Sub-Mode?
