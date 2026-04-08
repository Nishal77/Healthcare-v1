import { View } from 'react-native';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WeekHeader }    from '@/components/track/week-header';
import { StatisticsCard } from '@/components/track/statistics-card';
import { EatingGuide }   from '@/components/track/eating-guide';

export default function TrackTab() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      {/* Dynamic Island / status bar cover */}
      <View
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: insets.top,
          backgroundColor: '#FFFFFF',
          zIndex: 100,
        }}
        pointerEvents="none"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 130,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>

        <WeekHeader onDateChange={() => {}} />
        <StatisticsCard />
        <EatingGuide />

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
