/**
 * DateWheelPicker
 * iOS-style drum-roll / slot-machine date selector.
 * Three independent snap-scroll columns: Day · Month · Year
 *
 * Features
 *  • Smooth snap scrolling (snapToInterval + decelerationRate fast)
 *  • Real-time size + opacity gradient while scrolling (updates on every tick)
 *  • Stacked-view fade overlays at top/bottom (no gradient library needed)
 *  • Green selection band + two thin separator lines
 *  • Day count auto-clamps when month/year changes (e.g. Jan 31 → Feb 28)
 *  • Spring bottom-sheet entrance animation
 *  • Tap-on-item jumps directly to that value
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

// ── Constants ─────────────────────────────────────────────────────────────────

const ITEM_H  = 58;   // height of one row
const VISIBLE = 5;    // rows shown (must be odd)
const PAD     = ITEM_H * Math.floor(VISIBLE / 2);
const GREEN   = '#2C6E49';

// ── Helpers ───────────────────────────────────────────────────────────────────

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate(); // month is 1-indexed here
}

export function parseDate(value: string): { day: number; month: number; year: number } {
  const parts = (value ?? '').split('/');
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const y = parseInt(parts[2], 10);
  const now = new Date();
  return {
    day:   Number.isFinite(d) && d >= 1 && d <= 31 ? d : 1,
    month: Number.isFinite(m) && m >= 1 && m <= 12 ? m : 1,
    year:  Number.isFinite(y) && y >= 1930          ? y : now.getFullYear() - 25,
  };
}

export function formatDate(day: number, month: number, year: number): string {
  return [
    day.toString().padStart(2, '0'),
    month.toString().padStart(2, '0'),
    year.toString(),
  ].join(' / ');
}

// ── Single wheel column ───────────────────────────────────────────────────────

interface WheelColProps {
  label:        string;
  items:        number[];
  selectedIdx:  number;
  onSelect:     (index: number) => void;
  fmt?:         (v: number) => string;
}

function WheelCol({ label, items, selectedIdx, onSelect, fmt }: WheelColProps) {
  const scrollRef  = useRef<ScrollView>(null);
  const currentRef = useRef(selectedIdx);
  const [current, setCurrent] = useState(selectedIdx);

  // Initial scroll position (no animation)
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIdx * ITEM_H, animated: false });
    currentRef.current = selectedIdx;
    setCurrent(selectedIdx);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When parent externally changes selected index (e.g. day clamped after month change)
  useEffect(() => {
    if (selectedIdx !== currentRef.current) {
      scrollRef.current?.scrollTo({ y: selectedIdx * ITEM_H, animated: true });
      currentRef.current = selectedIdx;
      setCurrent(selectedIdx);
    }
  }, [selectedIdx]);

  // Called on every scroll event — updates displayed sizes in real time
  const handleScroll = useCallback((e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const y   = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_H), items.length - 1));
    if (idx !== currentRef.current) {
      currentRef.current = idx;
      setCurrent(idx);
    }
  }, [items.length]);

  // Called when scroll settles — commits selection
  const handleEnd = useCallback((e: { nativeEvent: { contentOffset: { y: number } } }) => {
    const y   = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_H), items.length - 1));
    currentRef.current = idx;
    setCurrent(idx);
    onSelect(idx);
  }, [items.length, onSelect]);

  function tapItem(i: number) {
    currentRef.current = i;
    setCurrent(i);
    onSelect(i);
    scrollRef.current?.scrollTo({ y: i * ITEM_H, animated: true });
  }

  return (
    <View style={c.col}>
      {/* Column label */}
      <Text style={c.colLabel}>{label}</Text>

      <View style={{ height: ITEM_H * VISIBLE, overflow: 'hidden' }}>

        {/* ── Selection band ───────────────────────────────────── */}
        <View style={c.selBand}   pointerEvents="none" />
        <View style={c.sepTop}    pointerEvents="none" />
        <View style={c.sepBottom} pointerEvents="none" />

        {/* ── Scrollable list ──────────────────────────────────── */}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_H}
          decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.98}
          contentContainerStyle={{ paddingVertical: PAD }}
          scrollEventThrottle={8}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleEnd}
          onScrollEndDrag={handleEnd}>
          {items.map((val, i) => {
            const dist     = Math.abs(i - current);
            const selected = dist === 0;
            const near1    = dist === 1;
            const near2    = dist === 2;

            return (
              <TouchableOpacity
                key={val}
                activeOpacity={1}
                onPress={() => tapItem(i)}
                style={c.item}>
                <Text style={[
                  c.itemBase,
                  selected ? c.itemSelected : near1 ? c.itemNear1 : near2 ? c.itemNear2 : c.itemFar,
                ]}>
                  {fmt ? fmt(val) : val.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Fade overlays (top + bottom) — no gradient lib needed ── */}
        <View style={c.fadeWrapTop} pointerEvents="none">
          <View style={{ flex: 6, backgroundColor: 'rgba(255,255,255,0.97)' }} />
          <View style={{ flex: 4, backgroundColor: 'rgba(255,255,255,0.65)' }} />
          <View style={{ flex: 3, backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <View style={{ flex: 2, backgroundColor: 'rgba(255,255,255,0.06)' }} />
        </View>
        <View style={c.fadeWrapBottom} pointerEvents="none">
          <View style={{ flex: 2, backgroundColor: 'rgba(255,255,255,0.06)' }} />
          <View style={{ flex: 3, backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <View style={{ flex: 4, backgroundColor: 'rgba(255,255,255,0.65)' }} />
          <View style={{ flex: 6, backgroundColor: 'rgba(255,255,255,0.97)' }} />
        </View>
      </View>
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export interface DateWheelPickerProps {
  visible:  boolean;
  value:    string;           // "DD / MM / YYYY" or empty
  onChange: (date: string) => void;
  onClose:  () => void;
}

const CURR_YEAR = new Date().getFullYear();
const MONTHS    = range(1, 12);
const YEARS     = range(1930, CURR_YEAR);

export function DateWheelPicker({ visible, value, onChange, onClose }: DateWheelPickerProps) {
  const insets  = useSafeAreaInsets();
  const slideY  = useRef(new Animated.Value(600)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const initial = parseDate(value);
  const [day,   setDay  ] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year,  setYear ] = useState(initial.year);

  // Derived
  const maxDay  = daysInMonth(month, year);
  const safeDay = Math.min(day, maxDay);
  const days    = range(1, maxDay);

  // Animate in/out
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: 0, damping: 26, stiffness: 320, useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1, duration: 220, useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: 600, duration: 260, useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0, duration: 200, useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  function handleConfirm() {
    onChange(formatDate(safeDay, month, year));
    onClose();
  }

  function handleDaySelect(i: number)   { setDay(days[i]); }
  function handleMonthSelect(i: number) {
    const m      = MONTHS[i];
    const newMax = daysInMonth(m, year);
    setMonth(m);
    if (day > newMax) setDay(newMax);
  }
  function handleYearSelect(i: number) {
    const y      = YEARS[i];
    const newMax = daysInMonth(month, y);
    setYear(y);
    if (day > newMax) setDay(newMax);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>

      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[s.overlay, { opacity }]} />
      </TouchableWithoutFeedback>

      {/* Bottom sheet */}
      <Animated.View style={[
        s.sheet,
        { transform: [{ translateY: slideY }], paddingBottom: insets.bottom + 16 },
      ]}>

        {/* Handle bar */}
        <View style={s.handle} />

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>Date of Birth</Text>
            <Text style={s.headerSub}>Scroll to select · Tap to jump</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Wheels row */}
        <View style={s.wheelsRow}>
          <WheelCol
            label="DAY"
            items={days}
            selectedIdx={safeDay - 1}
            onSelect={handleDaySelect}
          />

          <View style={s.colDivider} />

          <WheelCol
            label="MONTH"
            items={MONTHS}
            selectedIdx={month - 1}
            onSelect={handleMonthSelect}
          />

          <View style={s.colDivider} />

          <WheelCol
            label="YEAR"
            items={YEARS}
            selectedIdx={year - 1930}
            onSelect={handleYearSelect}
            fmt={v => v.toString()}
          />
        </View>

        {/* Selected date preview */}
        <View style={s.preview}>
          <Ionicons name="calendar-outline" size={15} color={GREEN} />
          <Text style={s.previewText}>
            {formatDate(safeDay, month, year)}
          </Text>
        </View>

        {/* Confirm */}
        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.88}
          style={s.confirmBtn}>
          <Text style={s.confirmText}>Confirm Date</Text>
          <Ionicons name="checkmark" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

// ── Column styles ─────────────────────────────────────────────────────────────

const SEL_TOP = ITEM_H * Math.floor(VISIBLE / 2);

const c = StyleSheet.create({
  col: {
    flex:      1,
    alignItems:'center',
  },
  colLabel: {
    fontSize:      10.5,
    fontWeight:    '700',
    color:         '#94A3B8',
    letterSpacing: 1.5,
    marginBottom:  10,
  },

  // Selection band
  selBand: {
    position:        'absolute',
    top:             SEL_TOP,
    height:          ITEM_H,
    left:            0,
    right:           0,
    backgroundColor: 'rgba(44,110,73,0.07)',
    borderRadius:    10,
    zIndex:          1,
  },
  sepTop: {
    position:        'absolute',
    top:             SEL_TOP,
    height:          1.5,
    left:            8,
    right:           8,
    backgroundColor: 'rgba(44,110,73,0.3)',
    zIndex:          2,
  },
  sepBottom: {
    position:        'absolute',
    top:             SEL_TOP + ITEM_H - 1,
    height:          1.5,
    left:            8,
    right:           8,
    backgroundColor: 'rgba(44,110,73,0.3)',
    zIndex:          2,
  },

  // Items
  item: {
    height:         ITEM_H,
    justifyContent: 'center',
    alignItems:     'center',
    zIndex:         3,
  },
  itemBase: {
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  itemSelected: {
    fontSize:      32,
    fontWeight:    '800',
    color:         '#0D1117',
    letterSpacing: -0.8,
  },
  itemNear1: {
    fontSize:   22,
    fontWeight: '500',
    color:      '#475569',
  },
  itemNear2: {
    fontSize:   17,
    fontWeight: '400',
    color:      '#94A3B8',
  },
  itemFar: {
    fontSize:   14,
    fontWeight: '400',
    color:      '#CBD5E1',
  },

  // Fade wrappers
  fadeWrapTop: {
    position: 'absolute',
    top:      0,
    left:     0,
    right:    0,
    height:   ITEM_H * 2,
    zIndex:   5,
  },
  fadeWrapBottom: {
    position: 'absolute',
    bottom:   0,
    left:     0,
    right:    0,
    height:   ITEM_H * 2,
    zIndex:   5,
  },
});

// ── Sheet styles ──────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  sheet: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    paddingHorizontal:    20,
    paddingTop:           12,
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: -8 },
    shadowOpacity:  0.12,
    shadowRadius:   24,
    elevation:      20,
  },
  handle: {
    width:           44,
    height:          4,
    borderRadius:    2,
    backgroundColor: '#E2E8F0',
    alignSelf:       'center',
    marginBottom:    16,
  },

  // Header
  header: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    justifyContent:  'space-between',
    marginBottom:    20,
  },
  headerTitle: {
    fontSize:      22,
    fontWeight:    '800',
    color:         '#0D1117',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize:  12,
    color:     '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: '#F2F2F7',
    alignItems:      'center',
    justifyContent:  'center',
  },

  // Wheels
  wheelsRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    marginBottom:  12,
  },
  colDivider: {
    width:           1,
    height:          ITEM_H * VISIBLE + 32, // col height + label
    backgroundColor: '#F1F5F9',
    marginTop:       0,
  },

  // Preview
  preview: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             8,
    backgroundColor: '#F0FBF5',
    borderRadius:    12,
    paddingVertical: 10,
    marginBottom:    14,
  },
  previewText: {
    fontSize:      16,
    fontWeight:    '700',
    color:         '#0D1117',
    letterSpacing: 1,
  },

  // Confirm
  confirmBtn: {
    backgroundColor: '#0D1117',
    borderRadius:    999,
    height:          58,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.18,
    shadowRadius:    14,
    elevation:       8,
  },
  confirmText: {
    fontSize:   16,
    fontWeight: '600',
    color:      '#FFFFFF',
  },
});
