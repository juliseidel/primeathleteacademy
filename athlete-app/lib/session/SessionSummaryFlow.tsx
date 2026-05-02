import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { displaySerif } from '@/lib/design/light';
import { color, font, glow, radius, space } from '@/lib/design/tokens';

type Step = 0 | 1 | 2;

const MOOD_OPTIONS = [
  { value: 1, emoji: '😣', label: 'Erschöpft' },
  { value: 3, emoji: '😕', label: 'Naja' },
  { value: 5, emoji: '😌', label: 'Okay' },
  { value: 7, emoji: '💪', label: 'Stark' },
  { value: 10, emoji: '🔥', label: 'Unschlagbar' },
] as const;

type Props = {
  workoutTitle: string;
  durationMin: number;
  setsCompleted: number;
  setsTotal: number;
  totalVolumeKg?: number | null;
  saving?: boolean;
  onFinish: (summary: { rpe: number | null; energy: number | null; notes: string | null }) => Promise<void> | void;
  onBack?: () => void;
};

export function SessionSummaryFlow({
  workoutTitle,
  durationMin,
  setsCompleted,
  setsTotal,
  totalVolumeKg,
  saving,
  onFinish,
  onBack,
}: Props) {
  const [step, setStep] = useState<Step>(0);
  const [rpe, setRpe] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');

  const advance = (next: Step) => setStep(next);

  const submit = () => {
    onFinish({ rpe, energy, notes: notes.trim() || null });
  };

  return (
    <View style={styles.root}>
      <BackgroundAura />

      <View style={styles.headerRow}>
        <Pressable
          onPress={() => (step === 0 ? onBack?.() : advance((step - 1) as Step))}
          hitSlop={12}
          style={styles.headerBtn}
        >
          <Ionicons name="chevron-back" size={22} color={color.text} />
        </Pressable>
        <ProgressDots active={step} total={3} onSelect={(i) => i <= step && setStep(i as Step)} />
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.statsLine}>
        <Text style={styles.statsText}>
          {workoutTitle.toUpperCase()}  ·  {durationMin} MIN  ·  {setsCompleted}/{setsTotal} SÄTZE
          {totalVolumeKg ? `  ·  ${formatKg(totalVolumeKg)} KG` : ''}
        </Text>
      </View>

      {step === 0 ? (
        <RpeStep
          key="rpe"
          value={rpe}
          onPick={(v) => {
            setRpe(v);
            setTimeout(() => advance(1), 720);
          }}
        />
      ) : null}
      {step === 1 ? (
        <MoodStep
          key="mood"
          value={energy}
          onPick={(v) => {
            setEnergy(v);
            setTimeout(() => advance(2), 720);
          }}
        />
      ) : null}
      {step === 2 ? (
        <NotesStep
          key="notes"
          value={notes}
          onChange={setNotes}
          saving={saving}
          onSubmit={submit}
        />
      ) : null}
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// BACKGROUND — atmospheric gold aura
// ────────────────────────────────────────────────────────────────────────────

function BackgroundAura() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={[color.bg, color.surfaceDeep, color.bg]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbBottom]} />
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// STEP 1 — RPE
// ────────────────────────────────────────────────────────────────────────────

function RpeStep({ value, onPick }: { value: number | null; onPick: (v: number) => void }) {
  return (
    <Animated.View
      entering={FadeIn.duration(640).easing(Easing.out(Easing.cubic))}
      exiting={FadeOut.duration(280)}
      style={styles.stepBody}
    >
      <Animated.View entering={FadeInUp.duration(560).delay(60).easing(Easing.out(Easing.cubic))} style={styles.editorialBlock}>
        <Text style={styles.eyebrow}>Wie hart war's?</Text>
        <Text style={styles.headline}>RPE</Text>
        <View style={styles.serifRule} />
        <Text style={styles.subline}>1 = locker  ·  10 = maximum</Text>
      </Animated.View>

      <View style={styles.heroSlot}>
        {value != null ? (
          <HeroNumber value={value} />
        ) : (
          <Animated.View entering={FadeIn.duration(540).delay(180)} style={styles.heroPlaceholderWrap}>
            <Text style={styles.heroPlaceholder}>—</Text>
            <Text style={styles.heroPlaceholderHint}>Tippe eine Zahl</Text>
          </Animated.View>
        )}
      </View>

      <Animated.View
        entering={FadeInUp.duration(620).delay(160).easing(Easing.out(Easing.cubic))}
        style={styles.numberGrid}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const v = i + 1;
          return <NumberCell key={v} value={v} active={value === v} onPick={onPick} />;
        })}
      </Animated.View>
    </Animated.View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HERO NUMBER — kein remount, smooth spring + breathing aura
