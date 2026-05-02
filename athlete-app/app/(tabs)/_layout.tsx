import { Tabs } from 'expo-router';

import { AthleteTabBar } from '@/lib/design/components/AthleteTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AthleteTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="training" options={{ title: 'Training' }} />
      <Tabs.Screen name="nutrition" options={{ title: 'Ernährung' }} />
      <Tabs.Screen name="index" options={{ title: 'Heute' }} />
      <Tabs.Screen name="coach" options={{ title: 'Coach' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
