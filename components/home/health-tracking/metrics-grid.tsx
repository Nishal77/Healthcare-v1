/**
 * MetricsGrid
 *
 * 2 × 2 premium cards — Steps, Calories, Sleep, Water.
 * Each card has a tinted background, coloured icon, large value,
 * and a mini inline chart (ring, bars, or sparkline).
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

// ── Ring chart (SVG) ─────────────────────────────────────────────────────────
function RingChart({
  pct,
  color,
  trackColor,
  size = 54,
  stroke = 6,
}: {
  pct:        number;
  color:      string;
  trackColor: string;
  size?:      number;
  stroke?:    number;
}) {
  const r            = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset       = circumference - Math.min(pct / 100, 1) * circumference;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={trackColor} strokeWidth={stroke}
      />
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ── Mini bar chart ───────────────────────────────────────────────────────────
const SLEEP_BARS = [0.5, 0.65, 0.72, 0.8, 0.88, 0.95, 1, 0.9, 0.75];

function MiniBarChart({ color }: { color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 36 }}>
      {SLEEP_BARS.map((h, i) => (
        <View
          key={i}
          style={{
            width: 7,
            height: h * 36,
            borderRadius: 3,
            backgroundColor: color,
            opacity: 0.4 + (i / SLEEP_BARS.length) * 0.6,
          }}
        />
      ))}
    </View>
  );
}

// ── Mini sparkline ───────────────────────────────────────────────────────────
const STEP_POINTS = [22, 18, 28, 35, 30, 42, 38, 48, 44];

function MiniSparkline({ color }: { color: string }) {
  const W = 80; const H = 36;
  const minV = Math.min(...STEP_POINTS);
  const maxV = Math.max(...STEP_POINTS);
  const scaleX = W / (STEP_POINTS.length - 1);
  const scaleY = (v: number) => H - ((v - minV) / (maxV - minV)) * H * 0.8 - H * 0.1;
  const pts = STEP_POINTS.map((v, i) => `${i * scaleX},${scaleY(v)}`).join(' ');

  return (
    <Svg width={W} height={H}>
      <Polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Single card ──────────────────────────────────────────────────────────────
interface CardConfig {
  icon:       ComponentProps<typeof Ionicons>['name'];
  iconColor:  string;
  iconBg:     string;
  cardBg:     string;
  label:      string;
  value:      string;
  unit:       string;
  chart:      'ring' | 'bars' | 'sparkline';
  pct?:       number;          // for ring
  ringColor:  string;
  ringTrack:  string;
}

function MetricCard({ cfg, hasData }: { cfg: CardConfig; hasData: boolean }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: cfg.cardBg,
        borderRadius: 20,
        padding: 14,
        borderWidth: 1,
        borderColor: `${cfg.iconColor}18`,
        minHeight: 148,
      }}>

      {/* Icon + label row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: cfg.iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name={cfg.icon} size={16} color={cfg.iconColor} />
        </View>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', letterSpacing: -0.1 }}>
          {cfg.label}
        </Text>
      </View>

      {/* Value + chart row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1 }}>
        {/* Value block */}
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: hasData ? '#0F1923' : '#D1D5DB',
              letterSpacing: -1,
              lineHeight: 32,
            }}>
            {hasData ? cfg.value : '—'}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: '400', color: '#9CA3AF' }}>
            {cfg.unit}
          </Text>
        </View>

        {/* Chart */}
        <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          {cfg.chart === 'ring' && (
            <RingChart
              pct={hasData ? (cfg.pct ?? 0) : 0}
              color={cfg.ringColor}
              trackColor={cfg.ringTrack}
            />
          )}
          {cfg.chart === 'bars' && <MiniBarChart color={cfg.ringColor} />}
          {cfg.chart === 'sparkline' && <MiniSparkline color={cfg.ringColor} />}
        </View>
      </View>
    </View>
  );
}

// ── Props ────────────────────────────────────────────────────────────────────
interface MetricsGridProps {
  steps?:      number;
  waterLiters?: number;
  calories?:   number;
  sleepHours?: number;
  hasData?:    boolean;
}

export function MetricsGrid({
  steps       = 0,
  waterLiters  = 0,
  calories    = 0,
  sleepHours  = 0,
  hasData     = false,
}: MetricsGridProps) {

  const stepsPct    = Math.min(Math.round((steps / 8000) * 100), 100);
  const waterPct    = Math.min(Math.round((waterLiters / 2.5) * 100), 100);
  const calPct      = Math.min(Math.round((calories / 2000) * 100), 100);

  const CARDS: CardConfig[] = [
    {
      icon:      'footsteps-outline',
      iconColor: '#2C6E49',
      iconBg:    '#EAF4EE',
      cardBg:    '#F5FAF6',
      label:     'Steps',
      value:     steps.toLocaleString(),
      unit:      `${stepsPct}% of 8k goal`,
      chart:     'sparkline',
      ringColor: '#2C6E49',
      ringTrack: '#D1FAE5',
    },
    {
      icon:      'flame-outline',
      iconColor: '#EA580C',
      iconBg:    '#FEF0E7',
      cardBg:    '#FFF7F3',
      label:     'Calories',
      value:     calories > 0 ? calories.toLocaleString() : '0',
      unit:      'kcal',
      chart:     'ring',
      pct:       calPct,
      ringColor: '#EA580C',
      ringTrack: '#FED7AA',
    },
    {
      icon:      'moon-outline',
      iconColor: '#D97706',
      iconBg:    '#FEF9E7',
      cardBg:    '#FFFDF5',
      label:     'Sleep',
      value:     sleepHours > 0 ? sleepHours.toFixed(1) : '0.0',
      unit:      'hrs',
      chart:     'bars',
      ringColor: '#D97706',
      ringTrack: '#FDE68A',
    },
    {
      icon:      'water-outline',
      iconColor: '#0B6E8B',
      iconBg:    '#E6F4F9',
      cardBg:    '#F2F9FC',
      label:     'Water',
      value:     waterLiters > 0 ? `${(waterLiters * 1000).toFixed(0)}` : '0',
      unit:      `ml  ·  ${waterPct}% of 2.5L`,
      chart:     'ring',
      pct:       waterPct,
      ringColor: '#0B6E8B',
      ringTrack: '#BAE6FD',
    },
  ];

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MetricCard cfg={CARDS[0]} hasData={hasData} />
        <MetricCard cfg={CARDS[1]} hasData={hasData} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MetricCard cfg={CARDS[2]} hasData={hasData} />
        <MetricCard cfg={CARDS[3]} hasData={hasData} />
      </View>
    </View>
  );
}
