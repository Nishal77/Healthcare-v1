import { Linking } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  buildDoshaInsight,
  generateDoshaAlert,
  getDoshaBars,
  getHeartRateStatus,
  getNadiType,
  getSpo2Status,
} from '../src/health/dosha-engine';
import type {
  ConnectionStep,
  HealthData,
  HealthHookReturn,
  WatchConnectionState,
} from '../src/health/types';

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

  const now    = new Date();
  const today  = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end    = now.toISOString();
  const filter = { operator: 'between', startTime: today, endTime: end };

  const [hrRes, stepsRes, sleepRes, spo2Res, calRes] = await Promise.all([
    HealthConnect.readRecords('HeartRate',            { timeRangeFilter: filter }),
    HealthConnect.readRecords('Steps',                { timeRangeFilter: filter }),
    HealthConnect.readRecords('SleepSession',         { timeRangeFilter: filter }),
    HealthConnect.readRecords('OxygenSaturation',     { timeRangeFilter: filter }),
    HealthConnect.readRecords('ActiveCaloriesBurned', { timeRangeFilter: filter }),
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

  const latestSpo2 = (spo2Res.records as Array<Record<string, Record<string, number>>>).at(-1);
  const spo2       = latestSpo2 ? Math.round(latestSpo2.percentage?.value ?? 98) : 98;

  const calories = Math.round(
    (calRes.records as Array<Record<string, Record<string, number>>>)
      .reduce((s, r) => s + (r.energy?.inKilocalories ?? 0), 0),
  );

  const hrv = 42;
  const bodyTemp = 98.4;
  const waterLiters = 1.5;

  const alerts       = generateDoshaAlert(heartRate, spo2, sleepHours, steps);
  const doshaRaw     = getDoshaBars(steps, sleepHours, heartRate, spo2);
  const doshaInsight = buildDoshaInsight(doshaRaw.vata, doshaRaw.pitta, doshaRaw.kapha, alerts);

  return {
    heartRate, spo2, hrv, steps, waterLiters, sleepHours, calories, bodyTemp,
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
  const [connState, setConnState] = useState<WatchConnectionState>(
    HealthConnect ? 'disconnected' : 'unavailable',
  );
  const [step, setStep]           = useState<ConnectionStep>('idle');
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [data, setData]           = useState<HealthData | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const fetchAndSet = useCallback(async () => {
    try { setData(await readHealthData()); setError(null); }
    catch (e) { setError((e as Error).message); }
  }, []);

  // Step 1 — check Bluetooth / SDK availability
  const startScan = useCallback(async () => {
    if (!HealthConnect) {
      setConnState('unavailable');
      setStep('failed');
      setError('Health Connect is only available on Android dev builds.');
      return;
    }
    try {
      setError(null);
      setStep('checking_bluetooth');
      const status = await HealthConnect.getSdkStatus();

      if (status !== 3) {
        // SDK not installed or Bluetooth unavailable
        setStep('bluetooth_off');
        return;
      }

      setStep('scanning');
      // Request permissions then "find" the device
      const granted = await HealthConnect.requestPermission(PERMISSIONS);
      if (!granted.every(p => p.granted)) {
        setStep('failed');
        setError('Health Connect permissions denied.');
        return;
      }
      setDeviceName('Health Connect');
      setStep('device_found');
    } catch (e) {
      setStep('failed');
      setError((e as Error).message);
    }
  }, []);

  // Step 2 — open settings so user can enable Bluetooth / install Health Connect
  const enableBluetooth = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch { /* ignore */ }
    // After user returns from Settings, re-check
    setStep('scanning');
    try {
      if (!HealthConnect) return;
      const status = await HealthConnect.getSdkStatus();
      if (status === 3) {
        setDeviceName('Health Connect');
        setStep('device_found');
      } else {
        setStep('bluetooth_off');
      }
    } catch {
      setStep('bluetooth_off');
    }
  }, []);

  // Step 3 — connect and start reading data
  const connectToDevice = useCallback(async () => {
    try {
      setConnState('connecting');
      setStep('connecting_to_device');
      await fetchAndSet();
      setConnState('connected');
      setStep('idle');
      intervalRef.current = setInterval(fetchAndSet, 60_000);
    } catch (e) {
      setStep('failed');
      setError((e as Error).message);
      setConnState('disconnected');
    }
  }, [fetchAndSet]);

  const disconnect = useCallback(() => {
    stopPolling();
    setData(null);
    setDeviceName(null);
    setConnState('disconnected');
    setStep('idle');
    setError(null);
  }, [stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  return {
    data,
    connectionState: connState,
    connectionStep: step,
    deviceName,
    startScan,
    connectToDevice,
    enableBluetooth,
    disconnect,
    isLoading: connState === 'connecting' || step === 'checking_bluetooth' || step === 'scanning' || step === 'connecting_to_device',
    error,
  };
}
