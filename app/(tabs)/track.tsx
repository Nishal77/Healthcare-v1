import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WeekHeader }      from '@/components/track/week-header';
import { StatisticsCard }  from '@/components/track/statistics-card';
import { EatingGuide }     from '@/components/track/eating-guide';
import { LogFab }          from '@/components/track/fab/log-fab';
import { LogEntrySheet }   from '@/components/track/log-entry/log-entry-sheet';

// Tab bar height constant (matches CustomTabBar pill height)
const TAB_BAR_H = 78;

export default function TrackTab() {
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);

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
          paddingTop:    insets.top + 10,
          paddingBottom: insets.bottom + TAB_BAR_H + 80,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>

        <WeekHeader onDateChange={() => {}} />
        <StatisticsCard />
        <EatingGuide />

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Fixed + FAB above the tab bar */}
      <LogFab
        bottomOffset={insets.bottom + TAB_BAR_H}
        onPress={() => setSheetOpen(true)}
      />

      {/* Log entry bottom sheet */}
      <LogEntrySheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </View>
  );
}
