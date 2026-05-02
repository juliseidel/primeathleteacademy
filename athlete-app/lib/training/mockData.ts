/**
 * Mock-Trainings-Daten für die UI-Iteration.
 * Wird später durch Supabase-Queries ersetzt.
 */

export type WorkoutType =
  | 'krafttraining'
  | 'athletik'
  | 'schnelligkeit'
  | 'ausdauer'
  | 'plyometrie'
  | 'mobility'
  | 'technik'
  | 'spielform'
  | 'recovery'
  | 'mixed';

export type WorkoutStatus = 'planned' | 'in_progress' | 'completed' | 'skipped' | 'postponed';

export type MeasurementType =
  | 'reps_weight'
  | 'reps_only'
  | 'time'
  | 'distance'
  | 'distance_time'
  | 'rounds'
  | 'mixed';

export type ExerciseSet = {
  setNumber: number;
  plannedReps?: number;
  plannedLoadKg?: number;
  plannedDistanceM?: number;
  plannedTimeSec?: number;
  plannedRestSec?: number;
  completed: boolean;
  actualReps?: number;
  actualLoadKg?: number;
  actualDistanceM?: number;
  actualTimeSec?: number;
};

export type Exercise = {
  id: string;
  name: string;
  measurementType: MeasurementType;
  coachNote?: string;
  sets: ExerciseSet[];
};

export type Workout = {
  id: string;
  date: string;
  title: string;
  type: WorkoutType;
  status: WorkoutStatus;
  estimatedDurationMin: number;
  rpeTarget?: number;
  coachNotes?: string;
  exercises: Exercise[];
};

export const TODAY_WORKOUT: Workout = {
  id: 'w-001',
  date: new Date().toISOString().slice(0, 10),
  title: 'Krafttraining · Unterkörper',
  type: 'krafttraining',
  status: 'planned',
  estimatedDurationMin: 45,
  rpeTarget: 7,
  coachNotes: 'Reduktions-Tag. Saubere Tiefe wichtiger als Gewicht. Stoppe wenn Form bricht.',
  exercises: [
    {
      id: 'e-1',
      name: 'Squat',
      measurementType: 'reps_weight',
      coachNote: 'Saubere Tiefe, Knie über Zehenspitzen',
      sets: [
        { setNumber: 1, plannedReps: 8, plannedLoadKg: 80, plannedRestSec: 120, completed: false },
        { setNumber: 2, plannedReps: 8, plannedLoadKg: 80, plannedRestSec: 120, completed: false },
        { setNumber: 3, plannedReps: 8, plannedLoadKg: 80, plannedRestSec: 120, completed: false },
        { setNumber: 4, plannedReps: 8, plannedLoadKg: 80, plannedRestSec: 120, completed: false },
      ],
    },
    {
      id: 'e-2',
      name: 'Romanian Deadlift',
      measurementType: 'reps_weight',
      sets: [
        { setNumber: 1, plannedReps: 10, plannedLoadKg: 70, plannedRestSec: 90, completed: false },
        { setNumber: 2, plannedReps: 10, plannedLoadKg: 70, plannedRestSec: 90, completed: false },
        { setNumber: 3, plannedReps: 10, plannedLoadKg: 70, plannedRestSec: 90, completed: false },
      ],
    },
    {
      id: 'e-3',
      name: 'Bulgarian Split Squat',
      measurementType: 'reps_weight',
      coachNote: 'Pro Bein',
      sets: [
        { setNumber: 1, plannedReps: 10, plannedLoadKg: 16, plannedRestSec: 60, completed: false },
        { setNumber: 2, plannedReps: 10, plannedLoadKg: 16, plannedRestSec: 60, completed: false },
        { setNumber: 3, plannedReps: 10, plannedLoadKg: 16, plannedRestSec: 60, completed: false },
      ],
    },
    {
      id: 'e-4',
      name: 'Calf Raise',
      measurementType: 'reps_weight',
      sets: [
        { setNumber: 1, plannedReps: 15, plannedLoadKg: 40, plannedRestSec: 45, completed: false },
        { setNumber: 2, plannedReps: 15, plannedLoadKg: 40, plannedRestSec: 45, completed: false },
        { setNumber: 3, plannedReps: 15, plannedLoadKg: 40, plannedRestSec: 45, completed: false },
        { setNumber: 4, plannedReps: 15, plannedLoadKg: 40, plannedRestSec: 45, completed: false },
      ],
    },
  ],
};

