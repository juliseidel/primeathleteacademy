# Prime Athlete Academy

Coaching-Plattform für 2 Fußballer-Coaches + ihre Athleten/Klienten.
Mobile App (Athleten) + Web-Dashboard (Coaches) + Supabase Backend.

---

## ⛔ ABSOLUTE REGELN — NIEMALS BRECHEN

### 1. Landing-Page im Root ist TABU
Im Root (`/Users/julianseidel/primeathleteacademy/`) liegt eine **LIVE Next.js Landing-Page auf Vercel**. Sie ist perfekt, wird gebraucht und darf NIEMALS verändert, refaktoriert oder umstrukturiert werden.

**Niemals editieren, verschieben oder löschen:**
- Ordner: `src/`, `public/`, `.next/`, `.vercel/`
- Files im Root: `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.tsbuildinfo`, `next.config.ts`, `next-env.d.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `README.md`

**Erlaubt im Root sind nur:**
- Diese `CLAUDE.md` (Projekt-Doku für Claude)
- Neue Sub-Ordner: `athlete-app/`, `coach-dashboard/`, `supabase/`, `docs/`
- Vorsichtige additive Erweiterungen der `.gitignore` (nichts entfernen)

Wenn du dir nicht sicher bist, ob etwas zur Landing-Page gehört → **nicht anfassen, fragen.**

### 2. FEELY (EchtGesund_NEU3) ist read-only
`/Users/julianseidel/EchtGesund_NEU3/` ist ein anderes Live-Projekt. Nur LESEN.
Code übernehmen = lesen, kopieren, in Prime Athlete Academy einfügen + dort anpassen.
NIEMALS Edit/Write auf FEELY-Files.

---

## Projekt-Struktur

```
/Users/julianseidel/primeathleteacademy/
├── (Root)              → Landing-Page Next.js (TABU, läuft live auf Vercel)
├── athlete-app/        → Expo Mobile App für Athleten/Klienten
├── coach-dashboard/    → Next.js Web-Dashboard für die 2 Coaches
├── supabase/           → DB-Migrationen, Edge Functions, RLS
└── docs/               → Projekt-Doku, Konzepte, Pläne
```

## Stack (für athlete-app + coach-dashboard + supabase)

- **Mobile:** Expo SDK 54+ + React Native + TypeScript + Expo Router (file-based)
- **Web:** Next.js 16.1 + TypeScript + Tailwind 4 + App Router + Turbopack
- **Backend:** Supabase (Postgres 17 + Auth + Storage + Edge Functions)
- **KI:** Gemini 2.5 Flash (wie FEELY) — für Coach-Empfehlungen, Trainings/Ernährung
- **Sprache:** Deutsch (UI), TypeScript (Code)

## Supabase

- **Project ID:** `qrsbkofbikbxkmzyuibc`
- **URL:** `https://qrsbkofbikbxkmzyuibc.supabase.co`
- **Region:** `eu-west-1` (Ireland)
- **Postgres:** 17.6
- **Plan:** Pro ($10/Monat)
- **Org:** juliseidel's Org (`bffebpwdedyqjnwuwrwy`)

**Client-Setup:**
- Athleten-App: [`athlete-app/lib/supabase.ts`](athlete-app/lib/supabase.ts) — `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY` aus `.env.local`
- Coach-Dashboard: [`coach-dashboard/src/lib/supabase/client.ts`](coach-dashboard/src/lib/supabase/client.ts) (Browser) + [`server.ts`](coach-dashboard/src/lib/supabase/server.ts) (Server Components) — `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` aus `.env.local`

`.env.local` ist gitignored. `.env.example` als Template committed.

## App-Konzept

- **Athleten-App (Mobile):** Trainings-Plan empfangen, Ernährung tracken, Check-ins, Chat mit Coach, Fortschritt visualisieren
- **Coach-Dashboard (Web):** Athleten verwalten, Trainings- & Ernährungs-Pläne erstellen/zuweisen, Fortschritt überwachen, Chat
- **Backend:** Auth (Rolle: Athlet vs Coach), Pläne, Tracking, Chat, Push-Notifications

## Aus FEELY übernehmen (nur kopieren, nicht importieren!)

- **Design-System:** Pearl Glasmorphism + Editorial Serif. Referenz: FEELY Memory `design_system_feely_premium.md`
- **Essens-Tracker:** Logic + UI-Patterns (ohne Allergen-Layer, dafür Coach-Vorgaben/Makros)
- **Gemini-Service-Patterns:** Struktur-Vorlage, neu adaptiert für Coach-Kontext
- **Onboarding-UX:** Flow-Pattern
- **Supabase-Patterns:** RLS-Struktur, Migrations-Setup, Edge-Function-Aufbau

## Was NICHT übernehmen
Marktplatz, Stripe-Connect, Restaurant-Bestellungen, Lokales-Tab, Allergen-System — alles E-Commerce/FEELY-spezifisch und für Coaching irrelevant.

---

## ⚠️ ARBEITSWEISE — Step-by-Step, NIEMALS überstürzen

Vor jeder größeren Implementation (DB-Schema, neuem Feature, Refactor) **zuerst tiefgründig planen**: Optionen abwägen, mit User besprechen, Feedback einholen. **Erst wenn der Plan klar ist und der User explizit grünes Licht gibt, wird gebaut.** Alles auf einmal zu bauen geht schief.

**Why:** Coaching-App ist konzeptionell sensibel — falsche DB-Struktur, falscher Auth-Flow oder falsche Feature-Priorisierung würde später Refactor-Wellen auslösen, die viel teurer sind als 30 Min Planung vorab.

**How to apply:** Bei jedem "lass uns X bauen" zuerst: (1) Konzept-Skizze, (2) Optionen mit Trade-offs, (3) konkrete Frage an User, (4) Bestätigung abwarten, (5) DANN bauen.
