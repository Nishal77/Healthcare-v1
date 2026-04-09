/**
 * EatingGuide
 * Today's food log with a recommended meal card + meal entry list.
 */
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── Data ─────────────────────────────────────────────────────────────────────

const RECOMMENDATION = {
  icon:     'leaf-outline'  as const,
  iconColor:'#16A34A',
  label:    'Today\'s Pick',
  title:    'Quinoa Power Bowl',
  subtitle: 'High protein · complex carbs · ~520 kcal',
};

interface MealEntry {
  time:     string;
  mealType: string;
  food:     string;
  kcal:     number;
  icon:     React.ComponentProps<typeof Ionicons>['name'];
  iconColor:string;
  iconBg:   string;
}

const MEALS: MealEntry[] = [
  {
    time:     '08:30',
    mealType: 'Breakfast',
    food:     'Oats & Banana Bowl',
    kcal:     380,
    icon:     'sunny-outline',
    iconColor:'#F59E0B',
    iconBg:   '#FFFBEB',
  },
  {
    time:     '13:00',
    mealType: 'Lunch',
    food:     'Grilled Chicken Wrap',
    kcal:     540,
    icon:     'restaurant-outline',
    iconColor:'#F97316',
    iconBg:   '#FFF7ED',
  },
  {
    time:     '16:30',
    mealType: 'Snack',
    food:     'Mixed Nuts & Apple',
    kcal:     210,
    icon:     'nutrition-outline',
    iconColor:'#10B981',
    iconBg:   '#ECFDF5',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Today's date label e.g. "Tuesday, 8 Apr" */
function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day:     'numeric',
    month:   'short',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MealCard({ meal }: { meal: MealEntry }) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={{
        flexDirection:  'row',
        alignItems:     'center',
        backgroundColor:'#F5F6F8',
        borderRadius:   18,
        paddingVertical:  15,
        paddingHorizontal:16,
        marginBottom:   10,
        gap: 14,
      }}>

      {/* Icon tile */}
      <View style={{
        width: 42, height: 42,
        borderRadius: 13,
        backgroundColor: meal.iconBg,
        alignItems:      'center',
        justifyContent:  'center',
        flexShrink: 0,
      }}>
        <Ionicons name={meal.icon} size={19} color={meal.iconColor} />
      </View>

      {/* Food name + meal type */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize:     14,
          fontWeight:   '700',
          color:        '#0D1117',
          letterSpacing:-0.2,
          marginBottom: 2,
        }}>
          {meal.food}
        </Text>
        <Text style={{ fontSize: 11.5, color: '#9CA3AF' }}>
          {meal.mealType} · {meal.kcal} kcal
        </Text>
      </View>

      {/* Time badge */}
      <View style={{
        backgroundColor: '#EBEBEF',
        borderRadius:    20,
        paddingHorizontal:9,
        paddingVertical:  4,
      }}>
        <Text style={{
          fontSize:   11.5,
          fontWeight: '600',
          color:      '#6B7280',
          fontVariant:['tabular-nums'],
        }}>
          {meal.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function EatingGuide() {
  const totalKcal = MEALS.reduce((s, m) => s + m.kcal, 0);

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 4 }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={{ marginBottom: 14 }}>
        <View style={{
          flexDirection:  'row',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
        }}>
          <Text style={{
            fontSize:     17,
            fontWeight:   '700',
            color:        '#0D1117',
            letterSpacing:-0.3,
          }}>
            Today's Intake
          </Text>
          {/* Total kcal badge */}
          <View style={{
            backgroundColor: '#F0FBF5',
            borderRadius:    20,
            paddingHorizontal:10,
            paddingVertical:  4,
          }}>
            <Text style={{
              fontSize:   11.5,
              fontWeight: '600',
              color:      '#2C6E49',
            }}>
              {totalKcal} kcal
            </Text>
          </View>
        </View>
        <Text style={{
          fontSize:   12.5,
          fontWeight: '400',
          color:      '#9CA3AF',
          marginTop:  3,
        }}>
          {todayLabel()}
        </Text>
      </View>

      {/* ── Recommendation card (same style as original tip card) ─── */}
      <TouchableOpacity
        activeOpacity={0.82}
        style={{
          flexDirection:    'row',
          alignItems:       'center',
          backgroundColor:  '#F5F6F8',
          borderRadius:     18,
          paddingVertical:  16,
          paddingHorizontal:16,
          gap:    14,
          marginBottom: 22,
        }}>

        <Ionicons
          name={RECOMMENDATION.icon}
          size={26}
          color={RECOMMENDATION.iconColor}
        />

        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize:     10.5,
            fontWeight:   '600',
            color:        RECOMMENDATION.iconColor,
            letterSpacing: 0.5,
            marginBottom:  2,
          }}>
            {RECOMMENDATION.label.toUpperCase()}
          </Text>
          <Text style={{
            fontSize:   14,
            fontWeight: '700',
            color:      '#0D1117',
            letterSpacing:-0.2,
            marginBottom:3,
          }}>
            {RECOMMENDATION.title}
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
            {RECOMMENDATION.subtitle}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#C4C9D4" />
      </TouchableOpacity>

      {/* ── Meal entries ────────────────────────────────────────────── */}
      <Text style={{
        fontSize:     13,
        fontWeight:   '600',
        color:        '#6B7280',
        letterSpacing: 0.2,
        marginBottom:  10,
      }}>
        LOGGED TODAY
      </Text>

      {MEALS.map(meal => (
        <MealCard key={meal.mealType} meal={meal} />
      ))}

    </View>
  );
}
