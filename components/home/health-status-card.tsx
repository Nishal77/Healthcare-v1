/**
 * HealthStatusCard
 * Precise replication of the reference health card UI.
 *
 * Layout:
 *  • Title + circular arrow button
 *  • Subtitle
 *  • 3-column metric row — col 3 is inverted (label on top, value below)
 *  • Vivid gradient progress bar with striped track
 *  • Period labels
 *  • Doctor avatar stack + appointment CTA
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgGradient,
  Rect,
  Stop,
} from 'react-native-svg';

// ─── Data variants ────────────────────────────────────────────────────────────

const STATUSES = [
  {
    status:  'Vata Imbalance',
    focus:   'Energy focus • Dryness detected',
    col1:    { value: 'High',    label: 'Stress',  sub: 'Level'   },
    col2:    { value: 'Moderate',label: 'HRV',     sub: 'Status'  },
    col3:    { top: 'Score',     value: '62 pts'                   },
    period:  'Last 4w',
    since:   'Since Jan 11',
    fill:    0.62,
    barFrom: '#D4E84A',
    barTo:   '#22C55E',
    doctors: 24,
    cta:     'Book Consultation',
  },
  {
    status:  'Optimal Balance',
    focus:   'Pitta harmony • Digestion strong',
    col1:    { value: 'Strong',  label: 'Digestion', sub: 'Status' },
    col2:    { value: 'Balanced',label: 'Energy',    sub: 'Level'  },
    col3:    { top: 'Steps',     value: '8,241'                     },
    period:  'Last 2w',
    since:   'Since Mar 2',
    fill:    0.87,
    barFrom: '#84CC16',
    barTo:   '#15803D',
    doctors: 18,
    cta:     'View Progress',
  },
  {
    status:  'Kapha Sluggishness',
    focus:   'Metabolism focus • Low energy',
    col1:    { value: 'Low',     label: 'Activity', sub: 'Level'   },
    col2:    { value: 'Trending',label: 'Weight',   sub: 'Up'      },
    col3:    { top: 'Sleep',     value: '9.2h'                      },
    period:  'Last 3w',
    since:   'Since Feb 20',
    fill:    0.48,
    barFrom: '#F59E0B',
    barTo:   '#84CC16',
    doctors: 31,
    cta:     'Book Consultation',
  },
] as const;

const D = STATUSES[new Date().getHours() % STATUSES.length];

// ─── Gradient bar ─────────────────────────────────────────────────────────────

function GradientBar({
  fill,
  fromColor,
  toColor,
}: {
  fill:      number;
  fromColor: string;
  toColor:   string;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue:         fill,
      duration:        1000,
      delay:           400,
      useNativeDriver: false,
    }).start();
  }, []);

  const BAR_H = 11;

  return (
    <View>
      {/* Track — light gray */}
      <View
        style={{
          height:          BAR_H,
          backgroundColor: '#EFEFEF',
          borderRadius:    BAR_H / 2,
          overflow:        'hidden',
        }}>
        {/* Filled gradient */}
        <Animated.View
          style={{
            position:     'absolute',
            top: 0, left: 0, bottom: 0,
            borderRadius: BAR_H / 2,
            width: anim.interpolate({
              inputRange:  [0, 1],
              outputRange: ['0%', '100%'],
            }),
            overflow: 'hidden',
          }}>
          {/* SVG gradient fill */}
          <Svg height={BAR_H} width="100%" style={{ position: 'absolute' }}>
            <Defs>
              <SvgGradient id="g" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={fromColor} stopOpacity="1" />
                <Stop offset="1" stopColor={toColor}   stopOpacity="1" />
              </SvgGradient>
            </Defs>
            <Rect
              x="0" y="0"
              width="100%" height={BAR_H}
              rx={BAR_H / 2}
              fill="url(#g)"
            />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Doctor avatar stack ──────────────────────────────────────────────────────

const DR_COLORS = ['#2C6E49', '#1E3A5F', '#7C2D2D'];
const DR_INIT   = ['DA', 'SR', 'MK'];

