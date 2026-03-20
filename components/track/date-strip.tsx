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
        marginBottom: 22,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F5',
        borderRadius: 999,      // full pill container — exact match to reference
        padding: 5,
      }}>
      {offsets.map(offset => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        const isSelected = offset === selectedOffset;
        const isToday    = offset === 0;
        const dayNum     = d.getDate();
        const monthStr   = MONTH_SHORT[d.getMonth()];
        const dayStr     = DAY_SHORT[d.getDay()];

        // ── Active pill ─────────────────────────────────────────────────────
        if (isSelected) {
          const label = isToday
            ? `Today, ${dayNum} ${monthStr}`
            : `${dayStr}, ${dayNum} ${monthStr}`;

          return (
            <TouchableOpacity
              key={offset}
              onPress={() => handleSelect(offset)}
              activeOpacity={0.85}
              style={{
                flex: 2,                    // wider than plain numbers
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 999,          // pill shape — matches reference
                paddingVertical: 10,
                paddingHorizontal: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#0D1117',
                  letterSpacing: -0.1,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        }

        // ── Inactive date — plain number only, no day name ──────────────────
        return (
          <TouchableOpacity
            key={offset}
            onPress={() => handleSelect(offset)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                color: '#9CA3AF',
              }}>
              {dayNum}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
