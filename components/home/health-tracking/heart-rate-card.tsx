import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
import type { MetricStatus } from '../../../src/health/types';

// ── Bar chart matching reference image 2 ─────────────────────────────────────
const BASE_BARS = [38, 45, 52, 58, 62, 68, 74, 88, 99, 118, 104, 92, 76, 62];
const CHART_H   = 52;

function HeartBars({ bpm }: { bpm: number }) {
  const bars  = [...BASE_BARS.slice(1), bpm > 0 ? bpm : 72];
  const max   = Math.max(...bars);
  const min   = Math.min(...bars);
  const range = max - min || 1;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: CHART_H }}>
      {bars.map((val, i) => {
        const norm    = ((val - min) / range) * CHART_H * 0.8 + CHART_H * 0.12;
        const isPeak  = val === max;
        const prog    = i / (bars.length - 1);
        // Gradient: light sage → deep forest green, peak = amber
        const color   = isPeak ? '#C4860A'
          : prog < 0.45 ? '#A8C5B0'
          : prog < 0.7  ? '#4D9B6E'
          : '#2C6E49';
        const opacity = isPeak ? 1 : 0.5 + prog * 0.5;

        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: norm,
              borderRadius: 4,
              backgroundColor: color,
              opacity,
            }}
          />
        );
      })}
    </View>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
interface HeartRateCardProps {
  bpm?:      number;
  status?:   MetricStatus;
  nadiType?: string;
  hasData?:  boolean;
}

export function HeartRateCard({
  bpm      = 0,
  status   = 'normal',
  nadiType = '—',
  hasData  = false,
}: HeartRateCardProps) {
  const statusColor =
    status === 'elevated' || status === 'critical' ? '#EA580C'
    : status === 'low'   ? '#0B6E8B'
    : '#2C6E49';

  const statusLabel =
    status === 'elevated' ? 'Elevated'
    : status === 'critical' ? 'Critical'
    : status === 'low'      ? 'Low'
    : 'Normal';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ECEAE6',
      }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            backgroundColor: '#FEF2F2',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 9,
          }}>
          <Ionicons name="heart" size={17} color="#EF4444" />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F1923', flex: 1, letterSpacing: -0.2 }}>
          Heart Rate
        </Text>
        {/* LIVE dot */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C6E49' }} />
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#2C6E49', letterSpacing: 0.8 }}>
            LIVE
          </Text>
        </View>
      </View>

      {/* Bar chart */}
      <View style={{ marginBottom: 14 }}>
        <HeartBars bpm={bpm} />
      </View>

      {/* BPM value */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 14 }}>
        <Text
          style={{
            fontSize: 44,
            fontWeight: '700',
            color: hasData ? '#0F1923' : '#D1D5DB',
            lineHeight: 48,
            letterSpacing: -1.5,
          }}>
          {hasData ? bpm : '—'}
        </Text>
        {hasData && (
          <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '400', marginBottom: 7 }}>
            bpm
          </Text>
        )}
      </View>

      {/* NADI + STATUS */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10, gap: 7 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.8 }}>
            NADI
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '500', color: '#4B5563' }}>
            {hasData ? nadiType : '—'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.8 }}>
            STATUS
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: hasData ? statusColor : '#D1D5DB' }} />
            <Text style={{ fontSize: 11, fontWeight: '600', color: hasData ? statusColor : '#D1D5DB' }}>
              {hasData ? statusLabel : '—'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
