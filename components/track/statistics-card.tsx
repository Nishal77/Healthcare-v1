import React, { useRef, useState } from 'react';
import { Animated, Modal, Pressable, Text, TouchableOpacity, View, LayoutChangeEvent } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, {
  Defs, Line, LinearGradient as SvgLinearGradient,
  Rect, Stop, Text as SvgText,
} from 'react-native-svg';

// ─── Static data (macro breakdown per day) ───────────────────────────────────

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const DATA = [
  { fats: 190, carbs: 110, protein:   0 },  // Mo
  { fats: 310, carbs: 190, protein:   0 },  // Tu
  { fats: 760, carbs: 590, protein: 680 },  // We
  { fats: 830, carbs: 650, protein: 980 },  // Th
  { fats: 240, carbs: 140, protein:  90 },  // Fr
  { fats: 310, carbs: 210, protein: 150 },  // Sa
  { fats:  90, carbs:   0, protein:   0 },  // Su
];

const Y_MAX   = 3000;
const GOAL    = 2520;
const Y_TICKS = [0, 1000, 2000, 3000];

// ─── Layout constants ────────────────────────────────────────────────────────

const CARD_PADDING = 20;
const YAXIS_W      = 34;
const CHART_H      = 170;
const BAR_W        = 26;
const CORNER_R     = 5;

function yPos(value: number, h: number) {
  return h - (value / Y_MAX) * h;
}

// ─── Period options ──────────────────────────────────────────────────────────

type Period = 'Day' | 'Week' | 'Month';
const PERIODS: Period[] = ['Day', 'Week', 'Month'];

// ─── Period Dropdown ─────────────────────────────────────────────────────────

