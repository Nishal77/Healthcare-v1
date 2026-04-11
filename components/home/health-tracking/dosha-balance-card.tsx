/**
 * DoshaBalanceCard
 * Replicates the reference list UI — icon tile · bold value + label · circular ring.
 * Each row maps to one Ayurvedic dosha: Vata · Pitta · Kapha.
 * The circular ring is drawn with react-native-svg using stroke-dashoffset.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// ─── Dosha definitions ────────────────────────────────────────────────────────

const DOSHAS = [
  {
    key:       'vata',
    label:     'Vata',
    elements:  'Ether · Air',
    icon:      'partly-sunny-outline' as const,
    iconColor: '#6366F1',
    iconBg:    '#EEF2FF',
    ringColor: '#6366F1',
    value:     (v: number) => `${v}%`,
    insight:   'Governs movement, breath & nervous system',
  },
  {
    key:       'pitta',
    label:     'Pitta',
    elements:  'Fire · Water',
    icon:      'flame-outline' as const,
    iconColor: '#F59E0B',
    iconBg:    '#FFFBEB',
    ringColor: '#F59E0B',
    value:     (v: number) => `${v}%`,
    insight:   'Governs digestion, metabolism & transformation',
  },
  {
    key:       'kapha',
    label:     'Kapha',
    elements:  'Earth · Water',
    icon:      'leaf-outline' as const,
    iconColor: '#10B981',
    iconBg:    '#ECFDF5',
    ringColor: '#10B981',
    value:     (v: number) => `${v}%`,
    insight:   'Governs structure, lubrication & immunity',
  },
] as const;

// ─── Animated circular ring ───────────────────────────────────────────────────

const R          = 18;
const STROKE     = 3;
const CIRCUMFERENCE = 2 * Math.PI * R;

function CircleRing({
  percentage,
  color,
  delay = 0,
}: {
  percentage: number;
  color:      string;
  delay?:     number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue:         percentage / 100,
      duration:        900,
      delay,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const SIZE = (R + STROKE) * 2 + 4;

  // We animate the dashoffset from full circumference (0%) to target
  const dashOffset = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [CIRCUMFERENCE, CIRCUMFERENCE * (1 - percentage / 100)],
  });

  return (
    <View style={{
      width:           SIZE,
      height:          SIZE,
      alignItems:      'center',
      justifyContent:  'center',
    }}>
      <Svg width={SIZE} height={SIZE}>
        {/* Track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="#F0F0F0"
          strokeWidth={STROKE}
          fill="none"
        />
        {/* Animated progress */}
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset as any}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      {/* Percentage label inside the ring */}
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{
          fontSize:      8,
          fontWeight:    '700',
          color,
          letterSpacing: -0.2,
        }}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
}

// Animated SVG Circle — wrap Animated.createAnimatedComponent
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── Single dosha row — mirrors the reference exactly ─────────────────────────

function DoshaRow({
  dosha,
  percentage,
  isDominant,
  delay,
}: {
  dosha:      typeof DOSHAS[number];
  percentage: number;
  isDominant: boolean;
  delay:      number;
}) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(slideX, { toValue: 0, delay, useNativeDriver: true, damping: 20, stiffness: 200 }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      opacity:       fadeIn,
      transform:     [{ translateX: slideX }],
      flexDirection: 'row',
      alignItems:    'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
    }}>

      {/* Left: icon tile */}
      <View style={{
        width:           40,
        height:          40,
        borderRadius:    12,
        backgroundColor: dosha.iconBg,
        alignItems:      'center',
        justifyContent:  'center',
        marginRight:     12,
        borderWidth:     1,
        borderColor:     `${dosha.iconColor}20`,
      }}>
        <Ionicons name={dosha.icon} size={18} color={dosha.iconColor} />
      </View>

      {/* Middle: name + badge + elements */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{
            fontSize:      16,
            fontWeight:    '700',
            color:         '#0D1117',
            letterSpacing: -0.4,
            lineHeight:    20,
          }}>
            {dosha.label}
          </Text>
          {isDominant && (
            <View style={{
              backgroundColor: dosha.iconBg,
              borderRadius:    5,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderWidth:     1,
              borderColor:     `${dosha.iconColor}30`,
            }}>
              <Text style={{
                fontSize:      8.5,
                fontWeight:    '700',
                color:         dosha.iconColor,
                letterSpacing: 0.5,
              }}>
                HIGH
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 1, fontWeight: '500' }}>
          {dosha.elements}
        </Text>
      </View>

      {/* Right: circular ring */}
      <CircleRing percentage={percentage} color={dosha.ringColor} delay={delay + 100} />
    </Animated.View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface DoshaBalanceCardProps {
  vata?:    number;
  pitta?:   number;
  kapha?:   number;
  insight?: string;
}

