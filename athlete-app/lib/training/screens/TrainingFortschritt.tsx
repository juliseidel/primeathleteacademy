import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/lib/design/components/GlassCard';
import { Sparkline } from '@/lib/design/components/Sparkline';
import { color, font, space } from '@/lib/design/tokens';
import { PRS, TRENDS } from '@/lib/training/mockData';

export function TrainingFortschritt() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space[4], paddingBottom: 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>FORTSCHRITT</Text>
      <Text style={styles.headline}>Du wirst stärker</Text>

      {/* PRs Section */}
      <Text style={styles.sectionLabel}>PERSÖNLICHE BESTLEISTUNGEN</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.prScroll}
      >
        {PRS.map((pr) => (
          <GlassCard
            key={pr.id}
            variant={pr.isNew ? 'premium' : 'standard'}
            style={[styles.prCard, pr.isNew && styles.prCardNew]}
          >
            {pr.isNew ? (
              <View style={styles.newBadge}>
                <Ionicons name="flash" size={10} color={color.bg} />
                <Text style={styles.newBadgeText}>NEU</Text>
              </View>
            ) : null}
            <Text style={styles.prExercise}>{pr.exerciseName}</Text>
            <Text style={styles.prValue}>{pr.value}</Text>
            <View style={styles.prMetaRow}>
              {pr.delta ? (
                <View style={styles.deltaBadge}>
                  <Ionicons name="trending-up" size={10} color={color.gold} />
                  <Text style={styles.deltaText}>{pr.delta}</Text>
                </View>
              ) : (
                <Text style={styles.heldText}>gehalten</Text>
              )}
              <Text style={styles.prDays}>vor {pr.daysSince} {pr.daysSince === 1 ? 'Tag' : 'Tagen'}</Text>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      {/* Trends Section */}
      <Text style={styles.sectionLabel}>DEINE ÜBUNGEN</Text>

      <View style={styles.list}>
        {TRENDS.map((t) => {
          const inverted = t.measurementType === 'distance_time';
          const latest = t.values[t.values.length - 1];
          const trendIsPositive = inverted ? t.trendPercent < 0 : t.trendPercent > 0;
          const trendColor = trendIsPositive ? color.success : color.textMuted;
          const trendArrow = inverted
            ? (t.trendPercent < 0 ? '↘' : '↗')
            : (t.trendPercent > 0 ? '↗' : '↘');

          return (
            <GlassCard key={t.id} variant="standard" style={styles.trendCard}>
              <View style={styles.trendRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trendName}>{t.exerciseName}</Text>
                  <View style={styles.trendMeta}>
                    <Text style={[styles.trendDelta, { color: trendColor }]}>
                      {trendArrow} {Math.abs(t.trendPercent).toFixed(1)}%
                    </Text>
                    <Text style={styles.trendLabel}>{t.trendLabel}</Text>
                    <Text style={styles.trendCurrent}>aktuell {latest}{t.unit}</Text>
                  </View>
                </View>
                <View style={styles.sparkWrap}>
                  <Sparkline values={t.values} width={84} height={28} inverted={inverted} />
                </View>
              </View>
            </GlassCard>
          );
        })}
      </View>

      {/* Empty state for tests (we don't have test data yet) */}
      <Text style={styles.sectionLabel}>ATHLETIK-TESTS</Text>
      <GlassCard variant="subtle" style={styles.emptyCard}>
        <Ionicons name="speedometer-outline" size={20} color={color.textDim} />
        <Text style={styles.emptyText}>
          Noch keine Tests von Coach geplant. Sprint-Zeiten, Sprünge und Conditioning-Tests
          erscheinen hier sobald sie eingeplant sind.
        </Text>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: space[5],
    gap: space[4],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '600',
    color: color.gold,
    letterSpacing: 3.2,
  },
  headline: {
    fontFamily: font.family,
    fontSize: 30,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
    marginBottom: space[3],
    letterSpacing: -0.4,
  },
  sectionLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.4,
    marginTop: space[3],
  },
  prScroll: {
    gap: space[3],
    paddingRight: space[5],
    paddingVertical: space[1],
  },
  prCard: {
    width: 175,
    padding: space[4],
    minHeight: 130,
  },
  prCardNew: {
    borderWidth: 1,
    borderColor: 'rgba(197,165,90,0.50)',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: color.gold,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadgeText: {
    fontFamily: font.family,
    fontSize: 9,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 1,
  },
  prExercise: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    letterSpacing: 0.4,
    marginBottom: space[2],
  },
  prValue: {
    fontFamily: font.family,
    fontSize: 22,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -0.3,
    marginBottom: space[3],
  },
  prMetaRow: {
    gap: 4,
  },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
  },
  deltaText: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '600',
    color: color.gold,
  },
  heldText: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
  },
  prDays: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textDim,
  },
  list: { gap: space[2] },
  trendCard: {
    width: '100%',
    padding: space[4],
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  trendName: {
    fontFamily: font.family,
    fontSize: 15,
    fontWeight: '600',
    color: color.text,
  },
  trendMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    marginTop: 4,
    flexWrap: 'wrap',
  },
  trendDelta: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '700',
  },
  trendLabel: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textMuted,
  },
  trendCurrent: {
    fontFamily: font.family,
    fontSize: 11,
    color: color.textDim,
  },
  sparkWrap: {
    width: 84,
    height: 28,
  },
  emptyCard: {
    width: '100%',
    padding: space[4],
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[3],
  },
  emptyText: {
    flex: 1,
    fontFamily: font.family,
    fontSize: 12,
    lineHeight: 18,
    color: color.textMuted,
  },
});
