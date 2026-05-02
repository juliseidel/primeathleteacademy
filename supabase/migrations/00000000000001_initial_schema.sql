-- ============================================================================
-- Prime Athlete Academy — Initial Schema
-- ----------------------------------------------------------------------------
-- Stand: 2026-05-02
-- Bildet ab: Coach-/Athlet-Profile, Übungs-Library, Workouts mit Supersatz-
-- Logik (group_label A1/A2), flexible Plan-Notation (Reps-Range, Gewicht-
-- Display + parsbarer Wert), Pro-Seite-Tracking (side enum), Spieltage.
-- Datenmodell-Referenz: docs/05-datenmodell.md (folgt nach diesem Schema).
-- ============================================================================

-- Pflicht-Extension für gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- ENUMs
-- ============================================================================

CREATE TYPE user_role AS ENUM ('athlete', 'coach');

CREATE TYPE sport_profile AS ENUM ('football', 'strength', 'endurance', 'other');

CREATE TYPE workout_type AS ENUM (
  'krafttraining_oberkoerper',
  'krafttraining_unterkoerper',
  'athletik',
  'schnelligkeit',
  'sprint',
  'plyometrie',
  'core',
  'mobility',
  'priming',
  'regeneration',
  'ausdauer',
  'technik',
  'spielform',
  'recovery',
  'mixed'
);

CREATE TYPE workout_status AS ENUM (
  'planned',
  'in_progress',
  'completed',
  'skipped',
  'postponed'
);

CREATE TYPE workout_day_role AS ENUM (
  'paa_training',     -- vom Coach geplantes PAA-Training (volle Tracking-Sicht)
  'teamtraining_vm',  -- Verein-Vormittagstraining (nur Häkchen)
  'teamtraining_nm'   -- Verein-Nachmittagstraining (nur Häkchen)
);

CREATE TYPE measurement_type AS ENUM (
  'reps_weight',     -- Sätze × Wdh × Gewicht (klassisch Krafttraining)
  'reps_only',       -- Sätze × Wdh (Liegestütze, Klimmzüge ohne Zusatz)
  'time',            -- Sätze × Sekunden (Plank, Halteübungen)
  'distance',        -- Strecke (Sprint ohne Zeitmessung)
  'distance_time',   -- Strecke + Zeit (30m Sprint mit Zeitmessung)
  'rounds',          -- Runden × Stations (Drills, Circuits)
  'cardio',          -- Zeit/HF-basiert (Fahrradfahren, locker laufen)
  'mixed'            -- Komplexe Drills mit Mix
);

CREATE TYPE load_type AS ENUM (
  'barbell',           -- Langhantel mit Stange
  'dumbbell_pair',     -- Zwei Kurzhanteln (z.B. "2x15kg KH")
  'dumbbell_single',   -- Eine Kurzhantel (einarmig)
  'kettlebell',
  'medball',
  'bodyweight',
  'plate',
  'sled',
  'band',
  'machine',
  'other'
);

CREATE TYPE exercise_side AS ENUM ('both', 'left', 'right');

CREATE TYPE match_location AS ENUM ('home', 'away', 'neutral');

-- ============================================================================
-- HELPER: updated_at-Trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- HELPER: is_coach() — RLS-Helper
-- ============================================================================

CREATE OR REPLACE FUNCTION is_coach(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE id = uid AND role = 'coach'
  );
$$;

-- ============================================================================
-- TABELLE: profiles (gemeinsame Basis Athlet+Coach)
-- ============================================================================

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TABELLE: athlete_profiles (1:1 zu profiles)
-- ============================================================================

CREATE TABLE athlete_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  sport sport_profile NOT NULL DEFAULT 'football',
  date_of_birth date,
  height_cm integer,
  weight_kg numeric(5,2),
  -- Sport-spezifisch (Fußball)
  club text,
  league text,
  position text,
  -- Meta
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER athlete_profiles_updated_at
  BEFORE UPDATE ON athlete_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TABELLE: coach_profiles (1:1 zu profiles)
-- ============================================================================

CREATE TABLE coach_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bio text,
  licenses text[] NOT NULL DEFAULT '{}',
  instagram_handle text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER coach_profiles_updated_at
  BEFORE UPDATE ON coach_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- TABELLE: coach_athlete_assignments (N:M, beide Coaches gleichberechtigt)
