/**
 * HealthStatusCard
 * Premium health overview card — replicates the reference UI style.
 * Shows current health status, three key metrics, a gradient progress bar,
 * and a doctor appointment CTA row.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

// ─── Status variants ──────────────────────────────────────────────────────────

const STATUSES = [
  {
    status:     'Vata Imbalance',
    focus:      'Energy focus  •  Dryness detected',
    score:      62,
    scoreLabel: 'Health Score',
    metrics: [
      { label: 'Stress',  value: 'High',     sub: 'Level'    },
      { label: 'Sleep',   value: 'Moderate', sub: 'Quality'  },
      { label: 'Hydration', value: '68%',    sub: 'Today'    },
    ],
    since:     'Since Jan 11',
    period:    'Last 4w',
    barColors: ['#F59E0B', '#84CC16', '#22C55E'],
    barFill:   0.62,
    doctors:   24,
    cta:       'Book Consultation',
  },
  {
    status:     'Optimal Balance',
    focus:      'Pitta harmony  •  Digestion strong',
    score:      87,
    scoreLabel: 'Wellness Score',
    metrics: [
      { label: 'Digestion', value: 'Strong',  sub: 'Status'  },
      { label: 'Energy',    value: 'Balanced', sub: 'Level'  },
      { label: 'Steps',     value: '8,241',   sub: 'Today'   },
    ],
    since:     'Since Mar 2',
    period:    'Last 2w',
    barColors: ['#22C55E', '#16A34A', '#15803D'],
    barFill:   0.87,
    doctors:   18,
    cta:       'View Progress',
  },
  {
    status:     'Kapha Sluggishness',
    focus:      'Metabolism focus  •  Low energy',
    score:      48,
    scoreLabel: 'Health Score',
    metrics: [
      { label: 'Activity', value: 'Low',     sub: 'Level'    },
      { label: 'Weight',   value: 'Trending', sub: 'Up'      },
      { label: 'Sleep',    value: '9.2h',    sub: 'Average'  },
    ],
    since:     'Since Feb 20',
    period:    'Last 3w',
    barColors: ['#EF4444', '#F97316', '#F59E0B'],
    barFill:   0.48,
    doctors:   31,
    cta:       'Book Consultation',
  },
] as const;

// Pick by hour so it feels "live"
const DATA = STATUSES[new Date().getHours() % STATUSES.length];

// ─── Gradient progress bar using SVG ─────────────────────────────────────────

function GradientBar({ fill, colors }: { fill: number; colors: readonly string[] }) {
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue:         fill,
      duration:        900,
      delay:           300,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={{ height: 8, backgroundColor: '#F3F4F6', borderRadius: 6, overflow: 'hidden' }}>
      <Animated.View
        style={{
          position:     'absolute',
          top: 0, left: 0, bottom: 0,
          borderRadius: 6,
          width:        animWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}>
        <Svg height="8" width="100%" style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0"   stopColor={colors[0]} stopOpacity="1" />
              <Stop offset="0.5" stopColor={colors[1]} stopOpacity="1" />
              <Stop offset="1"   stopColor={colors[2]} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="8" rx="6" fill="url(#bar)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// ─── Doctor avatar stack ──────────────────────────────────────────────────────

const AVATAR_COLORS = ['#2C6E49', '#0A3040', '#3D1212', '#271650'];

function DoctorAvatars({ count }: { count: number }) {
  const initials = ['DA', 'SR', 'MK'];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {initials.map((ini, i) => (
        <View
          key={ini}
          style={{
            width:           32,
            height:          32,
            borderRadius:    16,
            backgroundColor: AVATAR_COLORS[i],
            borderWidth:     2,
            borderColor:     '#FFFFFF',
            alignItems:      'center',
            justifyContent:  'center',
            marginLeft:      i === 0 ? 0 : -10,
            zIndex:          3 - i,
          }}>
          <Text style={{ fontSize: 9, fontWeight: '700', color: '#FFFFFF' }}>{ini}</Text>
        </View>
      ))}
      {/* +N bubble */}
      <View
        style={{
          width:           32,
          height:          32,
          borderRadius:    16,
          backgroundColor: '#F3F4F6',
          borderWidth:     2,
          borderColor:     '#FFFFFF',
          alignItems:      'center',
          justifyContent:  'center',
          marginLeft:      -10,
        }}>
        <Text style={{ fontSize: 9, fontWeight: '700', color: '#6B7280' }}>
          +{count - 3}
        </Text>
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface HealthStatusCardProps {
  onAppointmentPress?: () => void;
}

