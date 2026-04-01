/**
 * MetricsGrid — Premium 2×2 health cards
 *
 * Design principles (matching reference image 1):
 * - Number is the HERO — 40px, 800 weight, dominates the card
 * - Large ring charts (72px) with thick 9px stroke, very light track
 * - Soft dual-tone gradient feel via two layered background Views
 * - Icon: soft rounded circle, no heavy tile
 * - No harsh borders — subtle coloured shadow gives depth
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Polyline, Stop } from 'react-native-svg';

// ── Ring chart ────────────────────────────────────────────────────────────────
function RingChart({
  pct,
  color,
  gradientId,
  trackColor,
  size   = 72,
  stroke = 9,
}: {
  pct:        number;
  color:      string;
  gradientId: string;
  trackColor: string;
  size?:      number;
  stroke?:    number;
}) {
  const r            = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const filled       = Math.min(pct / 100, 1);
  const offset       = circumference - filled * circumference;
  const cx           = size / 2;

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <Stop offset="100%" stopColor={color} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {/* Track */}
      <Circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      {/* Progress */}
      {filled > 0 && (
        <Circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

// ── Sleep bar chart ───────────────────────────────────────────────────────────
// Heights mirror a realistic sleep-stage pattern
const SLEEP_BARS = [0.35, 0.52, 0.65, 0.78, 0.88, 0.95, 1, 0.92, 0.80, 0.68, 0.55];

function SleepBars({ color }: { color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 52 }}>
      {SLEEP_BARS.map((h, i) => {
        const opacity = 0.35 + (i / (SLEEP_BARS.length - 1)) * 0.65;
        return (
          <View
            key={i}
            style={{
              width: 9,
              height: h * 52,
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

// ── Sparkline (Steps / Weight) ────────────────────────────────────────────────
const STEP_PTS = [18, 26, 22, 34, 30, 38, 44, 40, 52, 48, 58];

function Sparkline({ color, W = 90, H = 52 }: { color: string; W?: number; H?: number }) {
  const minV  = Math.min(...STEP_PTS);
  const maxV  = Math.max(...STEP_PTS);
  const range = maxV - minV || 1;
  const sx    = W / (STEP_PTS.length - 1);
  const sy    = (v: number) => H * 0.08 + (1 - (v - minV) / range) * H * 0.84;
  const pts   = STEP_PTS.map((v, i) => `${i * sx},${sy(v)}`).join(' ');

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

// ── Design tokens per card ────────────────────────────────────────────────────
interface CardTokens {
  icon:        ComponentProps<typeof Ionicons>['name'];
  iconColor:   string;
  iconBg:      string;
  bgTop:       string;   // top gradient layer (lighter)
  bgBase:      string;   // base card colour (slightly richer)
  shadowColor: string;
  label:       string;
  chart:       'ring' | 'bars' | 'sparkline';
  ringColor:   string;
  ringTrack:   string;
  gradientId:  string;
}

// ── Single premium card ───────────────────────────────────────────────────────
interface MetricCardProps {
  tokens:   CardTokens;
  value:    string;
  unit:     string;
  pct?:     number;
  hasData:  boolean;
}

function MetricCard({ tokens: t, value, unit, pct = 0, hasData }: MetricCardProps) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 22,
        overflow: 'hidden',
        minHeight: 162,
        // Coloured shadow — key to premium look
        shadowColor: t.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.13,
        shadowRadius: 14,
        elevation: 5,
      }}>

      {/* Base background */}
      <View style={{ flex: 1, backgroundColor: t.bgBase }}>

        {/* Lighter top-left glow blob — fakes a gradient */}
        <View
          style={{
            position: 'absolute',
            top: -24,
            left: -24,
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: t.bgTop,
          }}
        />

        <View style={{ flex: 1, padding: 16 }}>

          {/* ── Icon + Label ── */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                backgroundColor: t.iconBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name={t.icon} size={17} color={t.iconColor} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1C1C1E', letterSpacing: -0.2 }}>
              {t.label}
            </Text>
          </View>

          {/* ── Value + Chart row ── */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>

            {/* Number block */}
            <View style={{ justifyContent: 'flex-end', gap: 2 }}>
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: '800',
                  color: hasData ? '#0F1923' : '#D1D5DB',
                  letterSpacing: -1.5,
                  lineHeight: 42,
                  includeFontPadding: false,
                }}>
                {hasData ? value : '—'}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '400', color: '#9CA3AF', letterSpacing: 0.1 }}>
                {unit}
              </Text>
            </View>

            {/* Chart — anchored bottom-right */}
            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              {t.chart === 'ring' && (
                <RingChart
                  pct={hasData ? pct : 0}
                  color={t.ringColor}
                  gradientId={t.gradientId}
                  trackColor={t.ringTrack}
                />
              )}
              {t.chart === 'bars' && <SleepBars color={t.ringColor} />}
              {t.chart === 'sparkline' && <Sparkline color={t.ringColor} />}
            </View>
          </View>

        </View>
      </View>
    </View>
  );
}

// ── Grid ─────────────────────────────────────────────────────────────────────
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
    <View style={{ gap: 11 }}>

      {/* Row 1 — Calories · Water */}
      <View style={{ flexDirection: 'row', gap: 11 }}>
        <MetricCard
          tokens={{
            icon: 'flame',       iconColor: '#E8490A', iconBg: '#FDDDD4',
            bgBase: '#FEF3EF',   bgTop: '#FFFFFF',
            shadowColor: '#E8490A',
            label: 'Calories',   chart: 'ring',
            ringColor: '#E8490A', ringTrack: '#FDDDD4', gradientId: 'calGrad',
          }}
          value={calories > 0 ? calories.toLocaleString() : '0'}
          unit="kcal"
          pct={calPct}
          hasData={hasData}
        />
        <MetricCard
          tokens={{
            icon: 'water',       iconColor: '#1E90D6', iconBg: '#D1EDFB',
            bgBase: '#EEF7FD',   bgTop: '#FFFFFF',
            shadowColor: '#1E90D6',
            label: 'Water',      chart: 'ring',
            ringColor: '#1E90D6', ringTrack: '#C4E8F7', gradientId: 'waterGrad',
          }}
          value={waterLiters > 0 ? `${Math.round(waterLiters * 1000).toLocaleString()}` : '0'}
          unit="ml"
          pct={waterPct}
          hasData={hasData}
        />
      </View>

      {/* Row 2 — Sleep · Steps */}
      <View style={{ flexDirection: 'row', gap: 11 }}>
        <MetricCard
          tokens={{
            icon: 'moon',        iconColor: '#D97706', iconBg: '#FEF0C7',
            bgBase: '#FFFCF0',   bgTop: '#FFFFFF',
            shadowColor: '#D97706',
            label: 'Sleep',      chart: 'bars',
            ringColor: '#D97706', ringTrack: '#FDE68A', gradientId: 'sleepGrad',
          }}
          value={sleepHours > 0 ? sleepHours.toFixed(2).replace('.', '.') : '0.00'}
          unit="hrs"
          hasData={hasData}
        />
        <MetricCard
          tokens={{
            icon: 'footsteps',   iconColor: '#2C9E5A', iconBg: '#D1FAE5',
            bgBase: '#F0FDF4',   bgTop: '#FFFFFF',
            shadowColor: '#2C9E5A',
            label: 'Steps',      chart: 'sparkline',
            ringColor: '#2C9E5A', ringTrack: '#BBF7D0', gradientId: 'stepGrad',
          }}
          value={steps > 0 ? steps.toLocaleString() : '0'}
          unit={hasData ? `${stepsPct}% of 8k goal` : '0% of 8k goal'}
          hasData={hasData}
        />
      </View>

    </View>
  );
}
