import { View } from 'react-native';

import { DoshaBalanceCard } from './dosha-balance-card';
import { HealthSectionHeader } from './health-section-header';
import { HeartRateCard } from './heart-rate-card';
import { MetricsGrid } from './metrics-grid';
import { PredictiveInsightCard } from './predictive-insight-card';
import { WatchMetricsRow } from './watch-metrics-row';

interface HealthDashboardProps {
  onSeeAll?: () => void;
  onLearnMore?: () => void;
}

export function HealthDashboard({ onSeeAll, onLearnMore }: HealthDashboardProps) {
  return (
    <View style={{ paddingHorizontal: 20, gap: 12 }}>
      <HealthSectionHeader onSeeAll={onSeeAll} />

      {/* Row 1: Heart Rate (wider left) + Steps & Water (right) */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
        <View style={{ flex: 1.35 }}>
          <HeartRateCard bpm={123} status="normal" />
        </View>
        <MetricsGrid steps={2316} waterLiters={1.8} />
      </View>

      {/* Row 2: Watch metrics — SpO2, HRV, Body Temp */}
      <WatchMetricsRow />

      {/* Row 3: Dosha Balance — Ayurvedic predictive analysis */}
      <DoshaBalanceCard vata={32} pitta={45} kapha={23} />

      {/* Goals banner */}
      <PredictiveInsightCard goalsCompleted={2} onLearnMore={onLearnMore} />

      <View style={{ height: 8 }} />
    </View>
  );
}
