/**
 * MetricsGrid — 2×2 activity cards
 *
 * Design rules:
 *  • White card, soft shadow
 *  • Icon + label top-left
 *  • Chart CENTERED in the card with generous flex space
 *  • Calories / Water: large donut ring (100px) with value inside
 *  • Sleep: tall bars (64px) + S M T W T F S day labels
 *  • Steps: wide rising sparkline (strokeWidth 3)
 *  • Bold large value + context label bottom-left
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

// ── Donut ring — larger, centered ─────────────────────────────────────────────
function RingChart({
  pct,
  color,
  trackColor,
  size   = 100,
  stroke = 10,
  value,
  unit,
}: {
  pct:        number;
  color:      string;
  trackColor: string;
  size?:      number;
  stroke?:    number;
  value:      string;
  unit:       string;
}) {
  const r        = (size - stroke) / 2;
  const circ     = 2 * Math.PI * r;
  const cx       = size / 2;
  const hasValue = value !== '—' && pct > 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        {/* Track */}
        <Circle cx={cx} cy={cx} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        {/* Progress arc */}
        {hasValue && (
          <Circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - Math.min(pct / 100, 1))}
            strokeLinecap="round"
          />
        )}
      </Svg>

      {/* Value centered inside hole */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{
          fontSize:      hasValue ? 16 : 14,
          fontWeight:    '700',
          color:         hasValue ? '#1A1A1A' : '#D1D5DB',
          letterSpacing: -0.5,
          lineHeight:    19,
          textAlign:     'center',
        }}>
          {value}
        </Text>
        <Text style={{
          fontSize:   9,
          color:      '#9CA3AF',
          fontWeight: '500',
          marginTop:  2,
          textAlign:  'center',
        }}>
          {unit}
        </Text>
      </View>
    </View>
  );
}

// ── Sleep bars — tall + day labels ────────────────────────────────────────────
const SLEEP_H  = [0.38, 0.52, 0.68, 0.82, 1.00, 0.90, 0.76];
const SLEEP_C  = ['#F9D585', '#F5C140', '#EEAA18', '#E5960C', '#D97706', '#C46A06', '#EEAA18'];
const DAY_LABS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const BAR_H    = 64;

