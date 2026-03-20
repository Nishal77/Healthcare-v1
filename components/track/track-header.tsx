import { useEffect, useState, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

export function TrackHeader() {
  const [now, setNow] = useState(new Date());
  const dotOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, { toValue: 0.15, duration: 800, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [dotOpacity]);

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

        {/* ── Right: premium live clock (no bg, one line) ── */}
        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
          
          {/* Live indicator with blink */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C6E49', opacity: dotOpacity }} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#2C6E49', letterSpacing: 1.2 }}>
              LIVE
            </Text>
          </View>

          {/* Time on one line — all black "wow" premium normal weight */}
          <Text
            style={{
              fontSize: 26,
              fontWeight: '500',
              color: '#111827',
              letterSpacing: -0.6,
              fontVariant: ['tabular-nums'],
            }}>
            {clock}
            <Text style={{ fontWeight: '400' }}>:{seconds}</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', letterSpacing: 0.2 }}> {ampm}</Text>
          </Text>
        </View>

      </View>
    </View>
  );
}
