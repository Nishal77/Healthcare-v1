/**
 * HealthStatusCard — Ayurveda + Wearable Predictive Analysis
 * Wearable biometrics (HRV, SpO₂, Heart Rate) mapped through Ayurvedic
 * dosha framework with AI-generated remedy recommendations.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinear, Rect, Stop } from 'react-native-svg';

// ─── Prediction variants ──────────────────────────────────────────────────────

const PREDICTIONS = [
  {
    status:    'Vata Aggravation',
    focus:     'Nervous system · Dryness & fatigue rising',
    col1:      { value: '31ms',     label: 'HRV',        sub: 'Watch · ↓ Low'   },
    col2:      { value: 'Elevated', label: 'Vata Risk',  sub: 'Dosha Status'    },
    col3:      { top: 'SpO₂',       value: '96%'                                 },
    period:    'Last 4w',
    since:     'Since Jan 11',
    fill:      0.38,
    barFrom:   '#F59E0B',
    barMid:    '#AACC22',
    barTo:     '#22C55E',
    insight:   'Warm sesame abhyanga predicted to restore HRV by 22%',
    remedy:    'Ashwagandha · Sesame Oil',
    timeframe: '5 days',
    trend:     'down' as const,
  },
  {
    status:    'Pitta Harmony',
    focus:     'Metabolism · Digestion & energy optimal',
    col1:      { value: '68ms',     label: 'HRV',        sub: 'Watch · ↑ Good'  },
    col2:      { value: 'Balanced', label: 'Pitta',      sub: 'Dosha Status'    },
    col3:      { top: 'Steps',      value: '9,241'                               },
    period:    'Last 2w',
    since:     'Since Mar 2',
    fill:      0.86,
    barFrom:   '#84CC16',
    barMid:    '#22C55E',
    barTo:     '#15803D',
    insight:   'Sheetali pranayama predicted to sustain balance for 12 days',
    remedy:    'Amalaki · Sheetali',
    timeframe: '12 days',
    trend:     'up' as const,
  },
  {
    status:    'Kapha Sluggishness',
    focus:     'Metabolism focus · Low energy detected',
    col1:      { value: '82bpm',    label: 'Heart Rate', sub: 'Watch · ↑ High'  },
    col2:      { value: 'Elevated', label: 'Kapha Risk', sub: 'Dosha Status'    },
    col3:      { top: 'SpO₂',       value: '97%'                                 },
    period:    'Last 3w',
    since:     'Since Feb 20',
    fill:      0.48,
    barFrom:   '#F59E0B',
    barMid:    '#A3CC14',
    barTo:     '#84CC16',
    insight:   'Surya Namaskar daily can shift Kapha status in 5 days',
    remedy:    'Trikatu · Dry Ginger',
    timeframe: '5 days',
    trend:     'neutral' as const,
  },
] as const;

const D = PREDICTIONS[new Date().getHours() % PREDICTIONS.length];

// ─── Animated gradient bar ────────────────────────────────────────────────────

function GradientBar({ fill, from, mid, to }: {
  fill: number; from: string; mid: string; to: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: fill, duration: 1100, delay: 350, useNativeDriver: false,
    }).start();
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
            <SvgLinear id="g" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0"   stopColor={from} stopOpacity="1" />
              <Stop offset="0.5" stopColor={mid}  stopOpacity="1" />
              <Stop offset="1"   stopColor={to}   stopOpacity="1" />
            </SvgLinear>
          </Defs>
          <Rect x="0" y="0" width="100%" height={H} rx={H / 2} fill="url(#g)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// ─── Hairline vertical divider ────────────────────────────────────────────────

function VDivider() {
  return (
    <View style={{
      width: 1, backgroundColor: 'rgba(0,0,0,0.07)',
      alignSelf: 'stretch', marginHorizontal: 14,
    }} />
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HealthStatusCard() {
  const mount = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(mount, {
      toValue: 1, useNativeDriver: true, damping: 20, stiffness: 180, delay: 60,
    }).start();
  }, []);

  const trendIcon  = D.trend === 'up'   ? 'trending-up-outline'
                   : D.trend === 'down' ? 'trending-down-outline'
                   :                      'remove-outline';
  const trendColor = D.trend === 'up'   ? '#16A34A'
                   : D.trend === 'down' ? '#EF4444'
                   :                      '#F59E0B';

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}>
      <Animated.View style={{
        opacity:   mount,
        transform: [{ translateY: mount.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
      }}>
        <View style={{
          backgroundColor:  '#FFFFFF',
          borderRadius:     22,
          paddingHorizontal:20,
          paddingTop:       20,
          paddingBottom:    22,
          shadowColor:      '#000',
          shadowOffset:     { width: 0, height: 4 },
          shadowOpacity:    0.07,
          shadowRadius:     18,
          elevation:        4,
          borderWidth:      1,
          borderColor:      'rgba(0,0,0,0.055)',
        }}>

          {/* ── Top row: both badges + circular arrow in ONE line ────── */}
          <View style={{
            flexDirection:  'row',
            alignItems:     'center',
            justifyContent: 'space-between',
            marginBottom:   14,
          }}>
            {/* Left: badges side by side */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1, flexWrap: 'nowrap' }}>

              {/* Predictive Analysis badge */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: '#F0FDF4',
                borderRadius: 30,
                paddingHorizontal: 9, paddingVertical: 5,
                borderWidth: 1, borderColor: 'rgba(34,197,94,0.22)',
              }}>
                <Ionicons name="sparkles" size={10} color="#16A34A" />
                <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#16A34A', letterSpacing: 0.4 }}>
                  PREDICTIVE
                </Text>
              </View>

              {/* Watch synced pill */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: '#F8F9FA',
                borderRadius: 30,
                paddingHorizontal: 9, paddingVertical: 5,
                borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
              }}>
                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#22C55E' }} />
                <Ionicons name="watch-outline" size={10} color="#6B7280" />
                <Text style={{ fontSize: 9.5, fontWeight: '600', color: '#6B7280' }}>
                  Watch Live
                </Text>
              </View>
            </View>

            {/* Circular arrow — right */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: 38, height: 38, borderRadius: 19,
                backgroundColor: '#F4F4F4',
                alignItems: 'center', justifyContent: 'center',
                marginLeft: 10,
              }}>
              <Ionicons
                name="arrow-up-outline"
                size={17}
                color="#0D1117"
                style={{ transform: [{ rotate: '45deg' }] }}
              />
            </TouchableOpacity>
          </View>

          {/* ── Title + focus ─────────────────────────────────────────── */}
          <Text style={{
            fontSize: 22, fontWeight: '700',
            color: '#0D1117', letterSpacing: -0.6, lineHeight: 28,
          }}>
            {D.status}
          </Text>
          <Text style={{
            fontSize: 13, color: '#9CA3AF', marginTop: 4, lineHeight: 18,
          }}>
            {D.focus}
          </Text>

          {/* ── 3-column metrics ──────────────────────────────────────── */}
          <View style={{
            flexDirection: 'row', alignItems: 'flex-start',
            marginTop: 20, marginBottom: 20,
          }}>
            {/* Col 1 — primary wearable metric, large */}
            <View style={{ flex: 1.1 }}>
              <Text style={{
                fontSize: 22, fontWeight: '700',
                color: '#0D1117', letterSpacing: -0.5, lineHeight: 26,
              }}>
                {D.col1.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{D.col1.label}</Text>
              <Text style={{ fontSize: 11, color: '#C4C4C4', marginTop: 1 }}>{D.col1.sub}</Text>
            </View>

            <VDivider />

            {/* Col 2 — Dosha interpretation */}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16, fontWeight: '700',
                color: '#0D1117', letterSpacing: -0.3, lineHeight: 22,
              }}>
                {D.col2.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{D.col2.label}</Text>
              <Text style={{ fontSize: 11, color: '#C4C4C4', marginTop: 1 }}>{D.col2.sub}</Text>
            </View>

            <VDivider />

            {/* Col 3 — inverted: small label on top, bold value below */}
            <View style={{ flex: 0.85 }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 18 }}>{D.col3.top}</Text>
              <Text style={{
                fontSize: 18, fontWeight: '700',
                color: '#0D1117', letterSpacing: -0.3, marginTop: 3,
              }}>
                {D.col3.value}
              </Text>
            </View>
          </View>

          {/* ── Dosha trajectory bar ──────────────────────────────────── */}
          <GradientBar fill={D.fill} from={D.barFrom} mid={D.barMid} to={D.barTo} />

          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', marginTop: 8,
          }}>
            <Text style={{ fontSize: 11.5, color: '#C4C4C4' }}>{D.period}</Text>
            <Text style={{ fontSize: 11.5, color: '#C4C4C4' }}>{D.since}</Text>
          </View>

          {/* ── AI Insight + Ayurvedic remedy card ───────────────────── */}
          <View style={{
            marginTop:       18,
            backgroundColor: '#FAFAFA',
            borderRadius:    16,
            borderWidth:     1,
            borderColor:     'rgba(0,0,0,0.055)',
            overflow:        'hidden',
          }}>

            {/* Insight row */}
            <View style={{
              flexDirection: 'row', alignItems: 'flex-start',
              gap: 12, padding: 14,
            }}>
              <View style={{
                width: 34, height: 34, borderRadius: 11,
                backgroundColor: trendColor + '15',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
              }}>
                <Ionicons name={trendIcon} size={16} color={trendColor} />
              </View>
              <Text style={{
                fontSize: 13, color: '#374151',
                lineHeight: 19, flex: 1, fontWeight: '500',
              }}>
                {D.insight}
              </Text>
            </View>

            {/* Remedy strip — two-row layout so nothing clips */}
            <View style={{
              borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.055)',
              backgroundColor: '#F5F5F5',
              paddingHorizontal: 14, paddingVertical: 11,
            }}>
              {/* Row 1: leaf + label */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <Ionicons name="leaf-outline" size={12} color="#2C6E49" />
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>
                  Ayurvedic Recommendation
                </Text>
              </View>

              {/* Row 2: remedy names + timeframe pill */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Text style={{
                  fontSize: 13, fontWeight: '700', color: '#2C6E49',
                  flex: 1, marginRight: 10,
                }} numberOfLines={1}>
                  {D.remedy}
                </Text>
                <View style={{
                  backgroundColor: '#0D1117',
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  flexShrink: 0,
                }}>
                  <Text style={{
                    fontSize: 11, fontWeight: '700', color: '#FFFFFF',
                  }}>
                    In {D.timeframe}
                  </Text>
                </View>
              </View>
            </View>

          </View>

        </View>
      </Animated.View>
    </View>
  );
}