function SleepBars() {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: BAR_H }}>
        {SLEEP_H.map((h, i) => (
          <View
            key={i}
            style={{
              width:           13,
              height:          Math.round(h * BAR_H),
              borderRadius:    5,
              backgroundColor: SLEEP_C[i],
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {DAY_LABS.map((d, i) => (
          <Text
            key={i}
            style={{ width: 13, fontSize: 8, color: '#B0B7C3', textAlign: 'center', fontWeight: '600' }}>
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ── Steps sparkline — wider + thicker stroke ──────────────────────────────────
const STEP_PTS = [8, 14, 11, 20, 16, 26, 22, 32, 28, 38, 46];

function Sparkline({ color }: { color: string }) {
  const W = 110; const H = 60;
  const min = Math.min(...STEP_PTS);
  const max = Math.max(...STEP_PTS);
  const rng = max - min || 1;
  const sx  = W / (STEP_PTS.length - 1);
  const sy  = (v: number) => H * 0.06 + (1 - (v - min) / rng) * H * 0.88;
  const pts = STEP_PTS.map((v, i) => `${(i * sx).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');

  return (
    <Svg width={W} height={H}>
      <Polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Single card ───────────────────────────────────────────────────────────────
interface CardConfig {
  icon:        ComponentProps<typeof Ionicons>['name'];
  iconColor:   string;
  label:       string;
  chart:       'ring' | 'bars' | 'sparkline';
  accentColor: string;
  trackColor:  string;
}

interface MetricCardProps {
  cfg:       CardConfig;
  ringValue: string;
  ringUnit:  string;
  bigValue:  string;
  bigUnit:   string;
  pct:       number;
  hasData:   boolean;
}

function MetricCard({ cfg: c, ringValue, ringUnit, bigValue, bigUnit, pct, hasData }: MetricCardProps) {
  return (
    <View style={{
      flex:            1,
      borderRadius:    22,
      backgroundColor: '#FFFFFF',
      padding:         14,
      minHeight:       192,
      shadowColor:     '#0A0A0A',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.07,
      shadowRadius:    10,
      elevation:       3,
    }}>

      {/* Header: bare icon + label */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Ionicons name={c.icon} size={20} color={c.iconColor} />
        <Text style={{
          fontSize:      14,
          fontWeight:    '600',
          color:         '#1C1C1E',
          letterSpacing: -0.1,
        }}>
          {c.label}
        </Text>
      </View>

      {/* ── Chart — CENTERED both axes ── */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {c.chart === 'ring' && (
          <RingChart
            pct={hasData ? pct : 0}
            color={c.accentColor}
            trackColor={c.trackColor}
            value={hasData ? ringValue : '—'}
            unit={ringUnit}
          />
        )}
        {c.chart === 'bars'      && <SleepBars />}
        {c.chart === 'sparkline' && <Sparkline color={c.accentColor} />}
      </View>

      {/* Bottom: big value + context label */}
      <View style={{ marginTop: 10 }}>
        <Text style={{
          fontSize:           32,
          fontWeight:         '700',
          color:              hasData ? '#1A1A1A' : '#D1D5DB',
          letterSpacing:      -1,
          lineHeight:         36,
          includeFontPadding: false,
        }}>
          {hasData ? bigValue : '—'}
        </Text>
        <Text style={{
          fontSize:   11,
          color:      '#9CA3AF',
          marginTop:  3,
          fontWeight: '500',
        }}>
          {bigUnit}
        </Text>
      </View>

    </View>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
interface MetricsGridProps {
  steps?:       number;
  waterLiters?: number;
  calories?:    number;
  sleepHours?:  number;
  hasData?:     boolean;
}

export function MetricsGrid({
  steps       = 0,
  waterLiters = 0,
  calories    = 0,
  sleepHours  = 0,
  hasData     = false,
}: MetricsGridProps) {

  const calPct   = Math.min(Math.round((calories    / 2000) * 100), 100);
  const waterPct = Math.min(Math.round((waterLiters / 2.5)  * 100), 100);
  const stepsPct = Math.min(Math.round((steps       / 8000) * 100), 100);

  const fmtCal   = calories    > 0 ? calories.toLocaleString()                       : '—';
  const fmtWater = waterLiters > 0 ? Math.round(waterLiters * 1000).toLocaleString() : '—';
  const fmtSleep = sleepHours  > 0 ? sleepHours.toFixed(2)                           : '—';
  const fmtSteps = steps       > 0 ? steps.toLocaleString()                          : '—';

  return (
    <View style={{ gap: 12 }}>

      {/* Row 1 — Calories · Water */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <MetricCard
          cfg={{ icon: 'flame', iconColor: '#E8490A', label: 'Calories', chart: 'ring',
                 accentColor: '#22C55E', trackColor: '#DCFCE7' }}
          ringValue={fmtCal}   ringUnit="kcal"
          bigValue={fmtCal}    bigUnit="kcal · Daily rates"
          pct={calPct}         hasData={hasData}
        />
        <MetricCard
          cfg={{ icon: 'water', iconColor: '#2196F3', label: 'Water', chart: 'ring',
                 accentColor: '#3B82F6', trackColor: '#DBEAFE' }}
          ringValue={fmtWater}  ringUnit="ml"
          bigValue={fmtWater}   bigUnit="ml · Daily goal"
          pct={waterPct}        hasData={hasData}
        />
      </View>

      {/* Row 2 — Sleep · Steps */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <MetricCard
          cfg={{ icon: 'moon', iconColor: '#D97706', label: 'Sleep', chart: 'bars',
                 accentColor: '#D97706', trackColor: '#FDE68A' }}
          ringValue={fmtSleep}  ringUnit="hrs"
          bigValue={fmtSleep}   bigUnit="Hours"
          pct={0}               hasData={hasData}
        />
        <MetricCard
          cfg={{ icon: 'footsteps', iconColor: '#2C9E5A', label: 'Steps', chart: 'sparkline',
                 accentColor: '#16A34A', trackColor: '#DCFCE7' }}
          ringValue={fmtSteps}          ringUnit="steps"
          bigValue={fmtSteps}           bigUnit={`${stepsPct}% of 8k goal`}
          pct={stepsPct}                hasData={hasData}
        />
      </View>

    </View>
  );
}
