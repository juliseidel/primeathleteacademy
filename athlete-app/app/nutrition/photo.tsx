/**
 * Foto-Tracking — Mahlzeit fotografieren + optional Voice-Note → Gemini → Logs.
 *
 * Steps:
 *   1. pick        — Quelle wählen (Kamera / Mediathek)
 *   2. preview     — Foto + optional Voice-Note aufnehmen → "Analysieren"
 *   3. analyzing   — Loading-Spinner während Gemini analysiert
 *   4. result      — Komponenten-Liste editierbar + Slot-Picker + "Speichern"
 *   5. error       — Fehler anzeigen + "Erneut versuchen"
 *
 * Slot kommt aus query-param (von MealDetail) oder wird im result-Step gewählt
 * (von NutritionHeute Camera-Button — dort weiß man den Slot noch nicht).
 */

import { Ionicons } from '@expo/vector-icons';
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth/AuthContext';
import { todayLocalIso } from '@/lib/data/dates';
import { color, font, radius, space } from '@/lib/design/tokens';
import {
  analyzeMealPhoto,
  fileUriToBase64,
  type MealAnalysis,
  type MealComponent,
} from '@/lib/nutrition/MealVisionService';
import { useAddMealLogBulk, type BulkComponentLog } from '@/lib/nutrition/mealLogData';

type Step = 'pick' | 'preview' | 'analyzing' | 'result' | 'error';

const SLOT_OPTIONS: { key: string; label: string }[] = [
  { key: 'breakfast', label: 'Frühstück' },
  { key: 'lunch', label: 'Mittagessen' },
  { key: 'dinner', label: 'Abendessen' },
  { key: 'snack-1', label: 'Snack' },
];

