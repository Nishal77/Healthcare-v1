/**
 * HealthStatusCard — Ayurveda + Wearable Predictive Analysis
 *
 * Metrics sourced from wearable (HRV, SpO₂, Heart Rate, Steps)
 * interpreted through Ayurvedic dosha framework with AI forecast.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinear, Rect, Stop } from 'react-native-svg';

// ─── Prediction variants (wearable + Ayurveda data) ──────────────────────────

const PREDICTIONS = [
  {
    // Wearable shows low HRV + fragmented sleep → Vata aggravation forecast
    status:  'Vata Aggravation',
    focus:   'Nervous system • Dryness & fatigue rising',
    col1:    { value: '31ms',    label: 'HRV',     sub: 'Watch • ↓ Low'  },
    col2:    { value: 'Elevated', label: 'Vata',   sub: 'Dosha Risk'     },
    col3:    { top: 'SpO₂',      value: '96%'                             },
    period:  'Last 4w',
    since:   'Since Jan 11',
    fill:    0.38,
    barFrom: '#F59E0B',
    barMid:  '#AACC22',
    barTo:   '#22C55E',
    insight: 'Ashwagandha + warm sesame abhyanga predicted to restore HRV by 22% in 5 days',
    remedy:  'Ashwagandha · Sesame Oil',
    trend:   'down' as const,
    timeframe: '5 days',
  },
  {
    // Wearable shows strong HRV + high steps → Pitta in harmony
    status:  'Pitta Harmony',
    focus:   'Metabolism • Digestion & energy optimal',
    col1:    { value: '68ms',    label: 'HRV',     sub: 'Watch • ↑ Good' },
    col2:    { value: 'Balanced', label: 'Pitta',  sub: 'Dosha Level'    },
    col3:    { top: 'Steps',      value: '9,241'                          },
    period:  'Last 2w',
    since:   'Since Mar 2',
    fill:    0.86,
    barFrom: '#84CC16',
    barMid:  '#22C55E',
    barTo:   '#15803D',
    insight: 'Coconut-rich diet + evening Sheetali pranayama predicted to sustain balance for 12 days',
    remedy:  'Amalaki · Sheetali',
    trend:   'up' as const,
    timeframe: '12 days',
  },
  {
    // Wearable shows elevated resting HR + low steps → Kapha sluggishness
    status:  'Kapha Sluggishness',
    focus:   'Metabolism focus • Low energy detected',
    col1:    { value: '82bpm',   label: 'Heart Rate', sub: 'Watch • ↑ High' },
    col2:    { value: 'Elevated', label: 'Kapha',    sub: 'Dosha Risk'      },
    col3:    { top: 'SpO₂',       value: '97%'                               },
    period:  'Last 3w',
    since:   'Since Feb 20',
    fill:    0.48,
    barFrom: '#F59E0B',
    barMid:  '#A3CC14',
    barTo:   '#84CC16',
    insight: 'Trikatu herb + 25 min Surya Namaskar predicted to shift Kapha in 5 days',
    remedy:  'Trikatu · Dry Ginger',
    trend:   'neutral' as const,
    timeframe: '5 days',
  },
] as const;

const D = PREDICTIONS[new Date().getHours() % PREDICTIONS.length];

// ─── Gradient bar ─────────────────────────────────────────────────────────────

function GradientBar({ fill, from, mid, to }: {
  fill: number; from: string; mid: string; to: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: fill, duration: 1100, delay: 350, useNativeDriver: false }).start();
  }, []);
  const H = 11;
  return (
    <View style={{ height: H, backgroundColor: '#EFEFEF', borderRadius: H / 2, overflow: 'hidden' }}>
      <Animated.View style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        borderRadius: H / 2, overflow: 'hidden',
        width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
      }}>
        <Svg height={H} width="100%" style={{ position: 'absolute' }}>
          <Defs>
            <SvgLinear id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0"   stopColor={from} stopOpacity="1" />
              <Stop offset="0.5" stopColor={mid}  stopOpacity="1" />
              <Stop offset="1"   stopColor={to}   stopOpacity="1" />
            </SvgLinear>
          </Defs>
          <Rect x="0" y="0" width="100%" height={H} rx={H / 2} fill="url(#grad)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// ─── Vertical divider ─────────────────────────────────────────────────────────

function VDivider() {
  return (
    <View style={{
      width: 1, backgroundColor: 'rgba(0,0,0,0.07)',
      alignSelf: 'stretch', marginHorizontal: 14,
    }} />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HealthStatusCard() {
  const mount = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(mount, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 180, delay: 60 }).start();
  }, []);

  const trendIcon  = D.trend === 'up' ? 'trending-up-outline' : D.trend === 'down' ? 'trending-down-outline' : 'remove-outline';
  const trendColor = D.trend === 'up' ? '#16A34A' : D.trend === 'down' ? '#EF4444' : '#F59E0B';

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}>
      <Animated.View style={{
        opacity:   mount,
        transform: [{ translateY: mount.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
      }}>
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius:    22,
          paddingHorizontal: 20,
          paddingTop:      20,
          paddingBottom:   22,
          shadowColor:     '#000',
          shadowOffset:    { width: 0, height: 4 },
          shadowOpacity:   0.07,
          shadowRadius:    18,
          elevation:       4,
          borderWidth:     1,
          borderColor:     'rgba(0,0,0,0.055)',
        }}>

          {/* ── Header ───────────────────────────────────────────────── */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>

              {/* Badge row: AI badge + wearable sync pill */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                {/* Predictive Analysis badge */}
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 5,
                  backgroundColor: '#F0FDF4', borderRadius: 30,
                  paddingHorizontal: 10, paddingVertical: 4,
                  borderWidth: 1, borderColor: 'rgba(34,197,94,0.22)',
                }}>
                  <Ionicons name="sparkles" size={11} color="#16A34A" />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#16A34A', letterSpacing: 0.5 }}>
                    PREDICTIVE ANALYSIS
                  </Text>
                </View>

                {/* Wearable sync indicator */}
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  backgroundColor: '#F8F9FA', borderRadius: 30,
                  paddingHorizontal: 9, paddingVertical: 4,
                  borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
                }}>
                  <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#22C55E' }} />
                  <Ionicons name="watch-outline" size={10} color="#6B7280" />
                  <Text style={{ fontSize: 10, fontWeight: '600', color: '#6B7280', letterSpacing: 0.2 }}>
                    Watch Synced
                  </Text>
                </View>
              </View>

              <Text style={{ fontSize: 22, fontWeight: '700', color: '#0D1117', letterSpacing: -0.6, lineHeight: 28 }}>
                {D.status}
              </Text>
              <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4, lineHeight: 18 }}>
                {D.focus}
              </Text>
            </View>

            {/* Circular arrow */}
            <TouchableOpacity activeOpacity={0.7} style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: '#F4F4F4', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="arrow-up-outline" size={18} color="#0D1117" style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          </View>

          {/* ── 3-column metrics ─────────────────────────────────────── */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 20, marginBottom: 22 }}>

            {/* Col 1 — wearable metric, large value */}
            <View style={{ flex: 1.1 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#0D1117', letterSpacing: -0.5, lineHeight: 26 }}>
                {D.col1.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{D.col1.label}</Text>
              <Text style={{ fontSize: 11, color: '#C4C4C4', marginTop: 1 }}>{D.col1.sub}</Text>
            </View>

            <VDivider />

            {/* Col 2 — dosha interpretation */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0D1117', letterSpacing: -0.3, lineHeight: 22 }}>
                {D.col2.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{D.col2.label}</Text>
              <Text style={{ fontSize: 11, color: '#C4C4C4', marginTop: 1 }}>{D.col2.sub}</Text>
            </View>

            <VDivider />

            {/* Col 3 — inverted: label on top, value below */}
            <View style={{ flex: 0.9 }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 18 }}>{D.col3.top}</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#0D1117', letterSpacing: -0.3, marginTop: 3 }}>
                {D.col3.value}
              </Text>
            </View>
          </View>

          {/* ── Dosha trajectory bar ─────────────────────────────────── */}
          <GradientBar fill={D.fill} from={D.barFrom} mid={D.barMid} to={D.barTo} />

          {/* Period labels */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 }}>
            <Text style={{ fontSize: 11.5, color: '#C4C4C4' }}>{D.period}</Text>
            <Text style={{ fontSize: 11.5, color: '#C4C4C4' }}>{D.since}</Text>
          </View>

          {/* ── AI Insight + Ayurvedic remedy ────────────────────────── */}
          <View style={{
            marginTop: 18,
            backgroundColor: '#FAFAFA',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.055)',
            overflow: 'hidden',
          }}>

            {/* Main insight row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
              <View style={{
                width: 34, height: 34, borderRadius: 11,
                backgroundColor: trendColor + '15',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Ionicons name={trendIcon} size={17} color={trendColor} />
              </View>
              <Text style={{ fontSize: 12.5, color: '#374151', lineHeight: 18, flex: 1, fontWeight: '500' }}>
                {D.insight}
              </Text>
            </View>

            {/* Ayurvedic remedy strip */}
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.055)',
              paddingHorizontal: 14, paddingVertical: 10,
              backgroundColor: '#F5F5F5',
            }}>
              <Ionicons name="leaf-outline" size={13} color="#2C6E49" />
              <Text style={{ fontSize: 11.5, color: '#6B7280', fontWeight: '500' }}>
                Recommended:{' '}
                <Text style={{ color: '#2C6E49', fontWeight: '700' }}>{D.remedy}</Text>
              </Text>
              <View style={{ flex: 1 }} />
              <View style={{
                backgroundColor: '#0D1117', borderRadius: 20,
                paddingHorizontal: 10, paddingVertical: 4,
              }}>
                <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#FFFFFF' }}>
                  In {D.timeframe}
                </Text>
              </View>
            </View>
          </View>

        </View>
      </Animated.View>
    </View>
  );
}
