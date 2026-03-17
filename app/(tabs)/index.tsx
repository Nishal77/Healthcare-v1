import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthDashboard } from '@/components/home/health-tracking/health-dashboard';
import { HeroSection } from '@/components/home/hero-section';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">

      <HeroSection userName="Nishal N Poojary" />
      <HealthDashboard />

    </ScrollView>
  );
}
