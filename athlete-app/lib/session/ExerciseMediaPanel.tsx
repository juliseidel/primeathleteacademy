import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import type { Tables } from '@/lib/database.types';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { workoutImageSource, type WorkoutTypeDb } from '@/lib/training/workoutTypes';

type Props = {
  workoutType: WorkoutTypeDb;
  exercise: Tables<'workout_exercises'> & {
    library: Tables<'exercise_library'>;
  };
  exerciseIndex: number;
  exerciseTotal: number;
};

/**
 * Großes Demo-Panel oben im LiveTracking-Modal.
 * Aktuell: kein Video → Workout-Bild als Hintergrund mit dunklem Wash + Übungs-Titel.
 * Später: wenn `exercise.library.demo_video_url` vorhanden → Video / GIF.
 */
export function ExerciseMediaPanel({
  workoutType,
  exercise,
  exerciseIndex,
  exerciseTotal,
}: Props) {
  return (
    <View style={styles.panel}>
      <Image
        source={workoutImageSource(workoutType)}
        style={[StyleSheet.absoluteFill, styles.image]}
        contentFit="cover"
        transition={250}
        cachePolicy="memory-disk"
      />

      {/* Top wash */}
      <LinearGradient
        colors={['rgba(10,10,10,0.85)', 'rgba(10,10,10,0.20)']}
        locations={[0, 1]}
        style={styles.topWash}
      />
      {/* Bottom wash */}
      <LinearGradient
        colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.92)']}
        locations={[0, 1]}
        style={styles.bottomWash}
      />

      {/* Top row */}
      <View style={styles.topRow}>
        {exercise.group_label ? (
          <View style={styles.groupBadge}>
            <Text style={styles.groupBadgeText}>{exercise.group_label}</Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }} />
        <Text style={styles.counter}>
          ÜBUNG {exerciseIndex + 1} / {exerciseTotal}
        </Text>
      </View>

      {/* Bottom title block */}
      <View style={styles.bottomBlock}>
        {exercise.focus ? <Text style={styles.focus}>{exercise.focus.toUpperCase()}</Text> : null}
        <Text style={styles.title} numberOfLines={2}>
          {exercise.library.name}
        </Text>
      </View>
    </View>
  );
}

const PANEL_HEIGHT_RATIO = 0.42;

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    aspectRatio: 1 / PANEL_HEIGHT_RATIO,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: color.surfaceDeep,
  },
  image: {
    opacity: 0.78,
  },
  topWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  bottomWash: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  topRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[4],
    paddingTop: space[4],
    gap: space[3],
  },
  groupBadge: {
    minWidth: 36,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(197, 165, 90, 0.20)',
    borderWidth: 1,
    borderColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupBadgeText: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.5,
  },
  counter: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 2.4,
  },
  bottomBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space[5],
    paddingBottom: space[5],
    gap: space[2],
  },
  focus: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: '#D4B96E',
    letterSpacing: 2.8,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  title: {
    fontFamily: displaySerif as string,
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 36,
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
});
