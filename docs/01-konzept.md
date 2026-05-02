# Prime Athlete Academy — Konzept (Phase 1)

> **Status:** Phase 1 Konzept-Entwurf zur Freigabe.
> **Stand:** 2026-05-02
> **Nächster Schritt nach Freigabe:** Phase 2 (Architektur + Onboarding-Flow als User-Flow-Spec)

---

## 1. Vision

Prime Athlete Academy ersetzt die heutige Sammlung aus Google Sheets, Excel-Tabellen und Google Chat durch eine einzige, hochwertige App.

**Für die Coaches** (Jonas Kehl + Patrick Schetter): ein Web-Dashboard, in dem Trainings- und Ernährungspläne, Spieltermine und die Athleten-Kommunikation in einem Tool laufen. Was heute drei Stunden Excel-Arbeit am Sonntagabend kostet, soll in dreißig Minuten gehen.

**Für die Athleten:** eine Mobile App, in der jeden Morgen ein klares Tages-Briefing steht, der Trainings- und Ernährungsplan einen Tap entfernt ist und der Coach direkt erreichbar ist — ohne drei Apps zu öffnen.

---

## 2. Leitprinzipien (nicht verhandelbar)

### 2.1 Mensch vor Maschine
Maximale KI-Automatisierung im Backend, aber das **Persönliche und Individuelle der beiden Coaches darf nie verloren gehen.** Jedes KI-generierte Artefakt (Daily Briefing, Matchday-Protokoll, Plan-Vorschlag) hat einen Coach-Approval-Schritt oder ist nachträglich editierbar. Im Athleten-Erlebnis steht "Jonas hat das angepasst", nicht "die App hat berechnet".

### 2.2 Schritt für Schritt
Kein Big Bang. Jedes Feature wird einzeln gebaut, mit Test-Athleten erprobt — dann das nächste. Keine fünfzig Features parallel auf halbem Stand.

### 2.3 Premium-Design + Bedien-Klarheit
Sieht aus wie eine App, die man freiwillig öffnet. Nicht wie ein Excel-Ersatz mit Login. Design-Sprache: Pearl-Glasmorphism + Editorial Serif, von FEELY adaptiert (siehe CLAUDE.md).

### 2.4 Multi-Profile von Tag 1
Default-Profil ist Fußball (passt zur Mehrheit der heutigen Klienten). Aber das Datenmodell trägt von Anfang an weitere Profile (Kraftsport, Ausdauer, …). Jeder Athlet wählt sein Profil im Onboarding, einzelne Module schalten sich entsprechend um.

---

## 3. Coaches & Zielgruppe

### 3.1 Die zwei Coaches
- **Jonas Kehl** — Co-Founder & Head Coach. 8 Jahre FC Bayern München, aktiver Profifußballer 4. Liga, Sportwissenschafts-Studium. A-Lizenz Athletiktrainer, A-Lizenz Ernährungsberater, Personal Trainer.
- **Patrick Schetter** — Co-Founder & Head Coach. Jugend 1. FC Nürnberg + FC Carl Zeiss Jena, aktiver Profi 4. Liga, ~150k Follower auf Instagram. Gleiche Lizenzen.

**Beziehung im System:** beide gleichberechtigt, beide können alle Athleten betreuen. Pro Athlet gibt es einen "Lead Coach" für die Hauptverantwortung — beide haben Lese-/Schreibzugriff auf alle Daten.

### 3.2 Athleten heute
Profi-/Halbprofi-Fußballer Kreisliga bis 2. Bundesliga. Konkrete Referenzen: Kolja Oudenne (Hannover 96, 2. BL), Robin Heußer (Eintracht Braunschweig, 2. BL), Jannick Hofmann (RW Essen, 3. Liga), Veron Dobruna, Kaan Kurt, Alexander Prokopenko (alle Profi 4. Liga / Regionalliga).

### 3.3 Athleten morgen
Weiterhin Mehrheit Fußball, aber wachsende Zahl Kraftsportler, Ausdauerathleten, Sonstige. Multi-Profile-Architektur trägt das.

### 3.4 Sprache & Tonalität
- Du-Form überall
- Begriffe nach außen: **Athlet** (primär), **Spieler** im Fußball-Kontext, **Coach** für Jonas/Patrick
- Mix Deutsch / Englisch erlaubt ("Speed & Agility", "Matchday", "Recovery")
- Modern, motivierend, fachlich präzise — nicht arrogant

