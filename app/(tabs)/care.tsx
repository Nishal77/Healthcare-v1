import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CareHeader } from '@/components/care/care-header';
import { DateStrip } from '@/components/care/date-strip';
import { SummaryCard } from '@/components/care/daily-summary/summary-card';
import { QuickAddRow } from '@/components/care/quick-add/quick-add-row';
import { TimelineView } from '@/components/care/timeline/timeline-view';

export default function CareTab() {
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

        <CareHeader />
        <DateStrip />
        <SummaryCard />
        <QuickAddRow />
        <TimelineView />

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
