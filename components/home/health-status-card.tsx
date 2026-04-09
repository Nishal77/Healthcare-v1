/**
 * HealthStatusCard — Ayurveda + Wearable Predictive Analysis
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinear, Rect, Stop } from 'react-native-svg';

// ─── Marquee ticker ───────────────────────────────────────────────────────────
function MarqueeText({ text, style }: { text: string; style?: object }) {
  const translateX  = useRef(new Animated.Value(0)).current;
  const [textW,  setTextW]  = useState(0);
  const [trackW, setTrackW] = useState(0);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (textW === 0 || trackW === 0 || textW <= trackW) return;
    const travel   = textW - trackW + 20;
    const duration = (travel / 38) * 1000;
    translateX.setValue(0);
    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(translateX, { toValue: -travel, duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(translateX, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ])
    );
    animRef.current.start();
    return () => animRef.current?.stop();
  }, [textW, trackW]);

  return (
    <View style={{ flex: 1, overflow: 'hidden' }} onLayout={e => setTrackW(e.nativeEvent.layout.width)}>
      <Animated.Text
        style={[style, { transform: [{ translateX }] }]}
        numberOfLines={1}
        onLayout={e => setTextW(e.nativeEvent.layout.width)}>
        {text}
      </Animated.Text>
    </View>
  );
}

// ─── Prediction variants — natural, human-sounding copy ───────────────────────
const PREDICTIONS = [
  {
    status:    'Vata imbalance',
    focus:     'Feeling scattered or low on energy lately',
    col1:      { value: '31ms',    label: 'HRV',        sub: 'Watch · ↓ Low'  },
    col2:      { value: 'Elevated', label: 'Vata dosha', sub: 'Current status' },
    col3:      { top: 'SpO₂',      value: '96%'                                },
    period:    'Last 4 weeks',
    since:     'Since Jan 11',
    fill:      0.38,
    barFrom:   '#F59E0B', barMid: '#AACC22', barTo: '#22C55E',
    insight:   'Warm sesame oil massage before bed can bring your HRV back up within a few days',
    remedy:    'Ashwagandha · Sesame oil',
    timeframe: '5 days',
    trend:     'down' as const,
  },
  {
    status:    'Pitta in balance',
    focus:     'Digestion and energy are looking really good today',
    col1:      { value: '68ms',     label: 'HRV',        sub: 'Watch · ↑ Good' },
    col2:      { value: 'Balanced', label: 'Pitta dosha', sub: 'Current status' },
    col3:      { top: 'Steps',      value: '9,241'                              },
    period:    'Last 2 weeks',
    since:     'Since Mar 2',
    fill:      0.86,
    barFrom:   '#84CC16', barMid: '#22C55E', barTo: '#15803D',
    insight:   'Keep up the sheetali pranayama — it\'s helping you stay steady',
    remedy:    'Amalaki · Sheetali breath',
    timeframe: '12 days',
    trend:     'up' as const,
  },
  {
    status:    'Kapha sluggishness',
    focus:     'Metabolism\'s a bit slow — some movement will help',
    col1:      { value: '82 bpm',   label: 'Heart Rate', sub: 'Watch · ↑ High' },
    col2:      { value: 'Elevated', label: 'Kapha dosha', sub: 'Current status' },
    col3:      { top: 'SpO₂',       value: '97%'                                },
    period:    'Last 3 weeks',
    since:     'Since Feb 20',
    fill:      0.48,
    barFrom:   '#F59E0B', barMid: '#A3CC14', barTo: '#84CC16',
    insight:   'A daily sun salutation routine can lift your energy noticeably within a week',
    remedy:    'Trikatu · Dry ginger tea',
    timeframe: '5 days',
    trend:     'neutral' as const,
  },
] as const;

const D = PREDICTIONS[new Date().getHours() % PREDICTIONS.length];

// ─── Animated gradient bar ────────────────────────────────────────────────────
function GradientBar({ fill, from, mid, to }: { fill: number; from: string; mid: string; to: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: fill, duration: 1100, delay: 350, useNativeDriver: false }).start();
  }, []);
  const H = 9;
  return (
    <View style={{ height: H, backgroundColor: '#F0F0F0', borderRadius: H / 2, overflow: 'hidden' }}>
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

function VDivider() {
  return <View style={{ width: 1, backgroundColor: 'rgba(0,0,0,0.07)', alignSelf: 'stretch', marginHorizontal: 14 }} />;
}

// ─── Main card ────────────────────────────────────────────────────────────────
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
          backgroundColor:  '#FFFFFF',
          borderRadius:     22,
          paddingHorizontal:20,
          paddingTop:       18,
          paddingBottom:    20,
          shadowColor:      '#000',
          shadowOffset:     { width: 0, height: 4 },
          shadowOpacity:    0.07,
          shadowRadius:     18,
          elevation:        4,
          borderWidth:      1,
          borderColor:      'rgba(0,0,0,0.05)',
        }}>

          {/* ── Badge row ────────────────────────────────────────────── */}
          <View style={{
            flexDirection:  'row',
            alignItems:     'center',
            justifyContent: 'space-between',
            marginBottom:   16,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>

              {/* "Predictive" — sentence case, not screaming caps */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 5,
                backgroundColor: '#F0FDF4',
                borderRadius: 30, paddingHorizontal: 10, paddingVertical: 6,
                borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)',
              }}>
                <Ionicons name="sparkles" size={10} color="#16A34A" />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#16A34A', letterSpacing: -0.1 }}>
                  Predictive
                </Text>
              </View>

              {/* Watch Live — just dot + text, no icon clutter */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: '#F8F9FA',
                borderRadius: 30, paddingHorizontal: 10, paddingVertical: 6,
                borderWidth: 1, borderColor: 'rgba(0,0,0,0.07)',
              }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' }} />
                <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280', letterSpacing: -0.1 }}>
                  Watch Live
                </Text>
              </View>
            </View>

            {/* Arrow-out button */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: '#F3F4F6',
                alignItems: 'center', justifyContent: 'center',
              }}>
              <Ionicons name="arrow-up-outline" size={16} color="#374151" style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          </View>

          {/* ── Title + subtitle ──────────────────────────────────────── */}
          <Text style={{
            fontSize: 22, fontWeight: '700',
            color: '#0D1117', letterSpacing: -0.6, lineHeight: 28,
          }}>
            {D.status}
          </Text>
          <Text style={{
            fontSize: 13.5, color: '#9CA3AF',
            marginTop: 5, lineHeight: 19, letterSpacing: -0.1,
          }}>
            {D.focus}
          </Text>

          {/* ── 3-column metrics ──────────────────────────────────────── */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 22, marginBottom: 22 }}>

            {/* Col 1 */}
            <View style={{ flex: 1.1 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#0D1117', letterSpacing: -0.5, lineHeight: 26 }}>
                {D.col1.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: '500' }}>{D.col1.label}</Text>
              <Text style={{ fontSize: 11, color: '#C4C4C4', marginTop: 2 }}>{D.col1.sub}</Text>
            </View>

            <VDivider />

            {/* Col 2 */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#0D1117', letterSpacing: -0.3, lineHeight: 24 }}>
                {D.col2.value}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, fontWeight: '500' }}>{D.col2.label}</Text>
              <Text style={{ fontSize: 11, color: '#C4C4C4', marginTop: 2 }}>{D.col2.sub}</Text>
            </View>

            <VDivider />

            {/* Col 3 — label on top, value below */}
            <View style={{ flex: 0.85 }}>
              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500', lineHeight: 18 }}>{D.col3.top}</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#0D1117', letterSpacing: -0.4, marginTop: 3 }}>
                {D.col3.value}
              </Text>
            </View>
          </View>

          {/* ── Gradient progress bar ─────────────────────────────────── */}
          <GradientBar fill={D.fill} from={D.barFrom} mid={D.barMid} to={D.barTo} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 }}>
            <Text style={{ fontSize: 11, color: '#C4C4C4', fontWeight: '500' }}>{D.period}</Text>
            <Text style={{ fontSize: 11, color: '#C4C4C4', fontWeight: '500' }}>{D.since}</Text>
          </View>

          {/* ── Insight + remedy ──────────────────────────────────────── */}
          <View style={{
            marginTop:        18,
            backgroundColor:  '#FAFAFA',
            borderRadius:     16,
            borderWidth:      1,
            borderColor:      'rgba(0,0,0,0.05)',
            overflow:         'hidden',
          }}>

            {/* Insight row */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 }}>
              <View style={{
                width: 32, height: 32, borderRadius: 10,
                backgroundColor: trendColor + '15',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
              }}>
                <Ionicons name={trendIcon} size={15} color={trendColor} />
              </View>
              <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20, flex: 1, fontWeight: '400' }}>
                {D.insight}
              </Text>
            </View>

            {/* Remedy strip */}
            <View style={{
              borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)',
              backgroundColor: '#F5F5F7',
              paddingHorizontal: 14, paddingVertical: 11,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                <Ionicons name="leaf-outline" size={11} color="#2C6E49" />
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>
                  Ayurvedic recommendation
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MarqueeText
                  text={D.remedy}
                  style={{ fontSize: 13, fontWeight: '600', color: '#1C4532', letterSpacing: -0.1 }}
                />
                <View style={{
                  backgroundColor: '#0D1117', borderRadius: 20,
                  paddingHorizontal: 12, paddingVertical: 5, flexShrink: 0,
                }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#FFFFFF' }}>
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
