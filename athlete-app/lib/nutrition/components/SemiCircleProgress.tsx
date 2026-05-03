/**
 * SemiCircleProgress — Halbkreis-Kalorien-Anzeige (Tachometer).
 *
 * Bogen geht 1:1 von LEFT (cx-r, cy) → über TOP → RIGHT (cx+r, cy).
 * Container-Höhe = size/2 + strokeWidth, Mittelpunkt cy = size/2 (am unteren
 * Rand → nur die obere Halbkreis-Hälfte ist sichtbar).
 */

import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { color, font } from '@/lib/design/tokens';

const TRACK_BG = 'rgba(255,255,255,0.06)';

type Props = {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
};

export function SemiCircleProgress({ current, goal, size = 200, strokeWidth = 14 }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const percentage = goal > 0 ? Math.min(150, (current / goal) * 100) : 0;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: percentage,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [percentage, animatedValue]);

  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const containerHeight = size / 2 + strokeWidth;

  const isOver = percentage > 100;
  const remaining = Math.max(0, Math.round(goal - current));
  const overshoot = Math.max(0, Math.round(current - goal));

  // Background = voller oberer Halbkreis: M LEFT → A → RIGHT (sweep=1 = clockwise = via TOP)
  const backgroundPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  return (
    <View style={[styles.container, { width: size, height: containerHeight + 36 }]}>
      <Svg width={size} height={containerHeight} style={styles.svg}>
        <Path
          d={backgroundPath}
          stroke={TRACK_BG}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <ProgressArc
          cx={cx}
          cy={cy}
          radius={radius}
          strokeWidth={strokeWidth}
          animatedValue={animatedValue}
          isOver={isOver}
        />
      </Svg>

      <View style={styles.content}>
        <Text style={[styles.value, isOver && styles.valueOver]}>
          {(isOver ? overshoot : remaining).toLocaleString('de-DE')}
        </Text>
        <Text style={styles.label}>{isOver ? 'zu viel' : 'übrig'}</Text>
      </View>
    </View>
  );
}

function ProgressArc({
  cx,
  cy,
  radius,
  strokeWidth,
  animatedValue,
  isOver,
}: {
  cx: number;
  cy: number;
  radius: number;
  strokeWidth: number;
  animatedValue: Animated.Value;
  isOver: boolean;
}) {
  const [pathD, setPathD] = useState('');

  useEffect(() => {
    const id = animatedValue.addListener(({ value }) => {
      const p = Math.max(0, Math.min(value, 100));
      if (p <= 0.5) {
        setPathD('');
        return;
      }
      // Math-Konvention: 0% = LEFT (180°), 50% = TOP (90°), 100% = RIGHT (0°)
      const angleDeg = 180 - p * 1.8;
      const angleRad = (angleDeg * Math.PI) / 180;
      const endX = cx + radius * Math.cos(angleRad);
      const endY = cy - radius * Math.sin(angleRad);
      setPathD(`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`);
    });
    return () => animatedValue.removeListener(id);
  }, [animatedValue, cx, cy, radius]);

  if (!pathD) return null;
  return (
    <Path
      d={pathD}
      stroke={isOver ? color.danger : color.gold}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  content: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  value: {
    fontFamily: font.family,
    fontSize: 38,
    fontWeight: '700',
    color: color.text,
    letterSpacing: -1.2,
  },
  valueOver: {
    color: color.danger,
  },
  label: {
    fontFamily: font.family,
    fontSize: 11,
    fontWeight: '500',
    color: color.textMuted,
    marginTop: 2,
    letterSpacing: 0.4,
  },
});
