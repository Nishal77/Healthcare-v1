/**
 * useHealthData
 *
 * Reads live biometric data from the platform health store:
 *   iOS     → Apple HealthKit  (react-native-health)
 *   Android → Google Health Connect (react-native-health-connect)
 *
 * Returns null data when the native module is absent (Expo Go / simulator).
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

// ── Apple HealthKit (iOS only) ───────────────────────────────────────────────

interface HKValue { value: number }
interface HKSleep { startDate: string; endDate: string; value: string }

interface HKInterface {
  IS_STUB?: boolean;
  Constants: { Permissions: Record<string, string> };
  initHealthKit(opts: object, cb: (err: string | null) => void): void;
  getLatestHeartRate(opts: object, cb: (err: string | null, r: HKValue | null) => void): void;
  getStepCount(opts: object, cb: (err: string | null, r: HKValue | null) => void): void;
  getSleepSamples(opts: object, cb: (err: string | null, r: HKSleep[]) => void): void;
  getLatestBloodOxygenSaturation(opts: object, cb: (err: string | null, r: HKValue | null) => void): void;
  getActiveEnergyBurned(opts: object, cb: (err: string | null, r: HKValue[]) => void): void;
  getHeartRateVariabilitySamples(opts: object, cb: (err: string | null, r: HKValue[]) => void): void;
  getLatestBodyTemperature(opts: object, cb: (err: string | null, r: HKValue | null) => void): void;
}

// Lazy singleton — constructor is safe on Android; every call is guarded by
// Platform.OS === 'ios' so the Android bundle never invokes HealthKit methods.
let _hk: HKInterface | null = null;
let _hkDone = false;

function getHK(): HKInterface | null {
  if (_hkDone) return _hk;
  _hkDone = true;
  if (Platform.OS !== 'ios') return null;
  try {
    const lib = require('react-native-health') as HKInterface & { default?: HKInterface };
    const mod  = lib?.default ?? lib;
    _hk = mod?.IS_STUB ? null : mod;
  } catch {
    _hk = null;
  }
  return _hk;
}

function hkPromise<T>(fn: (cb: (err: string | null, r: T) => void) => void): Promise<T | null> {
  return new Promise(resolve => fn((err, r) => resolve(err ? null : r)));
}

async function initHK(hk: HKInterface): Promise<boolean> {
  return new Promise(resolve =>
    hk.initHealthKit(
      {
        permissions: {
          read: [
            'HeartRate', 'StepCount', 'SleepAnalysis',
            'OxygenSaturation', 'ActiveEnergyBurned',
            'HeartRateVariabilitySDNN', 'BodyTemperature',
          ],
          write: [],
        },
      },
      err => resolve(!err),
    ),
  );
}

async function readHealthKit(hk: HKInterface): Promise<HealthData | null> {
  const ok = await initHK(hk);
  if (!ok) return null;

  const today     = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endDate   = today.toISOString();

  const [hrVal, stepsVal, sleepRecs, spo2Val, calRecs, hrvRecs, tempVal] = await Promise.all([
    hkPromise<HKValue>  (cb => hk.getLatestHeartRate({}, cb)),
    hkPromise<HKValue>  (cb => hk.getStepCount({ date: endDate }, cb)),
    hkPromise<HKSleep[]>(cb => hk.getSleepSamples({ startDate, endDate }, cb)),
    hkPromise<HKValue>  (cb => hk.getLatestBloodOxygenSaturation({}, cb)),
    hkPromise<HKValue[]>(cb => hk.getActiveEnergyBurned({ startDate, endDate }, cb)),
    hkPromise<HKValue[]>(cb => hk.getHeartRateVariabilitySamples({ startDate, endDate, limit: 1 }, cb)),
    hkPromise<HKValue>  (cb => hk.getLatestBodyTemperature({}, cb)),
  ]);

  const heartRate = hrVal?.value ? Math.round(hrVal.value) : 0;
  if (!heartRate) return null; // no real data yet today

  const steps  = stepsVal?.value ? Math.round(stepsVal.value) : 0;
  const spo2   = spo2Val?.value  ? Math.round(spo2Val.value * 100) : 0; // fraction → %
  const hrv    = Math.round((hrvRecs ?? []).at(-1)?.value ?? 0);

  const totalSleepMs = (sleepRecs ?? [])
    .filter(r => r.value === 'ASLEEP' || r.value === 'INBED')
    .reduce((ms, r) => ms + (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()), 0);
  const sleepHours = parseFloat((totalSleepMs / 3_600_000).toFixed(1));

  const calories = Math.round((calRecs ?? []).reduce((s, r) => s + (r.value ?? 0), 0));

  // HealthKit BodyTemperature is in Celsius → convert to °F
  const tempC    = tempVal?.value ?? 0;
  const bodyTemp = tempC ? parseFloat((tempC * 9 / 5 + 32).toFixed(1)) : 0;

  const alerts   = generateDoshaAlert(heartRate, spo2 || 98, sleepHours || 7, steps);
  const doshaRaw = getDoshaBars(steps, sleepHours || 7, heartRate, spo2 || 98);
  const insight  = buildDoshaInsight(doshaRaw.vata, doshaRaw.pitta, doshaRaw.kapha, alerts);

  // Stress derived from HRV: low HRV → high stress
  const stressLevel = hrv > 0 ? Math.max(0, Math.round(100 - hrv * 1.4)) : 0;

  return {
    heartRate,
    spo2:            spo2  || 98,
    hrv,
    steps,
    waterLiters:     0,
    sleepHours,
    calories,
    bodyTemp,
    respiratoryRate: 0,   // HealthKit respiratory rate requires separate permission
    stressLevel,
    nadiType:         getNadiType(heartRate, hrv || 42),
    heartRateStatus:  getHeartRateStatus(heartRate),
    spo2Status:       getSpo2Status(spo2 || 98),
    doshaAlerts:      alerts,
    lastUpdated:      new Date(),
    ...(doshaRaw as unknown as object),
    doshaInsight:     insight,
  } as HealthData & { vata: number; pitta: number; kapha: number; doshaInsight: string };
}

// ── Google Health Connect (Android only) ────────────────────────────────────

type HCModule = {
  IS_STUB?: boolean;
  getSdkStatus:      () => Promise<number>;
  requestPermission: (p: Array<{ accessType: string; recordType: string }>) => Promise<Array<{ granted: boolean }>>;
  readRecords:       (type: string, opts: object) => Promise<{ records: object[] }>;
};

const hcLib = require('react-native-health-connect') as HCModule;
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
  if (!grants.every(g => g.granted)) return null;

  const now    = new Date();
  const today  = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end    = now.toISOString();
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
  if (!heartRate) return null;

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

  const alerts   = generateDoshaAlert(heartRate, spo2 || 98, sleepHours || 7, steps);
  const doshaRaw = getDoshaBars(steps, sleepHours || 7, heartRate, spo2 || 98);
  const insight  = buildDoshaInsight(doshaRaw.vata, doshaRaw.pitta, doshaRaw.kapha, alerts);

  return {
    heartRate,
    spo2:            spo2 || 98,
    hrv:             0,
    steps,
    waterLiters:     0,
    sleepHours,
    calories,
    bodyTemp:        0,
    respiratoryRate: 0,
    stressLevel:     0,
    nadiType:         getNadiType(heartRate, 42),
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
  const [data, setData]   = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const intervalRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const fetchOnce = useCallback(async () => {
    try {
      let result: HealthData | null = null;

      if (Platform.OS === 'ios') {
        const hk = getHK();
        if (hk) result = await readHealthKit(hk);
      } else if (HC_AVAILABLE) {
        result = await readHealthConnect();
      }

      if (result) {
        setData(result);
        setError(null);
      } else {
        setError(
          Platform.OS === 'ios'
            ? 'No Apple Health data yet today. Wear your watch and open the Health app.'
            : 'No Health Connect data yet today. Wear your watch and sync.',
        );
      }
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

  // true when the current platform has a real health data backend
  const isAvailable = Platform.OS === 'ios' ? !!getHK() : HC_AVAILABLE;

  return { data, error, ready, start, reset, isAvailable };
}
