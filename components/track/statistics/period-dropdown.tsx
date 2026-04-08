/**
 * PeriodDropdown
 * Animated pill button that opens a floating Day / Week / Month picker.
 */
import React, { useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export type Period = 'Day' | 'Week' | 'Month';

const OPTIONS: Period[] = ['Day', 'Week', 'Month'];

const GREEN       = '#2C6E49';
const ACTIVE_BG   = '#E8F0EB';
const INACTIVE_BG = '#F4F4F6';

interface Props {
  selected: Period;
  onChange: (p: Period) => void;
}

export function PeriodDropdown({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  function openMenu() {
    setOpen(true);
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 280,
    }).start();
  }

  function closeMenu() {
    Animated.timing(anim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setOpen(false));
  }

  function select(p: Period) {
    onChange(p);
    closeMenu();
  }

  // Animated styles for the dropdown panel
  const panelStyle = {
    opacity:   anim,
    transform: [
      { scale:      anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) },
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0]   }) },
    ],
  };

  // Chevron rotation
  const chevronRotate = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={{ position: 'relative', zIndex: 99 }}>

      {/* ── Trigger pill ─────────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={open ? closeMenu : openMenu}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: open ? ACTIVE_BG : INACTIVE_BG,
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderWidth: open ? 1 : 0,
          borderColor: GREEN,
        }}>
        <Text style={{
          fontSize: 13,
          fontWeight: '600',
          color: open ? GREEN : '#374151',
        }}>
          {selected}
        </Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Ionicons name="chevron-down" size={13} color={open ? GREEN : '#6B7280'} />
        </Animated.View>
      </TouchableOpacity>

      {/* ── Floating dropdown panel ───────────────────────────────────── */}
      {open && (
        <Animated.View style={[{
          position: 'absolute',
          top: 44,
          right: 0,
          width: 130,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          paddingVertical: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.13,
          shadowRadius: 20,
          elevation: 14,
        }, panelStyle]}>
          {OPTIONS.map((p, i) => {
            const isActive = p === selected;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => select(p)}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 11,
                  backgroundColor: isActive ? '#F0FBF5' : 'transparent',
                  marginHorizontal: 4,
                  borderRadius: 10,
                  marginBottom: i < OPTIONS.length - 1 ? 2 : 0,
                }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? GREEN : '#374151',
                }}>
                  {p}
                </Text>
                {isActive && (
                  <Ionicons name="checkmark" size={15} color={GREEN} />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}
