import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';
import { queryClient } from '@/lib/data/queryClient';
import { useMyAthleteProfile } from '@/lib/data/profile';
import { WelcomeSplash } from '@/lib/design/components/WelcomeSplash';
import { color } from '@/lib/design/tokens';
import { AthleteNavProvider, useAthleteNav } from '@/lib/nav/AthleteNavContext';
import { SessionProvider } from '@/lib/session/SessionContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  anchor: '(tabs)',
};

const PaaDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: color.gold,
    background: color.bg,
    card: color.surface,
    text: color.text,
    border: 'rgba(197, 165, 90, 0.10)',
    notification: color.gold,
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    Inter: Inter_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: color.bg }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.bg }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SessionProvider>
              <AthleteNavProvider>
                <ThemeProvider value={PaaDarkTheme}>
                  <RootNav />
                  <StatusBar style="light" />
                </ThemeProvider>
              </AthleteNavProvider>
            </SessionProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const athleteQuery = useMyAthleteProfile(session?.user.id);
  const athlete = athleteQuery.data;

  useEffect(() => {
    if (loading) return;
    const isOnLogin = segments[0] === 'login';
    const isOnOnboarding = segments[0] === 'onboarding';

    if (!session) {
      if (!isOnLogin) router.replace('/login');
      return;
    }

    if (isOnLogin) {
      router.replace('/');
      return;
    }

    // Avatar-Onboarding: nur athletes ohne Avatar werden geführt
    if (athlete && !athlete.avatar_data_uri && !isOnOnboarding) {
      router.replace('/onboarding/avatar');
    }
  }, [session, loading, segments, router, athlete]);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: color.bg }} />;
  }

  return (
    <>
      <Stack screenOptions={{ contentStyle: { backgroundColor: color.bg } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen
          name="session/[workoutId]"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
            animation: 'slide_from_bottom',
            contentStyle: { backgroundColor: color.bg },
          }}
        />
        <Stack.Screen
          name="plan/[workoutId]"
          options={{
            presentation: 'card',
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: color.bg },
          }}
        />
        <Stack.Screen
          name="onboarding/avatar"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: color.bg },
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="nutrition/meal/[slotKey]"
          options={{
            presentation: 'card',
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: color.bg },
          }}
        />
        <Stack.Screen
          name="nutrition/scan"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
            contentStyle: { backgroundColor: color.bg },
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
            headerStyle: { backgroundColor: color.surface },
            headerTintColor: color.text,
          }}
        />
      </Stack>
      <SplashOverlay />
    </>
  );
}

function SplashOverlay() {
  const { splashLabel } = useAthleteNav();
  return <WelcomeSplash label={splashLabel} />;
}
