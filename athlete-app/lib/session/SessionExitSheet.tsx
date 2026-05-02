import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

type Props = {
  visible: boolean;
  hasProgress: boolean; // mindestens ein Set committed
  onContinue: () => void;
  onMinimize: () => void;
  onFinishNow?: () => void;
  onReset?: () => void;
  onSkip?: () => void;
};

/**
 * Bottom-Sheet wenn User Session schließen will.
 * Bietet: Hintergrund weiterlaufen / zurück / direkt abschließen / neu starten / als nicht gemacht
 */
export function SessionExitSheet({
  visible,
  hasProgress,
  onContinue,
  onMinimize,
  onFinishNow,
  onReset,
  onSkip,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onContinue}
      statusBarTranslucent
    >
      <Animated.View entering={FadeIn.duration(180)} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onContinue} />
        <Animated.View
          entering={SlideInDown.duration(280)}
          style={[styles.sheet, { paddingBottom: Math.max(space[5], insets.bottom + space[3]) }]}
        >
          <Text style={styles.headline}>Session läuft</Text>
          <Text style={styles.body}>
            Du kannst die Session im Hintergrund weiterlaufen lassen und später fortsetzen — auch
            tagelang. Oder du beendest sie jetzt.
          </Text>

          <Pressable
            onPress={onMinimize}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={color.bg} />
            <Text style={styles.primaryLabel}>Im Hintergrund weiterlaufen</Text>
          </Pressable>

          <Pressable
            onPress={onContinue}
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.secondaryLabel}>Zurück zum Workout</Text>
          </Pressable>

          <View style={styles.divider} />
          <Text style={styles.dividerLabel}>SESSION BEENDEN</Text>

          {hasProgress && onFinishNow ? (
            <Pressable
              onPress={onFinishNow}
              style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="flag-outline" size={16} color={color.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.actionLabel}>Direkt abschließen</Text>
                <Text style={styles.actionHint}>Mit den bisherigen Werten zur Zusammenfassung</Text>
              </View>
            </Pressable>
          ) : null}

          {hasProgress && onReset ? (
            <Pressable
              onPress={onReset}
              style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="refresh-outline" size={16} color={color.text} />
              <View style={{ flex: 1 }}>
                <Text style={styles.actionLabel}>Neu starten</Text>
                <Text style={styles.actionHint}>Alle eingegebenen Werte verwerfen</Text>
              </View>
            </Pressable>
          ) : null}

          {onSkip ? (
            <Pressable
              onPress={onSkip}
              style={({ pressed }) => [styles.dangerBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="close-circle-outline" size={16} color={color.danger} />
              <Text style={styles.dangerLabel}>Als „nicht gemacht" markieren</Text>
            </Pressable>
          ) : null}
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
    paddingTop: space[6],
    gap: space[3],
  },
  headline: {
    fontFamily: displaySerif as string,
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.5,
    marginBottom: space[1],
  },
  body: {
    fontFamily: font.family,
    fontSize: 14,
    color: color.textMuted,
    lineHeight: 20,
    marginBottom: space[3],
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    backgroundColor: color.gold,
    borderRadius: radius.md,
    paddingVertical: space[4],
  },
  primaryLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: radius.md,
    paddingVertical: space[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  secondaryLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginTop: space[3],
    marginBottom: space[1],
  },
  dividerLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textDim,
    letterSpacing: 2.0,
    paddingVertical: space[1],
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  actionLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.3,
  },
  actionHint: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    paddingVertical: space[4],
    marginTop: space[1],
  },
  dangerLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.danger,
    letterSpacing: 0.3,
  },
});
