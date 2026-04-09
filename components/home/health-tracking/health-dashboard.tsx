import { useEffect } from 'react';
import { View } from 'react-native';
import { useHealthData }    from '../../../hooks/useHealthData';
import { useWatchBluetooth } from '../../../hooks/useWatchBluetooth';
import { buildDoshaInsight, getDoshaBars } from '../../../src/health/dosha-engine';
import type { HealthData } from '../../../src/health/types';
import { DoshaBalanceCard }    from './dosha-balance-card';
import { HealthSectionHeader } from './health-section-header';
import { HeartRateCard }       from './heart-rate-card';
import { MetricsGrid }         from './metrics-grid';
import { PredictiveInsightCard } from './predictive-insight-card';
import { WatchMetricsRow }     from './watch-metrics-row';

// ── Preview data shown when no watch is connected ─────────────────────────────
// Gives the UI a premium, filled-in look for first-time / unconnected users.
const PREVIEW: HealthData = {
  heartRate:       72,
  spo2:            98,
  hrv:             52,
  steps:           6842,
  waterLiters:     1.8,
  sleepHours:      7.2,
  calories:        1450,
  bodyTemp:        98.2,
  respiratoryRate: 16,
  stressLevel:     32,
  nadiType:        'Vata-Pitta',
  heartRateStatus: 'normal',
  spo2Status:      'optimal',
  doshaAlerts:     [],
  lastUpdated:     new Date(),
};

interface HealthDashboardProps {
  onSeeAll?:    () => void;
  onLearnMore?: () => void;
}

export function HealthDashboard({ onSeeAll, onLearnMore }: HealthDashboardProps) {
  const ble    = useWatchBluetooth();
  const health = useHealthData();

  useEffect(() => {
    if (ble.connectionState === 'connected' && !health.ready) health.start();
    if (ble.connectionState === 'disconnected') health.reset();
  }, [ble.connectionState]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLive = ble.connectionState === 'connected' && !!health.data;

  // Real data when watch is live; preview data otherwise (always looks filled-in)
  const d: HealthData = health.data ?? PREVIEW;

  const dosha = getDoshaBars(d.steps, d.sleepHours, d.heartRate, d.spo2);

  const doshaInsight = isLive
    ? buildDoshaInsight(dosha.vata, dosha.pitta, dosha.kapha, d.doshaAlerts)
    : 'Your Pitta is slightly elevated. Try cooling foods — cucumber, coconut water — and avoid midday sun.';

  return (
    <View style={{ paddingHorizontal: 20, gap: 12 }}>

      <HealthSectionHeader
        onSeeAll={onSeeAll}
        onDisconnect={ble.disconnect}
        connectionState={ble.connectionState}
        lastUpdated={d.lastUpdated}
        deviceName={ble.connectedDevice?.name ?? null}
      />

      {/* Heart Rate — full width, same white card style as grid */}
      <HeartRateCard
        bpm={d.heartRate}
        status={d.heartRateStatus}
        nadiType={d.nadiType}
        isLive={isLive}
      />

      {/* 2 × 2 metrics grid: Calories · Water · Sleep · Steps */}
      <MetricsGrid
        steps={d.steps}
        waterLiters={d.waterLiters}
        calories={d.calories}
        sleepHours={d.sleepHours}
        hasData
      />

      {/* Wearable row: Blood O₂ · HRV · Body Temp + Resp Rate · Stress */}
      <WatchMetricsRow
        spo2={d.spo2}
        hrv={d.hrv}
        bodyTemp={d.bodyTemp}
        respiratoryRate={d.respiratoryRate}
        stressLevel={d.stressLevel}
        hasData
      />

      <DoshaBalanceCard
        vata={dosha.vata}
        pitta={dosha.pitta}
        kapha={dosha.kapha}
        insight={doshaInsight}
      />

      <PredictiveInsightCard
        goalsCompleted={isLive ? Math.min(d.doshaAlerts.length === 0 ? 3 : 1, 5) : 2}
        onLearnMore={onLearnMore}
      />

      <View style={{ height: 8 }} />
    </View>
  );
}
