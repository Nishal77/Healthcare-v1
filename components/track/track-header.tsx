import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export function TrackHeader() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Split time into parts for styled rendering
  const hhmm = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hhmm.slice(-2); // "AM" or "PM"
  const clock = hhmm.slice(0, -3); // "08:07" without AM/PM

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* ── Left: title ── */}
        <View>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: '#0D1117',
              letterSpacing: -0.8,
              lineHeight: 36,
            }}>
            Track
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#9CA3AF',
              fontWeight: '500',
              marginTop: 3,
              letterSpacing: 0.1,
            }}>
            Daily Health Journal
          </Text>
        </View>

        {/* ── Right: premium live clock badge ── */}
        <View
          style={{
            backgroundColor: '#0D1117',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            alignItems: 'flex-end',
            shadowColor: '#0D1117',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.22,
            shadowRadius: 12,
            elevation: 8,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.07)',
          }}>

          {/* Live indicator */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C6E49' }} />
            <Text style={{ fontSize: 9, fontWeight: '700', color: '#4ADE80', letterSpacing: 1 }}>
              LIVE
            </Text>
          </View>

          {/* HH:MM large */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: -0.5,
                lineHeight: 30,
                fontVariant: ['tabular-nums'],
              }}>
              {clock}
            </Text>

            {/* Seconds + AM/PM stacked small */}
            <View style={{ alignItems: 'flex-start', paddingBottom: 2 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.5)',
                  fontVariant: ['tabular-nums'],
                  lineHeight: 13,
                }}>
                :{seconds}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 13,
                }}>
                {ampm}
              </Text>
            </View>
          </View>
        </View>

      </View>
    </View>
  );
}
