/**
 * Onboarding — 2-slide premium carousel
 *
 * Slide 1 · Feature highlights   → "Next →"
 * Slide 2 · CTA                  → "Get Started" / "I already have an account"
 *
 * Design reference: Laundrify-style split-screen
 *  • Top ~52 % — solid blue (#2563EB) with Vedarogya brand + sparkle
 *  • Bottom ~48 % — white with title, subtitle, CTAs pinned to bottom
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
  type ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const KEY_SEEN               = 'vedarogya_seen_onboarding';
const { width: W, height: H } = Dimensions.get('window');

// Blue section occupies top 52 % of screen
const BLUE_H  = Math.round(H * 0.52);
const WHITE_H = H - BLUE_H;

// ─── helpers ──────────────────────────────────────────────────────────────────

async function markSeen() {
  try { await AsyncStorage.setItem(KEY_SEEN, '1'); } catch { /* ignore */ }
}

// ─── Shared blue header with brand at top ─────────────────────────────────────

function BlueHeader({ children, topInset }: {
  children?: React.ReactNode;
  topInset:  number;
}) {
  return (
    <View style={[bh.wrap, { height: BLUE_H, paddingTop: topInset + 20 }]}>
      {/* ── Vedarogya brand ─────────────────────────────────── */}
      <View style={bh.brand}>
        {/* Leaf icon in a small white circle */}
        <View style={bh.brandIcon}>
          <Ionicons name="leaf" size={13} color="#2C6E49" />
        </View>
        <Text style={bh.brandText}>Vedarogya</Text>
      </View>

      {/* ── 4-pointed sparkle ───────────────────────────────── */}
      <View style={bh.sparkleWrap} pointerEvents="none">
        <Text style={bh.sparkle}>✦</Text>
      </View>

      {/* Slot for slide-specific content */}
      {children}
    </View>
  );
}

// ─── Slide 1 — Feature highlights ────────────────────────────────────────────

const FEATURES = [
  {
    icon:   'leaf-outline'  as const,
    label:  'Ayurvedic Insights',
    detail: 'Personalised Dosha analysis & holistic recommendations',
    bg:     '#E8F5EE',
    tint:   '#2C6E49',
  },
  {
    icon:   'pulse-outline' as const,
    label:  'AI Health Tracking',
    detail: 'Smart meal, exercise & wellness logging with real-time summaries',
    bg:     '#EFF8FF',
    tint:   '#2563EB',
  },
  {
    icon:   'heart-outline' as const,
    label:  'Holistic Care Plans',
    detail: 'Curated yoga, remedies & lifestyle plans from Ayurvedic experts',
    bg:     '#FDF2F8',
    tint:   '#DB2777',
  },
];

