/**
 * HealthReminders
 *
 * A premium banner card below the home search bar.
 * Warm earthy-green healthcare palette — replicates the reference image style
 * with a bold title, subtitle copy, CTA button, and a large decorative icon.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ── Subtle floating animation for the decorative icon ────────────────────────
function FloatingIcon() {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotAnim   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -7,  duration: 1200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue:  0,  duration: 1200, useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotAnim, { toValue:  1, duration: 900, useNativeDriver: true }),
        Animated.timing(rotAnim, { toValue: -1, duration: 900, useNativeDriver: true }),
        Animated.timing(rotAnim, { toValue:  0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const rotate = rotAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-10deg', '10deg'] });

  return (
    <Animated.View
      style={{
        transform: [{ translateY: floatAnim }, { rotate }],
        alignItems: 'center',
        justifyContent: 'center',
      }}>

      {/* Glow ring */}
      <View
        style={{
          position: 'absolute',
          width: 78,
          height: 78,
          borderRadius: 39,
          backgroundColor: 'rgba(255,255,255,0.12)',
        }}
      />

      {/* Icon circle */}
      <View
        style={{
          width: 66,
          height: 66,
          borderRadius: 33,
          backgroundColor: 'rgba(255,255,255,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.25)',
        }}>
        <Ionicons name="alarm-outline" size={32} color="#FFFFFF" />
      </View>

      {/* Small pulse dot top-right */}
      <View
        style={{
          position: 'absolute',
          top: 4,
          right: 2,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: '#F59E0B',
          borderWidth: 2,
          borderColor: '#2C6E49',
        }}
      />
    </Animated.View>
  );
}

// ── Banner variants — rotated daily so it never feels stale ──────────────────
const BANNERS = [
  {
    title:    'Set Your Health\nReminder',
    sub:      "Never miss your morning routine.\nStay consistent, stay healthy.",
    cta:      'Set Reminder',
    bg:       '#1C4A32',       // deep forest green
    pill:     '#2C6E49',
    pillText: '#FFFFFF',
    accent:   '#4ADE80',
  },
  {
    title:    'Hydration\nCheck-In',
    sub:      "You're halfway through the day.\nHave you had enough water?",
    cta:      'Log Water',
    bg:       '#0C3547',       // deep teal
    pill:     '#0B6E8B',
    pillText: '#FFFFFF',
    accent:   '#67E8F9',
  },
  {
    title:    'Evening Wind\nDown',
    sub:      "Time to relax and recover.\nSet a bedtime reminder now.",
    cta:      'Set Bedtime',
    bg:       '#2D1B5E',       // deep indigo
    pill:     '#5B21B6',
    pillText: '#FFFFFF',
    accent:   '#C4B5FD',
  },
  {
    title:    'Medication\nReminder',
    sub:      "Consistency is key to recovery.\nTrack your daily doses.",
    cta:      'Track Meds',
    bg:       '#4A1919',       // deep rose
    pill:     '#B83A3A',
    pillText: '#FFFFFF',
    accent:   '#FCA5A5',
  },
];

interface HealthRemindersProps {
  onCTAPress?: (action: string) => void;
}

export function HealthReminders({ onCTAPress }: HealthRemindersProps) {
  // Pick banner by hour so it changes throughout the day
  const hourIndex = new Date().getHours() % BANNERS.length;
  const banner    = BANNERS[hourIndex];

  const [pressed, setPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  function handleCTA() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 90, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
    ]).start();
    setPressed(true);
    onCTAPress?.(banner.cta);
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          borderRadius: 24,
          backgroundColor: banner.bg,
          overflow: 'hidden',
          // Premium shadow
          shadowColor: banner.bg,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.45,
          shadowRadius: 20,
          elevation: 10,
        }}>

        {/* Background texture — subtle radial blobs */}
        <View
          style={{
            position: 'absolute',
            top: -40,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -30,
            right: 60,
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: 'rgba(255,255,255,0.03)',
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 22,
            paddingVertical: 22,
            gap: 12,
          }}>

          {/* Left: text content */}
          <View style={{ flex: 1, gap: 8 }}>
            {/* Accent label */}
            <View
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 20,
                paddingHorizontal: 9,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.15)',
              }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: banner.accent }} />
              <Text style={{ fontSize: 10, fontWeight: '700', color: banner.accent, letterSpacing: 0.6 }}>
                HEALTH REMINDER
              </Text>
            </View>

            {/* Title */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: '800',
                color: '#FFFFFF',
                lineHeight: 26,
                letterSpacing: -0.5,
              }}>
              {banner.title}
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.62)',
                fontWeight: '400',
                lineHeight: 17,
              }}>
              {banner.sub}
            </Text>

            {/* CTA button */}
            <TouchableOpacity
              onPress={handleCTA}
              activeOpacity={0.82}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
                backgroundColor: pressed ? banner.accent : '#FFFFFF',
                borderRadius: 22,
                paddingHorizontal: 16,
                paddingVertical: 9,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 3,
              }}>
              <Ionicons
                name={pressed ? 'checkmark-circle' : 'add-circle-outline'}
                size={15}
                color={pressed ? banner.bg : banner.bg}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: banner.bg,
                  letterSpacing: -0.1,
                }}>
                {pressed ? 'Reminder Set!' : banner.cta}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right: floating decorative icon */}
          <FloatingIcon />
        </View>
      </Animated.View>
    </View>
  );
}
