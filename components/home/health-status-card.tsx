/**
 * HealthStatusCard — Predictive Analysis
 * Shows an AI-driven health forecast:
 *  • Status title + focus category
 *  • 3-column metric row (col 3 inverted — label on top, value below)
 *  • Animated gradient bar representing predicted trajectory
 *  • Period labels + AI insight note
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinear, Rect, Stop } from 'react-native-svg';

// ─── Prediction data ──────────────────────────────────────────────────────────

const PREDICTIONS = [
  {
    status:  'Vata Imbalance',
    focus:   'Energy focus • Dryness detected',
    col1:    { value: 'High',     label: 'Stress',   sub: 'Level'    },
    col2:    { value: 'Moderate', label: 'HRV',      sub: 'Status'   },
    col3:    { top: 'Score',      value: '62 pts'                     },
    period:  'Last 4w',
    since:   'Since Jan 11',
    fill:    0.62,
    barFrom: '#D4E84A',
    barMid:  '#84CC16',
    barTo:   '#22C55E',
    insight: 'Vata likely to worsen 18% next week without rest',
    trend:   'down' as const,
  },
  {
    status:  'Optimal Balance',
    focus:   'Pitta harmony • Digestion strong',
    col1:    { value: 'Strong',   label: 'Digestion', sub: 'Status'  },
    col2:    { value: 'Balanced', label: 'Energy',    sub: 'Level'   },
    col3:    { top: 'Steps',      value: '8,241'                      },
    period:  'Last 2w',
    since:   'Since Mar 2',
    fill:    0.87,
    barFrom: '#84CC16',
    barMid:  '#22C55E',
    barTo:   '#15803D',
    insight: 'Predicted to maintain balance for next 10 days',
    trend:   'up' as const,
  },
  {
    status:  'Kapha Sluggishness',
    focus:   'Metabolism focus • Low energy',
    col1:    { value: 'Low',      label: 'Activity',  sub: 'Level'   },
    col2:    { value: 'Trending', label: 'Weight',    sub: 'Up'      },
    col3:    { top: 'Sleep',      value: '9.2h'                       },
    period:  'Last 3w',
    since:   'Since Feb 20',
    fill:    0.48,
    barFrom: '#F59E0B',
    barMid:  '#A3CC14',
    barTo:   '#84CC16',
    insight: 'Activity increase of 20 min/day could shift status in 5 days',
    trend:   'neutral' as const,
  },
] as const;

const D = PREDICTIONS[new Date().getHours() % PREDICTIONS.length];

// ─── Gradient progress bar ────────────────────────────────────────────────────

function GradientBar({ fill, from, mid, to }: {
  fill: number;
  from: string;
  mid:  string;
  to:   string;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue:         fill,
      duration:        1100,
      delay:           350,
      useNativeDriver: false,
    }).start();
  }, []);

  const H = 11;

  return (
    <View style={{ height: H, backgroundColor: '#EFEFEF', borderRadius: H / 2, overflow: 'hidden' }}>
      <Animated.View
        style={{
          position:     'absolute',
          top: 0, left: 0, bottom: 0,
          borderRadius: H / 2,
          overflow:     'hidden',
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
      width: 1,
      backgroundColor: 'rgba(0,0,0,0.07)',
      alignSelf: 'stretch',
      marginHorizontal: 16,
    }} />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HealthStatusCard() {
  const mount = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(mount, {
      toValue:         1,
      useNativeDriver: true,
      damping:         20,
      stiffness:       180,
      delay:           60,
    }).start();
  }, []);

  const trendIcon =
    D.trend === 'up'      ? 'trending-up-outline'   :
    D.trend === 'down'    ? 'trending-down-outline'  :
                            'remove-outline';

  const trendColor =
    D.trend === 'up'      ? '#16A34A' :
    D.trend === 'down'    ? '#EF4444' :
                            '#F59E0B';

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}>
      <Animated.View
        style={{
          opacity:   mount,
          transform: [{ translateY: mount.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
        }}>

        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius:    22,
          paddingHorizontal:20,
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

          {/* ── Header ─────────────────────────────────────────────── */}
          <View style={{
            flexDirection:  'row',
            alignItems:     'flex-start',
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1, paddingRight: 12 }}>

              {/* AI badge */}
              <View style={{
                alignSelf:         'flex-start',
                flexDirection:     'row',
                alignItems:        'center',
                gap:               5,
                backgroundColor:   '#F0FDF4',
                borderRadius:      30,
                paddingHorizontal: 10,
                paddingVertical:   4,
                marginBottom:      10,
                borderWidth:       1,
                borderColor:       'rgba(34,197,94,0.2)',
              }}>
                <Ionicons name="sparkles" size={11} color="#16A34A" />
                <Text style={{ fontSize: 10.5, fontWeight: '700', color: '#16A34A', letterSpacing: 0.4 }}>
                  PREDICTIVE ANALYSIS
                </Text>
              </View>

              <Text style={{
                fontSize:      22,
                fontWeight:    '700',
                color:         '#0D1117',
                letterSpacing: -0.6,
                lineHeight:    28,
              }}>
                {D.status}
              </Text>
              <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4, lineHeight: 18 }}>
                {D.focus}
              </Text>
            </View>

            {/* Circular arrow */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width:           40,
                height:          40,
                borderRadius:    20,
                backgroundColor: '#F4F4F4',
                alignItems:      'center',
                justifyContent:  'center',
              }}>
              <Ionicons
                name="arrow-up-outline"
                size={18}
                color="#0D1117"
                style={{ transform: [{ rotate: '45deg' }] }}
              />
            </TouchableOpacity>
          </View>

          {/* ── Metrics row ────────────────────────────────────────── */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 22, marginBottom: 22 }}>

            {/* Col 1 — large value */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#0D1117', letterSpacing: -0.5, lineHeight: 26 }}>
                {D.col1.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{D.col1.label}</Text>
              <Text style={{ fontSize: 12, color: '#C4C4C4' }}>{D.col1.sub}</Text>
            </View>

            <VDivider />

            {/* Col 2 */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0D1117', letterSpacing: -0.3, lineHeight: 22 }}>
                {D.col2.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{D.col2.label}</Text>
              <Text style={{ fontSize: 12, color: '#C4C4C4' }}>{D.col2.sub}</Text>
            </View>

            <VDivider />

            {/* Col 3 — inverted (label on top, value below) */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 18 }}>{D.col3.top}</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#0D1117', letterSpacing: -0.3, marginTop: 3 }}>
                {D.col3.value}
              </Text>
            </View>
          </View>

          {/* ── Gradient bar ───────────────────────────────────────── */}
          <GradientBar fill={D.fill} from={D.barFrom} mid={D.barMid} to={D.barTo} />

          {/* Period labels */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 }}>
            <Text style={{ fontSize: 11.5, color: '#C4C4C4' }}>{D.period}</Text>
            <Text style={{ fontSize: 11.5, color: '#C4C4C4' }}>{D.since}</Text>
          </View>

          {/* ── AI Insight note ────────────────────────────────────── */}
          <View style={{
            flexDirection:     'row',
            alignItems:        'center',
            gap:               8,
            marginTop:         18,
            backgroundColor:   '#FAFAFA',
            borderRadius:      14,
            paddingHorizontal: 14,
            paddingVertical:   12,
            borderWidth:       1,
            borderColor:       'rgba(0,0,0,0.055)',
          }}>
            <View style={{
              width:           30,
              height:          30,
              borderRadius:    10,
              backgroundColor: trendColor + '15',
              alignItems:      'center',
              justifyContent:  'center',
              flexShrink:      0,
            }}>
              <Ionicons name={trendIcon} size={16} color={trendColor} />
            </View>
            <Text style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 18, flex: 1 }}>
              {D.insight}
            </Text>
          </View>

        </View>
      </Animated.View>
    </View>
  );
}
