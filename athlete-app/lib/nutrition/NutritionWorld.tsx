import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { color, glow } from '@/lib/design/tokens';
import { useAthleteNav } from '@/lib/nav/AthleteNavContext';

import { NutritionHeute } from './screens/NutritionHeute';
import { NutritionLebensmittel } from './screens/NutritionLebensmittel';
import { NutritionMatchday } from './screens/NutritionMatchday';
import { NutritionPlan } from './screens/NutritionPlan';

export function NutritionWorld() {
  const nav = useAthleteNav();

  useEffect(() => {
    if (nav.mode !== 'nutrition-sub') {
      nav.enterNutritionSub();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <BackgroundDecor />
      {nav.nutritionSubTab === 'heute' && <NutritionHeute />}
      {nav.nutritionSubTab === 'plan' && <NutritionPlan />}
      {nav.nutritionSubTab === 'lebensmittel' && <NutritionLebensmittel />}
      {nav.nutritionSubTab === 'matchday' && <NutritionMatchday />}
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
      <View style={[styles.orb, { top: -180, right: -160, ...glow.goldHaloOuter }]} />
      <View style={[styles.orb, styles.orbBottomLeft]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
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
