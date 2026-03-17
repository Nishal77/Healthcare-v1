import { View } from 'react-native';

import { MetricCard } from './metric-card';

interface MetricsGridProps {
  spo2?: number;
  steps?: number;
  sleepHours?: number;
  calories?: number;
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
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <MetricCard
          iconName="water-outline"
          iconColor="#3B82F6"
          label="Blood Oxygen"
          value={spo2.toString()}
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
          iconName="walk-outline"
          iconColor="#22C55E"
          label="Steps Today"
          value={steps >= 1000 ? (steps / 1000).toFixed(1) + 'k' : steps.toString()}
          unit="steps"
          trend={Math.round((steps / stepsGoal) * 100).toString() + '% of goal'}
          trendUp={steps >= stepsGoal * 0.5}
          bgColor="#F0FDF4"
          iconBgColor="#DCFCE7"
          valueColor="#14532D"
          progress={steps / stepsGoal}
          progressColor="#22C55E"
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <MetricCard
          iconName="moon-outline"
          iconColor="#A855F7"
          label="Sleep Last Night"
          value={sleepHours.toString()}
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
          iconName="flame-outline"
          iconColor="#F97316"
          label="Calories Burned"
          value={calories >= 1000 ? (calories / 1000).toFixed(1) + 'k' : calories.toString()}
          unit="kcal"
          trend={Math.round((calories / caloriesGoal) * 100).toString() + '% of goal'}
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
