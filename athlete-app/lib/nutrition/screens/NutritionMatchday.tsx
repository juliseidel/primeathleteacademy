import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { displaySerif } from '@/lib/design/light';
import { color, font, space } from '@/lib/design/tokens';
import { MealCard } from '@/lib/nutrition/components/MealCard';
import { useNutritionTemplate } from '@/lib/nutrition/nutritionData';

export function NutritionMatchday() {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const userId = session?.user.id;
  const templateQuery = useNutritionTemplate(userId, 'matchday');
  const template = templateQuery.data;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[3], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>ERNÄHRUNG · MATCHDAY</Text>
      <Text style={styles.headline}>Spieltag-Routine</Text>
      <Text style={styles.intro}>
        Pre-Match · Halbzeit · Post-Match — alles vom Coach durchgetaktet.
      </Text>

      {templateQuery.isLoading ? (
        <ActivityIndicator color={color.text} style={{ marginTop: space[10] }} />
      ) : !template ? (
        <Text style={styles.empty}>Noch kein Matchday-Template hinterlegt.</Text>
      ) : (
        <View style={styles.list}>
          {template.notes ? <Text style={styles.note}>{template.notes}</Text> : null}
          {template.meals.map((meal, idx) => (
            <MealCard key={meal.id} meal={meal} slotIndex={idx + 1} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 3.0,
  },
  headline: {
    fontFamily: displaySerif as string,
    fontSize: 32,
    fontStyle: 'italic',
    color: color.text,
    letterSpacing: -0.5,
    marginTop: space[2],
  },
  intro: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    lineHeight: 19,
    marginTop: space[3],
    marginBottom: space[5],
  },
  note: {
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 14,
    color: color.text,
    paddingBottom: space[2],
  },
  list: {
    gap: space[3],
  },
  empty: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    textAlign: 'center',
    paddingVertical: space[10],
  },
});
