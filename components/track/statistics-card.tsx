import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Defs, Line, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

// ─── Data ────────────────────────────────────────────────────────────────────

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// Simulated macro breakdown per day: protein (blue), carbs (teal), fats (orange)
const DATA = [
  { fats: 190, carbs: 110, protein: 0    },  // Mo
  { fats: 310, carbs: 180, protein: 0    },  // Tu
  { fats: 760, carbs: 590, protein: 680  },  // We
  { fats: 830, carbs: 650, protein: 980  },  // Th
  { fats: 240, carbs: 130, protein: 80   },  // Fr
  { fats: 310, carbs: 200, protein: 140  },  // Sa
  { fats: 90,  carbs: 0,   protein: 0    },  // Su
];

const Y_MAX  = 3000;
const GOAL   = 2520;
const Y_TICKS = [0, 1000, 2000, 3000];

// ─── Colours ─────────────────────────────────────────────────────────────────
const C_ORANGE  = '#F97316';
const C_TEAL    = '#22D3EE';
const C_BLUE    = '#6366F1';
const C_GOAL_BG = '#2C6E49';

// ─── Chart constants ─────────────────────────────────────────────────────────
const { width: SCREEN_W } = Dimensions.get('window');
const CARD_H_PAD  = 20;   // card horizontal padding
const YAXIS_W     = 36;   // space for y-axis labels
const CHART_W     = SCREEN_W - CARD_H_PAD * 2 - YAXIS_W - 4;
const CHART_H     = 164;
const BAR_W       = 22;
const NUM_BARS    = 7;
const GAP         = (CHART_W - NUM_BARS * BAR_W) / (NUM_BARS - 1);
const CORNER_R    = 4;

function yPos(value: number) {
  return CHART_H - (value / Y_MAX) * CHART_H;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  period?: 'Week' | 'Month';
  onPeriodToggle?: () => void;
}

export function StatisticsCard({ period = 'Week', onPeriodToggle }: Props) {
  const goalY = yPos(GOAL);

  return (
    <View style={{
      marginHorizontal: CARD_H_PAD,
      marginBottom: 24,
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      paddingTop: 18,
      paddingBottom: 20,
      paddingHorizontal: CARD_H_PAD,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 4,
    }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0D1117', letterSpacing: -0.3 }}>
            Statistics
          </Text>
          <Text style={{ fontSize: 11.5, fontWeight: '400', color: '#9CA3AF', marginTop: 3, lineHeight: 16 }}>
            Recommended Nutritional Value and Statistics
          </Text>
        </View>

        {/* Week pill toggle */}
        <TouchableOpacity
          onPress={onPeriodToggle}
          activeOpacity={0.75}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 5,
            backgroundColor: '#F4F4F6',
            borderRadius: 20,
            paddingHorizontal: 12, paddingVertical: 7,
          }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>{period}</Text>
          <Ionicons name="refresh-outline" size={13} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* ── Chart ───────────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row' }}>

        {/* Y-axis labels */}
        <View style={{ width: YAXIS_W, height: CHART_H, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 6 }}>
          {[...Y_TICKS].reverse().map(v => (
            <Text key={v} style={{ fontSize: 9.5, fontWeight: '500', color: '#CBD5E1' }}>
              {v === 0 ? '0' : `${v / 1000}k`}
            </Text>
          ))}
        </View>

        {/* SVG chart area */}
        <Svg width={CHART_W} height={CHART_H}>
          <Defs>
            {/* Gradient overlays for premium depth */}
            <LinearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#FB923C" stopOpacity="1" />
              <Stop offset="100%" stopColor="#EA580C" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0EA5E9" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#818CF8" stopOpacity="1" />
              <Stop offset="100%" stopColor="#4F46E5" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Horizontal grid lines */}
          {Y_TICKS.slice(1).map(v => (
            <Line
              key={v}
              x1={0} y1={yPos(v)}
              x2={CHART_W} y2={yPos(v)}
              stroke="#F1F5F9" strokeWidth={1}
            />
          ))}

          {/* Goal dashed line */}
          <Line
            x1={0} y1={goalY}
            x2={CHART_W} y2={goalY}
            stroke={C_GOAL_BG}
            strokeWidth={1.5}
            strokeDasharray="5,4"
            strokeOpacity={0.55}
          />

          {/* Goal pill label — sits on the dashed line */}
          {/* Rendered as SVG rect + text */}
          <Rect
            x={0} y={goalY - 10}
            width={36} height={20}
            rx={10} fill={C_GOAL_BG}
          />
          <SvgText
            x={18} y={goalY + 4}
            fontSize={8.5} fontWeight="700"
            fill="#FFFFFF" textAnchor="middle">
            {GOAL}
          </SvgText>

          {/* Stacked bars */}
          {DATA.map((day, i) => {
            const x = i * (BAR_W + GAP);

            const hFats    = (day.fats    / Y_MAX) * CHART_H;
            const hCarbs   = (day.carbs   / Y_MAX) * CHART_H;
            const hProtein = (day.protein / Y_MAX) * CHART_H;

            const yFats    = CHART_H - hFats;
            const yCarbs   = yFats - hCarbs;
            const yProtein = yCarbs - hProtein;

            return (
              <React.Fragment key={i}>
                {/* Fats — orange bottom */}
                {hFats > 0 && (
                  <Rect
                    x={x} y={yFats}
                    width={BAR_W} height={hFats}
                    rx={hCarbs === 0 && hProtein === 0 ? CORNER_R : 0}
                    ry={hCarbs === 0 && hProtein === 0 ? CORNER_R : 0}
                    fill="url(#gradOrange)"
                  />
                )}
                {/* Carbs — teal middle */}
                {hCarbs > 0 && (
                  <Rect
                    x={x} y={yCarbs}
                    width={BAR_W} height={hCarbs}
                    rx={hProtein === 0 ? CORNER_R : 0}
                    ry={hProtein === 0 ? CORNER_R : 0}
                    fill="url(#gradTeal)"
                  />
                )}
                {/* Protein — blue top */}
                {hProtein > 0 && (
                  <Rect
                    x={x} y={yProtein}
                    width={BAR_W} height={hProtein}
                    rx={CORNER_R} ry={CORNER_R}
                    fill="url(#gradBlue)"
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* X-axis day labels */}
          {DAYS.map((label, i) => (
            <SvgText
              key={label}
              x={i * (BAR_W + GAP) + BAR_W / 2}
              y={CHART_H + 14}
              fontSize={10} fontWeight="500"
              fill="#94A3B8" textAnchor="middle">
              {label}
            </SvgText>
          ))}
        </Svg>
      </View>

      {/* X-axis spacer */}
      <View style={{ height: 16 }} />

      {/* ── Legend ──────────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', gap: 16, justifyContent: 'center' }}>
        {[
          { color: C_ORANGE, label: 'Fats'    },
          { color: C_TEAL,   label: 'Carbs'   },
          { color: C_BLUE,   label: 'Protein' },
        ].map(item => (
          <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
            <Text style={{ fontSize: 11, fontWeight: '500', color: '#6B7280' }}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
