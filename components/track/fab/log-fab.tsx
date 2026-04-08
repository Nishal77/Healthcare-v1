/**
 * LogFab
 * Premium floating action button — fixed above the bottom tab bar.
 * Glows on press and opens the LogEntrySheet.
 */
import React, { useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  bottomOffset: number;   // insets.bottom + tab bar height
  onPress: () => void;
}

export function LogFab({ bottomOffset, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  function onPressIn() {
    Animated.spring(scale, { toValue: 0.91, useNativeDriver: true, speed: 40 }).start();
  }
  function onPressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  }

  return (
    <Animated.View style={{
      position:   'absolute',
      bottom:     bottomOffset + 16,
      right:      20,
      transform:  [{ scale }],
      // Outer glow ring
      shadowColor:   '#0D1117',
      shadowOffset:  { width: 0, height: 8 },
      shadowOpacity: 0.28,
      shadowRadius:  16,
      elevation:     14,
    }}>
      {/* Soft halo behind the button */}
      <View style={{
        position:        'absolute',
        top: -6, left: -6, right: -6, bottom: -6,
        borderRadius:    40,
        backgroundColor: 'rgba(44,110,73,0.12)',
      }} />

      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={{
          width:           56,
          height:          56,
          borderRadius:    28,
          backgroundColor: '#0D1117',
          alignItems:      'center',
          justifyContent:  'center',
          borderWidth:     1,
          borderColor:     'rgba(255,255,255,0.08)',
        }}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}
