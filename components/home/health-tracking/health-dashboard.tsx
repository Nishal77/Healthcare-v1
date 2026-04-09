import { useEffect } from 'react';
import { View } from 'react-native';
import { useHealthData }    from '../../../hooks/useHealthData';
import { useWatchBluetooth } from '../../../hooks/useWatchBluetooth';
import { buildDoshaInsight, getDoshaBars } from '../../../src/health/dosha-engine';
import { DoshaBalanceCard }    from './dosha-balance-card';
import { HealthSectionHeader } from './health-section-header';
import { HeartRateCard }       from './heart-rate-card';
import { MetricsGrid }         from './metrics-grid';
import { PredictiveInsightCard } from './predictive-insight-card';
import { WatchMetricsRow }     from './watch-metrics-row';

interface HealthDashboardProps {
  onSeeAll?:    () => void;
  onLearnMore?: () => void;
  // Watch sheet is now triggered from the header — dashboard no longer renders it
}

export function HealthDashboard({ onSeeAll, onLearnMore }: HealthDashboardProps) {
  const ble    = useWatchBluetooth();
  const health = useHealthData();

  useEffect(() => {
    if (ble.connectionState === 'connected' && !health.ready) health.start();
    if (ble.connectionState === 'disconnected') health.reset();
  }, [ble.connectionState]); // eslint-disable-line react-hooks/exhaustive-deps

  const data        = health.data;
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

      {/* Heart Rate — full width */}
      <HeartRateCard
        bpm={data?.heartRate ?? 0}
        status={data?.heartRateStatus ?? 'normal'}
        nadiType={data?.nadiType ?? '—'}
        hasData={!!data}
      />

      {/* 2 × 2 metrics grid: Steps · Calories · Sleep · Water */}
      <MetricsGrid
        steps={data?.steps ?? 0}
        waterLiters={data?.waterLiters ?? 0}
        calories={data?.calories ?? 0}
        sleepHours={data?.sleepHours ?? 0}
        hasData={!!data}
      />

      {/* 3-col row: Blood O₂ · HRV · Body Temp + Resp Rate · Stress */}
      <WatchMetricsRow
        spo2={data?.spo2 ?? 0}
        hrv={data?.hrv ?? 0}
        bodyTemp={data?.bodyTemp ?? 0}
        respiratoryRate={data?.respiratoryRate ?? 0}
        stressLevel={data?.stressLevel ?? 0}
        hasData={!!data}
      />

      <DoshaBalanceCard
        vata={dosha.vata}
        pitta={dosha.pitta}
        kapha={dosha.kapha}
        insight={doshaInsight}
      />

      <PredictiveInsightCard
        goalsCompleted={
          isConnected && data
            ? Math.min(data.doshaAlerts.length === 0 ? 3 : 1, 5)
            : 0
        }
        onLearnMore={onLearnMore}
      />

      <View style={{ height: 8 }} />
    </View>
  );
}
