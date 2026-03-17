import { View } from 'react-native';

import { MetricCard } from './metric-card';

interface MetricsGridProps {
  spo2?: number;      // e.g. 98
  steps?: number;     // e.g. 6240
  sleepHours?: number; // e.g. 7.2
  calories?: number;  // e.g. 1840
}

export function MetricsGrid({
  spo2 = 98,
  steps = 6240,
  sleepHours = 7.2,
  calories = 1840,
}: MetricsGridProps) {
  const stepsGoal = 10000;
  const caloriesGoal = 2200;

  return (
    <View style={{ paddingHorizontal: 20, gap: 12 }}>
      {/* Row 1: SpO2 + Steps */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <MetricCard
          icon="🫁"
          label="Blood Oxygen"
          value={`${spo2}`}
          unit="%"
          trend="Optimal range"
          trendUp
          bgColor="#EFF6FF"
          iconBgColor="#DBEAFE"
          valueColor="#1E40AF"
          progress={spo2 / 100}
          progressColor="#3B82F6"
        />
        <MetricCard
          icon="👟"
          label="Steps Today"
          value={steps >= 1000 ? `${(steps / 1000).toFixed(1)}k` : `${steps}`}
          unit="steps"
          trend={`${Math.round((steps / stepsGoal) * 100)}% of goal`}
          trendUp={steps >= stepsGoal * 0.5}
          bgColor="#F0FDF4"
          iconBgColor="#DCFCE7"
          valueColor="#14532D"
          progress={steps / stepsGoal}
          progressColor="#22C55E"
        />
      </View>

      {/* Row 2: Sleep + Calories */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <MetricCard
          icon="🌙"
          label="Sleep Last Night"
          value={`${sleepHours}`}
          unit="hrs"
          trend={sleepHours >= 7 ? 'Well rested' : 'Below target'}
          trendUp={sleepHours >= 7}
          bgColor="#FDF4FF"
          iconBgColor="#F3E8FF"
          valueColor="#581C87"
          progress={sleepHours / 9}
          progressColor="#A855F7"
        />
        <MetricCard
          icon="🔥"
          label="Calories Burned"
          value={calories >= 1000 ? `${(calories / 1000).toFixed(1)}k` : `${calories}`}
          unit="kcal"
          trend={`${Math.round((calories / caloriesGoal) * 100)}% of goal`}
          trendUp={calories >= caloriesGoal * 0.7}
          bgColor="#FFF7ED"
          iconBgColor="#FFEDD5"
          valueColor="#7C2D12"
          progress={calories / caloriesGoal}
          progressColor="#F97316"
        />
      </View>
    </View>
  );
}