function DoctorAvatars({ extra }: { extra: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {DR_INIT.map((ini, i) => (
        <View
          key={ini}
          style={{
            width:           30,
            height:          30,
            borderRadius:    15,
            backgroundColor: DR_COLORS[i],
            borderWidth:     2,
            borderColor:     '#FFFFFF',
            alignItems:      'center',
            justifyContent:  'center',
            marginLeft:      i === 0 ? 0 : -9,
            zIndex:          10 - i,
          }}>
          <Text style={{ fontSize: 8.5, fontWeight: '700', color: '#FFFFFF' }}>
            {ini}
          </Text>
        </View>
      ))}
      <View
        style={{
          width:           30,
          height:          30,
          borderRadius:    15,
          backgroundColor: '#F0F0F0',
          borderWidth:     2,
          borderColor:     '#FFFFFF',
          alignItems:      'center',
          justifyContent:  'center',
          marginLeft:      -9,
        }}>
        <Text style={{ fontSize: 8, fontWeight: '700', color: '#6B7280' }}>
          +{extra}
        </Text>
      </View>
    </View>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function VDivider() {
  return (
    <View
      style={{
        width:           1,
        backgroundColor: 'rgba(0,0,0,0.07)',
        alignSelf:       'stretch',
        marginHorizontal:16,
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HealthStatusCard({
  onAppointmentPress,
}: {
  onAppointmentPress?: () => void;
}) {
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

  const cardStyle: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius:    20,
    paddingTop:      20,
    paddingBottom:   20,
    paddingHorizontal:20,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.07,
    shadowRadius:    18,
    elevation:       4,
    borderWidth:     1,
    borderColor:     'rgba(0,0,0,0.055)',
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}>
      <Animated.View
        style={{
          opacity:   mount,
          transform: [{
            translateY: mount.interpolate({
              inputRange:  [0, 1],
              outputRange: [14, 0],
            }),
          }],
        }}>
        <View style={cardStyle}>

          {/* ── Header ───────────────────────────────────────────────── */}
          <View style={{
            flexDirection:  'row',
            alignItems:     'flex-start',
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{
                fontSize:      22,
                fontWeight:    '700',
                color:         '#0D1117',
                letterSpacing: -0.6,
                lineHeight:    28,
              }}>
                {D.status}
              </Text>
              <Text style={{
                fontSize:   13,
                color:      '#9CA3AF',
                marginTop:  4,
                lineHeight: 18,
              }}>
                {D.focus}
              </Text>
            </View>

            {/* Circular arrow — exact match to reference */}
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

          {/* ── Metrics row ──────────────────────────────────────────── */}
          {/* Col 1 & 2: value on top, label below
              Col 3:     label on top (inverted), value below — matches reference */}
          <View style={{
            flexDirection: 'row',
            alignItems:    'flex-start',
            marginTop:     22,
            marginBottom:  20,
          }}>

            {/* Col 1 — large value */}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize:      22,
                fontWeight:    '700',
                color:         '#0D1117',
                letterSpacing: -0.5,
                lineHeight:    26,
              }}>
                {D.col1.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
                {D.col1.label}
              </Text>
              <Text style={{ fontSize: 12, color: '#BABABA' }}>
                {D.col1.sub}
              </Text>
            </View>

            <VDivider />

            {/* Col 2 */}
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize:      16,
                fontWeight:    '700',
                color:         '#0D1117',
                letterSpacing: -0.3,
                lineHeight:    22,
              }}>
                {D.col2.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
                {D.col2.label}
              </Text>
              <Text style={{ fontSize: 12, color: '#BABABA' }}>
                {D.col2.sub}
              </Text>
            </View>

            <VDivider />

            {/* Col 3 — inverted (label on top, value below) */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 18 }}>
                {D.col3.top}
              </Text>
              <Text style={{
                fontSize:      16,
                fontWeight:    '700',
                color:         '#0D1117',
                letterSpacing: -0.3,
                marginTop:     3,
              }}>
                {D.col3.value}
              </Text>
            </View>
          </View>

          {/* ── Gradient bar ─────────────────────────────────────────── */}
          <GradientBar
            fill={D.fill}
            fromColor={D.barFrom}
            toColor={D.barTo}
          />

          {/* Period labels */}
          <View style={{
            flexDirection:  'row',
            justifyContent: 'space-between',
            marginTop:      8,
          }}>
            <Text style={{ fontSize: 11.5, color: '#BABABA' }}>{D.period}</Text>
            <Text style={{ fontSize: 11.5, color: '#BABABA' }}>{D.since}</Text>
          </View>

          {/* Divider */}
          <View style={{
            height:          1,
            backgroundColor: '#F3F4F6',
            marginVertical:  18,
          }} />

          {/* ── Doctor row + CTA ─────────────────────────────────────── */}
          <View style={{
            flexDirection:  'row',
            alignItems:     'center',
            justifyContent: 'space-between',
          }}>
            {/* Avatars + count */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, flex: 1 }}>
              <DoctorAvatars extra={D.doctors - 3} />
              <Text style={{
                fontSize:  12,
                color:     '#6B7280',
                fontWeight:'500',
                flexShrink: 1,
              }}>
                {D.doctors} available doctors
              </Text>
            </View>

            {/* CTA button */}
            <TouchableOpacity
              onPress={onAppointmentPress}
              activeOpacity={0.82}
              style={{
                backgroundColor:  '#0D1117',
                paddingHorizontal:18,
                paddingVertical:  11,
                borderRadius:     24,
                shadowColor:      '#000',
                shadowOffset:     { width: 0, height: 4 },
                shadowOpacity:    0.22,
                shadowRadius:     10,
                elevation:        5,
                marginLeft:       10,
              }}>
              <Text style={{
                fontSize:      13,
                fontWeight:    '700',
                color:         '#FFFFFF',
                letterSpacing: -0.2,
              }}>
                {D.cta}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </Animated.View>
    </View>
  );
}
