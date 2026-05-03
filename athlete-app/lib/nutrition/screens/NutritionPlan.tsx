import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { DAY_TYPE_LABEL, type NutritionDayType } from '@/lib/nutrition/dayType';
import { supabase } from '@/lib/supabase';

const TEMPLATE_ORDER: NutritionDayType[] = [
  'offday',
  'one_session',
  'two_sessions',
  'matchday_minus1',
  'matchday',
];

export function NutritionPlan() {
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const userId = session?.user.id;

  const templatesQuery = useQuery({
    queryKey: ['nutrition', 'all-templates', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nutrition_day_templates')
        .select('*, meals:nutrition_template_meals(id)')
        .eq('athlete_id', userId!)
        .eq('is_active', true);
      if (error) throw error;
      return data ?? [];
    },
  });

  const templates = templatesQuery.data ?? [];
  const sorted = TEMPLATE_ORDER.map((t) => templates.find((tpl) => tpl.template_type === t)).filter(
    (t): t is NonNullable<typeof t> => !!t,
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[3], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>ERNÄHRUNG · PLAN</Text>
      <Text style={styles.headline}>Deine Tagestypen</Text>
      <Text style={styles.intro}>
        Dein Coach pflegt für jeden Tagestyp ein eigenes Plan-Template. Die App ordnet automatisch
        je nach Trainingsplan und Spielterminen das passende Template zu.
      </Text>

      <View style={styles.list}>
        {sorted.map((tpl) => (
          <View key={tpl.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{DAY_TYPE_LABEL[tpl.template_type]}</Text>
              {tpl.target_kcal ? (
                <Text style={styles.cardKcal}>{tpl.target_kcal.toLocaleString('de-DE')} kcal</Text>
              ) : (
                <Text style={styles.cardKcalFree}>frei</Text>
              )}
            </View>
            {tpl.target_protein_g ? (
              <Text style={styles.cardMacros}>
                {tpl.target_protein_g}g P · {tpl.target_carbs_g}g C · {tpl.target_fat_g}g F
              </Text>
            ) : null}
            {tpl.notes ? <Text style={styles.cardNote}>{tpl.notes}</Text> : null}
            <View style={styles.cardFooter}>
              <Ionicons name="restaurant-outline" size={12} color={color.textMuted} />
              <Text style={styles.cardFooterText}>
                {(tpl as { meals?: { id: string }[] }).meals?.length ?? 0} Slots
              </Text>
            </View>
          </View>
        ))}
      </View>
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
  list: {
    gap: space[3],
  },
  card: {
    padding: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    gap: space[2],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  cardTitle: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    color: color.text,
    letterSpacing: -0.4,
  },
  cardKcal: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
  },
  cardKcalFree: {
    fontFamily: displaySerif as string,
    fontSize: 16,
    fontStyle: 'italic',
    color: color.text,
  },
  cardMacros: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  cardNote: {
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 13,
    color: color.text,
    marginTop: space[1],
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingTop: space[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.05)',
    marginTop: space[2],
  },
  cardFooterText: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
});
