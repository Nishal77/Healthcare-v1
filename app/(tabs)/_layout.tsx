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
      <Tabs.Screen name="track" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="care" />
      <Tabs.Screen name="profile" />
      {/* explore accessible via route but not shown in tab bar */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