function Slide1({ onNext }: { onNext: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[sl.root, { width: W }]}>
      {/* Blue top */}
      <BlueHeader topInset={insets.top}>
        {/* Tagline inside blue */}
        <View style={sl.blueTagline}>
          <Text style={sl.blueTitle}>Ancient wisdom,{'\n'}modern health</Text>
          <Text style={sl.blueSub}>
            Personalised Ayurvedic health tracking powered by AI
          </Text>
        </View>
      </BlueHeader>

      {/* White bottom */}
      <View style={[sl.whiteBottom, { height: WHITE_H }]}>
        {/* Feature cards — centred vertically */}
        <View style={sl.cards}>
          {FEATURES.map(f => (
            <View key={f.label} style={sl.card}>
              <View style={[sl.cardIcon, { backgroundColor: f.bg }]}>
                <Ionicons name={f.icon} size={19} color={f.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={sl.cardTitle}>{f.label}</Text>
                <Text style={sl.cardDetail}>{f.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Next button — pinned to bottom right */}
        <View style={[sl.nextRow, { paddingBottom: insets.bottom + 28 }]}>
          <TouchableOpacity onPress={onNext} activeOpacity={0.82} style={sl.nextBtn}>
            <Text style={sl.nextBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Slide 2 — CTA ───────────────────────────────────────────────────────────

function Slide2({
  onGetStarted,
  onLogin,
}: {
  onGetStarted: () => void;
  onLogin:      () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s2.root, { width: W }]}>
      {/* Blue top — brand + sparkle only, no object */}
      <BlueHeader topInset={insets.top} />

      {/* White bottom — title + buttons pinned to bottom */}
      <View style={[s2.white, { height: WHITE_H }]}>

        {/* Title block — sits at top of white section */}
        <View style={s2.titleBlock}>
          <Text style={s2.title}>
            Your health, your journey.{'\n'}Anytime, anywhere.
          </Text>
          <Text style={s2.sub}>
            Track meals, log wellness, consult Ayurvedic{'\n'}
            experts — all in one place.
          </Text>
        </View>

        {/* Spacer pushes buttons down */}
        <View style={{ flex: 1 }} />

        {/* Buttons + terms — anchored to bottom */}
        <View style={[s2.btnBlock, { paddingBottom: insets.bottom + 24 }]}>
          {/* Get Started */}
          <TouchableOpacity
            onPress={onGetStarted}
            activeOpacity={0.88}
            style={s2.btnPrimary}>
            <Text style={s2.btnPrimaryText}>Get Started</Text>
          </TouchableOpacity>

          {/* Already have an account */}
          <TouchableOpacity
            onPress={onLogin}
            activeOpacity={0.75}
            style={s2.btnSecondary}>
            <Text style={s2.btnSecondaryText}>I already have an account</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={s2.terms}>
            By continuing you agree to our{' '}
            <Text style={s2.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={s2.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const SLIDES = ['features', 'cta'] as const;
type SlideId = typeof SLIDES[number];

export default function OnboardingScreen() {
  const router   = useRouter();
  const flatList = useRef<FlatList>(null);
  const [idx, setIdx] = useState(0);

  const nav = async (to: '/(auth)/login' | '/(auth)/register') => {
    await markSeen();
    router.replace(to);
  };

  function goTo(i: number) {
    flatList.current?.scrollToIndex({ index: i, animated: true });
    setIdx(i);
  }

  const onViewable = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) setIdx(viewableItems[0].index);
    }
  ).current;

  const viewCfg = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  function renderSlide({ item }: ListRenderItemInfo<SlideId>) {
    if (item === 'features')
      return <Slide1 onNext={() => goTo(1)} />;
    return (
      <Slide2
        onGetStarted={() => nav('/(auth)/register')}
        onLogin={() => nav('/(auth)/login')}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <FlatList
        ref={flatList}
        data={SLIDES as unknown as SlideId[]}
        keyExtractor={item => item}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={viewCfg}
        scrollEnabled={false}          // controlled programmatically only
      />

      {/* Page dots — centred, sits just above bottom bar */}
      <View style={dots.row} pointerEvents="none">
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              dots.dot,
              i === idx ? dots.active : dots.idle,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Shared blue header styles ─────────────────────────────────────────────────

const bh = StyleSheet.create({
  wrap: {
    backgroundColor:  '#2563EB',
    width:            '100%',
    position:         'relative',
  },
  brand: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
  },
  brandIcon: {
    width:           30,
    height:          30,
    borderRadius:    15,
    backgroundColor: '#FFFFFF',
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.12,
    shadowRadius:    6,
    elevation:       4,
  },
  brandText: {
    fontSize:      18,
    fontWeight:    '700',
    color:         '#FFFFFF',
    letterSpacing: -0.3,
  },
  sparkleWrap: {
    position: 'absolute',
    top:      0,
    right:    26,
  },
  sparkle: {
    fontSize:   28,
    color:      '#FFFFFF',
    lineHeight: 40,
  },
});

// ─── Slide 1 styles ────────────────────────────────────────────────────────────

const sl = StyleSheet.create({
  root: {
    flex: 1,
  },
  blueTagline: {
    paddingHorizontal: 26,
    marginTop:         28,
  },
  blueTitle: {
    fontSize:      24,
    fontWeight:    '800',
    color:         '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight:    30,
    marginBottom:  8,
  },
  blueSub: {
    fontSize:   13.5,
    color:      'rgba(255,255,255,0.75)',
    lineHeight: 19,
  },
  whiteBottom: {
    backgroundColor:  '#FFFFFF',
    paddingHorizontal:22,
  },
  cards: {
    paddingTop: 22,
    gap:        12,
  },
  card: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  '#F8F9FA',
    borderRadius:     16,
    paddingVertical:  15,
    paddingHorizontal:16,
    gap:              14,
  },
  cardIcon: {
    width:          42,
    height:         42,
    borderRadius:   13,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  cardTitle: {
    fontSize:     13.5,
    fontWeight:   '700',
    color:        '#0D1117',
    marginBottom:  2,
    letterSpacing:-0.2,
  },
  cardDetail: {
    fontSize:   12,
    color:      '#6B7280',
    lineHeight: 16,
  },
  nextRow: {
    flexDirection:  'row',
    justifyContent: 'flex-end',
    paddingTop:     16,
  },
  nextBtn: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              8,
    backgroundColor:  '#0D1117',
    borderRadius:     999,
    paddingVertical:  13,
    paddingHorizontal:22,
  },
  nextBtnText: {
    fontSize:   14.5,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
});

// ─── Slide 2 styles ────────────────────────────────────────────────────────────

const s2 = StyleSheet.create({
  root: {
    flex: 1,
  },
  white: {
    backgroundColor:  '#FFFFFF',
    paddingHorizontal:26,
  },
  titleBlock: {
    paddingTop: 32,
    gap:        10,
  },
  title: {
    fontSize:      30,
    fontWeight:    '800',
    color:         '#0D1117',
    letterSpacing: -0.7,
    lineHeight:    37,
  },
  sub: {
    fontSize:   15,
    color:      '#6B7280',
    lineHeight: 22,
    fontWeight: '400',
  },
  btnBlock: {
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: '#0D1117',
    borderRadius:    999,
    height:          58,
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     '#0D1117',
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.25,
    shadowRadius:    18,
    elevation:       10,
  },
  btnPrimaryText: {
    fontSize:      16,
    fontWeight:    '700',
    color:         '#FFFFFF',
    letterSpacing: 0.1,
  },
  btnSecondary: {
    backgroundColor: '#F2F2F7',
    borderRadius:    999,
    height:          56,
    alignItems:      'center',
    justifyContent:  'center',
  },
  btnSecondaryText: {
    fontSize:      15.5,
    fontWeight:    '600',
    color:         '#1C1C1E',
    letterSpacing: -0.1,
  },
  terms: {
    fontSize:   12,
    color:      '#ADADB8',
    textAlign:  'center',
    lineHeight: 17,
    marginTop:  4,
  },
  termsLink: {
    fontWeight: '700',
    color:      '#6B7280',
  },
});

// ─── Page dots ─────────────────────────────────────────────────────────────────

const dots = StyleSheet.create({
  row: {
    position:       'absolute',
    bottom:         14,
    left:           0,
    right:          0,
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    gap:            6,
  },
  dot: {
    height:      6,
    borderRadius:3,
  },
  active: {
    width:           20,
    backgroundColor: '#0D1117',
  },
  idle: {
    width:           6,
    backgroundColor: '#D1D5DB',
  },
});
