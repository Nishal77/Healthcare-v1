import { Platform, View } from 'react-native';
import { useMockHealthData } from '../../../hooks/useMockHealthData';
import { buildDoshaInsight, getDoshaBars } from '../../../src/health/dosha-engine';
import { ConnectWatchBanner } from './connect-watch-banner';
import { DoshaBalanceCard } from './dosha-balance-card';
import { HealthSectionHeader } from './health-section-header';
import { HeartRateCard } from './heart-rate-card';
import { MetricsGrid } from './metrics-grid';
import { PredictiveInsightCard } from './predictive-insight-card';
import { WatchMetricsRow } from './watch-metrics-row';

// Flip to false to use the real Health Connect hook on Android dev build
const IS_MOCK = true;

interface HealthDashboardProps {
  onSeeAll?: () => void;
  onLearnMore?: () => void;
}

export function HealthDashboard({ onSeeAll, onLearnMore }: HealthDashboardProps) {
  // On iOS Health Connect is unavailable — always fall back to mock
  const useHook = IS_MOCK || Platform.OS === 'ios'
    ? useMockHealthData
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    : require('../../../hooks/useHealthConnect').useHealthConnect;

  const { data, connectionState, connect, disconnect, isLoading } = useHook();

  const isConnected = connectionState === 'connected';

  // Derive dosha bars from live data or show defaults
  const dosha = data
    ? getDoshaBars(data.steps, data.sleepHours, data.heartRate, data.spo2)
    : { vata: 32, pitta: 45, kapha: 23 };

  const doshaInsight = data
    ? buildDoshaInsight(dosha.vata, dosha.pitta, dosha.kapha, data.doshaAlerts)
    : 'Connect your watch to get real-time Dosha analysis powered by your biometrics.';

  return (
    <View style={{ paddingHorizontal: 20, gap: 12 }}>
      <HealthSectionHeader
        onSeeAll={onSeeAll}
        onDisconnect={disconnect}
        connectionState={connectionState}
        lastUpdated={data?.lastUpdated ?? null}
      />

      {!isConnected ? (
        <ConnectWatchBanner onConnect={connect} isConnecting={isLoading} />
      ) : null}

      {/* Row 1: Heart Rate + Steps & Water */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
        <View style={{ flex: 1.35 }}>
          <HeartRateCard
            bpm={data?.heartRate ?? 72}
            status={data?.heartRateStatus ?? 'normal'}
            nadiType={data?.nadiType ?? 'Kaphaja'}
          />
        </View>
        <MetricsGrid
          steps={data?.steps ?? 0}
          waterLiters={data?.waterLiters ?? 0}
        />
      </View>

      {/* Row 2: SpO2, HRV, Body Temp */}
      <WatchMetricsRow
        spo2={data?.spo2 ?? 98}
        hrv={data?.hrv ?? 42}
        bodyTemp={data?.bodyTemp ?? 98.4}
      />

      {/* Row 3: Dosha Balance */}
      <DoshaBalanceCard
        vata={dosha.vata}
        pitta={dosha.pitta}
        kapha={dosha.kapha}
        insight={doshaInsight}
      />

      {/* Goals banner */}
      <PredictiveInsightCard
        goalsCompleted={isConnected && data ? Math.min(data.doshaAlerts.length === 0 ? 3 : 1, 5) : 0}
        onLearnMore={onLearnMore}
      />

      <View style={{ height: 8 }} />
    </View>
  );
}
