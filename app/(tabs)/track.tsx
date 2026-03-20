import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrackHeader } from '@/components/track/track-header';
import { DateStrip } from '@/components/track/date-strip';
import { SummaryCard } from '@/components/track/daily-summary/summary-card';
import { QuickAddRow } from '@/components/track/quick-add/quick-add-row';
import { TimelineView } from '@/components/track/timeline/timeline-view';

export default function TrackTab() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      {/* Fixed white cover for Dynamic Island */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
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
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>

        <TrackHeader />
        <DateStrip />
        <SummaryCard />
        <QuickAddRow />
        <TimelineView />

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
