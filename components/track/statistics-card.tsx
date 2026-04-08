/**
 * StatisticsCard
 * Shell card that hosts the period picker and swaps the chart view:
 *   Day   → DayMacros  (2×2 macro grid + water banner)
 *   Week  → WeekChart  (stacked bar chart Mon–Sun)
 *   Month → MonthChart (28-day bezier line chart — Fats / Carbs / Protein)
 */
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { DayMacros }                    from './statistics/day-macros';
import { WeekChart }                    from './statistics/week-chart';
import { MonthChart }                   from './statistics/month-chart';
import { PeriodDropdown, type Period }  from './statistics/period-dropdown';

export function StatisticsCard() {
  const [period, setPeriod] = useState<Period>('Week');

  return (
    <View style={{
      marginHorizontal: 20,
      marginBottom: 24,
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 18,
      elevation: 5,
      overflow: 'visible',
    }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#0D1117',
            letterSpacing: -0.4,
          }}>
            Statistics
          </Text>
          <Text style={{
            fontSize: 11.5,
            color: '#9CA3AF',
            marginTop: 3,
            lineHeight: 16,
          }}>
            Recommended Nutritional Value and Statistics
          </Text>
        </View>

        {/* Period picker — Day / Week / Month */}
        <PeriodDropdown selected={period} onChange={setPeriod} />
      </View>

      {/* ── Content — swaps based on selected period ─────────────────── */}
      {period === 'Day'   && <DayMacros  />}
      {period === 'Week'  && <WeekChart  />}
      {period === 'Month' && <MonthChart />}
    </View>
  );
}