-- ============================================================================

CREATE TABLE coach_athlete_assignments (
  coach_id   uuid NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (coach_id, athlete_id)
);

-- ============================================================================
-- TABELLE: exercise_library (globale Übungs-Bibliothek)
-- ============================================================================

CREATE TABLE exercise_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  demo_video_url text,
  measurement_type measurement_type NOT NULL,
  tracks_per_side boolean NOT NULL DEFAULT false,
  default_load_type load_type,
  default_rest_sec integer,
  tags text[] NOT NULL DEFAULT '{}',
  difficulty text,                          -- 'beginner' | 'intermediate' | 'advanced'
  created_by uuid REFERENCES coach_profiles(id) ON DELETE SET NULL,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER exercise_library_updated_at
  BEFORE UPDATE ON exercise_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_exercise_library_active
  ON exercise_library(is_archived) WHERE is_archived = false;
CREATE INDEX idx_exercise_library_tags
  ON exercise_library USING gin(tags);

-- ============================================================================
-- TABELLE: workouts (1 Workout = 1 Trainingsreiz)
-- ============================================================================

CREATE TABLE workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  created_by_coach_id uuid REFERENCES coach_profiles(id) ON DELETE SET NULL,

  -- Plan-Header
  planned_date date NOT NULL,
  day_session_order integer NOT NULL DEFAULT 1,   -- 1 = erster Trainingsreiz, 2 = zweiter
  day_role workout_day_role NOT NULL DEFAULT 'paa_training',
  title text NOT NULL,
  type workout_type NOT NULL,
  status workout_status NOT NULL DEFAULT 'planned',
  estimated_duration_min integer,
  rpe_target integer,
  coach_global_note text,
  block_tag text,                                  -- "Aufbauphase April 2026"

  -- Execution
  started_at timestamptz,
  completed_at timestamptz,
  actual_duration_min integer,

  -- Athleten-Reflektion (Session-Summary am Ende)
  athlete_rpe integer,
  athlete_energy integer,
  athlete_summary_notes text,

  -- Meta
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (athlete_id, planned_date, day_session_order, day_role)
);

CREATE TRIGGER workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_workouts_athlete_date ON workouts(athlete_id, planned_date DESC);
CREATE INDEX idx_workouts_status ON workouts(status);

-- ============================================================================
-- TABELLE: workout_exercises (mit Supersatz-group_label A1/A2)
-- ============================================================================

CREATE TABLE workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_library_id uuid NOT NULL REFERENCES exercise_library(id) ON DELETE RESTRICT,

  order_index integer NOT NULL,
  group_label text,           -- 'A1', 'A2', 'B1', 'B2', ... oder NULL für freistehend
  focus text,                  -- 'Kraft', 'Explosivität', 'Anti-Rotation', ...
  tempo text,                  -- '3-1-1-1' oder leer
  coach_notes text,            -- "1 Rep in Reserve"
  athlete_notes text,

  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER workout_exercises_updated_at
  BEFORE UPDATE ON workout_exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_workout_exercises_workout
  ON workout_exercises(workout_id, order_index);

-- ============================================================================
-- TABELLE: workout_exercise_sets (Pro-Satz-Tracking)
-- ============================================================================

CREATE TABLE workout_exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id uuid NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,

  set_number integer NOT NULL,
  side exercise_side NOT NULL DEFAULT 'both',

  -- Plan (alle nullable, je nach measurement_type)
  planned_reps_min integer,
  planned_reps_max integer,
  planned_reps_label text,           -- 'max', 'all out', 'AMRAP'
  planned_load_kg numeric(6,2),
  planned_load_display text,         -- "Stange+10kg", "2x15kg KH", "12,5-14kg"
  planned_load_type load_type,
  planned_distance_m numeric(6,2),
  planned_time_sec integer,
  planned_rest_sec integer,
  planned_tempo text,

  -- Ist (Athleten-Werte)
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  actual_reps integer,
  actual_load_kg numeric(6,2),
  actual_distance_m numeric(6,2),
  actual_time_sec numeric(6,3),       -- 3 Decimal für 4.123s Sprint
  actual_rpe integer,
  athlete_notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (workout_exercise_id, set_number, side)
);