---

## 4. Feature-Katalog

### 4.1 MVP — Build Wochen 1–8

Ziel: Jonas + Patrick + 2-3 Test-Athleten ersetzen ihre Excel-Tabellen + Google Chat damit. Was im MVP nicht drin ist, läuft erstmal weiter über die alten Tools — wir reißen nichts ein, bevor der Ersatz steht.

| # | Feature | Wer | Was |
|---|---------|-----|-----|
| 1 | **Auth & Onboarding** | Beide | Coach: E-Mail + Passwort. Athlet: per Coach-Einladung (Code/Link), wählt Profil im Onboarding (Fußball/Kraftsport/…). |
| 2 | **Coach: Athleten-Übersicht** | Coach (Web) | Liste aller Athleten, gefiltert nach Lead-Coach. Status-Spalten: letzter Login, letzte Mahlzeit, letzte Trainingseinheit. Detail-View pro Athlet. |
| 3 | **Coach: Übungs-Library** | Coach (Web) | Eigene Übungen anlegen mit Demo-Video (Upload), Tags (Säule, Muskelgruppe, Schwierigkeit, Equipment), Beschreibung. Suchen + filtern. Bestehende Übungs-Videos von Jonas + Patrick werden nachgereicht und importiert. |
| 4 | **Coach: Trainingsplan-Editor** | Coach (Web) | Wochen-View pro Athlet. Tage befüllen mit Übungen aus Library. Pro Übung: Sätze × Wdh × RPE/Gewicht, optional Notizen. Plan veröffentlichen → Athlet sieht ihn sofort. |
| 5 | **Coach: Ernährungsplan-Editor** | Coach (Web) | Pro Athlet: Tages-Makros (kcal, P/F/KH), Beispiel-Mahlzeiten, Wasser-Ziel, Supplement-Liste. |
| 6 | **Coach: Spieltermine** | Coach (Web) | Pro Athlet Spieltermine eintragen (Datum, Uhrzeit, Heim/Auswärts, Gegner). Erzeugt Matchday-Slot beim Athleten + Kalender-Sync. |
| 7 | **Coach: Chat** | Coach (Web) | 1:1-Chat pro Athlet. Text, Voice-Memo, Foto, Video. (Spezialisiertes Form-Check-Tool kommt in Phase 2.) |
| 8 | **Athlet: Daily Briefing** | Athlet (Mobile) | Tages-Übersicht: Training heute (mit Direkt-Link), Mahlzeiten heute, Spieltag-Countdown, Coach-Notizen. **MVP: aus Plänen abgeleitet, nicht KI-generiert.** |
| 9 | **Athlet: Trainingsplan-View** | Athlet (Mobile) | Wochen-View + Tag-Detail. Pro Übung: Demo-Video, Sätze/Wdh, abhaken, Notiz hinterlassen ("12 statt 10 Wdh", "Knie hat gezwickt"). |
| 10 | **Athlet: Ernährungsplan + Foto-Tracking** | Athlet (Mobile) | Tages-Makros sehen, Mahlzeit per Foto loggen → KI-Schätzung (FEELY-Adaption) → manuell anpassen. Tageszähler vs. Plan. |
| 11 | **Athlet: Chat** | Athlet (Mobile) | 1:1 mit Lead-Coach. Text, Voice-Memo, Foto, Video. |
| 12 | **Athlet: Matchday-Protokoll** | Athlet (Mobile) | Pro Spieltermin ein Protokoll: Pre-Match-Mahlzeit, In-Game-Snacks, Post-Match-Recovery. **MVP: Coach füllt manuell (Template), Athlet sieht.** |
| 13 | **Push-Notifications** | Beide | Briefing-Push morgens, Chat-Pushes, Plan-Update-Pushes, Spieltag-Reminder. |

### 4.2 Phase 2 — nach MVP-Stabil-Lauf (Wochen 9–14)

- **KI-Daily-Briefing** mit Coach-Approval-Schritt
- **Auto-Matchday-Protokoll** (KI generiert aus Spieltermin + Plan, Coach overridet)
- **Video-Form-Check-Workflow** als eigener Flow (Athlet filmt 10s → Coach annotiert in Slow-Mo, Voice-Memo drauf, zurück)
- **fußball.de / FUPA Spielplan-Import** (Coach trägt Verein ein, App zieht Spielplan automatisch)
- **Recovery- / Schlaf-Modul** (manuelle Logs, Trends)
- **Verletzungs-Tracking + Reha-Pläne**
- **Coach-Notes pro Athlet** (interne private Notizen, Athlet sieht das nicht)
- **Auswertungen / Trends / Alerts** für Coaches ("Athlet X hat 3 Wochen kein Krafttraining gemacht")

