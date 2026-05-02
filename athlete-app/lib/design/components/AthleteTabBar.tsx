import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';

import { CenterButton } from './CenterButton';
import { color, font } from '@/lib/design/tokens';
import {
  useAthleteNav,
  type NutritionSubTab,
  type TrainingSubTab,
} from '@/lib/nav/AthleteNavContext';

// ─────────────────────────────────────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────────────────────────────────────

type IconPair = { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap };

const MAIN_ICON_FOR: Record<string, IconPair> = {
  training:  { active: 'barbell',    inactive: 'barbell-outline' },
  nutrition: { active: 'restaurant', inactive: 'restaurant-outline' },
  coach:     { active: 'chatbubble', inactive: 'chatbubble-outline' },
  profile:   { active: 'person',     inactive: 'person-outline' },
};

const MAIN_LABEL_FOR: Record<string, string> = {
  training: 'Training',
  nutrition: 'Ernährung',
  coach: 'Coach',
  profile: 'Profil',
};

const TRAINING_SUB_ICON: Record<TrainingSubTab, IconPair> = {
  heute:       { active: 'flash',        inactive: 'flash-outline' },
  woche:       { active: 'calendar',     inactive: 'calendar-outline' },
  historie:    { active: 'time',         inactive: 'time-outline' },
  fortschritt: { active: 'trending-up',  inactive: 'trending-up-outline' },
};

const TRAINING_SUB_LABEL: Record<TrainingSubTab, string> = {
  heute: 'Heute',
  woche: 'Woche',
  historie: 'Historie',
  fortschritt: 'Fortschritt',
};

const TRAINING_SUB_ORDER: TrainingSubTab[] = ['heute', 'woche', 'historie', 'fortschritt'];

const NUTRITION_SUB_ICON: Record<NutritionSubTab, IconPair> = {
  heute:    { active: 'flash',    inactive: 'flash-outline' },
  plan:     { active: 'list',     inactive: 'list-outline' },
  matchday: { active: 'trophy',   inactive: 'trophy-outline' },
  historie: { active: 'time',     inactive: 'time-outline' },
};

const NUTRITION_SUB_LABEL: Record<NutritionSubTab, string> = {
  heute: 'Heute',
  plan: 'Plan',
  matchday: 'Matchday',
  historie: 'Historie',
};

const NUTRITION_SUB_ORDER: NutritionSubTab[] = ['heute', 'plan', 'matchday', 'historie'];

// ─────────────────────────────────────────────────────────────────────────────
// Bar geometry
// ─────────────────────────────────────────────────────────────────────────────

const SIDE_MARGIN = 14;
const BOTTOM_GAP = 8;
const BAR_HEIGHT = 82;
const CORNER_RADIUS = 38;
const NOTCH_OUTER = 60;
const NOTCH_DEPTH = 28;
const NOTCH_INNER = 36;

function buildBarPath(width: number) {
  const cx = width / 2;
  return `
    M ${CORNER_RADIUS} 0
    L ${cx - NOTCH_OUTER} 0
    C ${cx - NOTCH_OUTER * 0.5} 0, ${cx - NOTCH_INNER} ${NOTCH_DEPTH}, ${cx} ${NOTCH_DEPTH}
    C ${cx + NOTCH_INNER} ${NOTCH_DEPTH}, ${cx + NOTCH_OUTER * 0.5} 0, ${cx + NOTCH_OUTER} 0
    L ${width - CORNER_RADIUS} 0
    Q ${width} 0, ${width} ${CORNER_RADIUS}
    L ${width} ${BAR_HEIGHT - CORNER_RADIUS}
    Q ${width} ${BAR_HEIGHT}, ${width - CORNER_RADIUS} ${BAR_HEIGHT}
    L ${CORNER_RADIUS} ${BAR_HEIGHT}
    Q 0 ${BAR_HEIGHT}, 0 ${BAR_HEIGHT - CORNER_RADIUS}
    L 0 ${CORNER_RADIUS}
    Q 0 0, ${CORNER_RADIUS} 0
    Z
  `;
}

