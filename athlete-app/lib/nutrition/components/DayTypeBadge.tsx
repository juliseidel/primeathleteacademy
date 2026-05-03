import { StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';
import { DAY_TYPE_SHORT, type NutritionDayType } from '@/lib/nutrition/dayType';

export function DayTypeBadge({ dayType }: { dayType: NutritionDayType }) {
  const isMatchday = dayType === 'matchday';
  return (
    <View style={[styles.badge, isMatchday && styles.matchday]}>
      <Text style={[styles.label, isMatchday && styles.labelMatchday]}>{DAY_TYPE_SHORT[dayType]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space[3],
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: color.whiteA08,
    borderWidth: 1,
    borderColor: color.whiteA15,
  },
  matchday: {
    backgroundColor: color.text,
    borderColor: color.text,
  },
  label: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 2.6,
  },
  labelMatchday: {
    color: color.bg,
  },
});