CREATE TRIGGER workout_exercise_sets_updated_at
  BEFORE UPDATE ON workout_exercise_sets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_workout_exercise_sets_exercise
  ON workout_exercise_sets(workout_exercise_id, set_number, side);

-- ============================================================================
-- TABELLE: matches (Spieltage — eigenes Konzept neben Workouts)
-- ============================================================================

CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  match_date date NOT NULL,
  match_time time,
  location match_location NOT NULL DEFAULT 'home',
  opponent text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_matches_athlete_date ON matches(athlete_id, match_date);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_athlete_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_library          ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises         ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercise_sets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches                   ENABLE ROW LEVEL SECURITY;

-- profiles: alle Authenticated lesen, eigenes UPDATE
CREATE POLICY profiles_select_authenticated ON profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY profiles_update_self ON profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- athlete_profiles: Athlet selbst + alle Coaches
CREATE POLICY athlete_profiles_select ON athlete_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_coach(auth.uid()));
CREATE POLICY athlete_profiles_insert_self ON athlete_profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY athlete_profiles_update_self ON athlete_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- coach_profiles: alle lesen, eigener Coach updated
CREATE POLICY coach_profiles_select ON coach_profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY coach_profiles_insert_self ON coach_profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY coach_profiles_update_self ON coach_profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- coach_athlete_assignments: Beteiligte lesen, Coaches schreiben
CREATE POLICY assignments_select ON coach_athlete_assignments
  FOR SELECT TO authenticated
  USING (coach_id = auth.uid() OR athlete_id = auth.uid());
CREATE POLICY assignments_write_coach ON coach_athlete_assignments
  FOR ALL TO authenticated
  USING (is_coach(auth.uid()))
  WITH CHECK (is_coach(auth.uid()));

-- exercise_library: alle lesen, Coaches schreiben
CREATE POLICY library_select ON exercise_library
  FOR SELECT TO authenticated USING (true);
CREATE POLICY library_write_coach ON exercise_library
  FOR ALL TO authenticated
  USING (is_coach(auth.uid()))
  WITH CHECK (is_coach(auth.uid()));

-- workouts: Athlet (eigene) + alle Coaches
CREATE POLICY workouts_select ON workouts
  FOR SELECT TO authenticated
  USING (athlete_id = auth.uid() OR is_coach(auth.uid()));
CREATE POLICY workouts_insert_coach ON workouts
  FOR INSERT TO authenticated
  WITH CHECK (is_coach(auth.uid()));
CREATE POLICY workouts_update_owner ON workouts
  FOR UPDATE TO authenticated
  USING (athlete_id = auth.uid() OR is_coach(auth.uid()));
CREATE POLICY workouts_delete_coach ON workouts
  FOR DELETE TO authenticated
  USING (is_coach(auth.uid()));

-- workout_exercises: über Workout-Owner
CREATE POLICY workout_exercises_select ON workout_exercises
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts w
      WHERE w.id = workout_exercises.workout_id
        AND (w.athlete_id = auth.uid() OR is_coach(auth.uid()))
    )
  );
CREATE POLICY workout_exercises_write ON workout_exercises
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts w
      WHERE w.id = workout_exercises.workout_id
        AND (w.athlete_id = auth.uid() OR is_coach(auth.uid()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts w
      WHERE w.id = workout_exercises.workout_id
        AND (w.athlete_id = auth.uid() OR is_coach(auth.uid()))
    )
  );

-- workout_exercise_sets: über Workout-Owner
CREATE POLICY workout_exercise_sets_select ON workout_exercise_sets
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_sets.workout_exercise_id
        AND (w.athlete_id = auth.uid() OR is_coach(auth.uid()))
    )
  );
CREATE POLICY workout_exercise_sets_write ON workout_exercise_sets
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_sets.workout_exercise_id
        AND (w.athlete_id = auth.uid() OR is_coach(auth.uid()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_sets.workout_exercise_id
        AND (w.athlete_id = auth.uid() OR is_coach(auth.uid()))
    )
  );

-- matches: Athlet (eigene) + alle Coaches
CREATE POLICY matches_select ON matches
  FOR SELECT TO authenticated
  USING (athlete_id = auth.uid() OR is_coach(auth.uid()));
CREATE POLICY matches_write_coach ON matches
  FOR ALL TO authenticated
  USING (is_coach(auth.uid()))
  WITH CHECK (is_coach(auth.uid()));
