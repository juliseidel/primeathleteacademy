import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';
import { searchBls, type BlsFood } from '@/lib/nutrition/blsService';
import { supabase } from '@/lib/supabase';

import type { CoachFood } from '@/lib/nutrition/nutritionData';

type SearchHit =
  | { source: 'coach'; id: string; name: string; kcal: number; protein: number; carbs: number; fat: number; note: string | null }
  | { source: 'bls'; id: string; name: string; kcal: number; protein: number; carbs: number; fat: number; note: string | null };

export function NutritionLebensmittel() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const coachQuery = useQuery({
    queryKey: ['nutrition', 'coach-foods', query],
    queryFn: async () => {
      const q = query.trim().toLowerCase();
      const builder = supabase
        .from('coach_food_database')
        .select('*')
        .eq('is_archived', false)
        .order('name');
      const filtered = q.length >= 2 ? builder.ilike('name', `%${q}%`) : builder.limit(15);
      const { data, error } = await filtered;
      if (error) throw error;
      return data as CoachFood[];
    },
  });

  const blsResults = useMemo<BlsFood[]>(() => searchBls(query, 15), [query]);

  const allHits = useMemo<SearchHit[]>(() => {
    const coachHits: SearchHit[] = (coachQuery.data ?? []).map((c) => ({
      source: 'coach',
      id: c.id,
      name: c.name,
      kcal: Number(c.kcal_per_100g),
      protein: Number(c.protein_per_100g),
      carbs: Number(c.carbs_per_100g),
      fat: Number(c.fat_per_100g),
      note: c.note,
    }));
    const blsHits: SearchHit[] = blsResults.map((b) => ({
      source: 'bls',
      id: b.id,
      name: b.name,
      kcal: b.nutrients_per_100g.energy_kcal,
      protein: b.nutrients_per_100g.protein,
      carbs: b.nutrients_per_100g.carbs,
      fat: b.nutrients_per_100g.fat,
      note: b.tags?.join(' · ') ?? null,
    }));
    // Coach-Top, dann BLS, Doubletten via Lower-Name vermeiden
    const seen = new Set<string>();
    const merged: SearchHit[] = [];
    for (const h of [...coachHits, ...blsHits]) {
      const key = h.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(h);
    }
    return merged;
  }, [coachQuery.data, blsResults]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[3], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.eyebrow}>ERNÄHRUNG · LEBENSMITTEL</Text>
      <Text style={styles.headline}>Datenbank</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={color.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Lebensmittel suchen…"
          placeholderTextColor={color.textDim}
          style={styles.searchInput}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.sourceRow}>
        <SourceTag label="Coach" count={coachQuery.data?.length ?? 0} />
        <SourceTag label="BLS" count={blsResults.length} />
        <SourceTag label="Open Food Facts" muted />
      </View>

      <View style={styles.list}>
        {allHits.length === 0 && query.trim().length >= 2 ? (
          <Text style={styles.empty}>Keine Treffer für „{query}".</Text>
        ) : null}
        {allHits.map((hit) => (
          <FoodRow key={`${hit.source}:${hit.id}`} hit={hit} />
        ))}
      </View>
    </ScrollView>
  );
}

function SourceTag({ label, count, muted }: { label: string; count?: number; muted?: boolean }) {
  return (
    <View style={[styles.tag, muted && styles.tagMuted]}>
      <Text style={[styles.tagLabel, muted && styles.tagLabelMuted]}>{label}</Text>
      {count !== undefined ? <Text style={styles.tagCount}>{count}</Text> : <Text style={styles.tagCount}>bald</Text>}
    </View>
  );
}

function FoodRow({ hit }: { hit: SearchHit }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <Text style={styles.rowName}>{hit.name}</Text>
        {hit.note ? <Text style={styles.rowNote}>{hit.note}</Text> : null}
        <Text style={styles.rowSource}>{hit.source === 'coach' ? 'COACH-DATENBANK' : 'BLS-DATENBANK'}</Text>
      </View>
      <View style={styles.rowMacros}>
        <Text style={styles.rowKcal}>{Math.round(hit.kcal)} kcal</Text>
        <Text style={styles.rowMacroLine}>
          {Math.round(hit.protein)}P · {Math.round(hit.carbs)}C · {Math.round(hit.fat)}F
        </Text>
        <Text style={styles.rowPer}>/ 100 g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 3.0,
  },
  headline: {
    fontFamily: displaySerif as string,
    fontSize: 32,
    fontStyle: 'italic',
    color: color.text,
    letterSpacing: -0.5,
    marginTop: space[2],
    marginBottom: space[4],
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderRadius: radius.md,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  searchInput: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 15,
    color: color.text,
  },
  sourceRow: {
    flexDirection: 'row',
    gap: space[2],
    marginTop: space[3],
    marginBottom: space[4],
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space[3],
    paddingVertical: space[1],
    borderRadius: radius.pill,
    backgroundColor: color.whiteA08,
    borderWidth: 1,
    borderColor: color.whiteA15,
  },
  tagMuted: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tagLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 1.4,
  },
  tagLabelMuted: {
    color: color.textDim,
  },
  tagCount: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '500',
    color: color.textMuted,
  },
  list: {
    gap: space[2],
  },
  empty: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    textAlign: 'center',
    paddingVertical: space[8],
  },
  row: {
    flexDirection: 'row',
    padding: space[4],
    borderRadius: radius.md,
    backgroundColor: color.blackA55,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: space[3],
  },
  rowMain: {
    flex: 1,
    gap: 2,
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
    fontStyle: 'italic',
    color: color.textMuted,
  },
  rowSource: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '700',
    color: color.text,
    letterSpacing: 1.6,
    marginTop: 2,
  },
  rowMacros: {
    alignItems: 'flex-end',
  },
  rowKcal: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.text,
  },
  rowMacroLine: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
    marginTop: 2,
  },
  rowPer: {
    fontFamily: font.family,
    fontSize: 9,
    color: color.textDim,
    marginTop: 2,
    letterSpacing: 0.4,
  },
});
