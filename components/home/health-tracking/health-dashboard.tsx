import { useEffect } from 'react';
import { View } from 'react-native';
import { useHealthData } from '../../../hooks/useHealthData';
import { useWatchBluetooth } from '../../../hooks/useWatchBluetooth';
import { buildDoshaInsight, getDoshaBars } from '../../../src/health/dosha-engine';
import { ConnectWatchBanner } from './connect-watch-banner';
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
  const ble    = useWatchBluetooth();
  const health = useHealthData();

  // When BLE connects, kick off health data reading
  useEffect(() => {
    if (ble.connectionState === 'connected' && !health.ready) {
      health.start();
    }
    if (ble.connectionState === 'disconnected') {
      health.reset();
    }
  }, [ble.connectionState]); // eslint-disable-line react-hooks/exhaustive-deps

  const data = health.data;
  const isConnected = ble.connectionState === 'connected';

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
        onDisconnect={ble.disconnect}
        connectionState={ble.connectionState}
        lastUpdated={data?.lastUpdated ?? null}
        deviceName={ble.connectedDevice?.name ?? null}
      />

      {!isConnected && (
        <ConnectWatchBanner
          connectionStep={ble.connectionStep}
          scannedDevices={ble.scannedDevices}
          connectedDevice={ble.connectedDevice}
          onStartScan={ble.startScan}
          onSelectDevice={ble.selectDevice}
          onEnableBluetooth={ble.enableBluetooth}
          onRetry={ble.disconnect}
          error={ble.error ?? health.error}
        />
      )}

      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
        <View style={{ flex: 1.35 }}>
          <HeartRateCard
            bpm={data?.heartRate ?? 0}
            status={data?.heartRateStatus ?? 'normal'}
            nadiType={data?.nadiType ?? '—'}
            hasData={!!data}
          />
        </View>
        <MetricsGrid
          steps={data?.steps ?? 0}
          waterLiters={data?.waterLiters ?? 0}
          hasData={!!data}
        />
      </View>

      <WatchMetricsRow
        spo2={data?.spo2 ?? 0}
        hrv={data?.hrv ?? 0}
        bodyTemp={data?.bodyTemp ?? 0}
        hasData={!!data}
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
