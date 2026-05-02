import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useExerciseLibrary, type LibraryRow } from '@/lib/data/library';
import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

type Props = {
  visible: boolean;
  currentLibraryId: string;
  preferredMeasurementType?: LibraryRow['measurement_type'];
  onClose: () => void;
  onPick: (newLibraryId: string) => void;
};

export function ExerciseLibrarySheet({
  visible,
  currentLibraryId,
  preferredMeasurementType,
  onClose,
  onPick,
}: Props) {
  const insets = useSafeAreaInsets();
  const { data: library, isLoading } = useExerciseLibrary();
  const [search, setSearch] = useState('');
  const [filterCompatible, setFilterCompatible] = useState(true);

  const filtered = useMemo(() => {
    if (!library) return [];
    let result = library.filter((ex) => ex.id !== currentLibraryId);
    if (filterCompatible && preferredMeasurementType) {
      result = result.filter((ex) => ex.measurement_type === preferredMeasurementType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [library, currentLibraryId, search, filterCompatible, preferredMeasurementType]);

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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kavWrap}
          pointerEvents="box-none"
        >
          <Animated.View
            entering={SlideInDown.duration(280)}
            style={[
              styles.sheet,
              {
                paddingBottom: Math.max(space[5], insets.bottom + space[3]),
                maxHeight: '88%',
              },
            ]}
          >
            <View style={styles.handle} />
            <View style={styles.header}>
              <Text style={styles.headline}>Übung tauschen</Text>
              <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
                <Ionicons name="close" size={18} color={color.textMuted} />
              </Pressable>
            </View>

            <View style={styles.searchWrap}>
              <Ionicons name="search" size={16} color={color.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Übung suchen…"
                placeholderTextColor={color.textDim}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {search ? (
                <Pressable onPress={() => setSearch('')} hitSlop={6}>
                  <Ionicons name="close-circle" size={16} color={color.textMuted} />
                </Pressable>
              ) : null}
            </View>

            {preferredMeasurementType ? (
              <Pressable
                onPress={() => setFilterCompatible(!filterCompatible)}
                style={({ pressed }) => [styles.filterRow, pressed && { opacity: 0.7 }]}
              >
                <View style={[styles.filterCheck, filterCompatible && styles.filterCheckActive]}>
                  {filterCompatible ? (
                    <Ionicons name="checkmark" size={11} color={color.bg} />
                  ) : null}
                </View>
                <Text style={styles.filterLabel}>
                  Nur kompatible Übungen ({measurementTypeLabel(preferredMeasurementType)})
                </Text>
              </Pressable>
            ) : null}

            {isLoading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={color.gold} />
              </View>
            ) : (
              <ScrollView
                style={styles.list}
                contentContainerStyle={{ gap: space[2] }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {filtered.length === 0 ? (
                  <View style={styles.emptyWrap}>
                    <Ionicons name="search-outline" size={20} color={color.textMuted} />
                    <Text style={styles.emptyText}>Keine passende Übung gefunden.</Text>
                  </View>
                ) : (
                  filtered.map((ex) => (
                    <Pressable
                      key={ex.id}
                      onPress={() => {
                        onPick(ex.id);
                        onClose();
                      }}
                      style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowTitle}>{ex.name}</Text>
                        <Text style={styles.rowMeta}>
                          {measurementTypeLabel(ex.measurement_type)}
                          {ex.tags.length > 0 ? ` · ${ex.tags.slice(0, 3).join(' · ')}` : ''}
                        </Text>
                      </View>
                      <Ionicons name="arrow-forward" size={16} color={color.gold} />
                    </Pressable>
                  ))
                )}
              </ScrollView>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

function measurementTypeLabel(t: LibraryRow['measurement_type']): string {
  switch (t) {
    case 'reps_weight':   return 'Reps × Gewicht';
    case 'reps_only':     return 'Wiederholungen';
    case 'time':          return 'Zeit';
    case 'distance':      return 'Distanz';
    case 'distance_time': return 'Distanz + Zeit';
    case 'rounds':        return 'Runden';
    case 'cardio':        return 'Cardio';
    case 'mixed':         return 'Mixed';
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  kavWrap: {
    flex: 1,
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    marginBottom: space[3],
  },
  searchInput: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 14,
    color: color.text,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[2],
    marginBottom: space[2],
  },
  filterCheck: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCheckActive: {
    backgroundColor: color.gold,
    borderColor: color.gold,
  },
  filterLabel: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.3,
  },
  loadingWrap: {
    paddingVertical: space[10],
    alignItems: 'center',
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  rowTitle: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },
  rowMeta: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  emptyWrap: {
    paddingVertical: space[8],
    alignItems: 'center',
    gap: space[2],
  },
  emptyText: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
  },
});
