import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { DAY_SUMMARY } from '../care-data';

// ─── Single metric column ──────────────────────────────────────────────────────
interface MetricProps {
  label: string;
  value: string;
  progress: number; // 0–1
  barColor: string;
}

function Metric({ label, value, progress, barColor }: MetricProps) {
  const pct = `${Math.min(Math.round(progress * 100), 100)}%`;
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '800',
          color: '#0D1117',
          letterSpacing: -0.3,
          lineHeight: 18,
        }}>
        {value}
      </Text>

      {/* Progress bar */}
      <View
        style={{
          height: 4,
          backgroundColor: '#F3F4F6',
          borderRadius: 2,
          marginVertical: 6,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: pct,
            height: 4,
            backgroundColor: barColor,
            borderRadius: 2,
          }}
        />
      </View>

      <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '500' }}>{label}</Text>
    </View>
  );
}

// ─── Icon tile (top-right trio) ────────────────────────────────────────────────
function IconTile({ iconName, color }: { iconName: string; color: string }) {
  return (
    <View
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#EFEFEF',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.09)',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* Top-edge catch light */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 4,
          right: 4,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      />
      <Ionicons name={iconName as any} size={18} color={color} />
    </View>
  );
}

// ─── Summary card ──────────────────────────────────────────────────────────────
export function SummaryCard() {
  const s = DAY_SUMMARY;

  return (
    // Shadow wrapper
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.09,
        shadowRadius: 16,
        elevation: 7,
      }}>

      {/* Inner border + clip */}
      <View
        style={{
          borderRadius: 22,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.09)',
          padding: 18,
        }}>

        {/* Inner top-edge highlight */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 16,
            right: 16,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.9)',
          }}
        />

        {/* ── Top row: big calorie number + icon trio ───────────── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}>
          <View>
            <Text
              style={{
                fontSize: 52,
                fontWeight: '800',
                color: '#0D1117',
                letterSpacing: -2.5,
                lineHeight: 56,
              }}>
              {s.caloriesLeft.toLocaleString()}
            </Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500', marginTop: 2 }}>
              Calories left
            </Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <IconTile iconName="restaurant-outline" color="#16A34A" />
            <IconTile iconName="flame-outline"      color="#EF4444" />
            <IconTile iconName="barbell-outline"    color="#7C3AED" />
          </View>
        </View>

        {/* ── Divider ───────────────────────────────────────────── */}
        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 14 }} />

        {/* ── Metrics row ───────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <Metric
            label="Calories Loss"
            value={`${s.caloriesLoss} kcal`}
            progress={s.caloriesLoss / s.caloriesLossTarget}
            barColor="#EF4444"
          />

          {/* Vertical divider */}
          <View style={{ width: 1, height: 44, backgroundColor: 'rgba(0,0,0,0.06)' }} />

          <Metric
            label="Completed"
            value={`${s.exercisesCompleted}/${s.exercisesTarget} exr`}
            progress={s.exercisesCompleted / s.exercisesTarget}
            barColor="#F59E0B"
          />

          <View style={{ width: 1, height: 44, backgroundColor: 'rgba(0,0,0,0.06)' }} />

          <Metric
            label="Time Spent"
            value={`${s.timeSpentHr.toFixed(1)} hr`}
            progress={s.timeSpentHr / s.timeSpentTarget}
            barColor="#8B5CF6"
          />
        </View>
      </View>
    </View>
  );
}
