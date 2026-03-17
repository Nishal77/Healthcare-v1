import { View } from 'react-native';

import { HealthSectionHeader } from './health-section-header';
import { HeartRateCard } from './heart-rate-card';
import { MetricsGrid } from './metrics-grid';
import { PredictiveInsightCard } from './predictive-insight-card';

interface HealthDashboardProps {
  onSeeAll?: () => void;
  onLearnMore?: () => void;
}

export function HealthDashboard({ onSeeAll, onLearnMore }: HealthDashboardProps) {
  return (
    <View style={{ gap: 16 }}>
      <HealthSectionHeader onSeeAll={onSeeAll} />
      <HeartRateCard bpm={72} status="normal" />
      <MetricsGrid spo2={98} steps={6240} sleepHours={7.2} calories={1840} />
      <PredictiveInsightCard onLearnMore={onLearnMore} />
      {/* Bottom breathing room */}
      <View style={{ height: 8 }} />
    </View>
  );
}
