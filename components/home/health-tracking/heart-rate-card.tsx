import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';

// ECG-style waveform path
function EcgLine() {
  return (
    <Svg width="100%" height="52" viewBox="0 0 220 52" preserveAspectRatio="none">
      {/* Faint grid line */}
      <Polyline
        points="0,26 220,26"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      {/* ECG waveform */}
      <Path
        d="M0,26 L28,26 L34,26 L38,14 L42,38 L46,10 L52,42 L56,26 L80,26 L86,26 L90,14 L94,38 L98,10 L104,42 L108,26 L132,26 L138,26 L142,14 L146,38 L150,10 L156,42 L160,26 L185,26 L220,26"
        stroke="#4ADE80"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Pulsing dot
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

      {/* Subtle green glow overlay */}
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

        {/* BPM display */}
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

        {/* ECG line */}
        <View style={{ marginTop: 4, marginBottom: 8, marginHorizontal: -4 }}>
          <EcgLine />
        </View>

        {/* Footer stats */}
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