export function HealthStatusCard({ onAppointmentPress }: HealthStatusCardProps) {
  const mountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(mountAnim, {
      toValue:         1,
      useNativeDriver: true,
      damping:         18,
      stiffness:       160,
      delay:           80,
    }).start();
  }, []);

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}>
      <Animated.View
        style={{
          opacity:   mountAnim,
          transform: [{ translateY: mountAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        }}>

        {/* ── Main status card ─────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius:    22,
            padding:         20,
            shadowColor:     '#000',
            shadowOffset:    { width: 0, height: 4 },
            shadowOpacity:   0.07,
            shadowRadius:    16,
            elevation:       4,
            borderWidth:     1,
            borderColor:     'rgba(0,0,0,0.05)',
          }}>

          {/* Header row */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize:      20,
                  fontWeight:    '700',
                  color:         '#0D1117',
                  letterSpacing: -0.5,
                }}>
                {DATA.status}
              </Text>
              <Text style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 3 }}>
                {DATA.focus}
              </Text>
            </View>
            {/* Arrow icon — top right */}
            <TouchableOpacity
              style={{
                width:           34,
                height:          34,
                borderRadius:    12,
                backgroundColor: '#F3F4F6',
                alignItems:      'center',
                justifyContent:  'center',
              }}>
              <Ionicons name="arrow-up-outline" size={16} color="#0D1117" style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          </View>

          {/* Three metrics row */}
          <View
            style={{
              flexDirection:   'row',
              marginTop:       18,
              marginBottom:    16,
              gap:             0,
            }}>
            {DATA.metrics.map((m, i) => (
              <View
                key={m.label}
                style={{
                  flex:            1,
                  paddingRight:    i < 2 ? 12 : 0,
                  borderRightWidth:i < 2 ? 1 : 0,
                  borderRightColor:'rgba(0,0,0,0.07)',
                  marginRight:     i < 2 ? 12 : 0,
                }}>
                {/* Bold value */}
                <Text
                  style={{
                    fontSize:      i === 0 ? 15 : 13,
                    fontWeight:    '700',
                    color:         '#0D1117',
                    letterSpacing: -0.3,
                  }}>
                  {m.value}
                </Text>
                {/* Label */}
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                  {m.label}
                </Text>
                <Text style={{ fontSize: 11, color: '#C4C9D4' }}>
                  {m.sub}
                </Text>
              </View>
            ))}
          </View>

          {/* Gradient progress bar */}
          <GradientBar fill={DATA.barFill} colors={DATA.barColors} />

          {/* Period labels */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{DATA.period}</Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{DATA.since}</Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 }} />

          {/* Doctor row + CTA */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Left: avatars + count */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <DoctorAvatars count={DATA.doctors} />
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}>
                {DATA.doctors} specialists available
              </Text>
            </View>

            {/* Right: CTA button */}
            <TouchableOpacity
              onPress={onAppointmentPress}
              activeOpacity={0.85}
              style={{
                backgroundColor:  '#0D1117',
                paddingHorizontal:16,
                paddingVertical:  10,
                borderRadius:     22,
                shadowColor:      '#0D1117',
                shadowOffset:     { width: 0, height: 4 },
                shadowOpacity:    0.28,
                shadowRadius:     10,
                elevation:        5,
              }}>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.2 }}>
                {DATA.cta}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </Animated.View>
    </View>
  );
}
