import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthDashboard } from '@/components/home/health-tracking/health-dashboard';
import { HeroSection } from '@/components/home/hero-section';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F5EC' }}>

      {/* Fixed white cover behind the Dynamic Island / status bar */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: '#F9F5EC',
          zIndex: 100,
        }}
        pointerEvents="none"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ top: insets.top }}
        keyboardShouldPersistTaps="handled"
        bounces={false}>

        <HeroSection userName="Nishal N Poojary" />
        <HealthDashboard />
      </ScrollView>
    </View>
  );
}
