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
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Smooth Layout-Transitions auf Android aktivieren (iOS ist default an)
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// expo-audio wird LAZY geladen — wenn das native Modul im aktuellen Dev-Build
// fehlt (vor dem nächsten EAS-Build), required der try/catch nicht und der
// Foto-Flow läuft trotzdem. Voice-Note ist dann ausgeblendet mit Hinweis.
type VoiceRecorderProps = typeof import('@/lib/nutrition/VoiceRecorder')['VoiceRecorder'] extends React.ComponentType<infer P> ? P : never;
let VoiceRecorder: React.ComponentType<VoiceRecorderProps> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  VoiceRecorder = require('@/lib/nutrition/VoiceRecorder').VoiceRecorder;
} catch {
  VoiceRecorder = null;
}

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
import { searchProducts, type OffSearchResult } from '@/lib/nutrition/OpenFoodFactsService';

type Step = 'pick' | 'preview' | 'analyzing' | 'result' | 'error';

const SLOT_OPTIONS: { key: string; label: string }[] = [
  { key: 'breakfast', label: 'Frühstück' },
  { key: 'lunch', label: 'Mittagessen' },
  { key: 'dinner', label: 'Abendessen' },
  { key: 'snack-1', label: 'Snack' },
];

// ─── Grouping ────────────────────────────────────────────────────────────────
// Gemini liefert oft mehrere identische Komponenten (4× "Spiegelei"). Wir
// gruppieren sie zu einer Card mit ×N Badge — die Source-of-Truth bleibt das
// flache editComponents-Array, das Grouping passiert nur fürs Render & Save.

type GroupedComponent = {
  name: string;
  count: number;
  /** Indices in editComponents — für proportionale Skalierung beim Stepper */
  indices: number[];
  weightTotal: number;
  kcalTotal: number;
  proteinTotal: number;
  carbsTotal: number;
  fatTotal: number;
  minConfidence: number;
};

