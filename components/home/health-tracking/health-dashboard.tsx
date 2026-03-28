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
    <View style={{ paddingHorizontal: 20, gap: 12 }}>
      <HealthSectionHeader onSeeAll={onSeeAll} />

      {/* Main grid: Heart Rate (left, wider) + Steps & Water (right) */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
        {/* Heart Rate card — takes ~57% */}
        <View style={{ flex: 1.35 }}>
          <HeartRateCard bpm={123} status="normal" />
        </View>

        {/* Steps + Water stacked — takes ~43% */}
        <MetricsGrid steps={2316} waterLiters={1.8} />
      </View>

      {/* Goals banner */}
      <PredictiveInsightCard goalsCompleted={2} onLearnMore={onLearnMore} />

      <View style={{ height: 8 }} />
    </View>
  );
}