function PeriodDropdown({
  selected,
  onChange,
}: {
  selected: Period;
  onChange: (p: Period) => void;
}) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  function toggle() {
    if (!open) {
      setOpen(true);
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 260 }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => setOpen(false));
    }
  }

  function select(p: Period) {
    onChange(p);
    Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => setOpen(false));
  }

  const scale   = anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });
  const opacity = anim;
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });

  return (
    <View style={{ position: 'relative', zIndex: 99 }}>
      {/* Trigger pill */}
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 5,
          backgroundColor: open ? '#E8F0EB' : '#F4F4F6',
          borderRadius: 20,
          paddingHorizontal: 14, paddingVertical: 8,
          borderWidth: open ? 1 : 0,
          borderColor: '#2C6E49',
        }}>
        <Text style={{
          fontSize: 13, fontWeight: '600',
          color: open ? '#2C6E49' : '#374151',
        }}>
          {selected}
        </Text>
        <Animated.View style={{
          transform: [{ rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }],
        }}>
          <Ionicons name="chevron-down" size={13} color={open ? '#2C6E49' : '#6B7280'} />
        </Animated.View>
      </TouchableOpacity>

      {/* Dropdown panel */}
      {open && (
        <Animated.View style={{
          position: 'absolute',
          top: 44, right: 0,
          width: 130,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          paddingVertical: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.13,
          shadowRadius: 20,
          elevation: 14,
          opacity,
          transform: [{ scale }, { translateY }],
        }}>
          {PERIODS.map((p, i) => {
            const isSelected = p === selected;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => select(p)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 11,
                  backgroundColor: isSelected ? '#F0FBF5' : 'transparent',
                  marginHorizontal: 4,
                  borderRadius: 10,
                  marginBottom: i < PERIODS.length - 1 ? 2 : 0,
                }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? '#2C6E49' : '#374151',
                }}>
                  {p}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={15} color="#2C6E49" />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StatisticsCard() {
  const [period, setPeriod] = useState<Period>('Week');
  // Measure the true inner width at runtime — works on both iOS & Android
  const [chartW, setChartW] = useState(0);

  function onLayout(e: LayoutChangeEvent) {
    // Full inner content width minus the y-axis column
    setChartW(e.nativeEvent.layout.width - YAXIS_W);
  }

  const gap    = chartW > 0 ? (chartW - BAR_W * 7) / 6 : 0;
  const goalY  = yPos(GOAL, CHART_H);

  return (
    <View style={{
      marginHorizontal: CARD_PADDING,
      marginBottom: 24,
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: CARD_PADDING,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 18,
      elevation: 5,
      overflow: 'visible',
    }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={{
        flexDirection: 'row', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 16,
      }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#0D1117', letterSpacing: -0.4 }}>
            Statistics
          </Text>
          <Text style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 3, lineHeight: 16 }}>
            Recommended Nutritional Value and Statistics
          </Text>
        </View>

        <PeriodDropdown selected={period} onChange={setPeriod} />
      </View>

      {/* ── Chart area — onLayout measures exact usable width ───────── */}
      <View onLayout={onLayout}>
        {chartW > 0 && (
          <>
            {/* Row: y-axis + SVG */}
            <View style={{ flexDirection: 'row' }}>

              {/* Y-axis labels */}
              <View style={{
                width: YAXIS_W, height: CHART_H,
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

              {/* SVG bars + grid */}
              <Svg width={chartW} height={CHART_H}>
                <Defs>
                  <SvgLinearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FB923C" />
                    <Stop offset="100%" stopColor="#EA580C" />
                  </SvgLinearGradient>
                  <SvgLinearGradient id="gTeal" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#38BDF8" />
                    <Stop offset="100%" stopColor="#0EA5E9" />
                  </SvgLinearGradient>
                  <SvgLinearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#818CF8" />
                    <Stop offset="100%" stopColor="#4F46E5" />
                  </SvgLinearGradient>
                </Defs>

                {/* Grid lines */}
                {Y_TICKS.slice(1).map(v => (
                  <Line
                    key={v}
                    x1={0} y1={yPos(v, CHART_H)}
                    x2={chartW} y2={yPos(v, CHART_H)}
                    stroke="#F1F5F9" strokeWidth={1}
                  />
                ))}

                {/* Goal dashed line */}
                <Line
                  x1={0} y1={goalY}
                  x2={chartW} y2={goalY}
                  stroke="#2C6E49"
                  strokeWidth={1.5}
                  strokeDasharray="6,5"
                  strokeOpacity={0.5}
                />

                {/* Goal pill (SVG rect + text) */}
                <Rect x={0} y={goalY - 11} width={40} height={22} rx={11} fill="#2C6E49" />
                <SvgText
                  x={20} y={goalY + 4.5}
                  fontSize={8.5} fontWeight="700"
                  fill="#FFFFFF" textAnchor="middle">
                  {GOAL}
                </SvgText>

                {/* Stacked bars */}
                {DATA.map((d, i) => {
                  const x = i * (BAR_W + gap);

                  const hF = (d.fats    / Y_MAX) * CHART_H;
                  const hC = (d.carbs   / Y_MAX) * CHART_H;
                  const hP = (d.protein / Y_MAX) * CHART_H;

                  const yF = CHART_H - hF;
                  const yC = yF - hC;
                  const yP = yC - hP;

                  const topOnly = hC === 0 && hP === 0;
                  const noTop   = hP === 0;

                  return (
                    <React.Fragment key={i}>
                      {hF > 0 && (
                        <Rect
                          x={x} y={yF} width={BAR_W} height={hF}
                          rx={topOnly ? CORNER_R : 0} ry={topOnly ? CORNER_R : 0}
                          fill="url(#gOrange)"
                        />
                      )}
                      {hC > 0 && (
                        <Rect
                          x={x} y={yC} width={BAR_W} height={hC}
                          rx={noTop ? CORNER_R : 0} ry={noTop ? CORNER_R : 0}
                          fill="url(#gTeal)"
                        />
                      )}
                      {hP > 0 && (
                        <Rect
                          x={x} y={yP} width={BAR_W} height={hP}
                          rx={CORNER_R} ry={CORNER_R}
                          fill="url(#gBlue)"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </Svg>
            </View>

            {/* X-axis day labels — native View row, perfectly aligned */}
            <View style={{ flexDirection: 'row', marginLeft: YAXIS_W, marginTop: 10 }}>
              {DAYS.map((label, i) => (
                <View
                  key={label}
                  style={{
                    width: BAR_W,
                    marginRight: i < DAYS.length - 1 ? gap : 0,
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 11, fontWeight: '500', color: '#94A3B8' }}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      {/* ── Legend ──────────────────────────────────────────────────── */}
      <View style={{
        flexDirection: 'row', gap: 18,
        justifyContent: 'center', marginTop: 16,
      }}>
        {[
          { color: '#F97316', label: 'Fats'    },
          { color: '#22D3EE', label: 'Carbs'   },
          { color: '#6366F1', label: 'Protein' },
        ].map(item => (
          <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{
              width: 9, height: 9, borderRadius: 4.5,
              backgroundColor: item.color,
            }} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280' }}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