export type WeekDay = {
  weekday: string;     // 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So'
  date: string;        // 'DD.MM.'
  workout: { title: string; type: WorkoutType; status: WorkoutStatus } | null;
  isMatchday?: boolean;
  isToday?: boolean;
};

export const WEEK: WeekDay[] = [
  {
    weekday: 'Mo',
    date: '02.05.',
    isToday: true,
    workout: { title: 'Krafttraining · Unterkörper', type: 'krafttraining', status: 'planned' },
  },
  {
    weekday: 'Di',
    date: '03.05.',
    workout: { title: 'Athletik · Sprung & Schnelligkeit', type: 'athletik', status: 'planned' },
  },
  { weekday: 'Mi', date: '04.05.', workout: null },
  {
    weekday: 'Do',
    date: '05.05.',
    workout: { title: 'Krafttraining · Oberkörper', type: 'krafttraining', status: 'planned' },
  },
  {
    weekday: 'Fr',
    date: '06.05.',
    workout: { title: 'Conditioning · Position-spezifisch', type: 'ausdauer', status: 'planned' },
  },
  {
    weekday: 'Sa',
    date: '07.05.',
    isMatchday: true,
    workout: { title: 'Auswärts in Braunschweig', type: 'spielform', status: 'planned' },
  },
  {
    weekday: 'So',
    date: '08.05.',
    workout: { title: 'Recovery · Mobility & Stretching', type: 'recovery', status: 'planned' },
  },
];

export type HistorySession = {
  id: string;
  date: string;          // 'Sa, 26. Apr'
  isoDate: string;
  weekNumber: number;
  title: string;
  type: WorkoutType;
  durationMin: number;
  totalVolumeKg?: number;
  setsCompleted: number;
  setsTotal: number;
  rpe?: number;
  coachReaction?: string;
};

export const HISTORY: HistorySession[] = [
  {
    id: 'h-1',
    date: 'Sa, 26. Apr',
    isoDate: '2026-04-26',
    weekNumber: 17,
    title: 'Krafttraining · Oberkörper',
    type: 'krafttraining',
    durationMin: 52,
    totalVolumeKg: 4120,
    setsCompleted: 16,
    setsTotal: 16,
    rpe: 8,
    coachReaction: 'Saubere Session, Bench gut!',
  },
  {
    id: 'h-2',
    date: 'Do, 24. Apr',
    isoDate: '2026-04-24',
    weekNumber: 17,
    title: 'Athletik · Plyometrie',
    type: 'plyometrie',
    durationMin: 38,
    setsCompleted: 12,
    setsTotal: 12,
    rpe: 7,
  },
  {
    id: 'h-3',
    date: 'Mo, 22. Apr',
    isoDate: '2026-04-22',
    weekNumber: 17,
    title: 'Krafttraining · Unterkörper',
    type: 'krafttraining',
    durationMin: 47,
    totalVolumeKg: 3840,
    setsCompleted: 14,
    setsTotal: 14,
    rpe: 8,
  },
  {
    id: 'h-4',
    date: 'Fr, 19. Apr',
    isoDate: '2026-04-19',
    weekNumber: 16,
    title: 'Conditioning · Tempolauf',
    type: 'ausdauer',
    durationMin: 32,
    setsCompleted: 6,
    setsTotal: 6,
    rpe: 9,
    coachReaction: 'Auf der Linie, weiter so',
  },
  {
    id: 'h-5',
    date: 'Mi, 17. Apr',
    isoDate: '2026-04-17',
    weekNumber: 16,
    title: 'Athletik · Sprint & Reaktion',
    type: 'schnelligkeit',
    durationMin: 41,
    setsCompleted: 10,
    setsTotal: 10,
    rpe: 7,
  },
];

export type PersonalRecord = {
  id: string;
  exerciseName: string;
  value: string;       // '120kg × 5' oder '4.12s' oder '78cm'
  delta?: string;      // '+5kg' oder '-0.08s' (positiv = besser)
  daysSince: number;
  isNew: boolean;      // wenn < 7 Tage
};