function groupComponents(comps: MealComponent[]): GroupedComponent[] {
  const groups = new Map<string, GroupedComponent>();
  comps.forEach((c, idx) => {
    const key = c.name.toLowerCase().trim();
    const ex = groups.get(key);
    if (ex) {
      ex.indices.push(idx);
      ex.count += 1;
      ex.weightTotal += c.weight_g;
      ex.kcalTotal += c.calories;
      ex.proteinTotal += c.protein;
      ex.carbsTotal += c.carbs;
      ex.fatTotal += c.fat;
      ex.minConfidence = Math.min(ex.minConfidence, c.confidence);
    } else {
      groups.set(key, {
        name: c.name,
        count: 1,
        indices: [idx],
        weightTotal: c.weight_g,
        kcalTotal: c.calories,
        proteinTotal: c.protein,
        carbsTotal: c.carbs,
        fatTotal: c.fat,
        minConfidence: c.confidence,
      });
    }
  });
  return Array.from(groups.values());
}

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
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [editComponents, setEditComponents] = useState<MealComponent[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorDebug, setErrorDebug] = useState<string | null>(null);
  const [pickedSlotKey, setPickedSlotKey] = useState<string>(params.slotKey ?? '');
  const slotLockedFromParams = !!params.slotKey;
  // Edit-Modal: welche Gruppe gerade editiert wird (null = closed)
  const [editingGroup, setEditingGroup] = useState<GroupedComponent | null>(null);

  const applyEdit = (newName: string, newWeight: number) => {
    if (!editingGroup) return;
    const oldWeight = editingGroup.weightTotal;
    const indexSet = new Set(editingGroup.indices);
    const factor = oldWeight > 0 ? newWeight / oldWeight : 1;
    setEditComponents((prev) =>
      prev.map((c, i) => {
        if (!indexSet.has(i)) return c;
        return {
          ...c,
          name: newName.trim() || c.name,
          weight_g: oldWeight > 0 ? c.weight_g * factor : newWeight / editingGroup.count,
          calories: c.calories * factor,
          protein: c.protein * factor,
          carbs: c.carbs * factor,
          fat: c.fat * factor,
        };
      }),
    );
    setEditingGroup(null);
  };

  // Komplettes Replacement: Gruppe wird durch EIN neues Item ersetzt
  // (Open-Food-Facts-Treffer mit korrekten Macros pro 100g, bestehende
  // Gesamt-Menge in Gramm wird beibehalten).
  const applyReplace = (product: OffSearchResult) => {
    if (!editingGroup) return;
    const totalWeight = editingGroup.weightTotal > 0 ? editingGroup.weightTotal : 100;
    const factor = totalWeight / 100;
    const firstIdx = editingGroup.indices[0];
    const indexSet = new Set(editingGroup.indices);
    setEditComponents((prev) =>
      prev
        .map((c, i) => {
          if (i === firstIdx) {
            return {
              name: product.name,
              weight_g: totalWeight,
              calories: product.energy_kcal * factor,
              protein: product.protein * factor,
              carbs: product.carbs * factor,
              fat: product.fat * factor,
              confidence: 0.95, // explizite User-Wahl = hohe Confidence
            };
          }
          return c;
        })
        .filter((_, i) => i === firstIdx || !indexSet.has(i)),
    );
    setEditingGroup(null);
  };

  const addBulkMut = useAddMealLogBulk(userId, todayIso);

  const handleVoiceChange = (uri: string | null, seconds: number) => {
    setVoiceUri(uri);
    setVoiceSeconds(seconds);
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
      quality: 0.95,
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
      quality: 0.95,
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
    setErrorDebug(null);
    try {
      console.log('[photo] starte Analyse, photoUri:', photoUri);
      const imageB64 = await fileUriToBase64(photoUri);
      console.log('[photo] Bild als base64, Länge:', imageB64.length);
      const audioB64 = voiceUri ? await fileUriToBase64(voiceUri) : undefined;
      const result = await analyzeMealPhoto(imageB64, audioB64);
      if (!result.success) {
        console.log('[photo] Analyse fehlgeschlagen:', result.error);
        setErrorMsg(result.error);
        setErrorDebug(result.debug ?? null);
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
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      const stack = err instanceof Error && err.stack ? err.stack : null;
      console.log('[photo] Exception in runAnalysis:', msg, stack);
      setErrorMsg(msg);
      setErrorDebug(stack ? stack.slice(0, 800) : null);
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
    // Beim Speichern gruppieren — ein Log pro Komponente-Name (nicht 4 für 4 Eier).
    const items: BulkComponentLog[] = groupComponents(editComponents)
      .filter((g) => g.kcalTotal > 0)
      .map((g) => ({
        displayName: g.name,
        amountG: g.weightTotal || 100,
        totals: {
          kcal: g.kcalTotal,
          protein: g.proteinTotal,
          carbs: g.carbsTotal,
          fat: g.fatTotal,
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

          {VoiceRecorder ? (
            <VoiceRecorder
              voiceUri={voiceUri}
              voiceSeconds={voiceSeconds}
              onVoiceChange={handleVoiceChange}
              onRecordingChange={setIsRecording}
            />
          ) : (
            <View style={styles.voiceUnavailable}>
              <Ionicons name="mic-off-outline" size={20} color={color.textMuted} />
              <Text style={styles.voiceUnavailableText}>
                Voice-Note wird beim nächsten App-Update aktiviert. Foto-Tracking funktioniert jetzt schon.
              </Text>
            </View>
          )}
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
        <ScrollView contentContainerStyle={styles.errorScroll}>
          <Ionicons name="alert-circle-outline" size={56} color={color.warning} />
          <Text style={styles.errorTitle}>Analyse fehlgeschlagen</Text>
          <Text style={styles.errorSub}>{errorMsg ?? 'Unbekannter Fehler'}</Text>
          {errorDebug ? (
            <View style={styles.debugBox}>
              <Text style={styles.debugLabel}>DEBUG (zum Kopieren tippen+halten)</Text>
              <Text selectable style={styles.debugText}>{errorDebug}</Text>
            </View>
          ) : null}
          <Pressable
            onPress={() => setStep('preview')}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }, { marginTop: space[4] }]}
          >
            <Text style={styles.primaryBtnLabel}>Erneut versuchen</Text>
          </Pressable>
        </ScrollView>
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

          {(() => {
            const groups = groupComponents(editComponents);
            const totalKcal = editComponents.reduce((s, c) => s + c.calories, 0);
            const totalProtein = editComponents.reduce((s, c) => s + c.protein, 0);
            const totalCarbs = editComponents.reduce((s, c) => s + c.carbs, 0);
            const totalFat = editComponents.reduce((s, c) => s + c.fat, 0);

            return (
              <>
                {/* Hero-Total: groß, Gold-akzentuiert, animierter Counter */}
                <TotalSummary
                  kcal={totalKcal}
                  protein={totalProtein}
                  carbs={totalCarbs}
                  fat={totalFat}
                />

                {/* Komponenten als separate Cards mit Abstand */}
                <View style={styles.itemsSection}>
                  <Text style={styles.sectionLabel}>
                    {groups.length === 1 ? '1 KOMPONENTE' : `${groups.length} KOMPONENTEN`}
                  </Text>
                  <View style={styles.itemsStack}>
                    {groups.map((g) => (
                      <GroupedItemCard
                        key={g.name + g.indices.join(',')}
                        group={g}
                        onEdit={() => setEditingGroup(g)}
                        onScaleWeight={(newTotal) => {
                          const oldTotal = g.weightTotal;
                          if (oldTotal <= 0) return;
                          const factor = Math.max(0, newTotal) / oldTotal;
                          setEditComponents((prev) =>
                            prev.map((c, i) =>
                              g.indices.includes(i)
                                ? {
                                    ...c,
                                    weight_g: c.weight_g * factor,
                                    calories: c.calories * factor,
                                    protein: c.protein * factor,
                                    carbs: c.carbs * factor,
                                    fat: c.fat * factor,
                                  }
                                : c,
                            ),
                          );
                        }}
                        onRemove={() => {
                          LayoutAnimation.configureNext({
                            duration: 280,
                            create: { type: 'easeInEaseOut', property: 'opacity' },
                            update: { type: 'easeInEaseOut' },
                            delete: { type: 'easeInEaseOut', property: 'opacity' },
                          });
                          const removeSet = new Set(g.indices);
                          setEditComponents((prev) => prev.filter((_, i) => !removeSet.has(i)));
                        }}
                      />
                    ))}
                  </View>
                </View>

                {analysis.notes ? (
                  <View style={styles.notesBox}>
                    <Ionicons name="information-circle-outline" size={14} color={color.textMuted} />
                    <Text style={styles.notesText}>{analysis.notes}</Text>
                  </View>
                ) : null}
              </>
            );
          })()}
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

        <ItemEditModal
          group={editingGroup}
          onCancel={() => setEditingGroup(null)}
          onSave={applyEdit}
          onReplace={applyReplace}
        />
      </View>
    );
  }

  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────

// ─── AnimatedCounter ───────────────────────────────────────────────
// Tween-Counter, der bei Werte-Änderungen smooth zur neuen Zahl rollt.
// useNativeDriver=false weil wir den interpolierten Wert in Text rendern müssen.

function AnimatedCounter({
  value,
  style,
  duration = 380,
}: {
  value: number;
  style: import('react-native').StyleProp<import('react-native').TextStyle>;
  duration?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  }, [value, anim, duration]);

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    return () => anim.removeListener(id);
  }, [anim]);

  return <Text style={style}>{display}</Text>;
}

