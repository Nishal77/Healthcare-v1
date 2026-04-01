/**
 * MetricsGrid — Pixel-perfect replica of the Sleep card reference
 *
 * Rules derived from pixel analysis of the reference:
 *  • Icon is BARE — no tile, no container box. Raw coloured icon only.
 *  • Card background: warm off-white per metric, not strong-tint
 *  • Value: 44px, 700 weight — largest element on the card
 *  • Sleep bars: 6 thick bars (~11 px wide), 3-shade warmth gradient
 *  • Ring charts: 70px, 8px stroke, very light track, rounded linecap
 *  • Sparkline: clean 2.8px green line, no fill
 *  • No border — soft coloured card shadow only
 *  • Generous vertical breathing room between icon row and value
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Polyline, Stop } from 'react-native-svg';

// ── Ring chart ─────────────────────────────────────────────────────────────────
function RingChart({
  pct,
  color,
  trackColor,
  gradId,
  size   = 70,
  stroke = 8,
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
  const filled = Math.min(pct / 100, 1);

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%"   stopColor={color} stopOpacity="0.5" />
          <Stop offset="100%" stopColor={color} stopOpacity="1"   />
        </LinearGradient>
      </Defs>
      {/* Track — very light, almost invisible */}
      <Circle cx={cx} cy={cx} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      {/* Fill */}
      {filled > 0 && (
        <Circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c - filled * c}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

// ── Sleep bars — thick, 3-shade warmth gradient ────────────────────────────────
// 6 bars: short → peak at 5th → slight drop at 6th (matches reference silhouette)
const SLEEP_H   = [0.42, 0.60, 0.74, 0.90, 1.00, 0.82];
const SLEEP_C   = ['#F9D27A', '#F5BE4A', '#EDA620', '#E8950D', '#D97706', '#C46E08'];

function SleepBars() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 48 }}>
      {SLEEP_H.map((h, i) => (
        <View
          key={i}
          style={{
            width: 11,
            height: h * 48,
            borderRadius: 5,
            backgroundColor: SLEEP_C[i],
          }}
        />
      ))}
    </View>
  );
}

// ── Sparkline — Steps ──────────────────────────────────────────────────────────
const STEP_PTS = [14, 22, 18, 32, 28, 36, 42, 38, 50, 46, 56];

function Sparkline({ color }: { color: string }) {
  const W = 86; const H = 48;
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
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Card component ─────────────────────────────────────────────────────────────
interface CardDef {
  icon:        ComponentProps<typeof Ionicons>['name'];
  iconColor:   string;
  cardBg:      string;     // warm off-white unique per metric
  shadowColor: string;
  label:       string;
  chart:       'ring' | 'bars' | 'sparkline';
  ringColor:   string;
  ringTrack:   string;
  gradId:      string;
}

interface MetricCardProps {
  def:     CardDef;
  value:   string;
  unit:    string;
  pct?:    number;
  hasData: boolean;
}

function MetricCard({ def: d, value, unit, pct = 0, hasData }: MetricCardProps) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 24,
        backgroundColor: d.cardBg,
        padding: 16,
        minHeight: 160,
        // Warm coloured shadow — no border
        shadowColor: d.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 16,
        elevation: 4,
      }}>

      {/* ── Top: bare icon + label ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        {/* Icon — NO tile or container */}
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

      {/* ── Bottom: value left, chart right ── */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>

        {/* Value block */}
        <View style={{ gap: 3 }}>
          <Text style={{
            fontSize: 42,
            fontWeight: '700',
            color: hasData ? '#1A1A1A' : '#D1D5DB',
            letterSpacing: -1.5,
            lineHeight: 46,
            includeFontPadding: false,
          }}>
            {hasData ? value : '—'}
          </Text>
          <Text style={{
            fontSize: 13,
            fontWeight: '400',
            color: '#9CA3AF',
            letterSpacing: 0.1,
          }}>
            {unit}
          </Text>
        </View>

        {/* Chart — anchored bottom-right */}
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
    </View>
  );
}

// ── Grid export ────────────────────────────────────────────────────────────────
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

      {/* Row 1 — Calories · Water */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <MetricCard
          def={{
            icon: 'flame', iconColor: '#E8490A',
            cardBg: '#FEF5F0', shadowColor: '#E8490A',
            label: 'Calories', chart: 'ring',
            ringColor: '#E8490A', ringTrack: '#FDDDD4', gradId: 'calGrad',
          }}
          value={calories > 0 ? calories.toLocaleString() : '0'}
          unit="kcal"
          pct={calPct}
          hasData={hasData}
        />
        <MetricCard
          def={{
            icon: 'water', iconColor: '#2196F3',
            cardBg: '#F0F8FE', shadowColor: '#2196F3',
            label: 'Water', chart: 'ring',
            ringColor: '#2196F3', ringTrack: '#CCE9FC', gradId: 'waterGrad',
          }}
          value={waterLiters > 0 ? Math.round(waterLiters * 1000).toLocaleString() : '0'}
          unit="ml"
          pct={waterPct}
          hasData={hasData}
        />
      </View>

      {/* Row 2 — Sleep · Steps */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <MetricCard
          def={{
            icon: 'moon', iconColor: '#D97706',
            cardBg: '#FFFCF2', shadowColor: '#D97706',
            label: 'Sleep', chart: 'bars',
            ringColor: '#D97706', ringTrack: '#FDE68A', gradId: 'sleepGrad',
          }}
          value={sleepHours > 0 ? sleepHours.toFixed(2) : '0.00'}
          unit="hrs"
          hasData={hasData}
        />
        <MetricCard
          def={{
            icon: 'footsteps', iconColor: '#2C9E5A',
            cardBg: '#F3FDF6', shadowColor: '#2C9E5A',
            label: 'Steps', chart: 'sparkline',
            ringColor: '#2C9E5A', ringTrack: '#BBF7D0', gradId: 'stepGrad',
          }}
          value={steps > 0 ? steps.toLocaleString() : '0'}
          unit={`${stepsPct}% of 8k goal`}
          hasData={hasData}
        />
      </View>

    </View>
  );
}
