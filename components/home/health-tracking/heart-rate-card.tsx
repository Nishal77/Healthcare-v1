/**
 * HeartRateCard — compact design
 *
 * Layout:
 *  ┌──────────────────────────────────────┐
 *  │ [❤] Heart Rate            ● LIVE     │  ← header row
 *  │                                      │
 *  │  72          ▁▂▄▅▇█▆▄▃▂▁▂▃▄▅▆▇     │  ← BPM left · bars right
 *  │  bpm                                 │
 *  ├──────────────────────────────────────┤
 *  │ NADI ───────── —   STATUS ── ● —    │  ← footer row
 *  └──────────────────────────────────────┘
 *
 * White card + green bottom gradient — matches MetricsGrid shadow system.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import type { MetricStatus } from '../../../src/health/types';

// ── Bar chart (compact 38px height) ──────────────────────────────────────────
const BASE_BARS = [38, 45, 52, 58, 62, 68, 74, 88, 99, 118, 104, 92, 76, 62];
const CHART_H   = 42;

function HeartBars({ bpm }: { bpm: number }) {
  const bars  = [...BASE_BARS.slice(1), bpm > 0 ? bpm : 72];
  const max   = Math.max(...bars);
  const min   = Math.min(...bars);
  const range = max - min || 1;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3.5, height: CHART_H, flex: 1 }}>
      {bars.map((val, i) => {
        const norm   = ((val - min) / range) * CHART_H * 0.78 + CHART_H * 0.12;
        const isPeak = val === max;
        const prog   = i / (bars.length - 1);
        const color  = isPeak ? '#C4860A'
          : prog < 0.45 ? '#A8C5B0'
          : prog < 0.7  ? '#4D9B6E'
          : '#2C6E49';
        return (
          <View
            key={i}
            style={{
              flex:            1,
              height:          norm,
              borderRadius:    3.5,
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
    : status === 'low'    ? '#0B6E8B'
    : '#2C6E49';

  const statusLabel =
    status === 'elevated' ? 'Elevated'
    : status === 'critical' ? 'Critical'
    : status === 'low'      ? 'Low'
    : 'Normal';

  return (
    <View style={{
      borderRadius:    22,
      overflow:        'hidden',
      backgroundColor: '#FFFFFF',
      shadowColor:     '#0A0A0A',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.07,
      shadowRadius:    10,
      elevation:       3,
    }}>
      <LinearGradient
        colors={['#FFFFFF', '#EAF7EF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ padding: 14 }}>

        {/* ── Header ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            width:           34,
            height:          34,
            borderRadius:    11,
            backgroundColor: '#FECDD3',
            alignItems:      'center',
            justifyContent:  'center',
            marginRight:     10,
          }}>
            <Ionicons name="heart" size={16} color="#EF4444" />
          </View>

          <Text style={{
            fontSize:      15,
            fontWeight:    '600',
            color:         '#1C1C1E',
            flex:          1,
            letterSpacing: -0.2,
          }}>
            Heart Rate
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C6E49' }} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#2C6E49', letterSpacing: 0.8 }}>
              LIVE
            </Text>
          </View>
        </View>

        {/* ── Middle: BPM (left) + bars (right) ── */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginBottom: 12 }}>

          {/* BPM value */}
          <View style={{ justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
              <Text style={{
                fontSize:          36,
                fontWeight:        '700',
                color:             hasData ? '#1A1A1A' : '#D1D5DB',
                letterSpacing:     -1.2,
                lineHeight:        40,
                includeFontPadding: false,
              }}>
                {hasData ? bpm : '—'}
              </Text>
              {hasData && (
                <Text style={{ fontSize: 12, color: '#8A8A8E', fontWeight: '400', marginBottom: 5 }}>
                  bpm
                </Text>
              )}
            </View>
          </View>

          {/* Bars */}
          <HeartBars bpm={bpm} />
        </View>

        {/* ── Footer: NADI · STATUS in one tight row ── */}
        <View style={{
          flexDirection:  'row',
          alignItems:     'center',
          paddingTop:     10,
          borderTopWidth: 1,
          borderTopColor: 'rgba(44,110,73,0.1)',
          gap:            18,
        }}>

          {/* NADI */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <Text style={{ fontSize: 9.5, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.7 }}>
              NADI
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: hasData ? '#374151' : '#D1D5DB' }}>
              {hasData ? nadiType : '—'}
            </Text>
          </View>

          {/* Divider dot */}
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#E5E7EB' }} />

          {/* STATUS */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
            <Text style={{ fontSize: 9.5, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.7 }}>
              STATUS
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{
                width:           6,
                height:          6,
                borderRadius:    3,
                backgroundColor: hasData ? statusColor : '#D1D5DB',
              }} />
              <Text style={{
                fontSize:   11,
                fontWeight: '600',
                color:      hasData ? statusColor : '#D1D5DB',
              }}>
                {hasData ? statusLabel : '—'}
              </Text>
            </View>
          </View>

        </View>

      </LinearGradient>
    </View>
  );
}
