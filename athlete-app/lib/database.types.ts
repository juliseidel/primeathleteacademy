export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      athlete_profiles: {
        Row: {
          club: string | null
          created_at: string
          date_of_birth: string | null
          height_cm: number | null
          id: string
          league: string | null
          position: string | null
          sport: Database["public"]["Enums"]["sport_profile"]
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          club?: string | null
          created_at?: string
          date_of_birth?: string | null
          height_cm?: number | null
          id: string
          league?: string | null
          position?: string | null
          sport?: Database["public"]["Enums"]["sport_profile"]
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          club?: string | null
          created_at?: string
          date_of_birth?: string | null
          height_cm?: number | null
          id?: string
          league?: string | null
          position?: string | null
          sport?: Database["public"]["Enums"]["sport_profile"]
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      coach_athlete_assignments: {
        Row: {
          athlete_id: string
          coach_id: string
          created_at: string
        }
        Insert: {
          athlete_id: string
          coach_id: string
          created_at?: string
        }
        Update: {
          athlete_id?: string
          coach_id?: string
          created_at?: string
        }
        Relationships: []
      }
      coach_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          instagram_handle: string | null
          licenses: string[]
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          instagram_handle?: string | null
          licenses?: string[]
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          instagram_handle?: string | null
          licenses?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      exercise_library: {
        Row: {
          created_at: string
          created_by: string | null
          default_load_type: Database["public"]["Enums"]["load_type"] | null
          default_rest_sec: number | null
          demo_video_url: string | null
          description: string | null
          difficulty: string | null
          id: string
          is_archived: boolean
          measurement_type: Database["public"]["Enums"]["measurement_type"]
          name: string
          tags: string[]
          tracks_per_side: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          default_load_type?: Database["public"]["Enums"]["load_type"] | null
          default_rest_sec?: number | null
          demo_video_url?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_archived?: boolean
          measurement_type: Database["public"]["Enums"]["measurement_type"]
          name: string
          tags?: string[]
          tracks_per_side?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          default_load_type?: Database["public"]["Enums"]["load_type"] | null
          default_rest_sec?: number | null
          demo_video_url?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_archived?: boolean
          measurement_type?: Database["public"]["Enums"]["measurement_type"]
          name?: string
          tags?: string[]
          tracks_per_side?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          athlete_id: string
          created_at: string
          id: string
          location: Database["public"]["Enums"]["match_location"]
          match_date: string
          match_time: string | null
          notes: string | null
          opponent: string | null
          updated_at: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          id?: string
          location?: Database["public"]["Enums"]["match_location"]
          match_date: string
          match_time?: string | null
          notes?: string | null
          opponent?: string | null
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          id?: string
          location?: Database["public"]["Enums"]["match_location"]
          match_date?: string
          match_time?: string | null
          notes?: string | null
          opponent?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      workout_exercise_sets: {
        Row: {
          actual_distance_m: number | null
          actual_load_kg: number | null
          actual_reps: number | null
          actual_rpe: number | null
          actual_time_sec: number | null
          athlete_notes: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          planned_distance_m: number | null
          planned_load_display: string | null
          planned_load_kg: number | null
          planned_load_type: Database["public"]["Enums"]["load_type"] | null
          planned_reps_label: string | null
          planned_reps_max: number | null
          planned_reps_min: number | null
          planned_rest_sec: number | null
          planned_tempo: string | null
          planned_time_sec: number | null
          set_number: number
          side: Database["public"]["Enums"]["exercise_side"]
          updated_at: string
          workout_exercise_id: string
        }
        Insert: {
          actual_distance_m?: number | null
          actual_load_kg?: number | null
          actual_reps?: number | null
          actual_rpe?: number | null
          actual_time_sec?: number | null
          athlete_notes?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          planned_distance_m?: number | null
          planned_load_display?: string | null
          planned_load_kg?: number | null
          planned_load_type?: Database["public"]["Enums"]["load_type"] | null
          planned_reps_label?: string | null
          planned_reps_max?: number | null
          planned_reps_min?: number | null
          planned_rest_sec?: number | null
          planned_tempo?: string | null
          planned_time_sec?: number | null
          set_number: number
          side?: Database["public"]["Enums"]["exercise_side"]
          updated_at?: string
          workout_exercise_id: string
        }
        Update: {
          actual_distance_m?: number | null
          actual_load_kg?: number | null
          actual_reps?: number | null
          actual_rpe?: number | null
          actual_time_sec?: number | null
          athlete_notes?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          planned_distance_m?: number | null
          planned_load_display?: string | null
          planned_load_kg?: number | null
          planned_load_type?: Database["public"]["Enums"]["load_type"] | null
          planned_reps_label?: string | null
          planned_reps_max?: number | null
          planned_reps_min?: number | null
          planned_rest_sec?: number | null
          planned_tempo?: string | null
          planned_time_sec?: number | null
          set_number?: number
          side?: Database["public"]["Enums"]["exercise_side"]
          updated_at?: string
          workout_exercise_id?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          archived_reason: string | null
          athlete_notes: string | null
          coach_notes: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          exercise_library_id: string
          focus: string | null
          group_label: string | null
          id: string
          is_archived: boolean
          order_index: number
          replaced_by_exercise_id: string | null
          swapped_at: string | null
          swapped_by: string | null
          tempo: string | null
          updated_at: string
          workout_id: string
        }
        Insert: {
          archived_reason?: string | null
          athlete_notes?: string | null
          coach_notes?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          exercise_library_id: string
          focus?: string | null
          group_label?: string | null
          id?: string
          is_archived?: boolean
          order_index: number
          replaced_by_exercise_id?: string | null
          swapped_at?: string | null
          swapped_by?: string | null
          tempo?: string | null
          updated_at?: string
          workout_id: string
        }
        Update: {
          archived_reason?: string | null
          athlete_notes?: string | null
          coach_notes?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          exercise_library_id?: string
          focus?: string | null
          group_label?: string | null
          id?: string
          is_archived?: boolean
          order_index?: number
          replaced_by_exercise_id?: string | null
          swapped_at?: string | null
          swapped_by?: string | null
          tempo?: string | null
          updated_at?: string
          workout_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          actual_duration_min: number | null
          athlete_energy: number | null
          athlete_id: string
          athlete_rpe: number | null
          athlete_summary_notes: string | null
          block_tag: string | null
          coach_global_note: string | null
          completed_at: string | null
          created_at: string
          created_by_coach_id: string | null
          day_role: Database["public"]["Enums"]["workout_day_role"]
          day_session_order: number
          estimated_duration_min: number | null
          id: string
          planned_date: string
          rpe_target: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["workout_status"]
          title: string
          type: Database["public"]["Enums"]["workout_type"]
          updated_at: string
        }
        Insert: {
          actual_duration_min?: number | null
          athlete_energy?: number | null
          athlete_id: string
          athlete_rpe?: number | null
          athlete_summary_notes?: string | null
          block_tag?: string | null
          coach_global_note?: string | null
          completed_at?: string | null
          created_at?: string
          created_by_coach_id?: string | null
          day_role?: Database["public"]["Enums"]["workout_day_role"]
          day_session_order?: number
          estimated_duration_min?: number | null
          id?: string
          planned_date: string
          rpe_target?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["workout_status"]
          title: string
          type: Database["public"]["Enums"]["workout_type"]
          updated_at?: string
        }
        Update: {
          actual_duration_min?: number | null
          athlete_energy?: number | null
          athlete_id?: string
          athlete_rpe?: number | null
          athlete_summary_notes?: string | null
          block_tag?: string | null
          coach_global_note?: string | null
          completed_at?: string | null
          created_at?: string
          created_by_coach_id?: string | null
          day_role?: Database["public"]["Enums"]["workout_day_role"]
          day_session_order?: number
          estimated_duration_min?: number | null
          id?: string
          planned_date?: string
          rpe_target?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["workout_status"]
          title?: string
          type?: Database["public"]["Enums"]["workout_type"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      is_coach: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      exercise_side: "both" | "left" | "right"
      load_type:
        | "barbell"
        | "dumbbell_pair"
        | "dumbbell_single"
        | "kettlebell"
        | "medball"
        | "bodyweight"
        | "plate"
        | "sled"
        | "band"
        | "machine"
        | "other"
      match_location: "home" | "away" | "neutral"
      measurement_type:
        | "reps_weight"
        | "reps_only"
        | "time"
        | "distance"
        | "distance_time"
        | "rounds"
        | "cardio"
        | "mixed"
      sport_profile: "football" | "strength" | "endurance" | "other"
      user_role: "athlete" | "coach"
      workout_day_role: "paa_training" | "teamtraining_vm" | "teamtraining_nm"
      workout_status:
        | "planned"
        | "in_progress"
        | "completed"
        | "skipped"
        | "postponed"
      workout_type:
        | "krafttraining_oberkoerper"
        | "krafttraining_unterkoerper"
        | "athletik"
        | "schnelligkeit"
        | "sprint"
        | "plyometrie"
        | "core"
        | "mobility"
        | "priming"
        | "regeneration"
        | "ausdauer"
        | "technik"
        | "spielform"
        | "recovery"
        | "mixed"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