function buildTopEdgePath(width: number) {
  const cx = width / 2;
  return `
    M 0 ${CORNER_RADIUS}
    Q 0 0, ${CORNER_RADIUS} 0
    L ${cx - NOTCH_OUTER} 0
    C ${cx - NOTCH_OUTER * 0.5} 0, ${cx - NOTCH_INNER} ${NOTCH_DEPTH}, ${cx} ${NOTCH_DEPTH}
    C ${cx + NOTCH_INNER} ${NOTCH_DEPTH}, ${cx + NOTCH_OUTER * 0.5} 0, ${cx + NOTCH_OUTER} 0
    L ${width - CORNER_RADIUS} 0
    Q ${width} 0, ${width} ${CORNER_RADIUS}
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Bar
// ─────────────────────────────────────────────────────────────────────────────

export function AthleteTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const nav = useAthleteNav();

  const barWidth = screenWidth - SIDE_MARGIN * 2;
  const barPath = buildBarPath(barWidth);
  const topEdge = buildTopEdgePath(barWidth);
  const bottomOffset = Math.max(insets.bottom, 12) + BOTTOM_GAP;

  const handleMainTabPress = (routeName: string, routeKey: string) => {
    const isFocused = state.routes[state.index]?.name === routeName;

    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (event.defaultPrevented) return;

    if (routeName === 'training') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      nav.enterTrainingSub();
      navigation.navigate(routeName as never);
      return;
    }
    if (routeName === 'nutrition') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      nav.enterNutritionSub();
      navigation.navigate(routeName as never);
      return;
    }
    if (!isFocused) {
      Haptics.impactAsync(
        routeName === 'index'
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );
      navigation.navigate(routeName as never);
    }
  };

  const handleCenterFromSub = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nav.exitToMain();
    navigation.navigate('index' as never);
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.outer, { bottom: bottomOffset, left: SIDE_MARGIN, right: SIDE_MARGIN }]}
    >
      <View style={styles.shadowWrap}>
        <Svg width={barWidth} height={BAR_HEIGHT} style={styles.svgLayer} pointerEvents="none">
          <Defs>
            <SvgLinearGradient id="glassFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#3D3527" stopOpacity="0.65" />
              <Stop offset="0.15" stopColor="#22201A" stopOpacity="0.78" />
              <Stop offset="0.55" stopColor="#0F0E0A" stopOpacity="0.92" />
              <Stop offset="1" stopColor="#070605" stopOpacity="0.96" />
            </SvgLinearGradient>
            <SvgLinearGradient id="topGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.20" />
              <Stop offset="0.18" stopColor="#FFFFFF" stopOpacity="0.05" />
              <Stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0" />
            </SvgLinearGradient>
            <SvgLinearGradient id="hairline" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.10" />
              <Stop offset="0.35" stopColor="#C5A55A" stopOpacity="0.45" />
              <Stop offset="0.5" stopColor="#D4B96E" stopOpacity="0.65" />
              <Stop offset="0.65" stopColor="#C5A55A" stopOpacity="0.45" />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.10" />
            </SvgLinearGradient>
          </Defs>

          <Path d={barPath} fill="url(#glassFill)" />
          <Path d={barPath} fill="url(#topGlow)" />
          <Path d={topEdge} stroke="url(#hairline)" strokeWidth={1.2} fill="none" />
          <Path d={barPath} stroke="rgba(197,165,90,0.18)" strokeWidth={0.6} fill="none" />
        </Svg>

        <View style={[styles.row, { width: barWidth, height: BAR_HEIGHT }]}>
          {nav.mode === 'main' ? (
            <MainRow state={state} onTabPress={handleMainTabPress} />
          ) : nav.mode === 'training-sub' ? (
            <TrainingSubRow
              activeSub={nav.trainingSubTab}
              onSubPress={nav.setTrainingSub}
              onCenterPress={handleCenterFromSub}
            />
          ) : (
            <NutritionSubRow
              activeSub={nav.nutritionSubTab}
              onSubPress={nav.setNutritionSub}
              onCenterPress={handleCenterFromSub}
            />
          )}
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main mode row
// ─────────────────────────────────────────────────────────────────────────────

function MainRow({
  state,
  onTabPress,
}: {
  state: BottomTabBarProps['state'];
  onTabPress: (routeName: string, routeKey: string) => void;
}) {
  return (
    <>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isCenter = route.name === 'index';

        if (isCenter) {
          return (
            <View key={route.key} style={styles.centerSlot}>
              <CenterButton
                focused={isFocused}
                onPress={() => onTabPress(route.name, route.key)}
              />
            </View>
          );
        }

        const icons = MAIN_ICON_FOR[route.name];
        const label = MAIN_LABEL_FOR[route.name] ?? route.name;
        if (!icons) return null;

        return (
          <TabItem
            key={route.key}
            focused={isFocused}
            icon={isFocused ? icons.active : icons.inactive}
            label={label}
            onPress={() => onTabPress(route.name, route.key)}
          />
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Training sub-mode row
// ─────────────────────────────────────────────────────────────────────────────

function TrainingSubRow({
  activeSub,
  onSubPress,
  onCenterPress,
}: {
  activeSub: TrainingSubTab;
  onSubPress: (tab: TrainingSubTab) => void;
  onCenterPress: () => void;
}) {
  const left = TRAINING_SUB_ORDER.slice(0, 2);
  const right = TRAINING_SUB_ORDER.slice(2);

  return (
    <>
      {left.map((tab) => {
        const focused = activeSub === tab;
        const icons = TRAINING_SUB_ICON[tab];
        return (
          <TabItem
            key={tab}
            focused={focused}
            icon={focused ? icons.active : icons.inactive}
            label={TRAINING_SUB_LABEL[tab]}
            onPress={() => {
              if (!focused) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSubPress(tab);
            }}
          />
        );
      })}

      <View style={styles.centerSlot}>
        <CenterButton focused={false} onPress={onCenterPress} />
      </View>

      {right.map((tab) => {
        const focused = activeSub === tab;
        const icons = TRAINING_SUB_ICON[tab];
        return (
          <TabItem
            key={tab}
            focused={focused}
            icon={focused ? icons.active : icons.inactive}
            label={TRAINING_SUB_LABEL[tab]}
            onPress={() => {
              if (!focused) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSubPress(tab);
            }}
          />
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nutrition sub-mode row
// ─────────────────────────────────────────────────────────────────────────────

function NutritionSubRow({
  activeSub,
  onSubPress,
  onCenterPress,
}: {
  activeSub: NutritionSubTab;
  onSubPress: (tab: NutritionSubTab) => void;
  onCenterPress: () => void;
}) {
  const left = NUTRITION_SUB_ORDER.slice(0, 2);
  const right = NUTRITION_SUB_ORDER.slice(2);

  return (
    <>
      {left.map((tab) => {
        const focused = activeSub === tab;
        const icons = NUTRITION_SUB_ICON[tab];
        return (
          <TabItem
            key={tab}
            focused={focused}
            icon={focused ? icons.active : icons.inactive}
            label={NUTRITION_SUB_LABEL[tab]}
            onPress={() => {
              if (!focused) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSubPress(tab);
            }}
          />
        );
      })}

      <View style={styles.centerSlot}>
        <CenterButton focused={false} onPress={onCenterPress} />
      </View>

      {right.map((tab) => {
        const focused = activeSub === tab;
        const icons = NUTRITION_SUB_ICON[tab];
        return (
          <TabItem
            key={tab}
            focused={focused}
            icon={focused ? icons.active : icons.inactive}
            label={NUTRITION_SUB_LABEL[tab]}
            onPress={() => {
              if (!focused) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSubPress(tab);
            }}
          />
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab item
// ─────────────────────────────────────────────────────────────────────────────

function TabItem({
  focused,
  icon,
  label,
  onPress,
}: {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const press = useRef(new Animated.Value(1)).current;
  const focusOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const iconScale = useRef(new Animated.Value(focused ? 1.08 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(focusOpacity, {
        toValue: focused ? 1 : 0,
        tension: 220,
        friction: 16,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: focused ? 1.08 : 1,
        tension: 240,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, focusOpacity, iconScale]);

  const handlePressIn = () => {
    Animated.timing(press, {
      toValue: 0.88,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(press, {
      toValue: 1,
      tension: 240,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tab}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale: press }] }]}>
        <View style={styles.iconWrap}>
          <Animated.View pointerEvents="none" style={[styles.activePill, { opacity: focusOpacity }]} />
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <Ionicons name={icon} size={22} color={focused ? color.gold : color.textMuted} />
          </Animated.View>
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            {
              color: focused ? color.gold : color.textMuted,
              fontWeight: focused ? '600' : '500',
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    alignItems: 'center',
  },
  shadowWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 18,
  },
  svgLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(197,165,90,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(197,165,90,0.32)',
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.4,
    textAlign: 'center',
    fontFamily: font.family,
    includeFontPadding: false,
  },
  centerSlot: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
