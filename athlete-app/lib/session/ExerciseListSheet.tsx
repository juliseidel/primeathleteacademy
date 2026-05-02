import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { formatPlanCompact } from '@/lib/session/setFormat';
import type { ExerciseRow } from '@/lib/data/workouts';

type Props = {
  visible: boolean;
  exercises: ExerciseRow[];
  activeIndex: number;
  onPick: (index: number) => void;
  onClose: () => void;
};

export function ExerciseListSheet({ visible, exercises, activeIndex, onPick, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View entering={FadeIn.duration(180)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          entering={SlideInDown.duration(280)}
          style={[
            styles.sheet,
            { paddingBottom: Math.max(space[5], insets.bottom + space[3]), maxHeight: '85%' },
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.headline}>Übungen</Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={color.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {exercises.map((ex, i) => {
              const setsTotal = ex.sets.length;
              const setsDone = ex.sets.filter((s) => s.completed).length;
              const isDone = setsTotal > 0 && setsDone === setsTotal;
              const isActive = i === activeIndex;

              return (
                <Pressable
                  key={ex.id}
                  onPress={() => onPick(i)}
                  style={({ pressed }) => [
                    styles.row,
                    isActive && styles.rowActive,
                    isDone && !isActive && styles.rowDone,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.rowLeft}>
                    {ex.group_label ? (
                      <View style={[styles.groupBadge, isActive && styles.groupBadgeActive]}>
                        <Text style={[styles.groupBadgeText, isActive && styles.groupBadgeTextActive]}>
                          {ex.group_label}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.groupBadgeSpacer}>
                        <Text style={styles.indexText}>{i + 1}</Text>
                      </View>
                    )}

                    <View style={{ flex: 1 }}>
                      <Text style={styles.title} numberOfLines={1}>{ex.library.name}</Text>
                      <Text style={styles.meta}>
                        {setsDone}/{setsTotal} ·{' '}
                        {ex.sets[0] ? formatPlanCompact(ex.sets[0], ex.library) : '–'}
                      </Text>
                    </View>
                  </View>

                  {isDone ? (
                    <View style={styles.statusDoneBadge}>
                      <Ionicons name="checkmark" size={14} color={color.bg} />
                    </View>
                  ) : isActive ? (
                    <View style={styles.statusActiveBadge}>
                      <Text style={styles.statusActiveText}>AKTIV</Text>
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={color.textDim} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: space[5],
    paddingTop: space[3],
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    marginBottom: space[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: space[4],
  },
  headline: {
    fontFamily: displaySerif as string,
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: space[2],
    paddingBottom: space[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[3],
    paddingVertical: space[3],
    paddingHorizontal: space[3],
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowActive: {
    backgroundColor: 'rgba(197, 165, 90, 0.10)',
    borderColor: color.goldA30,
  },
  rowDone: {
    backgroundColor: 'rgba(197, 165, 90, 0.04)',
    borderColor: 'rgba(197, 165, 90, 0.20)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    flex: 1,
  },
  groupBadge: {
    minWidth: 36,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupBadgeActive: {
    backgroundColor: color.gold,
    borderColor: color.gold,
  },
  groupBadgeText: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 0.4,
  },
  groupBadgeTextActive: {
    color: color.bg,
  },
  groupBadgeSpacer: {
    minWidth: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.textMuted,
  },
  title: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },
  meta: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    marginTop: 2,
  },
  statusDoneBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusActiveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(197, 165, 90, 0.20)',
  },
  statusActiveText: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 1.2,
  },
});
