import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';

import { color } from '@/lib/design/tokens';

type Props = {
  focused?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
};

const SIZE = 72;
const INNER_SIZE = 64;
const WRAPPER = SIZE + 16;

export function CenterButton({ focused = false, onPress }: Props) {
  const press = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.timing(press, {
      toValue: 0.88,
      duration: 90,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(press, {
      toValue: 1,
      tension: 220,
      friction: 9,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.wrapper, { width: WRAPPER, height: WRAPPER }]}>
      {/* Crisp Gold Ring (always visible, brand anchor) */}
      <View
        pointerEvents="none"
        style={[
          styles.absoluteCenter,
          {
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            borderWidth: 1.5,
            borderColor: color.gold,
            shadowColor: color.gold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.45,
            shadowRadius: 8,
          },
        ]}
      />

      {/* Pearl-Black Inner with Gradient + Gloss + Icon */}
      <Animated.View
        style={[
          styles.absoluteCenter,
          { transform: [{ scale: press }] },
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.innerWrap,
            {
              width: INNER_SIZE,
              height: INNER_SIZE,
              borderRadius: INNER_SIZE / 2,
            },
          ]}
        >
          <LinearGradient
            colors={['#1F1F1F', '#0E0E0E', '#050505']}
            locations={[0, 0.55, 1]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={[
              styles.innerFill,
              {
                width: INNER_SIZE,
                height: INNER_SIZE,
                borderRadius: INNER_SIZE / 2,
              },
            ]}
          >
            {/* Inner warm glow (top-left, simulates light source) */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: -INNER_SIZE * 0.25,
                left: -INNER_SIZE * 0.25,
                width: INNER_SIZE * 0.9,
                height: INNER_SIZE * 0.9,
                borderRadius: INNER_SIZE / 2,
                backgroundColor: color.goldA20,
                opacity: 0.45,
              }}
            />

            {/* Top gloss — pearl satin highlight */}
            <LinearGradient
              colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0)']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '55%',
                borderTopLeftRadius: INNER_SIZE / 2,
                borderTopRightRadius: INNER_SIZE / 2,
              }}
            />

            <Ionicons
              name="home"
              size={26}
              color={color.gold}
              style={styles.icon}
            />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -34,
  },
  absoluteCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
  },
  innerFill: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    zIndex: 2,
  },
});