// ─── Total-Summary ────────────────────────────────────────────────
// Hero-Card oben im Result-Step: prominent, Gold-akzentuiert, animierter
// kcal-Counter, Macros mit Trennern + animierten Werten.

function TotalSummary({
  kcal,
  protein,
  carbs,
  fat,
}: {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}) {
  return (
    <View style={styles.totalHero}>
      <View style={styles.totalHeroLabelRow}>
        <View style={styles.totalHeroDot} />
        <Text style={styles.totalHeroLabel}>GESAMT</Text>
      </View>

      <View style={styles.totalHeroKcalRow}>
        <AnimatedCounter value={kcal} style={styles.totalHeroKcal} duration={900} />
        <Text style={styles.totalHeroKcalUnit}>kcal</Text>
      </View>

      <View style={styles.totalHeroMacroRow}>
        <TotalMacro color={color.macroProtein} label="Protein" value={protein} />
        <View style={styles.totalHeroDivider} />
        <TotalMacro color={color.macroCarbs} label="Kohlenhydr." value={carbs} />
        <View style={styles.totalHeroDivider} />
        <TotalMacro color={color.macroFat} label="Fett" value={fat} />
      </View>
    </View>
  );
}

function TotalMacro({ color: c, label, value }: { color: string; label: string; value: number }) {
  return (
    <View style={styles.totalMacroBlock}>
      <View style={styles.totalMacroValueRow}>
        <AnimatedCounter value={value} style={[styles.totalMacroValue, { color: c }]} duration={750} />
        <Text style={styles.totalMacroUnit}>g</Text>
      </View>
      <Text style={styles.totalMacroLabel}>{label}</Text>
    </View>
  );
}

