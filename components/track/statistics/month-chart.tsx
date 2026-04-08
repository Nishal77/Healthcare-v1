/**
 * MonthChart
 * Month-view for the Statistics card.
 * Shows smooth bezier line curves for Fats / Carbs / Protein
 * with gradient area fills under each line — premium feel.
 */
import React, { useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
  Line,
} from 'react-native-svg';

// ─── 28-day mock data (4 weeks) ───────────────────────────────────────────────

// Values swing widely so the three lines cross each other naturally.
// Week 1: Fats spikes up, Carbs crashes down → they swap positions crossing Protein.
// Week 2: Recovery — Carbs climbs back, Fats drops back.
// Week 3: Protein surges, briefly overtakes Carbs while Fats stays mid.
// Week 4: All three converge then spread again.
const MONTH_DATA = {
  fats:    [ 28, 42, 70,115,162,185,158,  118, 78, 52, 42, 58,105,148,  178,155,108, 65, 42, 55, 92,  138,168,148,112, 72, 44, 30],
  carbs:   [255,225,185,138, 98, 72, 88,  132,178,218,258,210,155,102,   82,122,180,228,268,222,165,  118, 82,110,158,208,255,272],
  protein: [ 92,105,118,128,135,124,112,  122,135,148,158,145,132,120,  128,145,162,175,188,170,150,  138,148,162,148,135,148,138],
};

const NUM_POINTS = MONTH_DATA.fats.length;  // 28

// Week label positions (centre of each 7-day block)
const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

// ─── Chart constants ──────────────────────────────────────────────────────────

const Y_MAX   = 300;
const Y_TICKS = [0, 100, 200, 300];
const YAXIS_W = 34;
const CHART_H = 190;

// ─── Colours ─────────────────────────────────────────────────────────────────

const SERIES = [
  { key: 'fats'    as const, label: 'Fats',    color: '#F97316', gradId: 'gFats'    },
  { key: 'carbs'   as const, label: 'Carbs',   color: '#22D3EE', gradId: 'gCarbs'   },
  { key: 'protein' as const, label: 'Protein', color: '#818CF8', gradId: 'gProtein' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Point = { x: number; y: number };

/** Convert raw data value → SVG y coordinate */
function toY(v: number): number {
  return CHART_H - (v / Y_MAX) * CHART_H;
}

/** Build an array of {x, y} points from data values */
function buildPoints(values: number[], chartW: number): Point[] {
  const step = chartW / (NUM_POINTS - 1);
  return values.map((v, i) => ({ x: i * step, y: toY(v) }));
}

/**
 * Smooth cubic-bezier path using Catmull-Rom → Bezier conversion.
 * If closeBottom=true the path is closed along the bottom (for fills).
 */
function smoothPath(pts: Point[], closeBottom = false): string {
  if (pts.length < 2) return '';

  let d = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;

  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(i - 2, 0)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(i + 1, pts.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  if (closeBottom) {
    const last = pts[pts.length - 1];
    const first = pts[0];
    d += ` L ${last.x.toFixed(2)},${CHART_H} L ${first.x.toFixed(2)},${CHART_H} Z`;
  }

  return d;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MonthChart() {
  const [chartW, setChartW] = useState(0);

  function onLayout(e: LayoutChangeEvent) {
    setChartW(e.nativeEvent.layout.width - YAXIS_W);
  }

  return (
    <View onLayout={onLayout}>
      {chartW > 0 && (() => {
        const seriesPoints = SERIES.map(s => buildPoints(MONTH_DATA[s.key], chartW));
        const weekStep     = chartW / 4;

        return (
          <>
            {/* ── Row: y-axis + SVG canvas ───────────────────────── */}
            <View style={{ flexDirection: 'row' }}>

              {/* Y-axis labels */}
              <View style={{
                width: YAXIS_W,
                height: CHART_H,
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingRight: 6,
              }}>
                {[...Y_TICKS].reverse().map(v => (
                  <Text key={v} style={{ fontSize: 9.5, fontWeight: '500', color: '#CBD5E1' }}>
                    {v === 0 ? '0' : `${v}g`}
                  </Text>
                ))}
              </View>

              {/* SVG */}
              <Svg width={chartW} height={CHART_H}>
                <Defs>
                  {/* Area-fill gradients — each line colour fades to transparent */}
                  {SERIES.map(s => (
                    <SvgGradient key={s.gradId} id={s.gradId} x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%"   stopColor={s.color} stopOpacity="0.22" />
                      <Stop offset="100%" stopColor={s.color} stopOpacity="0"    />
                    </SvgGradient>
                  ))}
                </Defs>

                {/* Horizontal grid lines */}
                {Y_TICKS.slice(1).map(v => (
                  <Line
                    key={v}
                    x1={0} y1={toY(v)} x2={chartW} y2={toY(v)}
                    stroke="#F1F5F9" strokeWidth={1}
                  />
                ))}

                {/* Week separator vertical lines */}
                {[1, 2, 3].map(w => (
                  <Line
                    key={w}
                    x1={w * weekStep} y1={0}
                    x2={w * weekStep} y2={CHART_H}
                    stroke="#F1F5F9" strokeWidth={1}
                    strokeDasharray="4,4"
                  />
                ))}

                {/* Area fills (drawn first, below lines) */}
                {SERIES.map((s, idx) => (
                  <Path
                    key={`fill-${s.key}`}
                    d={smoothPath(seriesPoints[idx], true)}
                    fill={`url(#${s.gradId})`}
                  />
                ))}

                {/* Lines */}
                {SERIES.map((s, idx) => (
                  <Path
                    key={`line-${s.key}`}
                    d={smoothPath(seriesPoints[idx], false)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}

                {/* End-of-month dots — one per series at the last data point */}
                {SERIES.map((s, idx) => {
                  const lastPt = seriesPoints[idx][NUM_POINTS - 1];
                  return (
                    <React.Fragment key={`dot-${s.key}`}>
                      {/* Outer glow ring */}
                      <Circle
                        cx={lastPt.x} cy={lastPt.y}
                        r={6} fill={s.color} fillOpacity={0.2}
                      />
                      {/* White centre + colour fill */}
                      <Circle cx={lastPt.x} cy={lastPt.y} r={3.5} fill="#FFFFFF" />
                      <Circle cx={lastPt.x} cy={lastPt.y} r={2}   fill={s.color}  />
                    </React.Fragment>
                  );
                })}
              </Svg>
            </View>

            {/* ── X-axis: week labels ──────────────────────────────── */}
            <View style={{
              flexDirection: 'row',
              marginLeft: YAXIS_W,
              marginTop: 10,
            }}>
              {WEEK_LABELS.map((label, i) => (
                <View
                  key={label}
                  style={{ width: weekStep, alignItems: i === 0 ? 'flex-start' : 'center' }}>
                  <Text style={{ fontSize: 10.5, fontWeight: '500', color: '#94A3B8' }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            {/* ── Legend ──────────────────────────────────────────── */}
            <View style={{
              flexDirection: 'row',
              gap: 18,
              justifyContent: 'center',
              marginTop: 16,
            }}>
              {SERIES.map(s => (
                <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {/* Short line sample */}
                  <View style={{
                    width: 16, height: 2.5,
                    borderRadius: 2,
                    backgroundColor: s.color,
                  }} />
                  <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280' }}>
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          </>
        );
      })()}
    </View>
  );
}
