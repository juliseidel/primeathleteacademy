import type { Enums } from '@/lib/database.types';

export type WorkoutTypeDb = Enums<'workout_type'>;

const OBERKOERPER  = require('@/assets/images/workouts/oberkoerper.png');
const UNTERKOERPER = require('@/assets/images/workouts/unterkoerper.png');
const SPRINTS      = require('@/assets/images/workouts/sprints.png');
const PRIMING      = require('@/assets/images/workouts/priming.png');
const RECOVERY     = require('@/assets/images/workouts/recovery.png');
const MATCHDAY     = require('@/assets/images/workouts/matchday.png');
const CORE         = require('@/assets/images/workouts/core.png');

const LOCAL_IMAGES: Record<WorkoutTypeDb, number> = {
  krafttraining_oberkoerper:  OBERKOERPER,
  krafttraining_unterkoerper: UNTERKOERPER,
  athletik:                   SPRINTS,
  schnelligkeit:              SPRINTS,
  sprint:                     SPRINTS,
  plyometrie:                 SPRINTS,
  core:                       CORE,
  mobility:                   RECOVERY,
  priming:                    PRIMING,
  regeneration:               RECOVERY,
  ausdauer:                   SPRINTS,
  technik:                    SPRINTS,
  spielform:                  SPRINTS,
  recovery:                   RECOVERY,
  mixed:                      OBERKOERPER,
};

export function workoutImageSource(type: WorkoutTypeDb): number {
  return LOCAL_IMAGES[type];
}

export function matchdayImageSource(): number {
  return MATCHDAY;
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
