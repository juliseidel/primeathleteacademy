/**
 * MealDetail — FEELY-Style Mahlzeit-Detail-Screen.
 *
 * Layout:
 *   - Header: < + SLOT-LABEL + kcal-Pill rechts (gegessen / Tagesziel)
 *   - Such-Bar (Lebensmittel suchen) + Barcode-Icon
 *   - NÄHRWERTE GESAMT — kcal + 3 Macro-Bars für diesen Slot
 *   - LEBENSMITTEL:
 *       · Coach-Vorgabe (read-only, tap → Übernehmen-Sheet)
 *       · Athleten-getrackte Items (tap → Edit-Sheet)
 *   - Foto-Button unten (KI, Stub)
 *
 * Modal: FoodDetailSheet für jedes Item / Hinzufügen.
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { searchBls } from '@/lib/nutrition/blsService';
import { getProductByBarcode, searchProducts as searchOff, type OffProduct } from '@/lib/nutrition/OpenFoodFactsService';
import { FoodDetailSheet } from '@/lib/nutrition/components/FoodDetailSheet';
import { deriveDayType } from '@/lib/nutrition/dayType';
import { calcComponentMacros, pct, sumMacros } from '@/lib/nutrition/macroCalc';
import {
  extractLogMeta,
  useAddMealLog,
  useCoachSkipsForDate,
  useDeleteMealLog,
  useFrequentLogs,
  useMealLogForSlot,
  useRecentLogs,
  useSkipCoachItem,
  useUpdateMealLog,
  type MealLog,
  type QuickPickItem,
} from '@/lib/nutrition/mealLogData';
import {
  useHasMatchOn,
  useNutritionTemplate,
  useTodayDayOverride,
  useTodayWorkoutCount,
  type FullMeal,
  type TemplateComponent,
  type TemplateSnack,
} from '@/lib/nutrition/nutritionData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { CoachFood } from '@/lib/nutrition/nutritionData';

type SearchHit = {
  source: 'coach' | 'bls' | 'off';
  id: string;
  name: string;
  note?: string | null;
  macrosPer100g: { kcal: number; protein: number; carbs: number; fat: number };
};

/** Mini-Hook: Wert wird erst nach `delay` ms aktualisiert (verhindert API-Spam beim Tippen) */
function useDebounced<T>(value: T, delay: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

type ActiveSheet =
  | { kind: 'coach'; component: TemplateComponent | null; snack: TemplateSnack | null }
  | { kind: 'log'; log: MealLog }
  | { kind: 'search'; hit: SearchHit }
  | { kind: 'quickPick'; item: QuickPickItem }
  | { kind: 'scan'; product: OffProduct }
  | null;

type DetailTab = 'meal' | 'recent' | 'frequent';

export default function MealDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    slotKey: string;
    label: string;
    coachMealId?: string;
    openItem?: string;
    openKind?: string;
    openBarcode?: string;
  }>();
  const slotKey = params.slotKey ?? 'snack-x';
  const label = params.label ?? 'Mahlzeit';
  const coachMealId = params.coachMealId;
  const openItem = params.openItem;
  const openKind = params.openKind;
  const openBarcode = params.openBarcode;

  const { session } = useAuth();
  const userId = session?.user.id;
  const todayIso = todayLocalIso();

  // Day-type für Tagesziel
  const wcQuery = useTodayWorkoutCount(userId);
  const tmQuery = useHasMatchOn(userId, todayIso);
  const tmwQuery = useHasMatchOn(userId, addDaysIso(todayIso, 1));
  const ovQuery = useTodayDayOverride(userId);

  const dayType = useMemo(() => {
    if (wcQuery.isLoading || tmQuery.isLoading || tmwQuery.isLoading || ovQuery.isLoading) return undefined;
    return deriveDayType({
      workoutCount: wcQuery.data ?? 0,
      hasMatchToday: tmQuery.data ?? false,
      hasMatchTomorrow: tmwQuery.data ?? false,
      override: ovQuery.data ?? null,
    });
  }, [wcQuery.isLoading, wcQuery.data, tmQuery.isLoading, tmQuery.data, tmwQuery.isLoading, tmwQuery.data, ovQuery.isLoading, ovQuery.data]);

  const templateQuery = useNutritionTemplate(userId, dayType);
  const coachMeal: FullMeal | null = useMemo(() => {
    if (!templateQuery.data || !coachMealId) return null;
    return templateQuery.data.meals.find((m) => m.id === coachMealId) ?? null;
  }, [templateQuery.data, coachMealId]);

  const logQuery = useMealLogForSlot(userId, todayIso, slotKey);
  const addMealMut = useAddMealLog(userId, todayIso);
  const updateMealMut = useUpdateMealLog(userId, todayIso);
  const deleteMealMut = useDeleteMealLog(userId, todayIso);
  const coachSkipsQuery = useCoachSkipsForDate(userId, todayIso);
  const skipCoachMut = useSkipCoachItem(userId, todayIso);

  // Tabs (Mahlzeit / Zuletzt / Häufig — analog FEELY)
  const [activeTab, setActiveTab] = useState<DetailTab>('meal');
  const recentQuery = useRecentLogs(userId, 30);
  const frequentQuery = useFrequentLogs(userId, 30);

  // Auto-open sheet, wenn vom Heute-Tab ein spezifisches Item übergeben wurde
  const autoOpenedRef = useRef(false);

  // Suche
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();
  const showingSearch = trimmedQuery.length >= 2;
  const debouncedQuery = useDebounced(trimmedQuery, 350);

  const coachSearchQuery = useQuery({
    queryKey: ['nutrition', 'coach-foods-search', trimmedQuery],
    enabled: showingSearch,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coach_food_database')
        .select('*')
        .eq('is_archived', false)
        .ilike('name', `%${trimmedQuery}%`)
        .limit(10);
      if (error) throw error;
      return data as CoachFood[];
    },
  });

  const blsResults = useMemo(() => (showingSearch ? searchBls(trimmedQuery, 10) : []), [trimmedQuery, showingSearch]);

  // Open Food Facts API (debounced 350ms, 5min Cache)
  const offQuery = useQuery({
    queryKey: ['off-search', debouncedQuery],
    enabled: showingSearch && debouncedQuery.length >= 3,
    queryFn: () => searchOff(debouncedQuery, 1, 15),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Vom Scanner gesetzte Cache-Eintrag (oder Live-Fetch falls noch nicht da)
  const scannedQuery = useQuery({
    queryKey: ['scanned-product', openBarcode],
    enabled: !!openBarcode,
    queryFn: () => getProductByBarcode(openBarcode!),
    staleTime: Infinity,
  });

  const searchHits: SearchHit[] = useMemo(() => {
    if (!showingSearch) return [];
    const seen = new Set<string>();
    const hits: SearchHit[] = [];
    // 1. Coach-DB (höchste Priorität)
    for (const c of coachSearchQuery.data ?? []) {
      const key = c.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({
        source: 'coach',
        id: `coach-${c.id}`,
        name: c.name,
        note: c.note,
        macrosPer100g: {
          kcal: Number(c.kcal_per_100g),
          protein: Number(c.protein_per_100g),
          carbs: Number(c.carbs_per_100g),
          fat: Number(c.fat_per_100g),
        },
      });
    }
    // 2. BLS lokal (deutsche Basics)
    for (const b of blsResults) {
      const key = b.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({
        source: 'bls',
        id: `bls-${b.id}`,
        name: b.name,
        note: b.tags?.join(' · ') ?? null,
        macrosPer100g: {
          kcal: b.nutrients_per_100g.energy_kcal,
          protein: b.nutrients_per_100g.protein,
          carbs: b.nutrients_per_100g.carbs,
          fat: b.nutrients_per_100g.fat,
        },
      });
    }
    // 3. Open Food Facts (Marken-Produkte, ~360k weltweit)
    if (offQuery.data?.success) {
      for (const o of offQuery.data.products) {
        const displayName = o.brand ? `${o.name} (${o.brand})` : o.name;
        const key = displayName.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        hits.push({
          source: 'off',
          id: `off-${o.barcode}`,
          name: displayName,
          note: o.nutri_score ? `Nutri-Score ${o.nutri_score}` : null,
          macrosPer100g: {
            kcal: o.energy_kcal,
            protein: o.protein,
            carbs: o.carbs,
            fat: o.fat,
          },
        });
      }
    }
    return hits;
  }, [showingSearch, coachSearchQuery.data, blsResults, offQuery.data]);

  // Sheet-State
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

  // Auto-open Sheet wenn ein gescanntes Produkt vorliegt
  useEffect(() => {
    if (autoOpenedRef.current) return;
    if (!openBarcode) return;
    if (scannedQuery.data?.success) {
      setActiveSheet({ kind: 'scan', product: scannedQuery.data.product });
      autoOpenedRef.current = true;
    }
  }, [openBarcode, scannedQuery.data]);

  // Auto-open Sheet wenn ein Item via Heute-Tab Klick übergeben wurde
  useEffect(() => {
    if (autoOpenedRef.current) return;
    if (!openItem || !openKind) return;
    if (openKind === 'log') {
      const log = (logQuery.data ?? []).find((l) => l.id === openItem);
      if (log) {
        setActiveSheet({ kind: 'log', log });
        autoOpenedRef.current = true;
      }
    } else if (openKind === 'coach') {
      const comp = coachMeal?.components.find((c) => c.id === openItem);
      if (comp) {
        setActiveSheet({ kind: 'coach', component: comp, snack: null });
        autoOpenedRef.current = true;
        return;
      }
      const snack = coachMeal?.snacks.find((s) => s.id === openItem);
      if (snack) {
        setActiveSheet({ kind: 'coach', component: null, snack });
        autoOpenedRef.current = true;
      }
    }
  }, [openItem, openKind, logQuery.data, coachMeal]);

  // Skip-Set: vom Athleten weggeklickte Coach-Items
  const skips = coachSkipsQuery.data ?? { comp: new Set<string>(), snack: new Set<string>() };
  const visibleComponents = useMemo(
    () => coachMeal?.components.filter((c) => !skips.comp.has(c.id)) ?? [],
    [coachMeal, skips.comp],
  );
  const visibleSnacks = useMemo(
    () => coachMeal?.snacks.filter((s) => !skips.snack.has(s.id)) ?? [],
    [coachMeal, skips.snack],
  );

  // Macros: Coach-Plan (ohne geskippte) + selbst getrackt
  const coachPlannedMacros = useMemo(() => {
    const compMacros = visibleComponents.map((c) => calcComponentMacros(c.food, Number(c.amount_g)));
    const snackMacros = visibleSnacks.map((s) => calcComponentMacros(s.food, Number(s.amount_g)));
    return sumMacros([...compMacros, ...snackMacros]);
  }, [visibleComponents, visibleSnacks]);

  const loggedMacros = useMemo(
    () =>
      sumMacros(
        (logQuery.data ?? []).map((l) => ({
          kcal: Number(l.total_kcal ?? 0),
          protein: Number(l.total_protein_g ?? 0),
          carbs: Number(l.total_carbs_g ?? 0),
          fat: Number(l.total_fat_g ?? 0),
        })),
      ),
    [logQuery.data],
  );

  const totalMacros = useMemo(
    () => sumMacros([coachPlannedMacros, loggedMacros]),
    [coachPlannedMacros, loggedMacros],
  );

  const dayGoal = templateQuery.data?.target_kcal ?? 2500;
  const proteinGoal = templateQuery.data?.target_protein_g ?? 150;
  const carbsGoal = templateQuery.data?.target_carbs_g ?? 220;
  const fatGoal = templateQuery.data?.target_fat_g ?? 90;

  // Sheet-Helpers
  const closeSheet = () => setActiveSheet(null);

  const handleAdoptCoach = (amountG: number, servings: number) => {
    if (!activeSheet || activeSheet.kind !== 'coach') return;
    const item = activeSheet.component ?? activeSheet.snack;
    if (!item) return;
    const food = item.food;
    if (!food) {
      Alert.alert('Kein Lebensmittel', 'Diese Coach-Vorgabe hat kein Datenbank-Lebensmittel zum Übernehmen.');
      return;
    }
    addMealMut.mutate({
      slotKey,
      displayName: food.name,
      source: 'coach_plan',
      templateMealId: coachMealId,
      amountG,
      servings,
      macrosPer100g: {
        kcal: Number(food.kcal_per_100g),
        protein: Number(food.protein_per_100g),
        carbs: Number(food.carbs_per_100g),
        fat: Number(food.fat_per_100g),
      },
    });
  };

  const handleAddSearch = (amountG: number, servings: number) => {
    if (!activeSheet || activeSheet.kind !== 'search') return;
    addMealMut.mutate({
      slotKey,
      displayName: activeSheet.hit.name,
      source: activeSheet.hit.source === 'coach' ? 'search' : 'search',
      amountG,
      servings,
      macrosPer100g: activeSheet.hit.macrosPer100g,
    });
    setQuery('');
  };

  const handleAddQuickPick = (amountG: number, servings: number) => {
    if (!activeSheet || activeSheet.kind !== 'quickPick') return;
    addMealMut.mutate({
      slotKey,
      displayName: activeSheet.item.displayName,
      source: activeSheet.item.source,
      amountG,
      servings,
      macrosPer100g: activeSheet.item.macrosPer100g,
    });
  };

  const handleAddScan = (amountG: number, servings: number) => {
    if (!activeSheet || activeSheet.kind !== 'scan') return;
    const p = activeSheet.product;
    addMealMut.mutate({
      slotKey,
      displayName: p.brand ? `${p.name} (${p.brand})` : p.name,
      source: 'barcode',
      amountG,
      servings,
      macrosPer100g: {
        kcal: p.nutrients.energy_kcal ?? 0,
        protein: p.nutrients.protein ?? 0,
        carbs: p.nutrients.carbs ?? 0,
        fat: p.nutrients.fat ?? 0,
      },
    });
  };

  const handleEditLog = (amountG: number, servings: number) => {
    if (!activeSheet || activeSheet.kind !== 'log') return;
    const meta = extractLogMeta(activeSheet.log);
    if (!meta) return;
    updateMealMut.mutate({
      logId: activeSheet.log.id,
      amountG,
      servings,
      macrosPer100g: meta.macrosPer100g,
    });
  };

  const handleDeleteLog = () => {
    if (!activeSheet || activeSheet.kind !== 'log') return;
    deleteMealMut.mutate(activeSheet.log.id);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={color.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{label.toUpperCase()}</Text>
        <View style={styles.kcalPill}>
          <Text style={styles.kcalNow}>{Math.round(totalMacros.kcal)}</Text>
          <Text style={styles.kcalGoal}> / {dayGoal} kcal</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Suche + Barcode */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color={color.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Lebensmittel suchen…"
              placeholderTextColor={color.textDim}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={6}>
                <Ionicons name="close-circle" size={16} color={color.textMuted} />
              </Pressable>
            ) : null}
          </View>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/nutrition/scan',
                params: {
                  slotKey,
                  label,
                  coachMealId: coachMealId ?? '',
                },
              })
            }
            style={({ pressed }) => [styles.barcodeBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="barcode-outline" size={20} color={color.text} />
          </Pressable>
        </View>

        {/* Tabs (FEELY: Mahlzeit | Zuletzt | Häufig) */}
        {!showingSearch ? (
          <View style={styles.tabsRow}>
            <TabBtn label={label} active={activeTab === 'meal'} onPress={() => setActiveTab('meal')} />
            <TabBtn label="Zuletzt" active={activeTab === 'recent'} onPress={() => setActiveTab('recent')} />
            <TabBtn label="Häufig" active={activeTab === 'frequent'} onPress={() => setActiveTab('frequent')} />
          </View>
        ) : null}

        {/* Such-Ergebnisse oder Standard-Layout */}
        {showingSearch ? (
          <View style={styles.searchResults}>
            <View style={styles.searchHeaderRow}>
              <Text style={styles.sectionLabel}>SUCHERGEBNISSE</Text>
              {offQuery.isFetching && debouncedQuery.length >= 3 ? (
                <View style={styles.searchLoadingRow}>
                  <ActivityIndicator size="small" color={color.macroCarbs} />
                  <Text style={styles.searchLoadingText}>Open Food Facts…</Text>
                </View>
              ) : null}
            </View>
            {searchHits.length === 0 && !offQuery.isFetching ? (
              <Text style={styles.emptyText}>Keine Treffer für „{query}".</Text>
            ) : searchHits.length === 0 ? null : (
              searchHits.map((hit) => (
                <Pressable
                  key={hit.id}
                  onPress={() => setActiveSheet({ kind: 'search', hit })}
                  style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName}>{hit.name}</Text>
                    {hit.note ? <Text style={styles.rowNote}>{hit.note}</Text> : null}
                    <Text
                      style={[
                        styles.rowSource,
                        hit.source === 'coach' && { color: color.macroProtein },
                        hit.source === 'off' && { color: color.macroCarbs },
                      ]}
                    >
                      {hit.source === 'coach' ? 'COACH-DATENBANK' : hit.source === 'bls' ? 'BLS' : 'OPEN FOOD FACTS'}
                    </Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.rowKcal}>{Math.round(hit.macrosPer100g.kcal)} kcal</Text>
                    <Text style={styles.rowPer}>/ 100g</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        ) : activeTab !== 'meal' ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{activeTab === 'recent' ? 'ZULETZT GEGESSEN' : 'HÄUFIG GEGESSEN'}</Text>
            <QuickPickList
              items={(activeTab === 'recent' ? recentQuery.data : frequentQuery.data) ?? []}
              isLoading={activeTab === 'recent' ? recentQuery.isLoading : frequentQuery.isLoading}
              onPick={(item) => setActiveSheet({ kind: 'quickPick', item })}
              showCount={activeTab === 'frequent'}
            />
          </View>
        ) : (
          <>
            {/* Nährwerte gesamt für diesen Slot — Coach-Plan + selbst getrackt */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NÄHRWERTE GESAMT</Text>
              <View style={styles.macroCard}>
                <View style={styles.macroHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.macroBig}>
                      {Math.round(totalMacros.kcal)}
                      <Text style={styles.macroUnit}> kcal</Text>
                    </Text>
                  </View>
                  <Text style={styles.macroGoalRight}>von {dayGoal} Tagesziel</Text>
                </View>

                <MacroBar label="Eiweiß" current={totalMacros.protein} goal={proteinGoal} accent={color.macroProtein} />
                <MacroBar label="Kohlenhydrate" current={totalMacros.carbs} goal={carbsGoal} accent={color.macroCarbs} />
                <MacroBar label="Fett" current={totalMacros.fat} goal={fatGoal} accent={color.macroFat} />
              </View>
            </View>

            {/* LEBENSMITTEL — Coach-Plan (ohne geskippte) + selbst getrackt in einer Liste */}
            {visibleComponents.length > 0 ||
            visibleSnacks.length > 0 ||
            (logQuery.data ?? []).length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>LEBENSMITTEL</Text>
                  {coachMeal?.timing_hint ? (
                    <Text style={styles.sectionLabelSecondary}>· {coachMeal.timing_hint}</Text>
                  ) : null}
                </View>
                <View style={styles.itemsCard}>
                  {/* Coach-Plan-Items (zählen automatisch, read-only) */}
                  {visibleComponents.map((c, i) => {
                    const macros = calcComponentMacros(c.food, Number(c.amount_g));
                    const name = c.food?.name ?? c.food_name_override ?? '—';
                    const amt = c.amount_display ?? `${Number(c.amount_g)}g`;
                    return (
                      <ItemRow
                        key={`comp-${c.id}`}
                        name={name}
                        amount={amt}
                        kcal={Math.round(macros.kcal)}
                        protein={Math.round(macros.protein)}
                        carbs={Math.round(macros.carbs)}
                        fat={Math.round(macros.fat)}
                        isCoach
                        showDivider={i > 0}
                        onPress={() => setActiveSheet({ kind: 'coach', component: c, snack: null })}
                        onDelete={() => skipCoachMut.mutate({ slotKey, kind: 'comp', itemId: c.id })}
                      />
                    );
                  })}
                  {visibleSnacks.map((s, i) => {
                    const macros = calcComponentMacros(s.food, Number(s.amount_g));
                    const name = s.food?.name ?? s.food_name_override ?? '—';
                    const amt = s.amount_display ?? (Number(s.amount_g) > 0 ? `${Number(s.amount_g)}g` : '');
                    const isFirst = visibleComponents.length === 0 && i === 0;
                    return (
                      <ItemRow
                        key={`snack-${s.id}`}
                        name={name}
                        amount={amt}
                        kcal={Math.round(macros.kcal)}
                        protein={Math.round(macros.protein)}
                        carbs={Math.round(macros.carbs)}
                        fat={Math.round(macros.fat)}
                        hint={s.hint ?? undefined}
                        isCoach
                        showDivider={!isFirst}
                        onPress={() => setActiveSheet({ kind: 'coach', component: null, snack: s })}
                        onDelete={() => skipCoachMut.mutate({ slotKey, kind: 'snack', itemId: s.id })}
                      />
                    );
                  })}
                  {/* Athleten-getrackte Items (editierbar) */}
                  {(logQuery.data ?? []).map((log, i) => {
                    const isFirstOverall =
                      visibleComponents.length === 0 && visibleSnacks.length === 0 && i === 0;
                    const meta = extractLogMeta(log);
                    const amt = meta ? `${meta.amountG}g${meta.servings > 1 ? ` × ${meta.servings}` : ''}` : '';
                    return (
                      <ItemRow
                        key={`log-${log.id}`}
                        name={log.display_name}
                        amount={amt}
                        kcal={Math.round(Number(log.total_kcal ?? 0))}
                        protein={Math.round(Number(log.total_protein_g ?? 0))}
                        carbs={Math.round(Number(log.total_carbs_g ?? 0))}
                        fat={Math.round(Number(log.total_fat_g ?? 0))}
                        isCoach={false}
                        showDivider={!isFirstOverall}
                        onPress={() => setActiveSheet({ kind: 'log', log })}
                        onDelete={() => deleteMealMut.mutate(log.id)}
                      />
                    );
                  })}
                  {coachMeal?.notes ? (
                    <View style={styles.coachNoteInner}>
                      <Ionicons name="chatbox-ellipses" size={11} color={color.textMuted} />
                      <Text style={styles.coachNoteText}>{coachMeal.notes}</Text>
                    </View>
                  ) : null}
                </View>
                {logQuery.isLoading ? (
                  <ActivityIndicator color={color.text} style={{ marginTop: 8 }} />
                ) : null}
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>LEBENSMITTEL</Text>
                <Text style={styles.emptyText}>
                  Noch nichts geplant. Suche oben oder tippe ein neues Lebensmittel ein.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Foto-Button (Sticky) */}
      <View style={[styles.photoBar, { paddingBottom: insets.bottom + space[2] }]}>
        <Pressable
          onPress={() => Alert.alert('Foto-Tracking', 'Gemini-Vision-Pipeline kommt in Welle 2.')}
          style={({ pressed }) => [styles.photoBtn, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="camera" size={18} color={color.bg} />
          <Text style={styles.photoLabel}>Foto</Text>
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeLabel}>KI</Text>
          </View>
        </Pressable>
      </View>

      {/* Detail-Sheet */}
      <SheetMount activeSheet={activeSheet} onClose={closeSheet}
        onAdoptCoach={handleAdoptCoach}
        onAddSearch={handleAddSearch}
        onAddQuickPick={handleAddQuickPick}
        onAddScan={handleAddScan}
        onEditLog={handleEditLog}
        onDeleteLog={handleDeleteLog}
        onSkipCoach={(kind, itemId) => skipCoachMut.mutate({ slotKey, kind, itemId })}
      />
    </View>
  );
}

// ─── Sheet-Mount: rendert das richtige Sheet je nach Kontext ──────────

function SheetMount({
  activeSheet,
  onClose,
  onAdoptCoach,
  onAddSearch,
  onAddQuickPick,
  onAddScan,
  onEditLog,
  onDeleteLog,
  onSkipCoach,
}: {
  activeSheet: ActiveSheet;
  onClose: () => void;
  onAdoptCoach: (amountG: number, servings: number) => void;
  onAddSearch: (amountG: number, servings: number) => void;
  onAddQuickPick: (amountG: number, servings: number) => void;
  onAddScan: (amountG: number, servings: number) => void;
  onEditLog: (amountG: number, servings: number) => void;
  onDeleteLog: () => void;
  onSkipCoach: (kind: 'comp' | 'snack', itemId: string) => void;
}) {
  if (!activeSheet) {
    return <FoodDetailSheet visible={false} mode="view" name="" macrosPer100g={{ kcal: 0, protein: 0, carbs: 0, fat: 0 }} initialAmountG={100} onClose={onClose} />;
  }

  if (activeSheet.kind === 'coach') {
    const item = activeSheet.component ?? activeSheet.snack;
    const food = item?.food;
    if (!item || !food) {
      return null;
    }
    const kind: 'comp' | 'snack' = activeSheet.component ? 'comp' : 'snack';
    return (
      <FoodDetailSheet
        visible={true}
        mode="view"
        name={food.name}
        timeLabel="Coach-Vorgabe — zählt automatisch"
        macrosPer100g={{
          kcal: Number(food.kcal_per_100g),
          protein: Number(food.protein_per_100g),
          carbs: Number(food.carbs_per_100g),
          fat: Number(food.fat_per_100g),
        }}
        initialAmountG={Number(item.amount_g)}
        onClose={onClose}
        onDelete={() => onSkipCoach(kind, item.id)}
      />
    );
  }

  if (activeSheet.kind === 'log') {
    const meta = extractLogMeta(activeSheet.log);
    if (!meta) return null;
    return (
      <FoodDetailSheet
        visible={true}
        mode="edit"
        name={activeSheet.log.display_name}
        timeLabel={activeSheet.log.log_time?.slice(0, 5) + ' Uhr'}
        macrosPer100g={meta.macrosPer100g}
        initialAmountG={meta.amountG}
        initialServings={meta.servings}
        onClose={onClose}
        onSave={onEditLog}
        onDelete={onDeleteLog}
      />
    );
  }

  if (activeSheet.kind === 'quickPick') {
    return (
      <FoodDetailSheet
        visible={true}
        mode="create"
        name={activeSheet.item.displayName}
        timeLabel={activeSheet.item.count ? `${activeSheet.item.count}× gegessen` : 'Schnellauswahl'}
        macrosPer100g={activeSheet.item.macrosPer100g}
        initialAmountG={activeSheet.item.defaultAmountG}
        onClose={onClose}
        onSave={onAddQuickPick}
      />
    );
  }

  if (activeSheet.kind === 'scan') {
    const p = activeSheet.product;
    return (
      <FoodDetailSheet
        visible={true}
        mode="create"
        name={p.brand ? `${p.name} (${p.brand})` : p.name}
        timeLabel={`Barcode ${p.barcode}${p.quantity ? ' · ' + p.quantity : ''}`}
        macrosPer100g={{
          kcal: p.nutrients.energy_kcal ?? 0,
          protein: p.nutrients.protein ?? 0,
          carbs: p.nutrients.carbs ?? 0,
          fat: p.nutrients.fat ?? 0,
        }}
        initialAmountG={100}
        onClose={onClose}
        onSave={onAddScan}
      />
    );
  }

  // search
  return (
    <FoodDetailSheet
      visible={true}
      mode="create"
      name={activeSheet.hit.name}
      timeLabel={
        activeSheet.hit.source === 'coach'
          ? 'Coach-Datenbank'
          : activeSheet.hit.source === 'bls'
            ? 'BLS-Datenbank'
            : 'Open Food Facts'
      }
      macrosPer100g={activeSheet.hit.macrosPer100g}
      initialAmountG={100}
      onClose={onClose}
      onSave={onAddSearch}
    />
  );
}

// ─── Lebensmittel-Item-Row (Coach + Logs, FEELY-Style) ─────────────

function ItemRow({
  name,
  amount,
  kcal,
  protein,
  carbs,
  fat,
  hint,
  isCoach,
  showDivider,
  onPress,
  onDelete,
}: {
  name: string;
  amount: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  hint?: string;
  isCoach: boolean;
  showDivider: boolean;
  onPress: () => void;
  onDelete?: () => void;
}) {
  return (
    <View style={[styles.itemRowOuter, showDivider && styles.itemRowDivider]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.itemRowMain, pressed && { opacity: 0.6 }]}
      >
        <View style={[styles.itemBullet, { backgroundColor: isCoach ? color.macroProtein : color.text }]} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.itemName}>{name}</Text>
          {amount || kcal > 0 ? (
            <Text style={styles.itemMeta}>
              {[amount, kcal > 0 ? `${kcal} kcal` : null].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
          {protein + carbs + fat > 0 ? (
            <View style={styles.itemDots}>
              <MacroDot color={color.macroProtein} value={`${protein}g`} />
              <MacroDot color={color.macroCarbs} value={`${carbs}g`} />
              <MacroDot color={color.macroFat} value={`${fat}g`} />
            </View>
          ) : null}
          {hint ? <Text style={styles.rowHint}>{hint}</Text> : null}
        </View>
      </Pressable>
      {onDelete ? (
        <Pressable
          onPress={onDelete}
          hitSlop={10}
          style={({ pressed }) => [styles.itemDeleteBtn, pressed && { opacity: 0.5 }]}
        >
          <Ionicons name="close-circle" size={22} color={color.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

function MacroDot({ color: c, value }: { color: string; value: string }) {
  return (
    <View style={styles.macroDotWrap}>
      <View style={[styles.macroDot, { backgroundColor: c }]} />
      <Text style={styles.macroDotValue}>{value}</Text>
    </View>
  );
}

// ─── Tabs (FEELY-Style: Underline) ──────────────────────────────────

function TabBtn({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.tabBtn} hitSlop={6}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]} numberOfLines={1}>
        {label}
      </Text>
      <View style={[styles.tabUnderline, !active && { backgroundColor: 'transparent' }]} />
    </Pressable>
  );
}

// ─── QuickPickList (Zuletzt / Häufig) ───────────────────────────────

function QuickPickList({
  items,
  isLoading,
  onPick,
  showCount,
}: {
  items: QuickPickItem[];
  isLoading: boolean;
  onPick: (item: QuickPickItem) => void;
  showCount: boolean;
}) {
  if (isLoading) {
    return <ActivityIndicator color={color.text} style={{ marginTop: 16 }} />;
  }
  if (items.length === 0) {
    return (
      <Text style={styles.emptyText}>
        Noch keine Einträge. Tracke ein paar Mahlzeiten — dann findest du sie hier.
      </Text>
    );
  }
  return (
    <View style={{ gap: 8 }}>
      {items.map((item, idx) => (
        <Pressable
          key={`${item.displayName}-${idx}`}
          onPress={() => onPick(item)}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.rowName}>{item.displayName}</Text>
            <Text style={styles.rowNote}>
              {Math.round(item.macrosPer100g.protein)}P · {Math.round(item.macrosPer100g.carbs)}C · {Math.round(item.macrosPer100g.fat)}F · pro 100g
            </Text>
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.rowKcal}>{Math.round(item.macrosPer100g.kcal)}</Text>
            <Text style={styles.rowPer}>kcal/100g</Text>
            {showCount && item.count ? (
              <View style={styles.countPill}>
                <Text style={styles.countPillLabel}>{item.count}×</Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

// ─── Macro-Bar (für Slot-Übersicht) ────────────────────────────────

function MacroBar({
  label,
  current,
  goal,
  accent,
}: {
  label: string;
  current: number;
  goal: number;
  accent: string;
}) {
  const percent = pct(current, goal);
  return (
    <View style={styles.macroBarRow}>
      <Text style={styles.macroBarLabel}>{label}</Text>
      <View style={styles.macroBarTrack}>
        <View style={[styles.macroBarFill, { width: `${percent}%`, backgroundColor: accent }]} />
      </View>
      <Text style={styles.macroBarValue}>{Math.round(current)}g</Text>
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingVertical: space[3],
    gap: space[3],
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 16,
    fontWeight: '900',
    color: color.text,
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  kcalPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: space[3],
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: color.whiteA08,
    borderWidth: 1,
    borderColor: color.whiteA15,
  },
  kcalNow: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.text,
  },
  kcalGoal: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
  },
  scroll: {
    paddingHorizontal: space[5],
    gap: space[5],
  },
  searchRow: {
    flexDirection: 'row',
    gap: space[2],
    marginTop: space[2],
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  searchInput: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 14,
    color: color.text,
    paddingVertical: 0,
  },
  barcodeBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.whiteA08,
    borderWidth: 1,
    borderColor: color.whiteA15,
  },
  searchResults: {
    gap: space[2],
  },
  searchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchLoadingText: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingTop: space[3],
    paddingBottom: space[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: space[3],
    alignItems: 'center',
  },
  tabLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '500',
    color: color.textMuted,
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    color: color.text,
    fontWeight: '700',
  },
  tabUnderline: {
    width: 28,
    height: 2,
    borderRadius: 2,
    backgroundColor: color.text,
    marginTop: 6,
  },
  countPill: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: color.whiteA08,
    borderWidth: 1,
    borderColor: color.whiteA15,
  },
  countPillLabel: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 0.4,
  },
  section: {
    gap: space[3],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space[2],
  },
  sectionLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 2.2,
  },
  sectionLabelSecondary: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  macroCard: {
    paddingVertical: space[5],
    paddingHorizontal: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: color.whiteA15,
    gap: space[3],
  },
  macroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: space[2],
  },
  macroBig: {
    fontFamily: font.family,
    fontSize: 36,
    fontWeight: '800',
    color: color.text,
    letterSpacing: -1.2,
  },
  macroUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: color.textMuted,
  },
  macroGoalRight: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    letterSpacing: 0.4,
  },
  macroBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  macroBarLabel: {
    width: 100,
    fontFamily: font.family,
    fontSize: 12,
    color: color.text,
  },
  macroBarTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroBarValue: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: color.text,
    minWidth: 38,
    textAlign: 'right',
  },
  itemsCard: {
    paddingHorizontal: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.blackA40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  itemRowOuter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemRowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
    paddingVertical: space[4],
  },
  itemRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  itemDeleteBtn: {
    paddingVertical: space[4],
    paddingLeft: space[2],
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  itemBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  itemName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
    letterSpacing: -0.1,
  },
  itemMeta: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.1,
  },
  itemDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginTop: 2,
  },
  macroDotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroDotValue: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.text,
    letterSpacing: 0.1,
  },
  coachNoteInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2],
    paddingVertical: space[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
    marginTop: space[1],
  },
  coachNoteText: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 11,
    fontStyle: 'italic',
    color: color.textMuted,
    lineHeight: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
    paddingHorizontal: space[4],
    borderRadius: radius.md,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  rowName: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '600',
    color: color.text,
  },
  rowNote: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 3,
    letterSpacing: 0.2,
  },
  rowHint: {
    fontFamily: font.family,
    fontSize: 10,
    fontStyle: 'italic',
    color: color.macroProtein,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  rowSource: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '700',
    color: color.textMuted,
    letterSpacing: 1.6,
    marginTop: 4,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  rowKcal: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.text,
  },
  rowPer: {
    fontFamily: font.family,
    fontSize: 9,
    color: color.textDim,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  emptyText: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    paddingVertical: space[5],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  photoBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: space[5],
    paddingTop: space[3],
    backgroundColor: color.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.10)',
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    paddingVertical: space[4],
    borderRadius: radius.pill,
    backgroundColor: color.text,
  },
  photoLabel: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.4,
  },
  photoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: color.bg,
    marginLeft: 4,
  },
  photoBadgeLabel: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 0.4,
  },
});
