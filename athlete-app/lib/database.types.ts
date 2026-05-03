export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      athlete_meal_log: {
        Row: {
          ai_analysis: Json | null
          athlete_id: string
          components: Json | null
          created_at: string
          display_name: string
          id: string
          is_deleted: boolean
          log_date: string
          log_time: string | null
          notes: string | null
          photo_url: string | null
          source: Database["public"]["Enums"]["nutrition_meal_log_source"]
          swapped_from_original: boolean
          template_meal_id: string | null
          total_carbs_g: number | null
          total_fat_g: number | null
          total_kcal: number | null
          total_protein_g: number | null
          updated_at: string
          voice_note_url: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          athlete_id: string
          components?: Json | null
          created_at?: string
          display_name: string
          id?: string
          is_deleted?: boolean
          log_date: string
          log_time?: string | null
          notes?: string | null
          photo_url?: string | null
          source: Database["public"]["Enums"]["nutrition_meal_log_source"]
          swapped_from_original?: boolean
          template_meal_id?: string | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_kcal?: number | null
          total_protein_g?: number | null
          updated_at?: string
          voice_note_url?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          athlete_id?: string
          components?: Json | null
          created_at?: string
          display_name?: string
          id?: string
          is_deleted?: boolean
          log_date?: string
          log_time?: string | null
          notes?: string | null
          photo_url?: string | null
          source?: Database["public"]["Enums"]["nutrition_meal_log_source"]
          swapped_from_original?: boolean
          template_meal_id?: string | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_kcal?: number | null
          total_protein_g?: number | null
          updated_at?: string
          voice_note_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_meal_log_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_meal_log_template_meal_id_fkey"
            columns: ["template_meal_id"]
            isOneToOne: false
            referencedRelation: "nutrition_template_meals"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_nutrition_day: {
        Row: {
          athlete_id: string
          created_at: string
          id: string
          override_by: string | null
          override_reason: string | null
          override_template_type:
            | Database["public"]["Enums"]["nutrition_day_type"]
            | null
          plan_date: string
          updated_at: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          id?: string
          override_by?: string | null
          override_reason?: string | null
          override_template_type?:
            | Database["public"]["Enums"]["nutrition_day_type"]
            | null
          plan_date: string
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          id?: string
          override_by?: string | null
          override_reason?: string | null
          override_template_type?:
            | Database["public"]["Enums"]["nutrition_day_type"]
            | null
          plan_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_nutrition_day_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_nutrition_day_override_by_fkey"
            columns: ["override_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_profiles: {
        Row: {
          avatar_data_uri: string | null
          avatar_updated_at: string | null
          club: string | null
          created_at: string
          date_of_birth: string | null
          face_description: string | null
          height_cm: number | null
          id: string
          league: string | null
          position: string | null
          selfie_data_uri: string | null
          sport: Database["public"]["Enums"]["sport_profile"]
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          avatar_data_uri?: string | null
          avatar_updated_at?: string | null
          club?: string | null
          created_at?: string
          date_of_birth?: string | null
          face_description?: string | null
          height_cm?: number | null
          id: string
          league?: string | null
          position?: string | null
          selfie_data_uri?: string | null
          sport?: Database["public"]["Enums"]["sport_profile"]
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          avatar_data_uri?: string | null
          avatar_updated_at?: string | null
          club?: string | null
          created_at?: string
          date_of_birth?: string | null
          face_description?: string | null
          height_cm?: number | null
          id?: string
          league?: string | null
          position?: string | null
          selfie_data_uri?: string | null
          sport?: Database["public"]["Enums"]["sport_profile"]
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_supplement_check: {
        Row: {
          athlete_id: string
          check_date: string
          checked_at: string
          id: string
          supplement_id: string
        }
        Insert: {
          athlete_id: string
          check_date: string
          checked_at?: string
          id?: string
          supplement_id: string
        }
        Update: {
          athlete_id?: string
          check_date?: string
          checked_at?: string
          id?: string
          supplement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_supplement_check_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_supplement_check_supplement_id_fkey"
            columns: ["supplement_id"]
            isOneToOne: false
            referencedRelation: "nutrition_daily_supplements"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_water_log: {
        Row: {
          amount_ml: number
          athlete_id: string
          created_at: string
          drink_type: Database["public"]["Enums"]["drink_type"]
          id: string
          log_date: string
          log_time: string
        }
        Insert: {
          amount_ml: number
          athlete_id: string
          created_at?: string
          drink_type?: Database["public"]["Enums"]["drink_type"]
          id?: string
          log_date: string
          log_time?: string
        }
        Update: {
          amount_ml?: number
          athlete_id?: string
          created_at?: string
          drink_type?: Database["public"]["Enums"]["drink_type"]
          id?: string
          log_date?: string
          log_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_water_log_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "coach_athlete_assignments_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_athlete_assignments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_food_database: {
        Row: {
          carbs_per_100g: number
          category: Database["public"]["Enums"]["nutrition_food_category"]
          created_at: string
          created_by_coach_id: string | null
          fat_per_100g: number
          id: string
          is_archived: boolean
          is_global: boolean
          kcal_per_100g: number
          name: string
          note: string | null
          protein_per_100g: number
          updated_at: string
        }
        Insert: {
          carbs_per_100g?: number
          category: Database["public"]["Enums"]["nutrition_food_category"]
          created_at?: string
          created_by_coach_id?: string | null
          fat_per_100g?: number
          id?: string
          is_archived?: boolean
          is_global?: boolean
          kcal_per_100g: number
          name: string
          note?: string | null
          protein_per_100g?: number
          updated_at?: string
        }
        Update: {
          carbs_per_100g?: number
          category?: Database["public"]["Enums"]["nutrition_food_category"]
          created_at?: string
          created_by_coach_id?: string | null
          fat_per_100g?: number
          id?: string
          is_archived?: boolean
          is_global?: boolean
          kcal_per_100g?: number
          name?: string
          note?: string | null
          protein_per_100g?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_food_database_created_by_coach_id_fkey"
            columns: ["created_by_coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "coach_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "exercise_library_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "matches_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_daily_supplements: {
        Row: {
          amount: string | null
          athlete_id: string | null
          benefit: string | null
          created_at: string
          display_order: number
          id: string
          is_archived: boolean
          name: string
          priority: Database["public"]["Enums"]["nutrition_supplement_priority"]
          updated_at: string
          when_to_take: string | null
        }
        Insert: {
          amount?: string | null
          athlete_id?: string | null
          benefit?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_archived?: boolean
          name: string
          priority: Database["public"]["Enums"]["nutrition_supplement_priority"]
          updated_at?: string
          when_to_take?: string | null
        }
        Update: {
          amount?: string | null
          athlete_id?: string | null
          benefit?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_archived?: boolean
          name?: string
          priority?: Database["public"]["Enums"]["nutrition_supplement_priority"]
          updated_at?: string
          when_to_take?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_daily_supplements_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_day_templates: {
        Row: {
          athlete_id: string
          created_at: string
          created_by_coach_id: string | null
          id: string
          is_active: boolean
          notes: string | null
          target_carbs_g: number | null
          target_fat_g: number | null
          target_kcal: number | null
          target_protein_g: number | null
          template_type: Database["public"]["Enums"]["nutrition_day_type"]
          updated_at: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          created_by_coach_id?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          target_kcal?: number | null
          target_protein_g?: number | null
          template_type: Database["public"]["Enums"]["nutrition_day_type"]
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          created_by_coach_id?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          target_carbs_g?: number | null
          target_fat_g?: number | null
          target_kcal?: number | null
          target_protein_g?: number | null
          template_type?: Database["public"]["Enums"]["nutrition_day_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_day_templates_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_day_templates_created_by_coach_id_fkey"
            columns: ["created_by_coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_template_meal_components: {
        Row: {
          amount_display: string | null
          amount_g: number
          category: Database["public"]["Enums"]["nutrition_food_category"]
          category_order: number
          created_at: string
          food_id: string | null
          food_name_override: string | null
          id: string
          meal_id: string
          notes: string | null
          swap_options: string | null
          updated_at: string
        }
        Insert: {
          amount_display?: string | null
          amount_g: number
          category: Database["public"]["Enums"]["nutrition_food_category"]
          category_order?: number
          created_at?: string
          food_id?: string | null
          food_name_override?: string | null
          id?: string
          meal_id: string
          notes?: string | null
          swap_options?: string | null
          updated_at?: string
        }
        Update: {
          amount_display?: string | null
          amount_g?: number
          category?: Database["public"]["Enums"]["nutrition_food_category"]
          category_order?: number
          created_at?: string
          food_id?: string | null
          food_name_override?: string | null
          id?: string
          meal_id?: string
          notes?: string | null
          swap_options?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_template_meal_components_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "coach_food_database"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_template_meal_components_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "nutrition_template_meals"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_template_meals: {
        Row: {
          created_at: string
          id: string
          is_snack_container: boolean
          notes: string | null
          slot_label: string
          slot_order: number
          swap_hint: string | null
          template_id: string
          timing_hint: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_snack_container?: boolean
          notes?: string | null
          slot_label: string
          slot_order: number
          swap_hint?: string | null
          template_id: string
          timing_hint?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_snack_container?: boolean
          notes?: string | null
          slot_label?: string
          slot_order?: number
          swap_hint?: string | null
          template_id?: string
          timing_hint?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_template_meals_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "nutrition_day_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_template_snacks: {
        Row: {
          amount_display: string | null
          amount_g: number
          created_at: string
          food_id: string | null
          food_name_override: string | null
          hint: string | null
          id: string
          meal_id: string
          snack_order: number
          updated_at: string
        }
        Insert: {
          amount_display?: string | null
          amount_g: number
          created_at?: string
          food_id?: string | null
          food_name_override?: string | null
          hint?: string | null
          id?: string
          meal_id: string
          snack_order: number
          updated_at?: string
        }
        Update: {
          amount_display?: string | null
          amount_g?: number
          created_at?: string
          food_id?: string | null
          food_name_override?: string | null
          hint?: string | null
          id?: string
          meal_id?: string
          snack_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_template_snacks_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "coach_food_database"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_template_snacks_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "nutrition_template_meals"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "workout_exercise_sets_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_library_id_fkey"
            columns: ["exercise_library_id"]
            isOneToOne: false
            referencedRelation: "exercise_library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_replaced_by_exercise_id_fkey"
            columns: ["replaced_by_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "workouts_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_created_by_coach_id_fkey"
            columns: ["created_by_coach_id"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_coach: { Args: { uid: string }; Returns: boolean }
    }
    Enums: {
      drink_type: "water" | "tea" | "coffee" | "juice" | "isotonic" | "other"
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
      nutrition_day_type:
        | "offday"
        | "one_session"
        | "two_sessions"
        | "matchday_minus1"
        | "matchday"
      nutrition_food_category:
        | "protein"
        | "carb"
        | "fat"
        | "vegetable"
        | "fruit"
        | "sauce"
        | "snack"
        | "other"
      nutrition_meal_log_source:
        | "coach_plan"
        | "photo"
        | "barcode"
        | "search"
        | "manual"
      nutrition_supplement_priority:
        | "daily"
        | "very_recommended"
        | "pre_training"
        | "post_training"
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      drink_type: ["water", "tea", "coffee", "juice", "isotonic", "other"],
      exercise_side: ["both", "left", "right"],
      load_type: [
        "barbell",
        "dumbbell_pair",
        "dumbbell_single",
        "kettlebell",
        "medball",
        "bodyweight",
        "plate",
        "sled",
        "band",
        "machine",
        "other",
      ],
      match_location: ["home", "away", "neutral"],
      measurement_type: [
        "reps_weight",
        "reps_only",
        "time",
        "distance",
        "distance_time",
        "rounds",
        "cardio",
        "mixed",
      ],
      nutrition_day_type: [
        "offday",
        "one_session",
        "two_sessions",
        "matchday_minus1",
        "matchday",
      ],
      nutrition_food_category: [
        "protein",
        "carb",
        "fat",
        "vegetable",
        "fruit",
        "sauce",
        "snack",
        "other",
      ],
      nutrition_meal_log_source: [
        "coach_plan",
        "photo",
        "barcode",
        "search",
        "manual",
      ],
      nutrition_supplement_priority: [
        "daily",
        "very_recommended",
        "pre_training",
        "post_training",
      ],
      sport_profile: ["football", "strength", "endurance", "other"],
      user_role: ["athlete", "coach"],
      workout_day_role: ["paa_training", "teamtraining_vm", "teamtraining_nm"],
      workout_status: [
        "planned",
        "in_progress",
        "completed",
        "skipped",
        "postponed",
      ],
      workout_type: [
        "krafttraining_oberkoerper",
        "krafttraining_unterkoerper",
        "athletik",
        "schnelligkeit",
        "sprint",
        "plyometrie",
        "core",
        "mobility",
        "priming",
        "regeneration",
        "ausdauer",
        "technik",
        "spielform",
        "recovery",
        "mixed",
      ],
    },
  },
} as const
