import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWorkoutDetail } from '@/lib/data/workouts';
import { LiveTrackingOverlay } from '@/lib/session/LiveTrackingOverlay';
import { color, font, radius, space } from '@/lib/design/tokens';

export default function SessionRoute() {
  const params = useLocalSearchParams<{ workoutId: string }>();
  const workoutId = params.workoutId!;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: workout, isLoading, error } = useWorkoutDetail(workoutId);

  if (isLoading || !workout) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={color.gold} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top + space[8] }]}>
        <Text style={styles.errorText}>Workout konnte nicht geladen werden.</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeLabel}>Zurück</Text>
        </Pressable>
      </View>
    );
  }

  return <LiveTrackingOverlay workout={workout} onClose={() => router.back()} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontFamily: font.family,
    fontSize: 15,
    color: color.danger,
  },
  closeBtn: {
    marginTop: space[5],
    paddingHorizontal: space[6],
    paddingVertical: space[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.goldA20,
  },
  closeLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },
});
