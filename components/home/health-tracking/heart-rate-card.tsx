/**
 * HeartRateCard — matches MetricsGrid white card style exactly.
 *
 * Layout (full-width card):
 *  ┌────────────────────────────────────────────┐
 *  │ ❤  Heart Rate                     ● LIVE  │  ← header (same as grid cards)
 *  │                                            │
 *  │  ▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇  (bars, full-w) │  ← chart area
 *  │                                            │
 *  │  72                                        │  ← big value
 *  │  bpm · Nadi Vata · Normal                  │  ← context label
 *  └────────────────────────────────────────────┘
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
import type { MetricStatus } from '../../../src/health/types';

// ── Bar chart ─────────────────────────────────────────────────────────────────
const BASE_BARS = [38, 45, 52, 58, 62, 68, 74, 88, 99, 118, 104, 92, 76, 62];
const CHART_H   = 48;

function HeartBars({ bpm }: { bpm: number }) {
  const bars  = [...BASE_BARS.slice(1), bpm > 0 ? bpm : 72];
  const max   = Math.max(...bars);
  const min   = Math.min(...bars);
  const range = max - min || 1;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: CHART_H }}>
      {bars.map((val, i) => {
        const h      = ((val - min) / range) * CHART_H * 0.8 + CHART_H * 0.12;
        const isPeak = val === max;
        const prog   = i / (bars.length - 1);
        const color  = isPeak ? '#D97706'
          : prog < 0.45 ? '#A8C5B0'
          : prog < 0.7  ? '#4D9B6E'
          : '#2C6E49';
        return (
          <View
            key={i}
            style={{
              flex:            1,
              height:          h,
              borderRadius:    4,
              backgroundColor: color,
              opacity:         isPeak ? 1 : 0.45 + prog * 0.55,
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
  isLive?:   boolean;   // true = real watch data; false = preview
}

export function HeartRateCard({
  bpm      = 72,
  status   = 'normal',
  nadiType = '—',
  isLive   = false,
}: HeartRateCardProps) {

  const statusLabel =
    status === 'elevated' ? 'Elevated'
    : status === 'critical' ? 'Critical'
    : status === 'low'      ? 'Low'
    : 'Normal';

  return (
    <View style={{
      borderRadius:    22,
      backgroundColor: '#FFFFFF',
      padding:         14,
      shadowColor:     '#0A0A0A',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.07,
      shadowRadius:    10,
      elevation:       3,
    }}>

      {/* ── Header — identical to MetricsGrid cards ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ionicons name="heart" size={20} color="#EF4444" />
        <Text style={{
          fontSize:      14,
          fontWeight:    '600',
          color:         '#1C1C1E',
          flex:          1,
          letterSpacing: -0.1,
        }}>
          Heart Rate
        </Text>

        {/* LIVE dot */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{
            width:           6,
            height:          6,
            borderRadius:    3,
            backgroundColor: isLive ? '#2C6E49' : '#D1D5DB',
          }} />
          <Text style={{
            fontSize:      9.5,
            fontWeight:    '700',
            color:         isLive ? '#2C6E49' : '#9CA3AF',
            letterSpacing: 0.8,
          }}>
            LIVE
          </Text>
        </View>
      </View>

      {/* ── Bar chart — full width ── */}
      <View style={{ marginBottom: 12 }}>
        <HeartBars bpm={bpm} />
      </View>

      {/* ── Bottom value (same as MetricsGrid card bottom) ── */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          <Text style={{
            fontSize:          32,
            fontWeight:        '700',
            color:             '#1A1A1A',
            letterSpacing:     -1,
            lineHeight:        36,
            includeFontPadding: false,
          }}>
            {bpm}
          </Text>
          <Text style={{ fontSize: 11, color: '#8A8A8E', fontWeight: '400', marginBottom: 4 }}>
            bpm
          </Text>
        </View>
        <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3, fontWeight: '500' }}>
          {nadiType !== '—' ? `Nadi · ${nadiType} · ${statusLabel}` : `bpm · ${statusLabel}`}
        </Text>
      </View>

    </View>
  );
}
