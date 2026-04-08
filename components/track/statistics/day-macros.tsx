/**
 * DayMacros
 * Day-view for the Statistics card:
 *   • 2×2 macro grid — Calories / Protein / Fats / Carbohydrates
 *     Each tile shows percentage, a colour progress bar, and current/goal values.
 *   • Water intake banner at the bottom.
 */
import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── Data ────────────────────────────────────────────────────────────────────

interface Macro {
  label:   string;
  pct:     number;   // percentage of goal achieved
  current: number;
  goal:    number;
  unit:    string;
  color:   string;   // progress bar fill colour
}

const MACROS: Macro[] = [
  { label: 'Calories',      pct: 30,  current: 702, goal: 1547, unit: 'kcal', color: '#22C55E' },
  { label: 'Protein',       pct: 106, current: 173, goal: 157,  unit: 'g',    color: '#6366F1' },
  { label: 'Fats',          pct: 43,  current: 37,  goal: 71,   unit: 'g',    color: '#38BDF8' },
  { label: 'Carbohydrates', pct: 11,  current: 163, goal: 346,  unit: 'g',    color: '#F97316' },
];

const WATER = { current: 200, goal: 2660 };

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Single macro tile */
function MacroTile({ macro }: { macro: Macro }) {
  const fill = Math.min(macro.pct / 100, 1); // cap at 100% for bar width
  const isOver = macro.pct > 100;

  const valueLabel =
    macro.unit === 'kcal'
      ? `${macro.current} / ${macro.goal.toLocaleString()} kcal`
      : `${macro.current}g / ${macro.goal}g`;

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F5F6F8',
      borderRadius: 18,
      padding: 16,
      minHeight: 130,
    }}>
      {/* Label */}
      <Text style={{ fontSize: 12, fontWeight: '500', color: '#9CA3AF', marginBottom: 10 }}>
        {macro.label}
      </Text>

      {/* Percentage */}
      <Text style={{
        fontSize: 30,
        fontWeight: '800',
        color: '#0D1117',
        letterSpacing: -1,
        lineHeight: 34,
        marginBottom: 12,
      }}>
        {macro.pct}%
      </Text>

      {/* Progress bar */}
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
        {/* Over-goal indicator — small bright cap */}
        {isOver && (
          <View style={{
            position: 'absolute',
            right: 0,
            top: -1,
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: macro.color,
          }} />
        )}
      </View>

      {/* Value label */}
      <Text style={{ fontSize: 11, fontWeight: '400', color: '#9CA3AF' }}>
        {valueLabel}
      </Text>
    </View>
  );
}

/** Water intake banner */
function WaterBanner() {
  const pct  = Math.round((WATER.current / WATER.goal) * 100);
  const fill = WATER.current / WATER.goal;

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
      {/* Water glass icon */}
      <View style={{
        width: 44, height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Ionicons name="water-outline" size={22} color="#60A5FA" />
      </View>

      {/* Text block */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#FFFFFF',
          letterSpacing: -0.3,
        }}>
          {WATER.current}ml{' '}
          <Text style={{ fontWeight: '400', color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
            / {WATER.goal.toLocaleString()}ml
          </Text>
        </Text>
        <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
          Drinking water · {pct}% of daily goal
        </Text>

        {/* Mini progress bar */}
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

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.35)" />
    </View>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function DayMacros() {
  return (
    <View>
      {/* 2×2 macro grid */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 0 }}>
        <MacroTile macro={MACROS[0]} />
        <MacroTile macro={MACROS[1]} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <MacroTile macro={MACROS[2]} />
        <MacroTile macro={MACROS[3]} />
      </View>

      {/* Water banner */}
      <WaterBanner />
    </View>
  );
}