### 4.3 Vision — langfristig

- Wearables (Garmin, Polar, Apple Watch) — bewusst aus MVP raus auf Wunsch der Coaches
- KI-Form-Drift-Analyse (App vergleicht Form-Check-Videos über Wochen)
- Gruppen-Features (Team-Sessions, Camps)
- Bezahlmodell (Stripe / Subscription) — separates Gespräch mit Jonas + Patrick
- Athleten-Community (vorsichtig, Premium-Charakter darf nicht leiden)
- Whitelabel / Mehr-Coach-Plattform

---

## 5. User-Stories

### 5.1 Coach (Jonas / Patrick)

**Plan-Erstellung (der zentrale Coach-Pain-Point heute)**
> Als Coach möchte ich am Sonntagabend für 15 Athleten den Wochen-Trainingsplan in 30 Minuten erstellen — heute brauche ich 3 Stunden in Excel. Pro Athlet will ich sehen: was hat er letzte Woche gemacht, was war RPE, welche Übungen liefen gut, welche nicht.

**Athleten-Übersicht**
> Als Coach möchte ich am Montagmorgen einen Blick auf das Dashboard werfen und sofort sehen: welche Athleten haben in der letzten Woche kein Training abgehakt, welche haben ihr Mahlzeit-Tracking schleifen lassen, wer hat einen Spieltag am Wochenende. Damit ich gezielt nachhake, statt Excel-Kolonne für Kolonne durchzugehen.

**Form-Check** (Phase 2)
> Als Coach möchte ich, dass mein Athlet mir ein 10-Sekunden-Video von seiner Squat schickt, ich mir das in der App anschaue, mit Voice-Memo darauf antworte — ohne WhatsApp zu öffnen.

**Spieltage**
> Als Coach möchte ich alle Spieltermine meiner Athleten in einem Wochen-Kalender sehen, damit ich Trainingspläne entsprechend taktiere (Matchday-Reduktion, Recovery-Phase).

**Persönliche Note bewahren** (Leitprinzip 2.1)
> Als Coach möchte ich, dass mein Athlet beim Daily Briefing nicht denkt "die App hat das berechnet", sondern "Jonas hat heute geschrieben". Ich will jede automatische Empfehlung übersteuern oder kurz kommentieren können, bevor sie raus geht.

### 5.2 Athlet

**Tages-Klarheit**
> Als Athlet will ich morgens um 7 Uhr eine Push bekommen: "Heute: Krafttraining 18 Uhr, Mittag mit 50g Protein, Spieltag in 2 Tagen — Reduktions-Phase". Ich will nicht 3 Tabs öffnen müssen.

**Training**
> Als Athlet will ich vor dem Training meinen Plan durchgehen, jede Übung mit Erklärvideo sehen, abhaken und kurze Notizen hinterlassen können ("12 statt 10 Wdh geschafft" / "Knie hat gezwickt").

**Ernährung**
> Als Athlet will ich nach dem Mittagessen ein Foto vom Teller machen — die App schätzt grob die Makros, ich passe an, fertig. Coach kriegt das im Stream mit, ohne dass ich es schicken muss.

**Spieltag**
> Als Athlet will ich am Spieltag-Morgen eine klare Anweisung haben: "3h vor Spiel diese Mahlzeit, 1h vor Spiel dieser Snack, in der Halbzeit das, danach das." Kein Nachdenken, nur ausführen.

**Coach erreichen**
> Als Athlet will ich meinem Coach in 5 Sekunden eine Frage stellen können — Voice-Memo, Foto oder kurzer Text. Ohne WhatsApp, alles in einer App.

---

## 6. Bewusst aus dem MVP raus

