/**
 * MetricsGrid
 *
 * Design rules (from pixel analysis of reference):
 *  • Gradient background per card: top = ultra-light tint, bottom = richer tint
 *  • NO shadow, NO border — gradient is the only depth signal
 *  • Bare icon (no tile/box) + label top-left
 *  • 42px 700-weight value — hero element
 *  • Sleep: 6 thick amber-gradient bars, right-aligned bottom
 *  • Calories / Water: large 70px ring chart, right-aligned bottom
 *  • Steps: rising sparkline, right-aligned bottom
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgGrad, Polyline, Stop } from 'react-native-svg';

// ── Ring chart ─────────────────────────────────────────────────────────────────
function RingChart({
  pct,
  color,
  trackColor,
  gradId,
  size   = 72,
  stroke = 9,
}: {
  pct:        number;
  color:      string;
  trackColor: string;
  gradId:     string;
  size?:      number;
  stroke?:    number;
}) {
  const r  = (size - stroke) / 2;
  const c  = 2 * Math.PI * r;
  const cx = size / 2;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Defs>
        <SvgGrad id={gradId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%"   stopColor={color} stopOpacity="0.45" />
          <Stop offset="100%" stopColor={color} stopOpacity="1"    />
        </SvgGrad>
      </Defs>
      <Circle cx={cx} cy={cx} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      {pct > 0 && (
        <Circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c - Math.min(pct / 100, 1) * c}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

// ── Sleep bars — 6 thick bars, light → dark amber ─────────────────────────────
const SLEEP_H = [0.38, 0.55, 0.70, 0.84, 1.00, 0.88];
const SLEEP_C = ['#F9D585', '#F5C140', '#EEAA18', '#E5960C', '#D97706', '#C46A06'];

function SleepBars() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 52 }}>
      {SLEEP_H.map((h, i) => (
        <View
          key={i}
          style={{
            width: 12,
            height: h * 52,
            borderRadius: 5,
            backgroundColor: SLEEP_C[i],
          }}
        />
      ))}
    </View>
  );
}

// ── Steps sparkline ────────────────────────────────────────────────────────────
const STEP_PTS = [10, 16, 13, 22, 18, 28, 25, 34, 30, 40, 48];

function Sparkline({ color }: { color: string }) {
  const W = 90; const H = 52;
  const min = Math.min(...STEP_PTS);
  const max = Math.max(...STEP_PTS);
  const r   = max - min || 1;
  const sx  = W / (STEP_PTS.length - 1);
  const sy  = (v: number) => H * 0.06 + (1 - (v - min) / r) * H * 0.88;
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

// ── Card token ────────────────────────────────────────────────────────────────
interface CardDef {
  icon:       ComponentProps<typeof Ionicons>['name'];
  iconColor:  string;
  gradTop:    string;    // lighter — top of card
  gradBot:    string;    // richer  — bottom of card
  label:      string;
  chart:      'ring' | 'bars' | 'sparkline';
  ringColor:  string;
  ringTrack:  string;
  gradId:     string;
}

// ── Single card ───────────────────────────────────────────────────────────────
interface MetricCardProps {
  def:     CardDef;
  value:   string;
  unit:    string;
  pct?:    number;
  hasData: boolean;
}

function MetricCard({ def: d, value, unit, pct = 0, hasData }: MetricCardProps) {
  return (
    <View style={{ flex: 1, borderRadius: 24, overflow: 'hidden', minHeight: 168 }}>
      <LinearGradient
        colors={[d.gradTop, d.gradBot]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1, padding: 16 }}>

        {/* Icon + label — bare icon, no tile */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 16 }}>
          <Ionicons name={d.icon} size={22} color={d.iconColor} />
          <Text style={{
            fontSize: 15,
            fontWeight: '600',
            color: '#1C1C1E',
            letterSpacing: -0.2,
          }}>
            {d.label}
          </Text>
        </View>

        {/* Value + chart */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>

          {/* Value block */}
          <View style={{ gap: 4 }}>
            <Text style={{
              fontSize: 42,
              fontWeight: '700',
              color: hasData ? '#1A1A1A' : '#C8C8C8',
              letterSpacing: -1.5,
              lineHeight: 46,
              includeFontPadding: false,
            }}>
              {hasData ? value : '—'}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '400', color: '#8A8A8E' }}>
              {unit}
            </Text>
          </View>

          {/* Chart */}
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            {d.chart === 'ring' && (
              <RingChart
                pct={hasData ? pct : 0}
                color={d.ringColor}
                trackColor={d.ringTrack}
                gradId={d.gradId}
              />
            )}
            {d.chart === 'bars'      && <SleepBars />}
            {d.chart === 'sparkline' && <Sparkline color={d.ringColor} />}
          </View>
        </View>

      </LinearGradient>
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

  return (
    <View style={{ gap: 12 }}>

      {/* Row 1 */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* Calories */}
        <MetricCard
          def={{
            icon: 'flame', iconColor: '#E8490A',
            gradTop: '#FFFFFF', gradBot: '#FCDDD5',
            label: 'Calories', chart: 'ring',
            ringColor: '#E8490A', ringTrack: '#F9C4B2', gradId: 'calG',
          }}
          value={calories > 0 ? calories.toLocaleString() : '0'}
          unit="kcal" pct={calPct} hasData={hasData}
        />
        {/* Water */}
        <MetricCard
          def={{
            icon: 'water', iconColor: '#2196F3',
            gradTop: '#FFFFFF', gradBot: '#C9E8FB',
            label: 'Water', chart: 'ring',
            ringColor: '#2196F3', ringTrack: '#B3D9F7', gradId: 'watG',
          }}
          value={waterLiters > 0 ? Math.round(waterLiters * 1000).toLocaleString() : '0'}
          unit="ml" pct={waterPct} hasData={hasData}
        />
      </View>

      {/* Row 2 */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* Sleep */}
        <MetricCard
          def={{
            icon: 'moon', iconColor: '#D97706',
            gradTop: '#FFFFFF', gradBot: '#FDE9A8',
            label: 'Sleep', chart: 'bars',
            ringColor: '#D97706', ringTrack: '#FDE68A', gradId: 'slpG',
          }}
          value={sleepHours > 0 ? sleepHours.toFixed(2) : '0.00'}
          unit="hrs" hasData={hasData}
        />
        {/* Steps */}
        <MetricCard
          def={{
            icon: 'footsteps', iconColor: '#2C9E5A',
            gradTop: '#FFFFFF', gradBot: '#C3F0D2',
            label: 'Steps', chart: 'sparkline',
            ringColor: '#2C9E5A', ringTrack: '#BBF7D0', gradId: 'stpG',
          }}
          value={steps > 0 ? steps.toLocaleString() : '0'}
          unit={`${stepsPct}% of 8k goal`} hasData={hasData}
        />
      </View>

    </View>
  );
}
