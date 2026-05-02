import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WorkoutCard } from '@/lib/design/components/WorkoutCard';
import { color, font, space } from '@/lib/design/tokens';
import { WEEK } from '@/lib/training/mockData';

export function TrainingWoche() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[4], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>WOCHE</Text>
      <Text style={styles.headline}>Diese Woche</Text>

      <View style={styles.list}>
        {WEEK.map((day) => {
          if (!day.workout) {
            return (
              <View key={day.weekday} style={styles.restRow}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayName}>{day.weekday}</Text>
                  <Text style={styles.dayDate}>{day.date}</Text>
                </View>
                <View style={styles.restCard}>
                  <Ionicons name="moon-outline" size={18} color={color.textMuted} />
                  <Text style={styles.restText}>Ruhetag</Text>
                </View>
              </View>
            );
          }

          return (
            <View key={day.weekday} style={styles.dayRow}>
              <View style={styles.dayBadge}>
                <Text style={[styles.dayName, day.isToday && { color: color.gold }]}>
                  {day.weekday}
                </Text>
                <Text style={[styles.dayDate, day.isToday && { color: color.gold }]}>
                  {day.date}
                </Text>
                {day.isToday ? <View style={styles.todayDot} /> : null}
              </View>
              <View style={styles.cardWrap}>
                <WorkoutCard
                  type={day.workout.type}
                  title={day.workout.title}
                  isMatchday={day.isMatchday}
                  isToday={day.isToday}
                  height={120}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
    gap: space[4],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 3.2,
  },
  headline: {
    fontFamily: font.family,
    fontSize: 30,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
    marginBottom: space[3],
    letterSpacing: -0.4,
  },
  list: { gap: space[3] },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  dayBadge: {
    width: 50,
    alignItems: 'center',
  },
  dayName: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 0.6,
  },
  dayDate: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: color.gold,
    marginTop: 4,
  },
  cardWrap: {
    flex: 1,
  },
  restCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(20,20,20,0.4)',
  },
  restText: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
});