export const PRS: PersonalRecord[] = [
  { id: 'pr-1', exerciseName: 'Squat', value: '120kg × 5', delta: '+5kg', daysSince: 6, isNew: true },
  { id: 'pr-2', exerciseName: 'Bench Press', value: '90kg × 6', daysSince: 22, isNew: false },
  { id: 'pr-3', exerciseName: '30m Sprint', value: '4.12s', delta: '−0.08s', daysSince: 1, isNew: true },
  { id: 'pr-4', exerciseName: 'Romanian Deadlift', value: '110kg × 8', daysSince: 14, isNew: false },
  { id: 'pr-5', exerciseName: 'Box Jump', value: '78cm', daysSince: 30, isNew: false },
];

export type ExerciseTrend = {
  id: string;
  exerciseName: string;
  measurementType: MeasurementType;
  values: number[];           // last 8 sessions
  unit: string;               // 'kg' | 's' | 'cm' | 'reps'
  trendPercent: number;       // positiv = besser (höher oder schneller je nach Logik)
  trendLabel: string;         // 'in 3 Mo'
};

export const TRENDS: ExerciseTrend[] = [
  {
    id: 't-1',
    exerciseName: 'Squat',
    measurementType: 'reps_weight',
    values: [105, 105, 110, 110, 115, 115, 120, 120],
    unit: 'kg',
    trendPercent: 12,
    trendLabel: 'in 3 Mo',
  },
  {
    id: 't-2',
    exerciseName: 'Bench Press',
    measurementType: 'reps_weight',
    values: [82, 85, 85, 87, 87, 90, 90, 90],
    unit: 'kg',
    trendPercent: 6,
    trendLabel: 'in 3 Mo',
  },
  {
    id: 't-3',
    exerciseName: 'Romanian Deadlift',
    measurementType: 'reps_weight',
    values: [100, 100, 105, 105, 105, 110, 110, 110],
    unit: 'kg',
    trendPercent: 5,
    trendLabel: 'in 3 Mo',
  },
  {
    id: 't-4',
    exerciseName: '30m Sprint',
    measurementType: 'distance_time',
    values: [4.32, 4.30, 4.28, 4.25, 4.22, 4.18, 4.15, 4.12],
    unit: 's',
    trendPercent: -4.6,
    trendLabel: 'verbessert',
  },
  {
    id: 't-5',
    exerciseName: 'Box Jump',
    measurementType: 'reps_only',
    values: [70, 72, 72, 74, 75, 76, 76, 78],
    unit: 'cm',
    trendPercent: 11,
    trendLabel: 'in 3 Mo',
  },
];

// Local branded images (PAA-eigene Premium-Fotos). Wenn vorhanden, werden diese
// gegenüber den Unsplash-Fallbacks bevorzugt.
const WORKOUT_IMAGE_LOCAL: Partial<Record<WorkoutType, number>> = {
  krafttraining: require('@/assets/images/workout-krafttraining.png'),
};

export const WORKOUT_IMAGE_URL: Record<WorkoutType, string> = {
  krafttraining:  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&fit=crop&auto=format',
  athletik:       'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&fit=crop&auto=format',
  schnelligkeit:  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop&auto=format',
  ausdauer:       'https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=900&q=80&fit=crop&auto=format',
  plyometrie:     'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=900&q=80&fit=crop&auto=format',
  mobility:       'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80&fit=crop&auto=format',
  technik:        'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80&fit=crop&auto=format',
  spielform:      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&q=80&fit=crop&auto=format',
  recovery:       'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80&fit=crop&auto=format',
  mixed:          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&fit=crop&auto=format',
};

/** Source resolver — local asset if available, otherwise remote URL */
export function workoutImageSource(type: WorkoutType): number | string {
  return WORKOUT_IMAGE_LOCAL[type] ?? WORKOUT_IMAGE_URL[type];
}

export const WORKOUT_TYPE_LABEL: Record<WorkoutType, string> = {
  krafttraining: 'Krafttraining',
  athletik: 'Athletik',
  schnelligkeit: 'Schnelligkeit',
  ausdauer: 'Ausdauer',
  plyometrie: 'Plyometrie',
  mobility: 'Mobility',
  technik: 'Technik',
  spielform: 'Spielform',
  recovery: 'Recovery',
  mixed: 'Mixed',
};
