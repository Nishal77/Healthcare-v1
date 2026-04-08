/**
 * EatingGuide
 * Two sections below the Statistics card — exact replica of reference UI:
 *   1. "How not to overeat?" — tip card with lightbulb icon
 *   2. "Breakfast" — meal heading with recommended time row
 */
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export function EatingGuide() {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>

      {/* ── Section 1: How not to overeat? ──────────────────────────── */}
      <View style={{ marginBottom: 32 }}>

        {/* Title */}
        <Text style={{
          fontSize: 17,
          fontWeight: '700',
          color: '#0D1117',
          letterSpacing: -0.3,
          marginBottom: 3,
        }}>
          How not to overeat?
        </Text>

        {/* Subtitle */}
        <Text style={{
          fontSize: 12.5,
          fontWeight: '400',
          color: '#9CA3AF',
          marginBottom: 14,
        }}>
          A selection of tips on conscious eating
        </Text>

        {/* Tip card */}
        <TouchableOpacity
          activeOpacity={0.82}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F5F6F8',
            borderRadius: 18,
            paddingVertical: 16,
            paddingHorizontal: 16,
            gap: 14,
          }}>

          {/* Bare lightbulb icon */}
          <Ionicons name="bulb-outline" size={26} color="#C9A84C" />

          {/* Text block */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#0D1117',
              letterSpacing: -0.2,
              marginBottom: 3,
            }}>
              #1 Complicating the path to food
            </Text>
            <Text style={{
              fontSize: 12,
              fontWeight: '400',
              color: '#9CA3AF',
            }}>
              If you feel like eating something, then…
            </Text>
          </View>

          {/* Chevron */}
          <Ionicons name="chevron-forward" size={16} color="#C4C9D4" />
        </TouchableOpacity>
      </View>

      {/* ── Section 2: Breakfast ─────────────────────────────────────── */}
      <View>

        {/* Big meal title */}
        <Text style={{
          fontSize: 26,
          fontWeight: '800',
          color: '#0D1117',
          letterSpacing: -0.6,
          marginBottom: 10,
        }}>
          Breakfast
        </Text>

        {/* Recommended time row */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Text style={{
            fontSize: 13,
            fontWeight: '400',
            color: '#9CA3AF',
          }}>
            Recommended time
          </Text>
          <Text style={{
            fontSize: 13,
            fontWeight: '500',
            color: '#6B7280',
          }}>
            09:00 – 10:00
          </Text>
        </View>
      </View>

    </View>
  );
}
