/**
 * HealthReminders
 *
 * Compact premium banner — reduced height, normal/medium weights,
 * static bell icon with amber notification dot.
 * Healthcare colour palette, changes by time of day.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

// ── Static bell icon (no animation) ─────────────────────────────────────────
function BellIcon({ dotColor }: { dotColor: string }) {
  return (
    <View style={{ width: 68, height: 68, alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer frosted ring */}
      <View
        style={{
          width: 68,
          height: 68,
          borderRadius: 34,
          backgroundColor: 'rgba(255,255,255,0.10)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* Inner circle */}
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: 'rgba(255,255,255,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
        </View>
      </View>

      {/* Amber notification dot */}
      <View
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 11,
          height: 11,
          borderRadius: 6,
          backgroundColor: dotColor,
          borderWidth: 2,
          borderColor: 'rgba(0,0,0,0.25)',
        }}
      />
    </View>
  );
}

// ── Banner data — rotates by hour ────────────────────────────────────────────
const BANNERS = [
  {
    title:   'Set Your Health Reminder',
    sub:     'Never miss your morning routine. Stay consistent, stay healthy.',
    cta:     'Set Reminder',
    bg:      '#1A3D2B',
    accent:  '#52C87A',
    dot:     '#F59E0B',
  },
  {
    title:   'Hydration Check-In',
    sub:     "You're halfway through the day. Have you had enough water?",
    cta:     'Log Water',
    bg:      '#0A3040',
    accent:  '#38BDF8',
    dot:     '#F59E0B',
  },
  {
    title:   'Evening Wind Down',
    sub:     'Time to relax and recover. Set a bedtime reminder now.',
    cta:     'Set Bedtime',
    bg:      '#271650',
    accent:  '#A78BFA',
    dot:     '#F59E0B',
  },
  {
    title:   'Medication Reminder',
    sub:     'Consistency is key to recovery. Track your daily doses.',
    cta:     'Track Meds',
    bg:      '#3D1212',
    accent:  '#F87171',
    dot:     '#F59E0B',
  },
];

interface HealthRemindersProps {
  onCTAPress?: (action: string) => void;
}

export function HealthReminders({ onCTAPress }: HealthRemindersProps) {
  const banner     = BANNERS[new Date().getHours() % BANNERS.length];
  const [done, setDone] = useState(false);
  const scaleAnim  = useRef(new Animated.Value(1)).current;

  function handleCTA() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 8 }),
    ]).start();
    setDone(true);
    onCTAPress?.(banner.cta);
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 2 }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          borderRadius: 20,
          backgroundColor: banner.bg,
          overflow: 'hidden',
          shadowColor: banner.bg,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 8,
        }}>

        {/* Subtle top-left blob */}
        <View
          style={{
            position: 'absolute',
            top: -28,
            left: -28,
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        />

        {/* Content row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 18,
            paddingVertical: 16,
            gap: 14,
          }}>

          {/* ── Left text block ── */}
          <View style={{ flex: 1, gap: 6 }}>

            {/* Badge pill */}
            <View
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: 'rgba(255,255,255,0.09)',
                borderRadius: 30,
                paddingHorizontal: 9,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.13)',
              }}>
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: banner.accent }} />
              <Text style={{ fontSize: 9.5, fontWeight: '600', color: banner.accent, letterSpacing: 0.8 }}>
                HEALTH REMINDER
              </Text>
            </View>

            {/* Title — medium weight */}
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                color: '#FFFFFF',
                letterSpacing: -0.3,
                lineHeight: 22,
              }}>
              {banner.title}
            </Text>

            {/* Subtitle — normal weight */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: 'rgba(255,255,255,0.58)',
                lineHeight: 17,
              }}>
              {banner.sub}
            </Text>

            {/* CTA */}
            <TouchableOpacity
              onPress={handleCTA}
              activeOpacity={0.8}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginTop: 6,
                backgroundColor: '#FFFFFF',
                borderRadius: 30,
                paddingHorizontal: 14,
                paddingVertical: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 5,
                elevation: 3,
              }}>
              <Ionicons
                name={done ? 'checkmark-circle' : 'add-circle-outline'}
                size={14}
                color={banner.bg}
              />
              <Text style={{ fontSize: 12.5, fontWeight: '600', color: banner.bg, letterSpacing: 0.1 }}>
                {done ? 'Reminder Set!' : banner.cta}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Right static bell ── */}
          <BellIcon dotColor={banner.dot} />
        </View>
      </Animated.View>
    </View>
  );
}