export function DoshaBalanceCard({
  vata    = 32,
  pitta   = 45,
  kapha   = 23,
  insight = 'Pitta is slightly elevated. Favour cooling foods, avoid spicy meals after 6 PM, and take a 15-min evening walk.',
}: DoshaBalanceCardProps) {
  const values     = { vata, pitta, kapha };
  const dominant   = pitta >= vata && pitta >= kapha ? 'pitta' : vata >= kapha ? 'vata' : 'kapha';
  const dominantD  = DOSHAS.find(d => d.key === dominant)!;

  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius:    24,
      overflow:        'hidden',
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: 4 },
      shadowOpacity:   0.06,
      shadowRadius:    16,
      elevation:       3,
      borderWidth:     1,
      borderColor:     'rgba(0,0,0,0.055)',
    }}>

      {/* ── Card header ──────────────────────────────────────────── */}
      <View style={{
        flexDirection:     'row',
        alignItems:        'center',
        justifyContent:    'space-between',
        paddingHorizontal: 16,
        paddingTop:        14,
        paddingBottom:     2,
      }}>
        <View>
          <Text style={{
            fontSize:      15,
            fontWeight:    '700',
            color:         '#0D1117',
            letterSpacing: -0.3,
          }}>
            Dosha Balance
          </Text>
          <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1.5 }}>
            Prakriti Analysis · Today
          </Text>
        </View>

        {/* AI badge */}
        <View style={{
          flexDirection:     'row',
          alignItems:        'center',
          gap:               5,
          backgroundColor:   '#F0FDF4',
          borderRadius:      20,
          paddingHorizontal: 10,
          paddingVertical:   5,
          borderWidth:       1,
          borderColor:       'rgba(34,197,94,0.2)',
        }}>
          <Ionicons name="sparkles" size={9} color="#16A34A" />
          <Text style={{ fontSize: 9.5, fontWeight: '700', color: '#16A34A', letterSpacing: 0.4 }}>
            AI ANALYSIS
          </Text>
        </View>
      </View>

      {/* ── Dosha rows — separated by hairlines ──────────────────── */}
      {DOSHAS.map((dosha, i) => (
        <View key={dosha.key}>
          {i > 0 && (
            <View style={{
              height:           0.5,
              backgroundColor:  'rgba(0,0,0,0.07)',
              marginHorizontal: 16,
            }} />
          )}
          <DoshaRow
            dosha={dosha}
            percentage={values[dosha.key as keyof typeof values]}
            isDominant={dominant === dosha.key}
            delay={i * 120}
          />
        </View>
      ))}

      {/* ── AI Insight footer ─────────────────────────────────────── */}
      <View style={{
        marginHorizontal:  16,
        marginBottom:      14,
        marginTop:         4,
        backgroundColor:   dominantD.iconBg,
        borderRadius:      14,
        padding:           12,
        flexDirection:     'row',
        alignItems:        'flex-start',
        gap:               9,
        borderWidth:       1,
        borderColor:       `${dominantD.iconColor}18`,
      }}>
        <View style={{
          width:           28,
          height:          28,
          borderRadius:    9,
          backgroundColor: '#FFFFFF',
          alignItems:      'center',
          justifyContent:  'center',
          flexShrink:      0,
        }}>
          <Ionicons name="bulb-outline" size={14} color={dominantD.iconColor} />
        </View>
        <Text style={{
          flex:       1,
          fontSize:   12,
          lineHeight: 18,
          color:      '#374151',
          fontWeight: '500',
        }}>
          {insight}
        </Text>
      </View>

    </View>
  );
}
