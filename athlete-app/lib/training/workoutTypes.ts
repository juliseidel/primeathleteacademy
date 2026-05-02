import type { Enums } from '@/lib/database.types';

export type WorkoutTypeDb = Enums<'workout_type'>;

const LOCAL_IMAGES: Partial<Record<WorkoutTypeDb, number>> = {
  krafttraining_oberkoerper: require('@/assets/images/workout-krafttraining.png'),
  krafttraining_unterkoerper: require('@/assets/images/workout-krafttraining.png'),
};

const REMOTE_IMAGES: Record<WorkoutTypeDb, string> = {
  krafttraining_oberkoerper: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&fit=crop&auto=format',
  krafttraining_unterkoerper: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80&fit=crop&auto=format',
  athletik:                   'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&fit=crop&auto=format',
  schnelligkeit:              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop&auto=format',
  sprint:                     'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop&auto=format',
  plyometrie:                 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=900&q=80&fit=crop&auto=format',
  core:                       'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&fit=crop&auto=format',
  mobility:                   'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80&fit=crop&auto=format',
  priming:                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop&auto=format',
  regeneration:               'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80&fit=crop&auto=format',
  ausdauer:                   'https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=900&q=80&fit=crop&auto=format',
  technik:                    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80&fit=crop&auto=format',
  spielform:                  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&q=80&fit=crop&auto=format',
  recovery:                   'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80&fit=crop&auto=format',
  mixed:                      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&fit=crop&auto=format',
};

export function workoutImageSource(type: WorkoutTypeDb): number | string {
  return LOCAL_IMAGES[type] ?? REMOTE_IMAGES[type];
}

export const WORKOUT_TYPE_LABEL: Record<WorkoutTypeDb, string> = {
  krafttraining_oberkoerper: 'Krafttraining · Oberkörper',
  krafttraining_unterkoerper: 'Krafttraining · Unterkörper',
  athletik:                   'Athletik',
  schnelligkeit:              'Schnelligkeit',
  sprint:                     'Sprint',
  plyometrie:                 'Plyometrie',
  core:                       'Core',
  mobility:                   'Mobility',
  priming:                    'Priming',
  regeneration:               'Regeneration',
  ausdauer:                   'Ausdauer',
  technik:                    'Technik',
  spielform:                  'Spielform',
  recovery:                   'Recovery',
  mixed:                      'Mixed',
};

const SHORT_LABELS: Record<WorkoutTypeDb, string> = {
  krafttraining_oberkoerper: 'KRAFTTRAINING',
  krafttraining_unterkoerper: 'KRAFTTRAINING',
  athletik:                   'ATHLETIK',
  schnelligkeit:              'SCHNELLIGKEIT',
  sprint:                     'SPRINT',
  plyometrie:                 'PLYOMETRIE',
  core:                       'CORE',
  mobility:                   'MOBILITY',
  priming:                    'PRIMING',
  regeneration:               'REGENERATION',
  ausdauer:                   'AUSDAUER',
  technik:                    'TECHNIK',
  spielform:                  'SPIELFORM',
  recovery:                   'RECOVERY',
  mixed:                      'TRAINING',
};

export function workoutShortLabel(type: WorkoutTypeDb): string {
  return SHORT_LABELS[type];
}
