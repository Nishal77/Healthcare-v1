import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { WeekHeader } from '@/components/track/week-header';
import { StatisticsCard } from '@/components/track/statistics-card';
import { EatingGuide } from '@/components/track/eating-guide';
import { SummaryCard } from '@/components/track/daily-summary/summary-card';
import { QuickAddRow } from '@/components/track/quick-add/quick-add-row';
import { TimelineView } from '@/components/track/timeline/timeline-view';
import { AddEntrySheet } from '@/components/track/add-entry/add-entry-sheet';
import { type EntryType } from '@/components/track/track-data';

export default function TrackTab() {
  const insets = useSafeAreaInsets();

  // ── Sheet state ────────────────────────────────────────────────────────────
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetType, setSheetType] = useState<EntryType>('meal');

  function openSheet(type: EntryType = 'meal') {
    setSheetType(type);
    setSheetVisible(true);
  }

  function handleSave(entry: {
    type: EntryType;
    subType?: string;
    description: string;
    value: string;
    mood?: string;
  }) {
    // TODO: persist to state / backend
    console.log('New entry logged:', entry);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      {/* ── Dynamic Island cover ── */}
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
        <SummaryCard />

        {/* Quick add row — each pill opens the sheet with that type pre-selected */}
        <QuickAddRow onAdd={openSheet} />

        {/* Timeline — dashed "Add to …" buttons also open the sheet */}
        <TimelineView onAdd={(type) => openSheet(type)} />

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── FAB — always visible above tab bar ── */}
      <TouchableOpacity
        onPress={() => openSheet('meal')}
        activeOpacity={0.9}
        style={{
          position: 'absolute',
          bottom: insets.bottom + 100,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#0D1117',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#0D1117',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.28,
          shadowRadius: 14,
          elevation: 10,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        }}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* ── Add entry bottom sheet ── */}
      <AddEntrySheet
        visible={sheetVisible}
        initialType={sheetType}
        onClose={() => setSheetVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
}
