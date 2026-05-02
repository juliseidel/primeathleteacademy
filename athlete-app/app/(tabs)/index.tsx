import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/lib/design/components/GlassCard';
import { color, font, glow, radius, space } from '@/lib/design/tokens';

const TODAY = new Date().toLocaleDateString('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <BackgroundDecor />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + space[4], paddingBottom: 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>HEUTE</Text>
        <Text style={styles.headline}>{capitalize(TODAY)}</Text>

        <GlassCard variant="premium" style={styles.cardWide}>
          <View style={styles.coachRow}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>JK</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.coachName}>Jonas</Text>
              <Text style={styles.coachStatus}>dein Coach · heute aktiv</Text>
            </View>
          </View>
          <Text style={styles.coachMessage}>
            Heute ist Reduktions-Tag — geh's locker an, fokussier dich auf saubere Technik. Dein Spieltag rückt näher.
          </Text>
        </GlassCard>

        <GlassCard variant="standard" style={styles.cardWide}>
          <View style={styles.countdownRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardEyebrow}>SPIELTAG</Text>
              <Text style={styles.cardTitle}>Auswärts in Braunschweig</Text>
              <Text style={styles.cardMeta}>Samstag, 14:00</Text>
            </View>
            <View style={styles.countdownBadge}>
              <Text style={styles.countdownNumber}>2</Text>
              <Text style={styles.countdownUnit}>Tage</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard variant="standard" style={styles.cardWide}>
          <View style={styles.iconRow}>
            <View style={styles.iconBox}>
              <Ionicons name="barbell" size={18} color={color.gold} />
            </View>
            <Text style={styles.cardEyebrow}>TRAINING HEUTE</Text>
          </View>
          <Text style={styles.cardTitle}>Krafttraining · Unterkörper</Text>
          <Text style={styles.cardMeta}>4 Übungen · ~45 Minuten · 18:00</Text>
        </GlassCard>

        <GlassCard variant="standard" style={styles.cardWide}>
          <View style={styles.iconRow}>
            <View style={styles.iconBox}>
              <Ionicons name="restaurant" size={18} color={color.gold} />
            </View>
            <Text style={styles.cardEyebrow}>ERNÄHRUNG HEUTE</Text>
          </View>
          <Text style={styles.cardTitle}>2.450 kcal · 180g Protein</Text>
          <Text style={styles.cardMeta}>Mittag mit 50g Protein · 3L Wasser</Text>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

function BackgroundDecor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <LinearGradient
        colors={[color.surfaceDeep, color.bg, color.bg]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, { top: -120, right: -120, ...glow.goldHaloOuter }]} />
      <View style={[styles.orb, { bottom: -180, left: -150, ...glow.goldHaloInner }]} />
    </View>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
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
    fontSize: 32,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
    marginBottom: space[6],
    letterSpacing: -0.4,
  },
  cardWide: { width: '100%', padding: space[5] },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginBottom: space[4],
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.surfaceLight,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 0.4,
  },
  coachName: {
    fontFamily: font.family,
    fontSize: 17,
    fontWeight: '600',
    color: color.text,
  },
  coachStatus: {
    fontFamily: font.family,
    fontSize: 12,
    color: color.textMuted,
    marginTop: 2,
  },
  coachMessage: {
    fontFamily: font.family,
    fontSize: 15,
    lineHeight: 22,
    color: color.text,
  },
  cardEyebrow: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: color.textMuted,
    letterSpacing: 2.4,
  },
  cardTitle: {
    fontFamily: font.family,
    fontSize: 18,
    fontWeight: '700',
    color: color.text,
    marginTop: space[2],
  },
  cardMeta: {
    fontFamily: font.family,
    fontSize: 13,
    color: color.textMuted,
    marginTop: space[1],
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  countdownBadge: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: color.goldA10,
    borderWidth: 1,
    borderColor: color.goldA30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontFamily: font.family,
    fontSize: 28,
    fontWeight: '700',
    color: color.gold,
    lineHeight: 32,
  },
  countdownUnit: {
    fontFamily: font.family,
    fontSize: 10,
    color: color.gold,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  orb: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: color.goldA10,
    opacity: 0.6,
  },
});