export default function PhotoMealScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slotKey?: string; label?: string }>();
  const { session } = useAuth();
  const userId = session?.user.id;
  const todayIso = todayLocalIso();

  const [step, setStep] = useState<Step>('pick');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [editComponents, setEditComponents] = useState<MealComponent[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pickedSlotKey, setPickedSlotKey] = useState<string>(params.slotKey ?? '');
  const slotLockedFromParams = !!params.slotKey;

  const addBulkMut = useAddMealLogBulk(userId, todayIso);

  // ─── Voice-Recording ────────────────────────────────────────────
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const micPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.25, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 1, duration: 700, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    micPulse.setValue(1);
    return undefined;
  }, [isRecording, micPulse]);

  const startRecording = async () => {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Mikrofon-Zugriff benötigt', 'Bitte in den iOS-Einstellungen erlauben.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
      setVoiceSeconds(0);
      setVoiceUri(null);
      recordingTimerRef.current = setInterval(() => setVoiceSeconds((s) => s + 1), 1000);
    } catch (err) {
      Alert.alert('Aufnahme-Fehler', err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      const uri = recorder.uri;
      if (uri) setVoiceUri(uri);
    } catch (err) {
      Alert.alert('Stop-Fehler', err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  const discardVoice = () => {
    setVoiceUri(null);
    setVoiceSeconds(0);
  };

  // ─── Photo-Picker ───────────────────────────────────────────────
  const pickFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Kamera-Zugriff benötigt', 'Bitte in den iOS-Einstellungen erlauben.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setStep('preview');
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setStep('preview');
    }
  };

  // ─── Analyze ────────────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!photoUri) return;
    setStep('analyzing');
    setErrorMsg(null);
    try {
      const imageB64 = await fileUriToBase64(photoUri);
      const audioB64 = voiceUri ? await fileUriToBase64(voiceUri) : undefined;
      const result = await analyzeMealPhoto(imageB64, audioB64);
      if (!result.success) {
        setErrorMsg(result.error);
        setStep('error');
        return;
      }
      setAnalysis(result.analysis);
      setEditComponents(result.analysis.components);
      // Slot-Vorschlag übernehmen, wenn noch keiner gewählt
      if (!pickedSlotKey && result.analysis.meal_type_suggestion) {
        const suggested = result.analysis.meal_type_suggestion === 'snack' ? 'snack-1' : result.analysis.meal_type_suggestion;
        setPickedSlotKey(suggested);
      }
      setStep('result');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setStep('error');
    }
  };

  // ─── Save ───────────────────────────────────────────────────────
  const handleSave = () => {
    if (!analysis) return;
    if (!pickedSlotKey) {
      Alert.alert('Mahlzeit wählen', 'Bitte wähle aus, wo das Essen reingehört.');
      return;
    }
    const items: BulkComponentLog[] = editComponents
      .filter((c) => c.calories > 0)
      .map((c) => ({
        displayName: c.name,
        amountG: c.weight_g || 100,
        totals: {
          kcal: c.calories,
          protein: c.protein,
          carbs: c.carbs,
          fat: c.fat,
        },
      }));

    addBulkMut.mutate(
      {
        slotKey: pickedSlotKey,
        source: 'photo',
        items,
        notes: `Foto-Analyse: ${analysis.dish_name}`,
      },
      {
        onSuccess: () => router.back(),
        onError: (e) => Alert.alert('Speichern fehlgeschlagen', e instanceof Error ? e.message : 'Unbekannter Fehler'),
      },
    );
  };

  // ─── Header ─────────────────────────────────────────────────────
  const renderHeader = (title: string) => (
    <View style={[styles.header, { paddingTop: insets.top + space[2] }]}>
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.headerBtn}>
        <Ionicons name="close" size={22} color={color.text} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerBtn} />
    </View>
  );

  // ─── Step: Pick (Quelle) ────────────────────────────────────────
  if (step === 'pick') {
    return (
      <View style={styles.root}>
        {renderHeader('FOTO-TRACKING')}
        <View style={styles.pickerContent}>
          <View style={styles.pickerIconCircle}>
            <Ionicons name="camera" size={56} color={color.text} />
          </View>
          <Text style={styles.pickerTitle}>Mahlzeit fotografieren</Text>
          <Text style={styles.pickerSub}>
            Mach ein Foto von deinem Essen — die KI erkennt die Komponenten und rechnet die Makros.
          </Text>
          <Pressable
            onPress={pickFromCamera}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="camera-outline" size={18} color={color.bg} />
            <Text style={styles.primaryBtnLabel}>Kamera</Text>
          </Pressable>
          <Pressable
            onPress={pickFromLibrary}
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="images-outline" size={18} color={color.text} />
            <Text style={styles.secondaryBtnLabel}>Aus Mediathek wählen</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── Step: Preview (Foto + Voice) ──────────────────────────────
  if (step === 'preview' && photoUri) {
    return (
      <View style={styles.root}>
        {renderHeader('VOR DER ANALYSE')}
        <ScrollView contentContainerStyle={styles.scroll}>
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          <Pressable onPress={() => setStep('pick')} style={styles.changePhotoLink}>
            <Ionicons name="refresh" size={14} color={color.textMuted} />
            <Text style={styles.changePhotoLabel}>Anderes Foto</Text>
          </Pressable>

          <View style={styles.voiceCard}>
            <Text style={styles.voiceTitle}>Sprachnotiz (optional)</Text>
            <Text style={styles.voiceSub}>
              Sag z.B. „150g Reis, 200g Hähnchen, einen Esslöffel Öl" — die KI nutzt das zur Korrektur.
            </Text>
            {!voiceUri && !isRecording ? (
              <Pressable onPress={startRecording} style={({ pressed }) => [styles.micBtn, pressed && { opacity: 0.7 }]}>
                <Ionicons name="mic-outline" size={26} color={color.text} />
                <Text style={styles.micBtnLabel}>Aufnahme starten</Text>
              </Pressable>
            ) : null}
            {isRecording ? (
              <View style={styles.recordingRow}>
                <Animated.View style={[styles.recordingDot, { transform: [{ scale: micPulse }] }]} />
                <Text style={styles.recordingTimer}>{formatDuration(voiceSeconds)}</Text>
                <Pressable onPress={stopRecording} style={({ pressed }) => [styles.stopBtn, pressed && { opacity: 0.7 }]}>
                  <Ionicons name="stop" size={18} color={color.bg} />
                  <Text style={styles.stopBtnLabel}>Stopp</Text>
                </Pressable>
              </View>
            ) : null}
            {voiceUri && !isRecording ? (
              <View style={styles.voiceDoneRow}>
                <Ionicons name="checkmark-circle" size={18} color={color.macroProtein} />
                <Text style={styles.voiceDoneLabel}>Aufnahme: {formatDuration(voiceSeconds)}</Text>
                <Pressable onPress={discardVoice} hitSlop={6}>
                  <Text style={styles.discardLabel}>Verwerfen</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={[styles.footerBar, { paddingBottom: insets.bottom + space[2] }]}>
          <Pressable
            onPress={runAnalysis}
            disabled={isRecording}
            style={({ pressed }) => [styles.primaryBtn, isRecording && { opacity: 0.5 }, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="sparkles" size={18} color={color.bg} />
            <Text style={styles.primaryBtnLabel}>Mit KI analysieren</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── Step: Analyzing (Loading) ─────────────────────────────────
  if (step === 'analyzing') {
    return (
      <View style={styles.root}>
        {renderHeader('KI ANALYSIERT')}
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={color.macroProtein} />
          <Text style={styles.loadingTitle}>Gemini analysiert dein Foto…</Text>
          <Text style={styles.loadingSub}>
            {voiceUri ? 'Foto + Sprachnotiz werden ausgewertet.' : 'Komponenten werden erkannt und Makros berechnet.'}
          </Text>
        </View>
      </View>
    );
  }

  // ─── Step: Error ───────────────────────────────────────────────
  if (step === 'error') {
    return (
      <View style={styles.root}>
        {renderHeader('FEHLER')}
        <View style={styles.errorContent}>
          <Ionicons name="alert-circle-outline" size={56} color={color.warning} />
          <Text style={styles.errorTitle}>Analyse fehlgeschlagen</Text>
          <Text style={styles.errorSub}>{errorMsg ?? 'Unbekannter Fehler'}</Text>
          <Pressable
            onPress={() => setStep('preview')}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.primaryBtnLabel}>Erneut versuchen</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── Step: Result (Komponenten editieren + Slot wählen + Speichern) ────────
  if (step === 'result' && analysis) {
    return (
      <View style={styles.root}>
        {renderHeader(analysis.dish_name.toUpperCase())}
        <ScrollView contentContainerStyle={styles.scroll}>
          {photoUri ? <Image source={{ uri: photoUri }} style={styles.photoSmall} /> : null}

          {/* Slot-Picker */}
          {!slotLockedFromParams ? (
            <View style={styles.slotSection}>
              <Text style={styles.sectionLabel}>WO TRACKEN?</Text>
              <View style={styles.slotPickerRow}>
                {SLOT_OPTIONS.map((s) => {
                  const active = pickedSlotKey === s.key;
                  return (
                    <Pressable
                      key={s.key}
                      onPress={() => setPickedSlotKey(s.key)}
                      style={({ pressed }) => [
                        styles.slotChip,
                        active && styles.slotChipActive,
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <Text style={[styles.slotChipLabel, active && styles.slotChipLabelActive]}>
                        {s.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.slotSection}>
              <Text style={styles.sectionLabel}>WIRD GETRACKT IN</Text>
              <Text style={styles.slotLockedLabel}>{params.label ?? 'Mahlzeit'}</Text>
            </View>
          )}

          {/* Komponenten */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ERKANNTE KOMPONENTEN</Text>
            {editComponents.map((c, idx) => (
              <ComponentEditor
                key={idx}
                comp={c}
                onChange={(next) =>
                  setEditComponents((prev) => prev.map((x, i) => (i === idx ? next : x)))
                }
                onRemove={() => setEditComponents((prev) => prev.filter((_, i) => i !== idx))}
              />
            ))}
          </View>

          {/* Total */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>GESAMT</Text>
            <Text style={styles.totalKcal}>
              {Math.round(editComponents.reduce((s, c) => s + c.calories, 0))}
              <Text style={styles.totalUnit}> kcal</Text>
            </Text>
            <View style={styles.totalMacroRow}>
              <Text style={[styles.totalMacro, { color: color.macroProtein }]}>
                {Math.round(editComponents.reduce((s, c) => s + c.protein, 0))}P
              </Text>
              <Text style={[styles.totalMacro, { color: color.macroCarbs }]}>
                {Math.round(editComponents.reduce((s, c) => s + c.carbs, 0))}C
              </Text>
              <Text style={[styles.totalMacro, { color: color.macroFat }]}>
                {Math.round(editComponents.reduce((s, c) => s + c.fat, 0))}F
              </Text>
            </View>
          </View>

          {analysis.notes ? (
            <View style={styles.notesBox}>
              <Ionicons name="information-circle-outline" size={14} color={color.textMuted} />
              <Text style={styles.notesText}>{analysis.notes}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.footerBar, { paddingBottom: insets.bottom + space[2] }]}>
          <Pressable
            onPress={handleSave}
            disabled={addBulkMut.isPending || editComponents.length === 0}
            style={({ pressed }) => [
              styles.primaryBtn,
              (addBulkMut.isPending || editComponents.length === 0) && { opacity: 0.5 },
              pressed && { opacity: 0.85 },
            ]}
          >
            {addBulkMut.isPending ? (
              <ActivityIndicator size="small" color={color.bg} />
            ) : (
              <Ionicons name="checkmark" size={18} color={color.bg} />
            )}
            <Text style={styles.primaryBtnLabel}>
              {addBulkMut.isPending ? 'Speichern…' : 'Hinzufügen'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Component-Editor ─────────────────────────────────────────────

function ComponentEditor({
  comp,
  onChange,
  onRemove,
}: {
  comp: MealComponent;
  onChange: (next: MealComponent) => void;
  onRemove: () => void;
}) {
  const isLowConf = comp.confidence < 0.6;
  const updateWeight = (newWeight: number) => {
    if (newWeight <= 0 || comp.weight_g <= 0) {
      onChange({ ...comp, weight_g: Math.max(0, newWeight) });
      return;
    }
    const factor = newWeight / comp.weight_g;
    onChange({
      ...comp,
      weight_g: newWeight,
      calories: Math.round(comp.calories * factor),
      protein: Math.round(comp.protein * factor * 10) / 10,
      carbs: Math.round(comp.carbs * factor * 10) / 10,
      fat: Math.round(comp.fat * factor * 10) / 10,
    });
  };

  return (
    <View style={styles.compCard}>
      <View style={styles.compHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.compName}>{comp.name}</Text>
          {isLowConf ? (
            <Text style={styles.compLowConf}>unsichere Erkennung — bitte prüfen</Text>
          ) : null}
        </View>
        <Pressable onPress={onRemove} hitSlop={8} style={styles.compRemove}>
          <Ionicons name="close-circle" size={20} color={color.textMuted} />
        </Pressable>
      </View>

      <View style={styles.weightRow}>
        <Pressable
          onPress={() => updateWeight(Math.max(5, comp.weight_g - 10))}
          hitSlop={6}
          style={styles.weightBtn}
        >
          <Text style={styles.weightBtnLabel}>−10g</Text>
        </Pressable>
        <View style={styles.weightInputWrap}>
          <TextInput
            value={String(Math.round(comp.weight_g))}
            onChangeText={(t) => {
              const n = Number(t.replace(',', '.'));
              if (!Number.isNaN(n)) updateWeight(n);
            }}
            keyboardType="numeric"
            style={styles.weightInput}
          />
          <Text style={styles.weightUnit}>g</Text>
        </View>
        <Pressable onPress={() => updateWeight(comp.weight_g + 10)} hitSlop={6} style={styles.weightBtn}>
          <Text style={styles.weightBtnLabel}>+10g</Text>
        </Pressable>
      </View>

      <View style={styles.compMacros}>
        <Text style={styles.compKcal}>{Math.round(comp.calories)} kcal</Text>
        <View style={styles.compDots}>
          <Dot color={color.macroProtein} value={`${Math.round(comp.protein)}P`} />
          <Dot color={color.macroCarbs} value={`${Math.round(comp.carbs)}C`} />
          <Dot color={color.macroFat} value={`${Math.round(comp.fat)}F`} />
        </View>
      </View>
    </View>
  );
}

function Dot({ color: c, value }: { color: string; value: string }) {
  return (
    <View style={styles.dotWrap}>
      <View style={[styles.dot, { backgroundColor: c }]} />
      <Text style={styles.dotValue}>{value}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingBottom: space[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  headerTitle: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '900',
    color: color.text,
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: space[5],
    paddingTop: space[4],
    paddingBottom: 120,
    gap: space[4],
  },

  // Pick (Quelle)
  pickerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[6],
    gap: space[3],
  },
  pickerIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[3],
  },
  pickerTitle: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
  },
  pickerSub: {
    fontFamily: font.family,
    fontSize: 14,
    color: color.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: space[4],
  },

  // Photo Preview
  photoPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: color.surface,
  },
  photoSmall: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radius.lg,
    backgroundColor: color.surface,
  },
  changePhotoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: space[2],
  },
  changePhotoLabel: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
  },

  // Voice-Card
  voiceCard: {
    padding: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: space[3],
  },
  voiceTitle: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
  },
  voiceSub: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    lineHeight: 18,
  },
  micBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignSelf: 'flex-start',
  },
  micBtnLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  recordingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: color.danger,
  },
  recordingTimer: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
    fontVariant: ['tabular-nums'],
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.pill,
    backgroundColor: color.text,
  },
  stopBtnLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.bg,
  },
  voiceDoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  voiceDoneLabel: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 13,
    color: color.text,
  },
  discardLabel: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.danger,
    textDecorationLine: 'underline',
  },

  // Footer-Bar mit primary-Button
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: space[5],
    paddingTop: space[3],
    backgroundColor: color.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    paddingVertical: space[4],
    borderRadius: radius.pill,
    backgroundColor: color.text,
  },
  primaryBtnLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    paddingVertical: space[3],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginTop: space[2],
  },
  secondaryBtnLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },

  // Loading
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[6],
    gap: space[3],
  },
  loadingTitle: {
    fontFamily: font.family,
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
    marginTop: space[3],
  },
  loadingSub: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Error
  errorContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[6],
    gap: space[3],
  },
  errorTitle: {
    fontFamily: font.family,
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
  },
  errorSub: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    textAlign: 'center',
    marginBottom: space[4],
  },

  // Result Sections
  section: { gap: space[3] },
  slotSection: { gap: space[2] },
  sectionLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 2.2,
  },
  slotPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  slotChip: {
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  slotChipActive: {
    backgroundColor: color.text,
    borderColor: color.text,
  },
  slotChipLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '600',
    color: color.text,
  },
  slotChipLabelActive: {
    color: color.bg,
  },
  slotLockedLabel: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
  },

  // Component Cards
  compCard: {
    padding: space[4],
    borderRadius: radius.lg,
    backgroundColor: color.blackA40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: space[3],
  },
  compHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  compName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
  },
  compLowConf: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.warning,
    marginTop: 2,
  },
  compRemove: {
    paddingLeft: space[2],
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  weightBtn: {
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  weightBtnLabel: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.text,
  },
  weightInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: space[2],
    borderRadius: 10,
    backgroundColor: color.bg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  weightInput: {
    fontFamily: font.family,
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
    textAlign: 'center',
    minWidth: 50,
    paddingVertical: 0,
  },
  weightUnit: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
  },
  compMacros: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compKcal: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
  },
  compDots: {
    flexDirection: 'row',
    gap: space[3],
  },
  dotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotValue: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.text,
  },

  // Total Card
  totalCard: {
    padding: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: color.whiteA15,
    gap: space[2],
  },
  totalLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 2.2,
  },
  totalKcal: {
    fontFamily: font.family,
    fontSize: 36,
    fontWeight: '800',
    color: color.text,
    letterSpacing: -1.2,
  },
  totalUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: color.textMuted,
  },
  totalMacroRow: {
    flexDirection: 'row',
    gap: space[5],
    marginTop: space[1],
  },
  totalMacro: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
  },

  // Notes Box
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[3],
    paddingHorizontal: space[3],
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  notesText: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    lineHeight: 17,
  },
});
