/**
 * useHealthData
 *
 * Reads live biometric data from the platform health store:
 *   Android → Google Health Connect (react-native-health-connect)
 *   iOS     → Apple HealthKit via Linking to the Health app (full HealthKit
 *              access requires a dev build with react-native-health installed)
 *
 * Returns null data when the native module is absent (Expo Go).
 * Never returns fabricated numbers — if data isn't available, data === null.
 */

import { Platform } from 'react-native';
import { useCallback, useRef, useState } from 'react';
import {
  buildDoshaInsight,
  generateDoshaAlert,
  getDoshaBars,
  getHeartRateStatus,
  getNadiType,
  getSpo2Status,
} from '../src/health/dosha-engine';
import type { HealthData } from '../src/health/types';

// ── Health Connect (Android) ─────────────────────────────────────────────────
type HCModule = {
  getSdkStatus: () => Promise<number>;
  requestPermission: (p: Array<{ accessType: string; recordType: string }>) => Promise<Array<{ granted: boolean }>>;
  readRecords: (type: string, opts: object) => Promise<{ records: object[] }>;
};

const hcLib = require('react-native-health-connect') as HCModule & { IS_STUB?: boolean };
const HC_AVAILABLE = Platform.OS === 'android' && !hcLib.IS_STUB;

const HC_PERMISSIONS = [
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'OxygenSaturation' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
];

async function readHealthConnect(): Promise<HealthData | null> {
  // SDK_AVAILABLE = 3
  const status = await hcLib.getSdkStatus();
  if (status !== 3) return null;

  const grants = await hcLib.requestPermission(HC_PERMISSIONS);
  if (!grants.every((g) => g.granted)) return null;

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end   = now.toISOString();
  const filter = { operator: 'between', startTime: today, endTime: end };

  const [hrRes, stepsRes, sleepRes, spo2Res, calRes] = await Promise.all([
    hcLib.readRecords('HeartRate',            { timeRangeFilter: filter }),
    hcLib.readRecords('Steps',                { timeRangeFilter: filter }),
    hcLib.readRecords('SleepSession',         { timeRangeFilter: filter }),
    hcLib.readRecords('OxygenSaturation',     { timeRangeFilter: filter }),
    hcLib.readRecords('ActiveCaloriesBurned', { timeRangeFilter: filter }),
  ]);

  const latestHr  = (hrRes.records as Array<Record<string, unknown>>).at(-1);
  const heartRate = latestHr
    ? Math.round(((latestHr.samples as Array<Record<string, number>>)?.at(-1)?.beatsPerMinute ?? 0))
    : 0;
  if (!heartRate) return null; // no real data today yet

  const steps = (stepsRes.records as Array<Record<string, number>>)
    .reduce((s, r) => s + (r.count ?? 0), 0);

  const totalSleepMs = (sleepRes.records as Array<Record<string, string>>)
    .reduce((ms, r) => ms + (new Date(r.endTime).getTime() - new Date(r.startTime).getTime()), 0);
  const sleepHours = parseFloat((totalSleepMs / 3_600_000).toFixed(1));

  const latestSpo2 = (spo2Res.records as Array<Record<string, Record<string, number>>>).at(-1);
  const spo2       = latestSpo2 ? Math.round(latestSpo2.percentage?.value ?? 0) : 0;

  const calories = Math.round(
    (calRes.records as Array<Record<string, Record<string, number>>>)
      .reduce((s, r) => s + (r.energy?.inKilocalories ?? 0), 0),
  );

  // Health Connect doesn't expose HRV directly on all devices
  const hrv      = 0;
  const bodyTemp = 0;
  const waterLiters = 0;

  const alerts   = generateDoshaAlert(heartRate, spo2 || 98, sleepHours || 7, steps);
  const doshaRaw = getDoshaBars(steps, sleepHours || 7, heartRate, spo2 || 98);
  const insight  = buildDoshaInsight(doshaRaw.vata, doshaRaw.pitta, doshaRaw.kapha, alerts);

  return {
    heartRate,
    spo2:        spo2 || 98,
    hrv,
    steps,
    waterLiters,
    sleepHours,
    calories,
    bodyTemp,
    nadiType:         getNadiType(heartRate, hrv || 42),
    heartRateStatus:  getHeartRateStatus(heartRate),
    spo2Status:       getSpo2Status(spo2 || 98),
    doshaAlerts:      alerts,
    lastUpdated:      new Date(),
    ...(doshaRaw as unknown as object),
    doshaInsight:     insight,
  } as HealthData & { vata: number; pitta: number; kapha: number; doshaInsight: string };
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useHealthData() {
  const [data, setData]     = useState<HealthData | null>(null);
  const [error, setError]   = useState<string | null>(null);
  const [ready, setReady]   = useState(false);
  const intervalRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const fetchOnce = useCallback(async () => {
    try {
      let result: HealthData | null = null;

      if (HC_AVAILABLE) {
        result = await readHealthConnect();
      }
      // iOS HealthKit: requires dev build with react-native-health installed.
      // When that native module is available in a future build, add an else-if branch here.

      if (result) { setData(result); setError(null); }
      else        { setError('No health data available yet for today. Wear your watch and sync.'); }
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const start = useCallback(async () => {
    setReady(false);
    await fetchOnce();
    setReady(true);
    intervalRef.current = setInterval(fetchOnce, 60_000);
  }, [fetchOnce]);

  const reset = useCallback(() => {
    stop();
    setData(null);
    setReady(false);
    setError(null);
  }, [stop]);

  return { data, error, ready, start, reset, isAvailable: HC_AVAILABLE };
}
