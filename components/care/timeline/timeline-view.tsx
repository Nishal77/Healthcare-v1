import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

import {
  PERIOD_CONFIG,
  PERIODS,
  SAMPLE_ENTRIES,
  getEntriesForPeriod,
  type EntryType,
  type Period,
} from '../care-data';
import { EntryCard } from './entry-card';

// ─── Period icons ──────────────────────────────────────────────────────────────
const PERIOD_ICONS: Record<Period, { iconName: string; color: string }> = {
  morning:   { iconName: 'sunny-outline',    color: '#F59E0B' },
  afternoon: { iconName: 'partly-sunny-outline', color: '#EF4444' },
  evening:   { iconName: 'moon-outline',     color: '#7C3AED' },
  night:     { iconName: 'cloudy-night-outline', color: '#1C1C1E' },
};

// ─── Single period section ─────────────────────────────────────────────────────
interface PeriodSectionProps {
  period: Period;
  onAdd?: (type: EntryType, period: Period) => void;
}

function PeriodSection({ period, onAdd }: PeriodSectionProps) {
  const config = PERIOD_CONFIG[period];
  const icon = PERIOD_ICONS[period];
  const entries = getEntriesForPeriod(SAMPLE_ENTRIES, period);

  return (
    <View style={{ marginBottom: 6 }}>
      {/* Period header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* Period icon tile */}
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: '#F3F4F6',
              borderWidth: 0.5,
              borderColor: 'rgba(0,0,0,0.08)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name={icon.iconName as any} size={16} color={icon.color} />
          </View>

          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#0D1117',
                letterSpacing: -0.2,
              }}>
              {config.label}
            </Text>
            <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>
              {config.subLabel}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 11, color: '#C4C4C6', fontWeight: '600' }}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {/* Hairline divider */}
      <View
        style={{
          height: 1,
          backgroundColor: 'rgba(0,0,0,0.05)',
          marginHorizontal: 20,
          marginBottom: 10,
        }}
      />

      {/* Entries */}
      <View style={{ paddingLeft: 20, paddingRight: 16 }}>
        {entries.length > 0 ? (
          entries.map((entry, idx) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isLast={idx === entries.length - 1}
            />
          ))
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 16, opacity: 0.45 }}>
            <Ionicons name="add-circle-outline" size={24} color="#9CA3AF" />
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginTop: 6 }}>
              Nothing logged yet
            </Text>
          </View>
        )}
      </View>

      {/* Dashed add button */}
      <TouchableOpacity
        onPress={() => onAdd?.('meal', period)}
        activeOpacity={0.75}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          marginHorizontal: 20,
          marginTop: 4,
          paddingVertical: 11,
          paddingHorizontal: 14,
          borderRadius: 13,
          borderWidth: 1.2,
          borderStyle: 'dashed',
          borderColor: 'rgba(0,0,0,0.12)',
          backgroundColor: '#FAFAFA',
        }}>
        <Ionicons name="add-outline" size={16} color="#9CA3AF" />
        <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>
          Add to {config.label.toLowerCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Full timeline ─────────────────────────────────────────────────────────────
interface TimelineViewProps {
  onAdd?: (type: EntryType, period: Period) => void;
}

export function TimelineView({ onAdd }: TimelineViewProps) {
  return (
    <View>
      {/* Section title */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 4 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#0D1117',
            letterSpacing: -0.3,
          }}>
          Today's Log
        </Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3, fontWeight: '500' }}>
          12:00 AM → 11:59 PM · tap any entry to edit
        </Text>
      </View>

      {PERIODS.map(period => (
        <PeriodSection key={period} period={period} onAdd={onAdd} />
      ))}
    </View>
  );
}
