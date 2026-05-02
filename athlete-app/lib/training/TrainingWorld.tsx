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

  useEffect(() => {
    if (nav.mode !== 'training-sub') {
      nav.enterTrainingSub();
    }
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
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Subtle warm gold ambience — adds depth without distraction */}
      <View style={[styles.orb, { top: -180, right: -160, ...glow.goldHaloOuter }]} />
      <View style={[styles.orb, styles.orbBottomLeft]} />
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
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: color.goldA10,
    opacity: 0.55,
  },
  orbBottomLeft: {
    bottom: -220,
    left: -180,
    opacity: 0.35,
  },
});