| Feature | Warum jetzt nicht | Wann |
|---------|-------------------|------|
| Wearables | Wunsch von Jonas + Patrick: erst Basics solide, dann Sensorik | Vision |
| Bezahlmodell | Muss Julian erst mit Coaches abstimmen | Vision |
| KI-Briefing automatisch | Erst mit echten Coach-Inputs lernen, was wirklich Wert hat | Phase 2 |
| Auto-Matchday-Protokoll | Dito — erstmal manuell, dann automatisieren | Phase 2 |
| fußball.de / FUPA-Import | Setzt Spieltermin-Workflow voraus, baut darauf auf | Phase 2 |
| Gruppen-Features | Verwässert MVP-Fokus auf 1-zu-1 Coaching | Vision |
| Whitelabel / andere Coach-Marken | Nicht vor 12-Monats-Marker | Vision |

---

## 7. Roadmap

```
Phase 1 — Konzept (jetzt)
  ✅ Vision & Leitprinzipien
  ✅ Coaches & Zielgruppe
  ✅ Feature-Katalog (MVP / Phase 2 / Vision)
  ✅ User-Stories
  □ User-Freigabe dieses Dokuments

Phase 2 — Architektur (~ 1 Woche)
  □ Datenmodell (Tabellen, Relations, RLS-Skizze)
  □ Auth-Flow (Coach- vs. Athlet-Rolle, Onboarding-Tokens, Account-Löschung)
  □ Storage-Konzept (Übungs-Videos, Mahlzeit-Fotos, Voice-Memos)
  □ Realtime-Konzept (Chat, Live-Plan-Updates)
  □ Onboarding-Flow als User-Flow-Spec (welche Screens in welcher Reihenfolge)

Phase 3 — Design-System & Onboarding-Mockups (~ 1-2 Wochen)
  □ Design-Token Athleten-App (Farben, Typo, Spacing, Komponenten)
  □ Design-Token Coach-Web
  □ Onboarding-Mockups Athleten-App (Hi-Fi)
  □ Onboarding-Mockups Coach-Web (Hi-Fi)
  □ Schlüssel-Screens: Daily Briefing, Trainingsplan-View, Foto-Tracking, Coach-Athleten-Übersicht, Trainingsplan-Editor

Phase 4 — Build MVP (~ 4-6 Wochen, Schritt für Schritt)
  □ 4a — Supabase: Schema + RLS + Auth aufsetzen
  □ 4b — Coach-Web: Auth + Athleten-Verzeichnis + Athlet-Einladung
  □ 4c — Coach-Web: Übungs-Library
  □ 4d — Coach-Web: Trainingsplan-Editor + Ernährungsplan-Editor
  □ 4e — Coach-Web: Spieltermine + Matchday-Protokoll-Template
  □ 4f — Athleten-App: Auth + Onboarding + Daily Briefing + Trainingsplan-View
  □ 4g — Athleten-App: Foto-Mahlzeit-Tracking (FEELY-Adaption)
  □ 4h — Beide: Chat (Text + Voice + Foto + Video)
  □ 4i — Push-Notifications

Phase 5 — Test mit 2-3 Athleten + Jonas + Patrick (1-2 Wochen)
  □ Echte Wochen-Pläne, echte Mahlzeiten, echte Spieltermine
  □ Bug-Fixes, UX-Polish

Phase 6 — Launch
  □ Migration aller Athleten von Excel/Google
  □ Coach-Onboarding-Session

Phase 7 — Phase 2 Features
  □ KI-Briefing, Auto-Matchday, Form-Check, fußball.de-Sync, Recovery-Modul, Verletzungs-Tracking, Coach-Notes, Trends/Alerts
```

---

## 8. Offene Punkte für Phase 2

1. **Account-Löschung bei Athlet-Kündigung:** vollständig löschen oder anonymisieren mit 30-Tage-Soft-Delete? (DSGVO-Pflicht: Recht auf Löschung — aber Coach will vielleicht Statistik behalten)
2. **Lead-Coach-Wechsel:** Wenn Athlet von Jonas zu Patrick wechselt, was passiert mit Plänen, Chat-Historie?
3. **Mehrere Spieltermine pro Tag** (z.B. Doppelturnier): ein Matchday-Protokoll oder mehrere?
4. **Kraftsport-Profil:** gibt es das Konzept "Wettkampf" überhaupt? Oder nur Trainings-Phasen (Aufbau, Definition)?
5. **Onboarding-Token:** Magic Link per E-Mail, oder Code im Web-Dashboard, der dem Athleten persönlich gegeben wird?
6. **Bezahlmodell-Hook:** auch wenn jetzt nicht aktiv — sollten wir die Datenstruktur (Subscriptions, Plan-Tier) schon vorsehen, damit später nicht refactored werden muss?
