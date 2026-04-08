import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthDashboard } from '@/components/home/health-tracking/health-dashboard';
import { HeroSection }     from '@/components/home/hero-section';
import { useSidebar }      from '@/context/sidebar-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { openSidebar } = useSidebar();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      {/* Dynamic Island / status bar cover */}
      <View
        style={{
          position:        'absolute',
          top: 0, left: 0, right: 0,
          height:          insets.top,
          backgroundColor: '#FFFFFF',
          zIndex:          100,
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

        <HeroSection
          userName="Nishal N Poojary"
          onAvatarPress={openSidebar}
        />
        <HealthDashboard />
      </ScrollView>
    </View>
  );
}
