/**
 * WeekCalendar — Swipeable Wochenkalender im FEELY-Stil
 * Port aus FEELY (components/essentracker/WeekCalendar.js).
 * Akzent-Farbe von Grün auf PAA-Gold, dunkle PAA-Surface.
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { color, font, radius, space } from '@/lib/design/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DAYS = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'] as const;
const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const;

type Props = {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  weekOffset: number;
  onWeekChange: (offset: number) => void;
  hasDataForDate?: (date: Date) => boolean;
};

export function WeekCalendar({
  selectedDate,
  onDateSelect,
  weekOffset,
  onWeekChange,
  hasDataForDate,
}: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const offsetRef = useRef(weekOffset);

  useEffect(() => {
    offsetRef.current = weekOffset;
  }, [weekOffset]);

  const weekDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday + weekOffset * 7);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const isSameDay = useCallback((a: Date, b: Date) => a.toDateString() === b.toDateString(), []);
  const isToday = useCallback((d: Date) => isSameDay(d, new Date()), [isSameDay]);

  const monthYearLabel = useMemo(() => {
    const d = selectedDate ?? new Date();
    return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, [selectedDate]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        const threshold = SCREEN_WIDTH * 0.25;
        if (g.dx > threshold) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Animated.spring(translateX, { toValue: SCREEN_WIDTH, friction: 8, useNativeDriver: true }).start(
            () => {
              translateX.setValue(0);
              onWeekChange(offsetRef.current - 1);
            },
          );
        } else if (g.dx < -threshold) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Animated.spring(translateX, { toValue: -SCREEN_WIDTH, friction: 8, useNativeDriver: true }).start(
            () => {
              translateX.setValue(0);
              onWeekChange(offsetRef.current + 1);
            },
          );
        } else {
          Animated.spring(translateX, { toValue: 0, friction: 8, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  const handleDayPress = (date: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDateSelect(date);
  };

  const handleTodayPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    onDateSelect(t);
    onWeekChange(0);
  };

  const showTodayBtn = weekOffset !== 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navRow}>
          <Pressable
            onPress={() => onWeekChange(weekOffset - 1)}
            hitSlop={8}
            style={styles.navBtn}
          >
            <Ionicons name="chevron-back" size={18} color={color.textMuted} />
          </Pressable>
          <Text style={styles.dateText}>{monthYearLabel}</Text>
          <Pressable
            onPress={() => onWeekChange(weekOffset + 1)}
            hitSlop={8}
            style={styles.navBtn}
          >
            <Ionicons name="chevron-forward" size={18} color={color.textMuted} />
          </Pressable>
        </View>
        {showTodayBtn ? (
          <Pressable onPress={handleTodayPress} style={styles.todayBtn}>
            <Text style={styles.todayBtnLabel}>Heute</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.daysHeader}>
        {DAYS.map((d) => (
          <View key={d} style={styles.dayHeaderCell}>
            <Text style={styles.dayHeaderText}>{d}</Text>
          </View>
        ))}
      </View>

      <Animated.View style={[styles.daysRow, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
        {weekDates.map((date, idx) => {
          const selected = isSameDay(date, selectedDate);
          const today = isToday(date);
          const hasData = hasDataForDate?.(date) ?? false;
          return (
            <Pressable
              key={idx}
              style={styles.dayCell}
              onPress={() => handleDayPress(date)}
            >
              <View style={[styles.dayPill, selected && styles.dayPillSelected]}>
                <Text
                  style={[
                    styles.dayNumber,
                    selected && styles.dayNumberSelected,
                    !selected && today && styles.dayNumberToday,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </View>
              {hasData && !selected ? <View style={styles.trackingDot} /> : null}
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.blackA40,
    borderRadius: radius.lg,
    paddingVertical: space[4],
    paddingHorizontal: space[2],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[3],
    marginBottom: space[3],
  },
  navRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.2,
  },
  todayBtn: {
    paddingHorizontal: space[3],
    paddingVertical: 6,
    backgroundColor: color.text,
    borderRadius: radius.md,
    marginLeft: space[2],
  },
  todayBtnLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: space[2],
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textDim,
    letterSpacing: 1.2,
  },
  daysRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dayPill: {
    width: 38,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillSelected: {
    backgroundColor: color.text,
  },
  dayNumber: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '500',
    color: color.text,
  },
  dayNumberSelected: {
    color: color.bg,
    fontWeight: '700',
  },
  dayNumberToday: {
    color: color.macroProtein,
    fontWeight: '700',
  },
  trackingDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.macroProtein,
  },
});
