import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

// Pure RN ECG waveform — each segment is an absolutely-positioned rotated View
const RAW_PTS: [number, number][] = [
  [0, 26], [28, 26], [34, 26], [38, 14], [42, 38],
  [46, 10], [52, 42], [56, 26], [80, 26], [86, 26],
  [90, 14], [94, 38], [98, 10], [104, 42], [108, 26],
  [132, 26], [138, 26], [142, 14], [146, 38], [150, 10],
  [156, 42], [160, 26], [185, 26], [220, 26],
];
const ECG_H = 52;
const ECG_SOURCE_W = 220;

function EcgLine() {
  const [containerW, setContainerW] = useState(0);

  const segments = containerW > 0
    ? RAW_PTS.slice(1).map((p2, i) => {
        const p1 = RAW_PTS[i];
        const scale = containerW / ECG_SOURCE_W;
        const x1 = p1[0] * scale;
        const y1 = p1[1];
        const x2 = p2[0] * scale;
        const y2 = p2[1];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.5) return null;
        const angle = Math.atan2(dy, dx);
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        return { key: i, len, angle, cx, cy };
      }).filter(Boolean)
    : [];

  return (
    <View
      style={{ height: ECG_H, width: '100%', position: 'relative', overflow: 'hidden' }}
      onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}>
      {/* Baseline */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: ECG_H / 2 - 0.5,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      />
      {segments.map((s) =>
        s ? (
          <View
            key={s.key}
            style={{
              position: 'absolute',
              width: s.len,
              height: 2,
              backgroundColor: '#4ADE80',
              borderRadius: 1,
              left: s.cx - s.len / 2,
              top: s.cy - 1,
              transform: [{ rotate: `${s.angle}rad` }],
            }}
          />
        ) : null
      )}
    </View>
  );
}

// Pulsing LIVE dot
function PulseDot() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.5, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 700, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, [opacity, scale]);

  return (
    <Animated.View
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ADE80',
        transform: [{ scale }],
        opacity,
      }}
    />
  );
}

interface HeartRateCardProps {
  bpm?: number;
  status?: 'normal' | 'elevated' | 'low';
}

export function HeartRateCard({ bpm = 72, status = 'normal' }: HeartRateCardProps) {
  const statusLabel = status === 'elevated' ? 'Elevated' : status === 'low' ? 'Low' : 'Normal';
  const statusColor = status === 'elevated' ? '#F97316' : status === 'low' ? '#60A5FA' : '#4ADE80';

  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 24,
        backgroundColor: '#0F172A',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 12,
      }}>

      {/* Subtle glow */}
      <View
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: 'rgba(44,110,73,0.18)',
        }}
      />

      <View style={{ padding: 20 }}>
        {/* Top row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                backgroundColor: 'rgba(239,68,68,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="heart" size={18} color="#F87171" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>
              Heart Rate
            </Text>
          </View>

          {/* LIVE badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(74,222,128,0.12)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
            <PulseDot />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#4ADE80', letterSpacing: 0.5 }}>LIVE</Text>
          </View>
        </View>

        {/* BPM */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 12, marginBottom: 4 }}>
          <Text style={{ fontSize: 56, fontWeight: '800', color: '#FFFFFF', lineHeight: 60, letterSpacing: -2 }}>
            {bpm}
          </Text>
          <View style={{ paddingBottom: 10 }}>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>bpm</Text>
          </View>
          <View style={{ flex: 1 }} />
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 10,
              backgroundColor: `${statusColor}22`,
              marginBottom: 10,
            }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: statusColor }}>{statusLabel}</Text>
          </View>
        </View>

        {/* ECG (pure RN) */}
        <View style={{ marginTop: 4, marginBottom: 8, marginHorizontal: -4 }}>
          <EcgLine />
        </View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          {[
            { label: 'Min', value: '62 bpm' },
            { label: 'Avg', value: '71 bpm' },
            { label: 'Max', value: '88 bpm' },
          ].map(({ label, value }) => (
            <View key={label} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>{label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.75)' }}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