// ─── Grouped-Item-Row ──────────────────────────────────────────────
// Kompakte 2-Zeilen-Row: Name + ×N + kcal in Zeile 1, Macro-Pills + Stepper
// in Zeile 2. ~50% kompakter als die alte Card. Pressable mit Scale-Feedback.

function GroupedItemCard({
  group,
  onScaleWeight,
  onRemove,
  onEdit,
}: {
  group: GroupedComponent;
  onScaleWeight: (newTotalWeight: number) => void;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const isLowConf = group.minConfidence < 0.6;
  const adjust = (delta: number) => {
    onScaleWeight(Math.max(5, Math.round(group.weightTotal) + delta));
  };

  return (
    <View style={styles.itemCard}>
      {/* Zeile 1: Name (tap-to-edit) + ×N Badge | kcal | Trash */}
      <View style={styles.itemRowLine1}>
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [styles.itemRowNameWrap, pressed && { opacity: 0.55 }]}
          hitSlop={{ top: 6, bottom: 6 }}
        >
          <Text style={styles.itemRowName} numberOfLines={1}>
            {group.name}
          </Text>
          {group.count > 1 ? (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>×{group.count}</Text>
            </View>
          ) : null}
          <Ionicons name="pencil" size={11} color={color.textMuted} style={{ marginLeft: 2 }} />
        </Pressable>
        <View style={styles.itemRowKcalWrap}>
          <AnimatedCounter value={group.kcalTotal} style={styles.itemRowKcal} duration={320} />
          <Text style={styles.itemRowKcalUnit}>kcal</Text>
        </View>
        <Pressable
          onPress={onRemove}
          hitSlop={10}
          style={({ pressed }) => [styles.itemRowRemove, pressed && { opacity: 0.4, transform: [{ scale: 0.85 }] }]}
        >
          <Ionicons name="close" size={14} color={color.textMuted} />
        </Pressable>
      </View>

      {/* Zeile 2: Macro-Pills (links) | Stepper + Gramm (rechts) */}
      <View style={styles.itemRowLine2}>
        <View style={styles.itemRowMacros}>
          <MacroPill color={color.macroProtein} value={group.proteinTotal} suffix="P" />
          <MacroPill color={color.macroCarbs} value={group.carbsTotal} suffix="C" />
          <MacroPill color={color.macroFat} value={group.fatTotal} suffix="F" />
        </View>
        <View style={styles.itemRowStepperWrap}>
          <Pressable
            onPress={() => adjust(-10)}
            hitSlop={8}
            style={({ pressed }) => [styles.miniStepperBtn, pressed && styles.stepperBtnPressed]}
          >
            <Ionicons name="remove" size={13} color={color.text} />
          </Pressable>
          <Text style={styles.itemRowWeight}>{Math.round(group.weightTotal)}g</Text>
          <Pressable
            onPress={() => adjust(10)}
            hitSlop={8}
            style={({ pressed }) => [styles.miniStepperBtn, pressed && styles.stepperBtnPressed]}
          >
            <Ionicons name="add" size={13} color={color.text} />
          </Pressable>
        </View>
      </View>

      {isLowConf ? (
        <Text style={styles.itemRowLowConf}>unsichere Erkennung — bitte prüfen</Text>
      ) : null}
    </View>
  );
}

