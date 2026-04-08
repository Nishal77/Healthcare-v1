import { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABELS = ['M','T','W','T','F','S','S'];

function isoWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

function getMondayOf(d: Date): Date {
  const copy = new Date(d);
  const dow = copy.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onDateChange?: (date: Date) => void;
}

export function WeekHeader({ onDateChange }: Props) {
  const today = new Date();
  const [weekStart, setWeekStart] = useState<Date>(getMondayOf(today));
  const [selected, setSelected]   = useState<Date>(today);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const weekEnd = days[6];
  const weekNum = isoWeekNumber(weekStart);

  // "Apr 6 – 12" or "Mar 30 – Apr 5" for cross-month weeks
  const startStr =
    weekStart.getMonth() !== weekEnd.getMonth()
      ? `${MONTH[weekStart.getMonth()]} ${weekStart.getDate()}`
      : `${MONTH[weekStart.getMonth()]} ${weekStart.getDate()}`;
  const endStr =
    weekStart.getMonth() !== weekEnd.getMonth()
      ? `${MONTH[weekEnd.getMonth()]} ${weekEnd.getDate()}`
      : String(weekEnd.getDate());
  const rangeLabel = `${startStr}–${endStr}`;

  function selectDay(d: Date) {
    setSelected(d);
    onDateChange?.(d);
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20 }}>

      {/* ── Top row: back arrow · week label · clipboard ──────────────── */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>

        {/* Back / prev-week */}
        <TouchableOpacity
          onPress={() => setWeekStart(prev => {
            const d = new Date(prev); d.setDate(d.getDate() - 7); return d;
          })}
          activeOpacity={0.6}
          style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={22} color="#1C1C1E" />
        </TouchableOpacity>

        {/* Center: week number + range */}
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: 17,
            fontWeight: '700',
            color: '#0D1117',
            letterSpacing: -0.3,
          }}>
            Week {weekNum}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
            <Text style={{ fontSize: 12, fontWeight: '400', color: '#6B7280' }}>
              {rangeLabel}
            </Text>
            <Ionicons name="chevron-down" size={11} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Clipboard icon — top right */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            backgroundColor: '#F0F0F5',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="clipboard-outline" size={18} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* ── Day grid ──────────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {days.map((d, i) => {
          const isToday    = sameDay(d, today);
          const isSelected = sameDay(d, selected);
          const isFuture   = d > today && !isToday;

          const circleBg =
            isToday    ? '#0D1117' :
            isSelected ? '#2C6E49' :
            'transparent';

          const numColor =
            isToday || isSelected ? '#FFFFFF' :
            isFuture              ? '#C0C4CE' :
                                    '#1C1C1E';

          const dayLabelColor =
            isToday || isSelected ? '#2C6E49' : '#9CA3AF';

          return (
            <Pressable
              key={i}
              onPress={() => selectDay(d)}
              style={{ alignItems: 'center', gap: 5, flex: 1 }}>

              {/* Day letter */}
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: dayLabelColor,
                letterSpacing: 0.3,
              }}>
                {DAY_LABELS[i]}
              </Text>

              {/* Date circle */}
              <View style={{
                width: 36, height: 36,
                borderRadius: 18,
                backgroundColor: circleBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{
                  fontSize: 15,
                  fontWeight: isToday || isSelected ? '700' : '500',
                  color: numColor,
                  fontVariant: ['tabular-nums'],
                }}>
                  {d.getDate()}
                </Text>
              </View>

              {/* Dot indicator below today */}
              <View style={{ height: 4, alignItems: 'center', justifyContent: 'center' }}>
                {isToday && (
                  <View style={{
                    width: 4, height: 4, borderRadius: 2,
                    backgroundColor: '#0D1117',
                  }} />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
