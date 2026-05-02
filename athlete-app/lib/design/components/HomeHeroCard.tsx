import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { displaySerif } from '@/lib/design/light';
import { color, font, radius, space } from '@/lib/design/tokens';

export type HeroStat = {
  icon: keyof typeof Ionicons.glyphMap;
  eyebrow: string;
  value: string;
  unit?: string;
  featured?: boolean;
};

type Props = {
  eyebrow: string;          // "HEUTE · SAMSTAG, 2. MAI"
  avatarDataUri?: string | null;
  initials?: string;
  stats: HeroStat[];
  onCreateAvatar?: () => void;
};

const HERO_HEIGHT = 440;

export function HomeHeroCard({
  eyebrow,
  avatarDataUri,
  initials,
  stats,
  onCreateAvatar,
}: Props) {
  const hasAvatar = !!avatarDataUri;
  const featured = stats.filter((s) => s.featured);
  const secondary = stats.filter((s) => !s.featured);

  return (
    <View style={styles.hero}>
      {/* Warm Gold-Halo hinter dem Avatar — verschmilzt Avatar-BG mit Page-BG */}
      <View style={styles.warmHalo} pointerEvents="none" />

      {/* Avatar */}
      {hasAvatar ? (
        <View style={styles.avatarLayer} pointerEvents="none">
          <Image
            source={{ uri: avatarDataUri! }}
            style={styles.avatarImage}
            contentFit="cover"
            contentPosition="top center"
            transition={300}
          />
        </View>
      ) : (
        <View style={styles.avatarFallback}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials ?? '–'}</Text>
          </View>
          {onCreateAvatar ? (
            <Pressable
              onPress={onCreateAvatar}
              style={({ pressed }) => [styles.createAvatarBtn, pressed && { opacity: 0.92 }]}
            >
              <Ionicons name="sparkles" size={12} color={color.bg} />
              <Text style={styles.createAvatarLabel}>Avatar erstellen</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      {/* Linker Wash */}
      <LinearGradient
        colors={[
          'rgba(10,10,10,1)',
          'rgba(10,10,10,0.92)',
          'rgba(10,10,10,0.55)',
          'rgba(10,10,10,0)',
        ]}
        locations={[0, 0.32, 0.55, 0.85]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Bottom Wash */}
      <LinearGradient
        colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.6)', 'rgba(10,10,10,1)']}
        locations={[0.55, 0.82, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Top Wash */}
      <LinearGradient
        colors={['rgba(10,10,10,0.55)', 'rgba(10,10,10,0)']}
        locations={[0, 1]}
        style={styles.topFade}
        pointerEvents="none"
      />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>

        <View style={styles.statsBlock}>
          {featured.map((s, idx) => (
            <View key={`feat-${idx}`} style={styles.featuredStat}>
              <View style={styles.featuredValueRow}>
                <Text style={styles.featuredValue} numberOfLines={1}>
                  {s.value}
                </Text>
                {s.unit ? (
                  <Text style={styles.featuredUnit} numberOfLines={1}>
                    {s.unit}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.statLabel}>{s.eyebrow}</Text>
            </View>
          ))}

          {secondary.length > 0 ? (
            <View style={styles.secondaryWrap}>
              {secondary.map((s, idx) => (
                <View key={`sec-${idx}`} style={styles.secondaryStat}>
                  <Ionicons
                    name={s.icon}
                    size={15}
                    color="rgba(255,255,255,0.65)"
                    style={styles.secondaryIcon}
                  />
                  <View style={styles.secondaryTextWrap}>
                    <View style={styles.secondaryValueRow}>
                      <Text style={styles.secondaryValue} numberOfLines={1}>
                        {s.value}
                      </Text>
                      {s.unit ? (
                        <Text style={styles.secondaryUnit} numberOfLines={1}>
                          {s.unit}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={styles.statLabel}>{s.eyebrow}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },

  warmHalo: {
    position: 'absolute',
    right: -80,
    top: 60,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: 'rgba(197,165,90,0.10)',
  },

  avatarLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '52%',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },

  avatarFallback: {
    position: 'absolute',
    top: '20%',
    bottom: '20%',
    right: 0,
    width: '52%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[3],
  },
  initialsCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: color.goldA30,
  },
  initialsText: {
    fontFamily: displaySerif as string,
    fontSize: 34,
    fontStyle: 'italic',
    color: color.gold,
  },
  createAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: space[3],
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  createAvatarLabel: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.bg,
    letterSpacing: 0.3,
  },

  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space[5],
    paddingTop: space[5],
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '700',
    color: color.gold,
    letterSpacing: 2.6,
  },

  statsBlock: {
    width: '54%',
    marginTop: space[5],
    gap: space[5],
  },

  featuredStat: {
    gap: 3,
  },
  featuredValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 7,
    flexWrap: 'wrap',
  },
  featuredValue: {
    fontFamily: font.family,
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  featuredUnit: {
    fontFamily: font.family,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 0.2,
  },

  secondaryWrap: {
    gap: space[3],
    marginTop: space[2],
  },
  secondaryStat: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  secondaryIcon: {
    marginTop: 4,
  },
  secondaryTextWrap: {
    flex: 1,
    gap: 1,
  },
  secondaryValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  secondaryValue: {
    fontFamily: font.family,
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  secondaryUnit: {
    fontFamily: font.family,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.62)',
    letterSpacing: 0.2,
  },

  statLabel: {
    fontFamily: font.family,
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
});
