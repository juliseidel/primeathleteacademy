import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { color, glow } from '@/lib/design/tokens';
import { useAthleteNav } from '@/lib/nav/AthleteNavContext';

import { TrainingHeute } from './screens/TrainingHeute';
import { TrainingHistorie } from './screens/TrainingHistorie';
import { TrainingFortschritt } from './screens/TrainingFortschritt';
import { TrainingWoche } from './screens/TrainingWoche';

export function TrainingWorld() {
  const nav = useAthleteNav();

  // Make sure mode is in training-sub when this screen mounts
  // (handles direct navigation, hot-reload, deep links)
  useEffect(() => {
    if (nav.mode !== 'training-sub') {
      nav.enterTrainingSub();
    }
    // intentionally only run on mount — re-runs would loop the splash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <BackgroundDecor />
      {nav.trainingSubTab === 'heute' && <TrainingHeute />}
      {nav.trainingSubTab === 'woche' && <TrainingWoche />}
      {nav.trainingSubTab === 'historie' && <TrainingHistorie />}
      {nav.trainingSubTab === 'fortschritt' && <TrainingFortschritt />}
    </View>
  );
}

function BackgroundDecor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={[color.surfaceDeep, color.bg, color.bg]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, { top: -120, right: -120, ...glow.goldHaloOuter }]} />
      <View style={[styles.orb, { bottom: -180, left: -150, ...glow.goldHaloInner }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg,
  },
  orb: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: color.goldA10,
    opacity: 0.55,
  },
});
