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

function randomIn(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min;
  return decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.round(val);
}

function buildMockData(): HealthData {
  const heartRate   = randomIn(68, 88);
  const spo2        = randomIn(96, 99);
  const hrv         = randomIn(38, 60);
  const steps       = randomIn(1800, 6500);
  const sleepHours  = randomIn(5, 8, 1);
  const calories    = randomIn(900, 2200);
  const bodyTemp    = randomIn(97.6, 99.0, 1);
  const waterLiters = randomIn(0.8, 2.2, 1);

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
    // attach derived dosha bars for dashboard usage
    ...(doshaRaw as unknown as object),
    doshaInsight,
  } as HealthData & { vata: number; pitta: number; kapha: number; doshaInsight: string };
}

export function useMockHealthData(): HealthHookReturn {
  const [state, setState] = useState<WatchConnectionState>('disconnected');
  const [data, setData]   = useState<HealthData | null>(null);
  const [error]           = useState<string | null>(null);
  const intervalRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback(() => {
    setData(buildMockData());
    intervalRef.current = setInterval(() => {
      setData(buildMockData());
    }, 5000);
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const connect = useCallback(async () => {
    setState('connecting');
    await new Promise<void>(resolve => setTimeout(resolve, 1800));
    setState('connected');
    startPolling();
  }, [startPolling]);

  const disconnect = useCallback(() => {
    stopPolling();
    setData(null);
    setState('disconnected');
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
