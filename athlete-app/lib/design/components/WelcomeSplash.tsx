import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';

import { font } from '@/lib/design/tokens';

type Props = {
  label: string | null;
};

type SplashTheme = {
  eyebrow: string;
  subline: string;
};

const THEMES: Record<string, SplashTheme> = {
  TRAINING: {
    eyebrow: 'TRAINING',
    subline: 'wird vorbereitet',
  },
  ERNÄHRUNG: {
    eyebrow: 'ERNÄHRUNG',
    subline: 'wird vorbereitet',
  },
  HOME: {
    eyebrow: 'HEUTE',
    subline: 'dein Tag wartet',
  },
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ANIMATION_IN_MS = 720;
const HOLD_MS = 1500;
const ANIMATION_OUT_MS = 520;

export const SPLASH_TOTAL_MS = ANIMATION_IN_MS + HOLD_MS + ANIMATION_OUT_MS;

// Brand colors from the official logo
const PAPER = '#EFE6D2';
const PAPER_TOP = '#F4ECDA';
const PAPER_BOTTOM = '#E8DDC4';
const GOLD = '#C5A55A';
const GOLD_DARK = '#A88B3D';
const TEXT_GREY = '#7C7269';

export function WelcomeSplash({ label }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const innerOpacity = useRef(new Animated.Value(0)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const dividerScale = useRef(new Animated.Value(0)).current;

  const runningAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    return () => {
      if (runningAnim.current) runningAnim.current.stop();
    };
  }, []);

  useEffect(() => {
    if (!label) return;

    if (runningAnim.current) {
      runningAnim.current.stop();
      runningAnim.current = null;
    }

    translateY.setValue(SCREEN_HEIGHT);
    innerOpacity.setValue(0);
    subOpacity.setValue(0);
    dividerScale.setValue(0);

    const seq = Animated.sequence([
      // 1. Slide-in with smooth, deliberate easing (long enough to actually feel)
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION_IN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Logo block fades in across most of the slide — no jarring stagger
        Animated.sequence([
          Animated.delay(160),
          Animated.timing(innerOpacity, {
            toValue: 1,
            duration: 540,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
      // 2. After slide settles: divider grows, then subtitle fades
      Animated.parallel([
        Animated.timing(dividerScale, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(140),
          Animated.timing(subOpacity, {
            toValue: 1,
            duration: 420,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]),
      // 3. Hold (minus the time the inner animations already used)
      Animated.delay(Math.max(HOLD_MS - 560, 0)),
      // 4. Slide-out — smooth, slightly faster than entry but still deliberate
      Animated.timing(translateY, {
        toValue: -SCREEN_HEIGHT,
        duration: ANIMATION_OUT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    runningAnim.current = seq;
    seq.start(({ finished }) => {
      if (finished) runningAnim.current = null;
    });
  }, [label, translateY, innerOpacity, subOpacity, dividerScale]);

  if (!label) return null;

  const theme = THEMES[label] ?? THEMES.HOME;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        { transform: [{ translateY }] },
      ]}
    >
      {/* Paper background — cream gradient */}
      <LinearGradient
        colors={[PAPER_TOP, PAPER, PAPER_BOTTOM]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft gold ambient orbs — light brand atmosphere */}
      <View pointerEvents="none" style={[styles.orb, styles.orbTopRight]} />
      <View pointerEvents="none" style={[styles.orb, styles.orbBottomLeft]} />

      <Animated.View style={[styles.content, { opacity: innerOpacity }]}>
        {/* Logo — typographic recreation with brand box frame */}
        <View style={styles.logoFrame}>
          <Text style={styles.logoLine}>
            <Text style={styles.logoFirst}>P</Text>
            <Text style={styles.logoRest}>RIME</Text>
          </Text>
          <Text style={styles.logoLine}>
            <Text style={styles.logoFirst}>A</Text>
            <Text style={styles.logoRest}>THLETE</Text>
          </Text>
          <Text style={styles.logoLine}>
            <Text style={styles.logoFirst}>A</Text>
            <Text style={styles.logoRest}>CADEMY</Text>
          </Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.subBlock, { opacity: subOpacity }]}>
        {/* Animated divider — grows from center */}
        <Animated.View
          style={[
            styles.dividerWrap,
            { transform: [{ scaleX: dividerScale }] },
          ]}
        >
          <LinearGradient
            colors={['rgba(168,139,61,0)', GOLD_DARK, 'rgba(168,139,61,0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.divider}
          />
        </Animated.View>

        <Text style={styles.eyebrow}>{theme.eyebrow}</Text>
        <Text style={styles.subline}>{theme.subline}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PAPER,
  },
  orb: {
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: 'rgba(197, 165, 90, 0.12)',
  },
  orbTopRight: {
    top: -180,
    right: -180,
  },
  orbBottomLeft: {
    bottom: -200,
    left: -200,
    backgroundColor: 'rgba(197, 165, 90, 0.08)',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoFrame: {
    paddingHorizontal: 26,
    paddingVertical: 18,
    borderWidth: 1.6,
    borderColor: GOLD,
    alignItems: 'flex-start',
  },
  logoLine: {
    fontFamily: font.family,
    fontSize: 38,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1.4,
    lineHeight: 42,
  },
  logoFirst: {
    color: GOLD_DARK,
  },
  logoRest: {
    color: TEXT_GREY,
  },
  subBlock: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.18,
    alignItems: 'center',
    width: '100%',
  },
  dividerWrap: {
    width: 96,
    height: 1.4,
    marginBottom: 22,
    overflow: 'hidden',
  },
  divider: {
    flex: 1,
    height: 1.4,
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1A12',
    letterSpacing: 4.6,
    marginBottom: 6,
  },
  subline: {
    fontFamily: font.family,
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_GREY,
    letterSpacing: 1.8,
  },
});
