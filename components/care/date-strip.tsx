import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const MONTH_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAY_SHORT   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

interface DateStripProps {
  onDateChange?: (date: Date) => void;
}

export function DateStrip({ onDateChange }: DateStripProps) {
  const [selectedOffset, setSelectedOffset] = useState(0);

  function handleSelect(offset: number) {
    setSelectedOffset(offset);
    const d = new Date();
    d.setDate(d.getDate() + offset);
    onDateChange?.(d);
  }

  const offsets = [-2, -1, 0, 1, 2];

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        padding: 6,
      }}>
      {offsets.map(offset => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        const isSelected = offset === selectedOffset;
        const isToday = offset === 0;
        const dayNum = d.getDate();
        const monthStr = MONTH_SHORT[d.getMonth()];
        const dayStr = DAY_SHORT[d.getDay()];

        if (isSelected) {
          // ── Active pill ────────────────────────────────────────
          return (
            <TouchableOpacity
              key={offset}
              onPress={() => handleSelect(offset)}
              style={{
                flex: 2,
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                paddingVertical: 10,
                paddingHorizontal: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.07)',
              }}>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '700',
                  color: '#2C6E49',
                  letterSpacing: 0.6,
                  marginBottom: 1,
                }}>
                {isToday ? 'TODAY' : dayStr}
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: '#0D1117',
                  letterSpacing: -0.5,
                  lineHeight: 26,
                }}>
                {dayNum}
              </Text>
              <Text style={{ fontSize: 9, fontWeight: '600', color: '#6B7280', marginTop: 1 }}>
                {monthStr}
              </Text>
            </TouchableOpacity>
          );
        }

        // ── Inactive date ──────────────────────────────────────────
        return (
          <TouchableOpacity
            key={offset}
            onPress={() => handleSelect(offset)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 9,
                fontWeight: '500',
                color: '#C4C4C6',
                letterSpacing: 0.3,
                marginBottom: 2,
              }}>
              {dayStr}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#9CA3AF',
                lineHeight: 20,
              }}>
              {dayNum}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
