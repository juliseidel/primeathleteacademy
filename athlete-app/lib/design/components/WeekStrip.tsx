import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DarkGlassCard } from './DarkGlassCard';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

export type DayCell = {
  weekday: string;
  dayNumber: number;
  isToday?: boolean;
  isInPast?: boolean;
  status: 'completed' | 'in_progress' | 'planned' | 'skipped' | 'rest' | 'matchday';
};

type Props = {
  monthLabel: string;
  days: DayCell[];
  selectedKey: string;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onDayPress?: (day: DayCell) => void;
};

export function WeekStrip({
  monthLabel,
  days,
  selectedKey,
  onPrevWeek,
  onNextWeek,
  onDayPress,
}: Props) {
  return (
    <DarkGlassCard variant="premium" borderRadius={radius.xl}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Pressable onPress={onPrevWeek} hitSlop={10} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={16} color={color.textMuted} />
          </Pressable>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Pressable onPress={onNextWeek} hitSlop={10} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={16} color={color.textMuted} />
          </Pressable>
        </View>

        <View style={styles.daysRow}>
          {days.map((day) => {
            const key = `${day.weekday}-${day.dayNumber}`;
            const isSelected = selectedKey === key;

            return (
              <Pressable
                key={key}
                onPress={() => {
                  if (!isSelected) Haptics.selectionAsync();
                  onDayPress?.(day);
                }}
                style={({ pressed }) => [
                  styles.day,
                  isSelected && styles.daySelected,
                  pressed && !isSelected && styles.dayPressed,
                ]}
              >
                <Text
                  style={[
                    styles.weekday,
                    isSelected && styles.weekdayOnSelected,
                    day.isToday && !isSelected && styles.weekdayToday,
                  ]}
                >
                  {day.weekday}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.dayNumberOnSelected,
                    day.isToday && !isSelected && styles.dayNumberToday,
                  ]}
                >
                  {day.dayNumber}
                </Text>
                <View style={styles.statusRow}>
                  <StatusDot status={day.status} isPast={day.isInPast} onSelected={isSelected} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </DarkGlassCard>
  );
}

function StatusDot({
  status,
  isPast,
  onSelected,
}: {
  status: DayCell['status'];
  isPast?: boolean;
  onSelected?: boolean;
}) {
  if (status === 'rest') {
    return <View style={[styles.dot, styles.dotRest, onSelected && { opacity: 0.6 }]} />;
  }
  if (status === 'matchday') {
    return <View style={[styles.dot, styles.dotMatchday]} />;
  }
  if (status === 'completed') {
    return (
      <View
        style={[styles.dot, onSelected ? styles.dotCompletedOnSelected : styles.dotCompleted]}
      />
    );
  }
  if (status === 'in_progress') {
    return (
      <View style={[styles.dot, styles.dotInProgressOuter, onSelected && { borderColor: color.bg }]}>
        <View style={[styles.dotInProgressInner, onSelected && { backgroundColor: color.bg }]} />
      </View>
    );
  }
  if (status === 'skipped') {
    return <View style={[styles.dot, styles.dotSkipped]} />;
  }
  return (
    <View
      style={[
        styles.dot,
        isPast ? styles.dotMissed : styles.dotPlanned,
        onSelected && styles.dotPlannedOnSelected,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  inner: {
    paddingVertical: space[3],
    paddingHorizontal: space[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space[3],
    paddingHorizontal: space[2],
  },
  monthLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 2.6,
  },
  navBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space[2],
    paddingHorizontal: 2,
    borderRadius: 14,
  },
  dayPressed: {
    backgroundColor: color.goldA10,
  },
  daySelected: {
    backgroundColor: color.gold,
  },
  weekday: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 1.2,
  },
  weekdayToday: {
    color: color.gold,
  },
  weekdayOnSelected: {
    color: 'rgba(20,20,20,0.85)',
  },
  dayNumber: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    color: color.text,
    marginTop: 4,
    letterSpacing: -0.4,
  },
  dayNumberToday: {
    color: color.gold,
  },
  dayNumberOnSelected: {
    color: color.bg,
  },
  statusRow: {
    height: 8,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotCompleted: {
    backgroundColor: color.gold,
  },
  dotCompletedOnSelected: {
    backgroundColor: color.bg,
  },
  dotPlanned: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1.2,
    borderColor: color.gold,
    backgroundColor: 'transparent',
  },
  dotPlannedOnSelected: {
    borderColor: color.bg,
  },
  dotMissed: {
    backgroundColor: color.textDim,
    opacity: 0.5,
  },
  dotRest: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: color.textDim,
    opacity: 0.5,
  },
  dotMatchday: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.warning,
  },
  dotInProgressOuter: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1.2,
    borderColor: color.gold,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInProgressInner: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: color.gold,
  },
  dotSkipped: {
    backgroundColor: color.danger,
    opacity: 0.7,
  },
});
