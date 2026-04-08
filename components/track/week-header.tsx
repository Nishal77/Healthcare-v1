import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, TouchableOpacity, View } from 'react-native';
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
  const dow = copy.getDay();                 // 0 = Sun
  const diff = dow === 0 ? -6 : 1 - dow;    // shift to Monday
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  /** Called when the user taps a day cell */
  onDateChange?: (date: Date) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WeekHeader({ onDateChange }: Props) {
  const today = new Date();
  const [weekStart, setWeekStart] = useState<Date>(getMondayOf(today));
  const [selected, setSelected] = useState<Date>(today);

  // Blinking live-dot animation
  const dotOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, { toValue: 0.15, duration: 900, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [dotOpacity]);

  // Build 7-day array for the current week view
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const weekEnd = days[6];
  const weekNum = isoWeekNumber(weekStart);

  // Week range label — "Apr 7 – 13" or "Mar 30 – Apr 5" (cross-month)
  const startLabel =
    weekStart.getMonth() !== weekEnd.getMonth()
      ? `${MONTH[weekStart.getMonth()]} ${weekStart.getDate()}`
      : `${MONTH[weekStart.getMonth()]} ${weekStart.getDate()}`;
  const endLabel =
    weekStart.getMonth() !== weekEnd.getMonth()
      ? `${MONTH[weekEnd.getMonth()]} ${weekEnd.getDate()}`
      : `${weekEnd.getDate()}`;
  const rangeLabel = `${startLabel} – ${endLabel}`;

  function selectDay(d: Date) {
    setSelected(d);
    onDateChange?.(d);
  }

  function prevWeek() {
    setWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }

  function nextWeek() {
    setWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 18 }}>

      {/* ── Row 1: Title + clipboard icon ─────────────────────────────────── */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>

        {/* Left: title block */}
        <View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#0D1117', letterSpacing: -0.6, lineHeight: 33 }}>
            Log
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#9CA3AF', letterSpacing: 0.1 }}>
              Daily Health Journal
            </Text>
          </View>
        </View>

        {/* Right: LIVE dot + clipboard button */}
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          {/* LIVE pill */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5,
            backgroundColor: '#F0FBF5', borderRadius: 20,
            paddingHorizontal: 10, paddingVertical: 5 }}>
            <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C6E49', opacity: dotOpacity }} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#2C6E49', letterSpacing: 1 }}>LIVE</Text>
          </View>

          {/* Clipboard icon */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 38, height: 38, borderRadius: 12,
              backgroundColor: '#F4F4F6',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <Ionicons name="clipboard-outline" size={18} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Week card ─────────────────────────────────────────────────────── */}
      <View style={{
        backgroundColor: '#F7F8FA',
        borderRadius: 20,
        paddingTop: 14,
        paddingBottom: 16,
        paddingHorizontal: 14,
      }}>

        {/* Week label row — nav arrows + week number + range */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>

          {/* Prev arrow */}
          <TouchableOpacity onPress={prevWeek} activeOpacity={0.7}
            style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: '#EBEBEF',
              alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="chevron-back" size={16} color="#374151" />
          </TouchableOpacity>

          {/* Week label — center */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0D1117', letterSpacing: -0.2 }}>
              Week {weekNum}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '400', color: '#6B7280' }}>
                {rangeLabel}
              </Text>
              <Ionicons name="chevron-down" size={11} color="#9CA3AF" />
            </View>
          </View>

          {/* Next arrow */}
          <TouchableOpacity onPress={nextWeek} activeOpacity={0.7}
            style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: '#EBEBEF',
              alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="chevron-forward" size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* ── Day grid ───────────────────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {days.map((d, i) => {
            const isToday    = sameDay(d, today);
            const isSelected = sameDay(d, selected);
            const isPast     = d < today && !isToday;
            const isFuture   = d > today && !isToday;

            // Visual states
            const circleBg = isToday
              ? '#0D1117'
              : isSelected
              ? '#2C6E49'
              : 'transparent';

            const numColor = isToday || isSelected
              ? '#FFFFFF'
              : isPast
              ? '#374151'
              : '#C0C4CE';

            const dayLabelColor = isToday
              ? '#2C6E49'
              : isSelected
              ? '#2C6E49'
              : '#9CA3AF';

            return (
              <Pressable
                key={i}
                onPress={() => selectDay(d)}
                style={{ alignItems: 'center', gap: 4, flex: 1 }}>

                {/* Day letter */}
                <Text style={{ fontSize: 11, fontWeight: '600', color: dayLabelColor, letterSpacing: 0.2 }}>
                  {DAY_LABELS[i]}
                </Text>

                {/* Date circle */}
                <View style={{
                  width: 34, height: 34, borderRadius: 17,
                  backgroundColor: circleBg,
                  alignItems: 'center', justifyContent: 'center',
                  // Subtle ring on selected-but-not-today
                  borderWidth: isSelected && !isToday ? 1.5 : 0,
                  borderColor: '#2C6E49',
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: isToday || isSelected ? '700' : '500',
                    color: numColor,
                    fontVariant: ['tabular-nums'],
                  }}>
                    {d.getDate()}
                  </Text>
                </View>

                {/* Dot indicator — shown on today (always) and selected day */}
                <View style={{ height: 5, alignItems: 'center', justifyContent: 'center' }}>
                  {(isToday || isSelected) && (
                    <View style={{
                      width: 4, height: 4, borderRadius: 2,
                      backgroundColor: isToday ? '#0D1117' : '#2C6E49',
                    }} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
