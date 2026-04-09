import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WeekHeader }    from '@/components/track/week-header';
import { StatisticsCard } from '@/components/track/statistics-card';
import { EatingGuide }   from '@/components/track/eating-guide';
import { LogFab }        from '@/components/track/fab/log-fab';
import { LogEntrySheet } from '@/components/track/log-entry/log-entry-sheet';
import { useFoodLog, toDateStr } from '@/hooks/useFoodLog';
import type { CreateFoodLogPayload } from '@/src/api/endpoints/food-log';

// Tab bar height constant (matches CustomTabBar pill height)
const TAB_BAR_H = 78;

export default function TrackTab() {
  const insets = useSafeAreaInsets();
  const [sheetOpen, setSheetOpen] = useState(false);

  // ── Date selection (WeekHeader drives this) ──────────────────────────────
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = toDateStr(selectedDate);

  // ── Live food log data ────────────────────────────────────────────────────
  const { entries, summary, weekData, loading, addEntry } = useFoodLog(dateStr);

  // ── Handle "Log it" from the sheet — fire each payload sequentially ───────
  const handleLog = useCallback(async (payloads: CreateFoodLogPayload[]) => {
    for (const payload of payloads) {
      await addEntry(payload);
    }
  }, [addEntry]);

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
          paddingBottom: insets.bottom + TAB_BAR_H + 16,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>

        <WeekHeader onDateChange={setSelectedDate} />

        {/* Subtle loading indicator while fetching */}
        {loading && (
          <View style={{ paddingVertical: 10, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#2C6E49" />
          </View>
        )}

        <StatisticsCard summary={summary} weekData={weekData} />

        <EatingGuide
          entries={entries}
          summary={summary}
          date={selectedDate}
        />

      </ScrollView>

      {/* Fixed FAB above the tab bar */}
      <LogFab
        bottomOffset={insets.bottom + TAB_BAR_H}
        onPress={() => setSheetOpen(true)}
      />

      {/* Log entry bottom sheet */}
      <LogEntrySheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onLog={handleLog}
      />
    </View>
  );
}
