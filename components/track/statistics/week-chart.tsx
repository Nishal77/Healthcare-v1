/**
 * WeekChart
 * Stacked bar chart for the Week (and Month) period view.
 * Uses react-native-svg for the bars + goal dashed line.
 * Width is measured via onLayout so it never overflows on any device.
 */
import React, { useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Svg, {
  Defs,
  Line,
  LinearGradient as SvgGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

// ─── Chart data ───────────────────────────────────────────────────────────────

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/** Each day: fats (orange), carbs (teal), protein (blue) in kcal */
const WEEK_DATA = [
  { fats: 190, carbs: 110, protein:   0 },
  { fats: 310, carbs: 190, protein:   0 },
  { fats: 760, carbs: 590, protein: 680 },
  { fats: 830, carbs: 650, protein: 980 },
  { fats: 240, carbs: 140, protein:  90 },
  { fats: 310, carbs: 210, protein: 150 },
  { fats:  90, carbs:   0, protein:   0 },
];

// ─── Chart constants ──────────────────────────────────────────────────────────

const Y_MAX    = 3000;
const GOAL     = 2520;
const Y_TICKS  = [0, 1000, 2000, 3000];
const YAXIS_W  = 34;
const CHART_H  = 170;
const BAR_W    = 26;
const CORNER_R = 5;

function yPos(value: number): number {
  return CHART_H - (value / Y_MAX) * CHART_H;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WeekChart() {
  const [chartW, setChartW] = useState(0);

  function onLayout(e: LayoutChangeEvent) {
    setChartW(e.nativeEvent.layout.width - YAXIS_W);
  }

  const gap   = chartW > 0 ? (chartW - BAR_W * 7) / 6 : 0;
  const goalY = yPos(GOAL);

  return (
    <View onLayout={onLayout}>
      {chartW > 0 && (
        <>
          {/* ── Row: y-axis labels + SVG canvas ────────────────────── */}
          <View style={{ flexDirection: 'row' }}>

            {/* Y-axis */}
            <View style={{
              width: YAXIS_W,
              height: CHART_H,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingRight: 6,
            }}>
              {[...Y_TICKS].reverse().map(v => (
                <Text key={v} style={{ fontSize: 9.5, fontWeight: '500', color: '#CBD5E1' }}>
                  {v === 0 ? '0' : `${v / 1000}k`}
                </Text>
              ))}
            </View>

            {/* SVG chart */}
            <Svg width={chartW} height={CHART_H}>
              <Defs>
                <SvgGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%"   stopColor="#FB923C" />
                  <Stop offset="100%" stopColor="#EA580C" />
                </SvgGradient>
                <SvgGradient id="gTeal" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%"   stopColor="#38BDF8" />
                  <Stop offset="100%" stopColor="#0EA5E9" />
                </SvgGradient>
                <SvgGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%"   stopColor="#818CF8" />
                  <Stop offset="100%" stopColor="#4F46E5" />
                </SvgGradient>
              </Defs>

              {/* Grid lines */}
              {Y_TICKS.slice(1).map(v => (
                <Line
                  key={v}
                  x1={0} y1={yPos(v)} x2={chartW} y2={yPos(v)}
                  stroke="#F1F5F9" strokeWidth={1}
                />
              ))}

              {/* Goal dashed line */}
              <Line
                x1={0} y1={goalY} x2={chartW} y2={goalY}
                stroke="#2C6E49" strokeWidth={1.5}
                strokeDasharray="6,5" strokeOpacity={0.5}
              />

              {/* Goal pill */}
              <Rect x={0} y={goalY - 11} width={40} height={22} rx={11} fill="#2C6E49" />
              <SvgText x={20} y={goalY + 4.5} fontSize={8.5} fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                {GOAL}
              </SvgText>

              {/* Stacked bars */}
              {WEEK_DATA.map((d, i) => {
                const x  = i * (BAR_W + gap);
                const hF = (d.fats    / Y_MAX) * CHART_H;
                const hC = (d.carbs   / Y_MAX) * CHART_H;
                const hP = (d.protein / Y_MAX) * CHART_H;
                const yF = CHART_H - hF;
                const yC = yF - hC;
                const yP = yC - hP;

                return (
                  <React.Fragment key={i}>
                    {hF > 0 && (
                      <Rect
                        x={x} y={yF} width={BAR_W} height={hF}
                        rx={hC === 0 && hP === 0 ? CORNER_R : 0}
                        fill="url(#gOrange)"
                      />
                    )}
                    {hC > 0 && (
                      <Rect
                        x={x} y={yC} width={BAR_W} height={hC}
                        rx={hP === 0 ? CORNER_R : 0}
                        fill="url(#gTeal)"
                      />
                    )}
                    {hP > 0 && (
                      <Rect
                        x={x} y={yP} width={BAR_W} height={hP}
                        rx={CORNER_R}
                        fill="url(#gBlue)"
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Svg>
          </View>

          {/* ── X-axis day labels (native, never clips) ─────────────── */}
          <View style={{ flexDirection: 'row', marginLeft: YAXIS_W, marginTop: 10 }}>
            {DAY_LABELS.map((label, i) => (
              <View
                key={label}
                style={{
                  width: BAR_W,
                  marginRight: i < DAY_LABELS.length - 1 ? gap : 0,
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 11, fontWeight: '500', color: '#94A3B8' }}>
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* ── Legend ──────────────────────────────────────────────── */}
          <View style={{ flexDirection: 'row', gap: 18, justifyContent: 'center', marginTop: 16 }}>
            {[
              { color: '#F97316', label: 'Fats'    },
              { color: '#22D3EE', label: 'Carbs'   },
              { color: '#6366F1', label: 'Protein' },
            ].map(item => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: item.color }} />
                <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280' }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