// ────────────────────────────────────────────────────────────────────────────

function HeroNumber({ value }: { value: number }) {
  const scale = useSharedValue(0.82);
  const opacity = useSharedValue(0);
  const auraScale = useSharedValue(1);
  const auraOpacity = useSharedValue(0);

  // Number entry / change animation
  useEffect(() => {
    scale.value = 0.82;
    opacity.value = 0.3;
    scale.value = withSpring(1, { damping: 14, stiffness: 130, mass: 0.85 });
    opacity.value = withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Aura: fade in once + perpetual subtle breathing
  useEffect(() => {
    auraOpacity.value = withTiming(1, { duration: 720, easing: Easing.out(Easing.cubic) });
    auraScale.value = withRepeat(
      withTiming(1.06, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => {
      auraScale.value = 1;
      auraOpacity.value = 0;
    };
  }, []);

  const numberStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const auraStyle = useAnimatedStyle(() => ({
    opacity: auraOpacity.value * 0.65,
    transform: [{ scale: auraScale.value }],
  }));

  return (
    <View style={styles.heroWrap} pointerEvents="none">
      <Animated.View style={[styles.heroAura, auraStyle]} />
      <Animated.Text style={[styles.heroNumber, numberStyle]}>{value}</Animated.Text>
      <View style={styles.heroLabelRow}>
        <View style={styles.heroDash} />
        <Text style={styles.heroLabel}>{rpeLabel(value)}</Text>
        <View style={styles.heroDash} />
      </View>
    </View>
  );
}

function NumberCell({
  value,
  active,
  onPick,
}: {
  value: number;
  active: boolean;
  onPick: (v: number) => void;
}) {
  const scale = useSharedValue(1);
  const activeProgress = useSharedValue(active ? 1 : 0);

  if (active && activeProgress.value < 1) {
    activeProgress.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
  } else if (!active && activeProgress.value > 0) {
    activeProgress.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
  }

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.cellWrap, aStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(0.92, { duration: 90, easing: Easing.out(Easing.quad) });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 180, mass: 0.7 });
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPick(value);
        }}
        style={[styles.numberCell, active && styles.numberCellActive]}
      >
        {active ? (
          <LinearGradient
            colors={['rgba(212, 185, 110, 0.20)', 'rgba(197, 165, 90, 0.04)']}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Text style={[styles.numberCellText, active && styles.numberCellTextActive]}>
          {value}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// STEP 2 — Mood
// ────────────────────────────────────────────────────────────────────────────

function MoodStep({ value, onPick }: { value: number | null; onPick: (v: number) => void }) {
  return (
    <Animated.View
      entering={FadeIn.duration(640).easing(Easing.out(Easing.cubic))}
      exiting={FadeOut.duration(280)}
      style={styles.stepBody}
    >
      <Animated.View entering={FadeInUp.duration(560).delay(60).easing(Easing.out(Easing.cubic))} style={styles.editorialBlock}>
        <Text style={styles.eyebrow}>Wie fühlst du dich?</Text>
        <Text style={styles.headline}>Energie</Text>
        <View style={styles.serifRule} />
        <Text style={styles.subline}>Wie viel Saft ist noch da?</Text>
      </Animated.View>

      <View style={styles.moodColumn}>
        {MOOD_OPTIONS.map((m, idx) => {
          const active = value === m.value;
          return (
            <MoodCard
              key={m.value}
              emoji={m.emoji}
              label={m.label}
              index={idx}
              active={active}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                onPick(m.value);
              }}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

function MoodCard({
  emoji,
  label,
  index,
  active,
  onPress,
}: {
  emoji: string;
  label: string;
  index: number;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInUp.duration(540).delay(140 + 100 * index).easing(Easing.out(Easing.cubic))}
      style={aStyle}
    >
      <Pressable
        onPressIn={() => (scale.value = withTiming(0.97, { duration: 90, easing: Easing.out(Easing.quad) }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 14, stiffness: 180, mass: 0.7 }))}
        onPress={onPress}
        style={[styles.moodCard, active && styles.moodCardActive]}
      >
        {active ? (
          <LinearGradient
            colors={['rgba(212, 185, 110, 0.18)', 'rgba(197, 165, 90, 0.04)']}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Text style={styles.moodEmoji}>{emoji}</Text>
        <Text style={[styles.moodLabel, active && styles.moodLabelActive]}>{label}</Text>
        {active ? (
          <View style={styles.moodActiveIndicator}>
            <Ionicons name="checkmark" size={14} color={color.bg} />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// STEP 3 — Notes
// ────────────────────────────────────────────────────────────────────────────

function NotesStep({
  value,
  onChange,
  saving,
  onSubmit,
}: {
  value: string;
  onChange: (s: string) => void;
  saving?: boolean;
  onSubmit: () => void;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(640).easing(Easing.out(Easing.cubic))}
      exiting={FadeOut.duration(280)}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.stepBody, { paddingBottom: 40 }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInUp.duration(560).delay(60).easing(Easing.out(Easing.cubic))}
            style={styles.editorialBlock}
          >
            <Text style={styles.eyebrow}>Notiz an Coach</Text>
            <Text style={styles.headline}>Sag&apos;s deinem Coach</Text>
            <View style={styles.serifRule} />
            <Text style={styles.subline}>Optional — auch leer lassen geht.</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(620).delay(160).easing(Easing.out(Easing.cubic))}>
            <Pressable onPress={() => Keyboard.dismiss()} style={styles.notesCard}>
              <TextInput
                style={styles.notesInput}
                value={value}
                onChangeText={onChange}
                placeholder={'z.B. Knie hat gezwickt, Bench fühlte sich stark an…'}
                placeholderTextColor={color.textDim}
                multiline
                maxLength={500}
              />
              <View style={styles.notesFooter}>
                <Text style={styles.notesCount}>{value.length} / 500</Text>
                <Pressable onPress={() => Keyboard.dismiss()} hitSlop={8} style={styles.dismissBtn}>
                  <Ionicons name="chevron-down" size={14} color={color.textMuted} />
                  <Text style={styles.dismissLabel}>Tastatur</Text>
                </Pressable>
              </View>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(620).delay(240).easing(Easing.out(Easing.cubic))}>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                onSubmit();
              }}
              disabled={saving}
              style={({ pressed }) => [
                styles.submitCta,
                pressed && styles.submitCtaPressed,
                saving && { opacity: 0.7 },
              ]}
            >
              {saving ? (
                <ActivityIndicator color={color.bg} />
              ) : (
                <>
                  <Text style={styles.submitLabel}>Speichern & abschließen</Text>
                  <Ionicons name="arrow-forward" size={16} color={color.bg} />
                </>
              )}
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// PROGRESS DOTS
// ────────────────────────────────────────────────────────────────────────────

function ProgressDots({
  active,
  total,
  onSelect,
}: {
  active: number;
  total: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <Pressable
            key={i}
            disabled={!isPast}
            onPress={() => onSelect?.(i)}
            style={[styles.dot, isActive && styles.dotActive, isPast && styles.dotPast]}
          />
        );
      })}
    </View>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────────────

function rpeLabel(v: number): string {
  if (v <= 2) return 'Locker';
  if (v <= 4) return 'Leicht';
  if (v <= 6) return 'Moderat';
  if (v <= 8) return 'Hart';
  return 'Maximum';
}

function formatKg(n: number): string {
  return n.toLocaleString('de-DE');
}

// ────────────────────────────────────────────────────────────────────────────
// STYLES
// ────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },

  // ── Atmosphere
  orb: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: color.goldA10,
    opacity: 0.55,
  },
  orbTop: {
    top: -260,
    right: -180,
    ...glow.goldHaloOuter,
  },
  orbBottom: {
    bottom: -300,
    left: -200,
    ...glow.goldHaloInner,
    opacity: 0.30,
  },

  // ── Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space[4],
    paddingTop: space[3],
    paddingBottom: space[2],
    gap: space[3],
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space[2],
  },
  dot: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  dotPast: {
    backgroundColor: color.gold,
  },
  dotActive: {
    backgroundColor: color.gold,
    width: 36,
  },

  // ── Stats
  statsLine: {
    paddingHorizontal: space[6],
    paddingBottom: space[5],
  },
  statsText: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.4,
  },

  // ── Body
  stepBody: {
    flex: 1,
    paddingHorizontal: space[6],
  },

  // ── Editorial block
  editorialBlock: {
    paddingTop: space[2],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 3.0,
    textTransform: 'uppercase',
  },
  headline: {
    fontFamily: displaySerif as string,
    fontSize: 56,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -1.2,
    lineHeight: 60,
    marginTop: space[3],
  },
  serifRule: {
    width: 36,
    height: 1,
    backgroundColor: color.gold,
    marginTop: space[4],
    marginBottom: space[3],
    opacity: 0.7,
  },
  subline: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    letterSpacing: 0.4,
  },

  // ── Hero slot
  heroSlot: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[8],
  },
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAura: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: color.goldA10,
    ...glow.goldHaloInner,
    opacity: 0.6,
  },
  heroNumber: {
    fontFamily: displaySerif as string,
    fontSize: 156,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.gold,
    letterSpacing: -5,
    lineHeight: 160,
    includeFontPadding: false,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginTop: space[3],
  },
  heroDash: {
    width: 24,
    height: 1,
    backgroundColor: color.goldA30,
  },
  heroLabel: {
    fontFamily: displaySerif as string,
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.goldLight,
    letterSpacing: 0.8,
  },
  heroPlaceholderWrap: {
    alignItems: 'center',
    gap: space[2],
  },
  heroPlaceholder: {
    fontFamily: displaySerif as string,
    fontSize: 96,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.textDim,
    letterSpacing: -2,
    lineHeight: 96,
  },
  heroPlaceholderHint: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textDim,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },

  // ── Number grid
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
    paddingBottom: space[10],
  },
  cellWrap: {
    flexBasis: '18%',
    flexGrow: 1,
    aspectRatio: 1,
  },
  numberCell: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: 'rgba(20, 20, 20, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  numberCellActive: {
    borderColor: color.gold,
    borderWidth: 1.5,
    ...glow.goldSoft,
  },
  numberCellText: {
    fontFamily: displaySerif as string,
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '400',
    color: color.text,
    letterSpacing: -0.4,
  },
  numberCellTextActive: {
    color: color.gold,
  },

  // ── Mood
  moodColumn: {
    flex: 1,
    gap: space[3],
    paddingTop: space[6],
    paddingBottom: space[10],
  },
  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    paddingVertical: space[4],
    paddingHorizontal: space[5],
    borderRadius: radius.lg,
    backgroundColor: 'rgba(20, 20, 20, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  moodCardActive: {
    borderColor: color.gold,
    borderWidth: 1.5,
    ...glow.goldSoft,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    flex: 1,
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 22,
    fontWeight: '400',
    color: color.textMuted,
    letterSpacing: -0.3,
  },
  moodLabelActive: {
    color: color.text,
  },
  moodActiveIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Notes
  notesCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.65)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.goldA20,
    marginTop: space[6],
    overflow: 'hidden',
  },
  notesInput: {
    color: color.text,
    fontFamily: displaySerif as string,
    fontStyle: 'italic',
    fontSize: 17,
    lineHeight: 24,
    padding: space[5],
    paddingBottom: space[3],
    minHeight: 160,
    textAlignVertical: 'top',
  },
  notesFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingTop: space[2],
    paddingBottom: space[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  notesCount: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textDim,
    letterSpacing: 1.0,
  },
  dismissBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: space[2],
    paddingVertical: space[1],
  },
  dismissLabel: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  submitCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    backgroundColor: color.gold,
    borderRadius: radius.md,
    paddingVertical: space[4],
    marginTop: space[5],
    ...glow.goldSoft,
  },
  submitCtaPressed: {
    backgroundColor: color.goldDark,
    transform: [{ scale: 0.98 }],
  },
  submitLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
});
