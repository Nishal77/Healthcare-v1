import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { SemiGauge } from './semi-gauge';

interface Macro {
  emoji: string;
  label: string;
  current: number;
  goal: number;
  color: string;
}

interface VitalityMeterCardProps {
  caloriesLeft?: number;
  caloriesTotal?: number;
  steps?: number;
  stepsGoal?: number;
  macros?: Macro[];
}

const DEFAULT_MACROS: Macro[] = [
  { emoji: '🥩', label: 'Protein', current: 34, goal: 80, color: '#EF4444' },
  { emoji: '🌾', label: 'Carbs',   current: 62, goal: 160, color: '#F59E0B' },
  { emoji: '🥑', label: 'Fat',     current: 18, goal: 55, color: '#8B5CF6' },
];

export function VitalityMeterCard({
  caloriesLeft = 640,
  caloriesTotal = 2200,
  steps = 3400,
  stepsGoal = 10000,
  macros = DEFAULT_MACROS,
}: VitalityMeterCardProps) {
  const stepsProgress = Math.min(steps / stepsGoal, 1);
  const caloriesBurned = caloriesTotal - caloriesLeft;

  return (
    <View
      style={{
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        overflow: 'hidden',
      }}>

      {/* Card Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: 4,
        }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827', letterSpacing: -0.3 }}>
          Daily Vitality
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#F0FDF4',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#BBF7D0',
          }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' }} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#15803D' }}>Today</Text>
        </View>
      </View>

      {/* Gauge Row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 0 }}>

        {/* Left: Steps */}
        <View style={{ paddingBottom: 18, gap: 6 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              backgroundColor: '#F0FDF4',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
            }}>
            <Ionicons name="walk-outline" size={22} color="#2C6E49" />
          </View>
          <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '500' }}>Steps</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>
              {steps.toLocaleString()}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>
              /{stepsGoal.toLocaleString()}
            </Text>
          </View>
          {/* Mini steps progress bar */}
          <View style={{ width: 64, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
            <View
              style={{
                width: `${Math.round(stepsProgress * 100)}%`,
                height: 4,
                backgroundColor: '#2C6E49',
                borderRadius: 2,
              }}
            />
          </View>
        </View>

        {/* Right: Semicircle Gauge */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ position: 'relative', alignItems: 'center' }}>
            <SemiGauge progress={stepsProgress} />

            {/* Center overlay: calories */}
            <View
              style={{
                position: 'absolute',
                bottom: 2,
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 22 }}>🔥</Text>
              <Text style={{ fontSize: 26, fontWeight: '900', color: '#111827', lineHeight: 28, letterSpacing: -1 }}>
                {caloriesLeft}
              </Text>
              <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '500', marginTop: 1 }}>
                kcal left
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Calorie sub-stats */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, paddingBottom: 12, paddingTop: 4 }}>
        {[
          { label: 'Burned', value: caloriesBurned, color: '#F59E0B' },
          { label: 'Goal',   value: caloriesTotal,  color: '#2C6E49' },
        ].map(({ label, value, color }) => (
          <View key={label} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color }}>{value}</Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 16 }} />

      {/* Macros Row */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 14, gap: 8 }}>
        {macros.map(({ emoji, label, current, goal, color }) => (
          <View
            key={label}
            style={{
              flex: 1,
              alignItems: 'center',
              gap: 4,
            }}>
            <Text style={{ fontSize: 20 }}>{emoji}</Text>
            {/* Macro progress bar */}
            <View style={{ width: '80%', height: 3, backgroundColor: '#F3F4F6', borderRadius: 2 }}>
              <View
                style={{
                  width: `${Math.min((current / goal) * 100, 100)}%`,
                  height: 3,
                  backgroundColor: color,
                  borderRadius: 2,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{current}</Text>
              <Text style={{ fontSize: 10, color: '#9CA3AF' }}>/{goal}g</Text>
            </View>
            <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '500' }}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
