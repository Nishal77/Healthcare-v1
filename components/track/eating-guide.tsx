/**
 * EatingGuide
 * Two premium sections displayed below the Statistics card:
 *
 *  1. Eating Tips — "How not to overeat?" scrollable tip cards
 *  2. Meal Schedule — Recommended time windows for each meal of the day
 */
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── Data ─────────────────────────────────────────────────────────────────────

const TIPS = [
  {
    id: 1,
    title: 'Complicating the path to food',
    preview: 'If you feel like eating something, then…',
    icon: 'bulb-outline' as const,
    iconColor: '#F59E0B',
    iconBg:    '#FFFBEB',
  },
  {
    id: 2,
    title: 'Eat slowly, chew every bite',
    preview: 'Your brain needs 20 minutes to register…',
    icon: 'time-outline' as const,
    iconColor: '#10B981',
    iconBg:    '#ECFDF5',
  },
  {
    id: 3,
    title: 'Use smaller plates',
    preview: 'Visual portion cues trick the brain into…',
    icon: 'restaurant-outline' as const,
    iconColor: '#6366F1',
    iconBg:    '#EEF2FF',
  },
  {
    id: 4,
    title: 'Drink water before meals',
    preview: 'A glass of water 30 min before eating…',
    icon: 'water-outline' as const,
    iconColor: '#38BDF8',
    iconBg:    '#F0F9FF',
  },
];

interface MealSlot {
  name:      string;
  subtitle:  string;
  timeRange: string;
  icon:      React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg:    string;
  accent:    string;
}

const MEALS: MealSlot[] = [
  {
    name:      'Breakfast',
    subtitle:  'Recommended time',
    timeRange: '08:00 – 10:00',
    icon:      'sunny-outline',
    iconColor: '#F59E0B',
    iconBg:    '#FFFBEB',
    accent:    '#FEF3C7',
  },
  {
    name:      'Lunch',
    subtitle:  'Recommended time',
    timeRange: '12:30 – 14:00',
    icon:      'partly-sunny-outline',
    iconColor: '#F97316',
    iconBg:    '#FFF7ED',
    accent:    '#FFEDD5',
  },
  {
    name:      'Snack',
    subtitle:  'Optional window',
    timeRange: '16:00 – 17:00',
    icon:      'nutrition-outline',
    iconColor: '#10B981',
    iconBg:    '#ECFDF5',
    accent:    '#D1FAE5',
  },
  {
    name:      'Dinner',
    subtitle:  'Recommended time',
    timeRange: '19:00 – 20:30',
    icon:      'moon-outline',
    iconColor: '#818CF8',
    iconBg:    '#EEF2FF',
    accent:    '#E0E7FF',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single scrollable tip card */
function TipCard({ tip, index }: { tip: typeof TIPS[0]; index: number }) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={{
        width: 280,
        backgroundColor: '#F8F9FB',
        borderRadius: 18,
        padding: 16,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        // Subtle top-left accent
        borderLeftWidth: 3,
        borderLeftColor: tip.iconColor,
      }}>

      {/* Icon tile */}
      <View style={{
        width: 44, height: 44,
        borderRadius: 14,
        backgroundColor: tip.iconBg,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Ionicons name={tip.icon} size={20} color={tip.iconColor} />
      </View>

      {/* Text block */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 10,
          fontWeight: '600',
          color: tip.iconColor,
          letterSpacing: 0.6,
          marginBottom: 3,
        }}>
          #{index + 1}
        </Text>
        <Text style={{
          fontSize: 13.5,
          fontWeight: '700',
          color: '#0D1117',
          lineHeight: 18,
          marginBottom: 3,
        }}>
          {tip.title}
        </Text>
        <Text style={{ fontSize: 11.5, color: '#9CA3AF', lineHeight: 15 }}>
          {tip.preview}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={15} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

/** Single meal row */
function MealRow({ meal }: { meal: MealSlot }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        marginBottom: 10,
        gap: 14,
      }}>

      {/* Icon */}
      <View style={{
        width: 42, height: 42,
        borderRadius: 13,
        backgroundColor: meal.iconBg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Ionicons name={meal.icon} size={20} color={meal.iconColor} />
      </View>

      {/* Name + subtitle */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 15,
          fontWeight: '700',
          color: '#0D1117',
          letterSpacing: -0.2,
        }}>
          {meal.name}
        </Text>
        <Text style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 1 }}>
          {meal.subtitle}
        </Text>
      </View>

      {/* Time range pill */}
      <View style={{
        backgroundColor: meal.accent,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}>
        <Text style={{
          fontSize: 12,
          fontWeight: '600',
          color: meal.iconColor,
          letterSpacing: -0.2,
        }}>
          {meal.timeRange}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function EatingGuide() {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>

      {/* ══ Section 1: Eating Tips ═══════════════════════════════════════ */}
      <View style={{ marginBottom: 28 }}>

        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '800',
            color: '#0D1117',
            letterSpacing: -0.4,
          }}>
            How not to overeat?
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#2C6E49' }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 14 }}>
          A selection of tips on conscious eating
        </Text>

        {/* Horizontal tip carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 4 }}>
          {TIPS.map((tip, i) => (
            <TipCard key={tip.id} tip={tip} index={i} />
          ))}
        </ScrollView>
      </View>

      {/* ══ Section 2: Meal Schedule ══════════════════════════════════════ */}
      <View>

        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '800',
            color: '#0D1117',
            letterSpacing: -0.4,
          }}>
            Meal Schedule
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#2C6E49' }}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 12.5, color: '#9CA3AF', marginBottom: 14 }}>
          Your recommended eating windows today
        </Text>

        {/* Meal rows */}
        {MEALS.map(meal => (
          <MealRow key={meal.name} meal={meal} />
        ))}
      </View>

    </View>
  );
}
