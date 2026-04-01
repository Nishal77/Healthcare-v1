import { Platform, View } from 'react-native';
import { useHealthConnect } from '../../../hooks/useHealthConnect';
import { useMockHealthData } from '../../../hooks/useMockHealthData';
import { buildDoshaInsight, getDoshaBars } from '../../../src/health/dosha-engine';
import { ConnectWatchBanner } from './connect-watch-banner';
import { DoshaBalanceCard } from './dosha-balance-card';
import { HealthSectionHeader } from './health-section-header';
import { HeartRateCard } from './heart-rate-card';
import { MetricsGrid } from './metrics-grid';
import { PredictiveInsightCard } from './predictive-insight-card';
import { WatchMetricsRow } from './watch-metrics-row';

// IS_MOCK=true → always use simulated data (works in Expo Go, iOS, no watch needed)
// IS_MOCK=false → use real Health Connect on Android dev builds
const IS_MOCK = true;

interface HealthDashboardProps {
  onSeeAll?: () => void;
  onLearnMore?: () => void;
}

export function HealthDashboard({ onSeeAll, onLearnMore }: HealthDashboardProps) {
  // Static imports only — Metro can't handle dynamic require() for unknown modules.
  // useHealthConnect uses the metro stub on Expo Go / iOS and returns 'unavailable'.
  const mockHook = useMockHealthData();
  const liveHook = useHealthConnect();

  const { data, connectionState, connect, disconnect, isLoading } =
    IS_MOCK || Platform.OS === 'ios' ? mockHook : liveHook;

  const isConnected = connectionState === 'connected';

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

      <WatchMetricsRow
        spo2={data?.spo2 ?? 98}
        hrv={data?.hrv ?? 42}
        bodyTemp={data?.bodyTemp ?? 98.4}
      />

      <DoshaBalanceCard
        vata={dosha.vata}
        pitta={dosha.pitta}
        kapha={dosha.kapha}
        insight={doshaInsight}
      />

      <PredictiveInsightCard
        goalsCompleted={isConnected && data ? Math.min(data.doshaAlerts.length === 0 ? 3 : 1, 5) : 0}
        onLearnMore={onLearnMore}
      />

      <View style={{ height: 8 }} />
    </View>
  );
}
