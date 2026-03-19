import { Tabs } from 'expo-router';

import { CustomTabBar } from '@/components/custom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Transparent so the floating bar shows above content
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="appointments" />
      <Tabs.Screen name="records" />
      <Tabs.Screen name="providers" />
      <Tabs.Screen name="account" />
      {/* explore accessible via route but not shown in tab bar */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
