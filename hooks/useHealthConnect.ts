import { useCallback, useEffect, useRef, useState } from 'react';
import {
  buildDoshaInsight,
  generateDoshaAlert,
  getDoshaBars,
  getHeartRateStatus,
  getNadiType,
  getSpo2Status,
} from '../src/health/dosha-engine';
import type { HealthData, HealthHookReturn, WatchConnectionState } from '../src/health/types';

// expo-health-connect is Android-only and requires a dev client build.
// We gracefully swallow the require() error on iOS / Expo Go so the app never crashes.
type HealthConnectModule = {
  getSdkStatus: () => Promise<number>;
  requestPermission: (perms: Array<{ accessType: string; recordType: string }>) => Promise<Array<{ granted: boolean }>>;
  readRecords: (type: string, opts: object) => Promise<{ records: object[] }>;
};

let HealthConnect: HealthConnectModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  HealthConnect = require('react-native-health-connect') as HealthConnectModule;
} catch {
  HealthConnect = null;
}

const PERMISSIONS = [
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'OxygenSaturation' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
];

async function readHealthData(): Promise<HealthData> {
  if (!HealthConnect) throw new Error('Health Connect not available');

  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end   = now.toISOString();

  const timeFilter = { operator: 'between', startTime: today, endTime: end };

  const [hrRes, stepsRes, sleepRes, spo2Res, calRes] = await Promise.all([
    HealthConnect.readRecords('HeartRate',            { timeRangeFilter: timeFilter }),
    HealthConnect.readRecords('Steps',                { timeRangeFilter: timeFilter }),
    HealthConnect.readRecords('SleepSession',         { timeRangeFilter: timeFilter }),
    HealthConnect.readRecords('OxygenSaturation',     { timeRangeFilter: timeFilter }),
    HealthConnect.readRecords('ActiveCaloriesBurned', { timeRangeFilter: timeFilter }),
  ]);

  const latestHr  = (hrRes.records as Array<Record<string, unknown>>).at(-1);
  const heartRate = latestHr
    ? Math.round(((latestHr.samples as Array<Record<string, number>>)?.at(-1)?.beatsPerMinute ?? 72))
    : 72;

  const steps = (stepsRes.records as Array<Record<string, number>>)
    .reduce((s, r) => s + (r.count ?? 0), 0);

  const totalSleepMs = (sleepRes.records as Array<Record<string, string>>).reduce((ms, r) => {
    return ms + (new Date(r.endTime).getTime() - new Date(r.startTime).getTime());
  }, 0);
  const sleepHours = parseFloat((totalSleepMs / 3_600_000).toFixed(1));

  const latestSpo2  = (spo2Res.records as Array<Record<string, Record<string, number>>>).at(-1);
  const spo2        = latestSpo2 ? Math.round(latestSpo2.percentage?.value ?? 98) : 98;

  const calories = Math.round(
    (calRes.records as Array<Record<string, Record<string, number>>>)
      .reduce((s, r) => s + (r.energy?.inKilocalories ?? 0), 0),
  );

  const hrv      = 42;
  const bodyTemp = 98.4;
  const waterLiters = 1.5;

  const alerts       = generateDoshaAlert(heartRate, spo2, sleepHours, steps);
  const doshaRaw     = getDoshaBars(steps, sleepHours, heartRate, spo2);
  const doshaInsight = buildDoshaInsight(doshaRaw.vata, doshaRaw.pitta, doshaRaw.kapha, alerts);

  return {
    heartRate,
    spo2,
    hrv,
    steps,
    waterLiters,
    sleepHours,
    calories,
    bodyTemp,
    nadiType: getNadiType(heartRate, hrv),
    heartRateStatus: getHeartRateStatus(heartRate),
    spo2Status: getSpo2Status(spo2),
    doshaAlerts: alerts,
    lastUpdated: new Date(),
    ...(doshaRaw as unknown as object),
    doshaInsight,
  } as HealthData & { vata: number; pitta: number; kapha: number; doshaInsight: string };
}

export function useHealthConnect(): HealthHookReturn {
  const [state, setState] = useState<WatchConnectionState>(
    HealthConnect ? 'disconnected' : 'unavailable',
  );
  const [data, setData]   = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchAndSet = useCallback(async () => {
    try {
      const fresh = await readHealthData();
      setData(fresh);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!HealthConnect) {
      setState('unavailable');
      return;
    }
    try {
      setState('connecting');
      const available = await HealthConnect.getSdkStatus();
      if (available !== 3) {
        setState('unavailable');
        setError('Health Connect not installed on this device.');
        return;
      }

      const granted = await HealthConnect.requestPermission(PERMISSIONS);
      if (!granted.every(p => p.granted)) {
        setState('disconnected');
        setError('Some Health Connect permissions were denied.');
        return;
      }

      setState('connected');
      await fetchAndSet();
      intervalRef.current = setInterval(fetchAndSet, 60_000);
    } catch (e) {
      setState('disconnected');
      setError((e as Error).message);
    }
  }, [fetchAndSet]);

  const disconnect = useCallback(() => {
    stopPolling();
    setData(null);
    setState('disconnected');
    setError(null);
  }, [stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  return {
    data,
    connectionState: state,
    connect,
    disconnect,
    isLoading: state === 'connecting',
    error,
  };
}
