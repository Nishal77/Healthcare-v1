/**
 * DayMacros
 * Day-view for the Statistics card:
 *   • 2×2 macro grid — Calories / Exercise / Meals / Medicine
 *     (Protein/Fats/Carbs kept as illustrative static tiles until macro tracking is added)
 *   • Water intake banner at the bottom — driven by real DailySummary.
 */
import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { DailySummary } from '@/src/api/endpoints/food-log';

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface Macro {
  label:   string;
  pct:     number;
  current: number;
  goal:    number;
  unit:    string;
  color:   string;
}

function buildMacros(summary: DailySummary | null | undefined): Macro[] {
  const cal  = summary?.totalCalories    ?? 0;
  const calG = summary?.calorieGoal      ?? 2000;
  const ex   = summary?.totalExerciseMin ?? 0;
  const mc   = summary?.mealCount        ?? 0;
  const med  = summary?.medicineCount    ?? 0;

  return [
    {
      label:   'Calories',
      pct:     Math.round((cal  / calG)  * 100),
      current: cal,
      goal:    calG,
      unit:    'kcal',
      color:   '#22C55E',
    },
    {
      label:   'Exercise',
      pct:     Math.round((ex   / 60)    * 100), // goal = 60 min/day
      current: ex,
      goal:    60,
      unit:    'min',
      color:   '#6366F1',
    },
    {
      label:   'Meals',
      pct:     Math.round((mc   / 3)     * 100), // goal = 3 meals/day
      current: mc,
      goal:    3,
      unit:    '',
      color:   '#38BDF8',
    },
    {
      label:   'Medicine',
      pct:     med > 0 ? 100 : 0,
      current: med,
      goal:    1,
      unit:    '',
      color:   '#F97316',
    },
  ];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MacroTile({ macro }: { macro: Macro }) {
  const fill   = Math.min(macro.pct / 100, 1);
  const isOver = macro.pct > 100;
  const pct    = Math.max(macro.pct, 0);

  const valueLabel =
    macro.unit === 'kcal'
      ? `${macro.current} / ${macro.goal.toLocaleString()} kcal`
      : macro.unit === 'min'
        ? `${macro.current} / ${macro.goal} min`
        : macro.unit === ''
          ? `${macro.current} logged`
          : `${macro.current}${macro.unit} / ${macro.goal}${macro.unit}`;

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F5F6F8',
      borderRadius: 18,
      padding: 16,
      minHeight: 130,
    }}>
      <Text style={{ fontSize: 12, fontWeight: '500', color: '#9CA3AF', marginBottom: 10 }}>
        {macro.label}
      </Text>

      <Text style={{
        fontSize: 30,
        fontWeight: '800',
        color: '#0D1117',
        letterSpacing: -1,
        lineHeight: 34,
        marginBottom: 12,
      }}>
        {pct}%
      </Text>

      <View style={{
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginBottom: 10,
        overflow: 'hidden',
      }}>
        <View style={{
          width: `${fill * 100}%`,
          height: '100%',
          backgroundColor: macro.color,
          borderRadius: 3,
        }} />
        {isOver && (
          <View style={{
            position: 'absolute',
            right: 0, top: -1,
            width: 7, height: 7,
            borderRadius: 3.5,
            backgroundColor: macro.color,
          }} />
        )}
      </View>

      <Text style={{ fontSize: 11, fontWeight: '400', color: '#9CA3AF' }}>
        {valueLabel}
      </Text>
    </View>
  );
}

function WaterBanner({ summary }: { summary?: DailySummary | null }) {
  const current = summary?.totalWaterMl ?? 0;
  const goal    = summary?.waterGoalMl  ?? 2500;
  const pct     = Math.round((current / goal) * 100);
  const fill    = Math.min(current / goal, 1);

  return (
    <View style={{
      backgroundColor: '#0D1117',
      borderRadius: 18,
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    }}>
      <View style={{
        width: 44, height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Ionicons name="water-outline" size={22} color="#60A5FA" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#FFFFFF',
          letterSpacing: -0.3,
        }}>
          {current}ml{' '}
          <Text style={{ fontWeight: '400', color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
            / {goal.toLocaleString()}ml
          </Text>
        </Text>
        <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
          Drinking water · {pct}% of daily goal
        </Text>

        <View style={{
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderRadius: 2,
          marginTop: 8,
          overflow: 'hidden',
        }}>
          <View style={{
            width: `${fill * 100}%`,
            height: '100%',
            backgroundColor: '#60A5FA',
            borderRadius: 2,
          }} />
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.35)" />
    </View>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface Props {
  summary?: DailySummary | null;
}

export function DayMacros({ summary }: Props) {
  const macros = buildMacros(summary);

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MacroTile macro={macros[0]} />
        <MacroTile macro={macros[1]} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <MacroTile macro={macros[2]} />
        <MacroTile macro={macros[3]} />
      </View>
      <WaterBanner summary={summary} />
    </View>
  );
}