// ─── Item-Edit-Modal ───────────────────────────────────────────────
// Bottom-Sheet zum Bearbeiten von Name + Gesamt-Menge einer Komponenten-Gruppe.
// Tap auf den Item-Namen in der Liste öffnet dieses Sheet.

function ItemEditModal({
  group,
  onCancel,
  onSave,
  onReplace,
}: {
  group: GroupedComponent | null;
  onCancel: () => void;
  onSave: (newName: string, newWeight: number) => void;
  onReplace: (product: OffSearchResult) => void;
}) {
  const [name, setName] = useState('');
  const [weightStr, setWeightStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OffSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setWeightStr(String(Math.round(group.weightTotal)));
      // Search-Box reset wenn neues Item geöffnet wird
      setSearchQuery('');
      setSearchResults([]);
      setSearchError(null);
    }
  }, [group]);

  // Debounced search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearching(true);
    const id = setTimeout(async () => {
      const r = await searchProducts(trimmed, 1, 10);
      if (r.success) {
        setSearchResults(r.products);
        setSearchError(null);
      } else {
        setSearchResults([]);
        setSearchError(r.error);
      }
      setSearching(false);
    }, 380);
    return () => clearTimeout(id);
  }, [searchQuery]);

  if (!group) return null;

  const parsedWeight = Number(weightStr.replace(',', '.'));
  const isValid = name.trim().length > 0 && !Number.isNaN(parsedWeight) && parsedWeight > 0;
  const perPiece = group.count > 1 ? Math.round(parsedWeight / group.count) : 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave(name.trim(), parsedWeight);
  };

  return (
    <Modal
      transparent
      visible={!!group}
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.editModalBackdrop} onPress={onCancel}>
          <Pressable style={styles.editModalSheet} onPress={() => {}}>
            {/* Grabber */}
            <View style={styles.editModalGrabber} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: space[4] }}
            >
              <View style={styles.editModalHeader}>
                <Text style={styles.editModalTitle}>KOMPONENTE BEARBEITEN</Text>
                {group.count > 1 ? (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>×{group.count}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.editModalField}>
                <Text style={styles.editModalLabel}>NAME</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="z.B. Roggenbrot"
                  placeholderTextColor={color.textDim}
                  style={styles.editModalInput}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.editModalField}>
                <Text style={styles.editModalLabel}>GESAMT-MENGE</Text>
                <View style={styles.editModalWeightRow}>
                  <TextInput
                    value={weightStr}
                    onChangeText={setWeightStr}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={color.textDim}
                    style={[styles.editModalInput, { flex: 1 }]}
                  />
                  <Text style={styles.editModalUnit}>g</Text>
                </View>
                {perPiece > 0 ? (
                  <Text style={styles.editModalPerPiece}>≈ {perPiece} g pro Stück</Text>
                ) : null}
              </View>

              <View style={styles.editModalHintRow}>
                <Ionicons name="information-circle-outline" size={13} color={color.textMuted} />
                <Text style={styles.editModalHint}>
                  Macros werden proportional zur neuen Menge skaliert.
                </Text>
              </View>

              <View style={styles.editModalBtnRow}>
                <Pressable
                  onPress={onCancel}
                  style={({ pressed }) => [styles.editModalCancelBtn, pressed && { opacity: 0.7 }]}
                >
                  <Text style={styles.editModalCancelLabel}>Abbrechen</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={!isValid}
                  style={({ pressed }) => [
                    styles.editModalSaveBtn,
                    !isValid && { opacity: 0.4 },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Ionicons name="checkmark" size={16} color={color.bg} />
                  <Text style={styles.editModalSaveLabel}>Speichern</Text>
                </Pressable>
              </View>

              {/* ── Austauschen via Open Food Facts ── */}
              <View style={styles.editModalDivider} />

              <View style={styles.editModalField}>
                <Text style={styles.editModalLabel}>ODER AUSTAUSCHEN</Text>
                <View style={styles.editModalSearchRow}>
                  <Ionicons name="search" size={16} color={color.textMuted} />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Lebensmittel oder Marke suchen…"
                    placeholderTextColor={color.textDim}
                    style={styles.editModalSearchInput}
                    autoCapitalize="words"
                  />
                  {searching ? (
                    <ActivityIndicator size="small" color={color.textMuted} />
                  ) : null}
                </View>
                {searchError ? (
                  <Text style={styles.editModalSearchError}>{searchError}</Text>
                ) : null}
              </View>

              {searchResults.length > 0 ? (
                <View style={styles.searchResultsList}>
                  {searchResults.map((p) => (
                    <Pressable
                      key={p.id}
                      onPress={() => onReplace(p)}
                      style={({ pressed }) => [styles.searchResultRow, pressed && { opacity: 0.7 }]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.searchResultName} numberOfLines={1}>
                          {p.name}
                        </Text>
                        {p.brand ? (
                          <Text style={styles.searchResultBrand} numberOfLines={1}>
                            {p.brand}
                          </Text>
                        ) : null}
                        <Text style={styles.searchResultMacros}>
                          {Math.round(p.energy_kcal)} kcal · {Math.round(p.protein)}P · {Math.round(p.carbs)}C · {Math.round(p.fat)}F  · pro 100g
                        </Text>
                      </View>
                      <Ionicons name="swap-horizontal" size={16} color={color.gold} />
                    </Pressable>
                  ))}
                </View>
              ) : searchQuery.trim().length >= 2 && !searching && !searchError ? (
                <Text style={styles.editModalSearchEmpty}>
                  Keine Treffer — vielleicht anderes Stichwort?
                </Text>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function MacroPill({ color: c, value, suffix }: { color: string; value: number; suffix: string }) {
  return (
    <View style={styles.macroPill}>
      <View style={[styles.macroPillDot, { backgroundColor: c }]} />
      <Text style={styles.macroPillValue}>
        {Math.round(value)}
        <Text style={styles.macroPillSuffix}>{suffix}</Text>
      </Text>
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
  voiceUnavailable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    padding: space[4],
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  voiceUnavailableText: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    lineHeight: 18,
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
  errorScroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
    paddingVertical: space[6],
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
  debugBox: {
    width: '100%',
    padding: space[3],
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    gap: space[2],
  },
  debugLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 1.5,
  },
  debugText: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.text,
    lineHeight: 15,
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

  // ─── Total-Hero (oben, prominent, Gold-akzentuiert, animiert) ──
  totalHero: {
    paddingHorizontal: space[5],
    paddingVertical: space[5],
    borderRadius: radius.xl,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: color.goldA30,
    gap: space[3],
    // subtle gold-glow
    shadowColor: color.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  totalHeroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalHeroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.gold,
  },
  totalHeroLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '800',
    color: color.gold,
    letterSpacing: 2.4,
  },
  totalHeroKcalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  totalHeroKcal: {
    fontFamily: font.family,
    fontSize: 48,
    fontWeight: '800',
    color: color.text,
    letterSpacing: -2,
  },
  totalHeroKcalUnit: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '500',
    color: color.textMuted,
    letterSpacing: -0.3,
  },
  totalHeroMacroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: space[2],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  totalHeroDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginHorizontal: space[2],
  },
  totalMacroBlock: {
    flex: 1,
    gap: 4,
    alignItems: 'flex-start',
  },
  totalMacroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  totalMacroValue: {
    fontFamily: font.family,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  totalMacroUnit: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
  },
  totalMacroLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // ─── Komponenten-Section (Liste) ───────────────────────────────
  itemsSection: {
    gap: space[3],
  },
  itemsStack: {
    gap: space[3],
  },

  // Einzelne Item-Card (kompakt, 2 Zeilen, mit Border & Padding)
  itemCard: {
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderRadius: radius.lg,
    backgroundColor: color.blackA40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: space[3],
  },
  itemRowLine1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  itemRowNameWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemRowName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  countBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 999,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA30,
  },
  countBadgeText: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.3,
  },
  itemRowKcalWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  itemRowKcal: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.3,
  },
  itemRowKcalUnit: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
  },
  itemRowRemove: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  itemRowLine2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
  },
  itemRowMacros: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 1,
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  macroPillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  macroPillValue: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.text,
  },
  macroPillSuffix: {
    fontWeight: '500',
    color: color.textMuted,
  },
  itemRowStepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniStepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnPressed: {
    transform: [{ scale: 0.82 }],
    backgroundColor: color.goldA30,
    borderColor: color.gold,
  },
  itemRowWeight: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.text,
    minWidth: 42,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  itemRowLowConf: {
    fontFamily: font.family,
    fontSize: 10,
    color: color.warning,
    marginTop: -2,
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

  // ─── Edit-Modal (Bottom-Sheet) ─────────────────────────────────
  editModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  editModalSheet: {
    backgroundColor: color.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: space[5],
    paddingTop: space[3],
    paddingBottom: space[6],
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: color.goldA30,
    maxHeight: '85%',
  },
  editModalGrabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.whiteA30,
    alignSelf: 'center',
    marginBottom: space[2],
  },
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  editModalTitle: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '800',
    color: color.gold,
    letterSpacing: 2.4,
  },
  editModalField: {
    gap: space[2],
  },
  editModalLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 1.5,
  },
  editModalInput: {
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '600',
    color: color.text,
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    borderRadius: radius.md,
    backgroundColor: color.bg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  editModalWeightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  editModalUnit: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.textMuted,
    paddingRight: space[2],
  },
  editModalPerPiece: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: -2,
  },
  editModalHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editModalHint: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    lineHeight: 15,
  },
  editModalBtnRow: {
    flexDirection: 'row',
    gap: space[3],
    marginTop: space[2],
  },
  editModalCancelBtn: {
    flex: 1,
    paddingVertical: space[3],
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editModalCancelLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },
  editModalSaveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: space[3],
    borderRadius: radius.pill,
    backgroundColor: color.text,
  },
  editModalSaveLabel: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.3,
  },

  // ── Search/Replace Section innerhalb des Edit-Modals ──
  editModalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: space[1],
  },
  editModalSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[3],
    paddingVertical: space[2],
    borderRadius: radius.md,
    backgroundColor: color.bg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  editModalSearchInput: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '500',
    color: color.text,
    paddingVertical: space[2],
  },
  editModalSearchError: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.warning,
    marginTop: 4,
  },
  editModalSearchEmpty: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    fontStyle: 'italic',
    paddingVertical: space[2],
  },
  searchResultsList: {
    gap: space[2],
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[3],
    paddingVertical: space[3],
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  searchResultName: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },
  searchResultBrand: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 1,
  },
  searchResultMacros: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 3,
  },
});
