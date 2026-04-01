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

const MOCK_DEVICE = 'ColorFit Pro 3';

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

function randomIn(min: number, max: number, decimals = 0): number {
  const val = Math.random() * (max - min) + min;
  return decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.round(val);
}

function buildMockData(): HealthData {
  const heartRate   = randomIn(68, 92);
  const spo2        = randomIn(96, 99);
  const hrv         = randomIn(38, 62);
  const steps       = randomIn(1800, 7200);
  const sleepHours  = randomIn(5, 8, 1);
  const calories    = randomIn(900, 2400);
  const bodyTemp    = randomIn(97.6, 99.0, 1);
  const waterLiters = randomIn(0.8, 2.4, 1);

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

export function useMockHealthData(): HealthHookReturn {
  const [connState, setConnState] = useState<WatchConnectionState>('disconnected');
  const [step, setStep]           = useState<ConnectionStep>('idle');
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [data, setData]           = useState<HealthData | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef              = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    setData(buildMockData());
    intervalRef.current = setInterval(() => setData(buildMockData()), 5000);
  }, []);

  // Step 1 — user taps "Sync via Health Connect"
  const startScan = useCallback(async () => {
    cancelledRef.current = false;
    setError(null);
    setDeviceName(null);

    setStep('checking_bluetooth');
    await sleep(900);
    if (cancelledRef.current) return;

    // Simulate Bluetooth is OFF — shows the "Turn On Bluetooth" screen
    setStep('bluetooth_off');
  }, []);

  // Step 2 — user taps "Turn On Bluetooth" (or opens Settings on real device)
  const enableBluetooth = useCallback(async () => {
    if (cancelledRef.current) return;
    setStep('scanning');
    await sleep(2200);
    if (cancelledRef.current) return;

    setDeviceName(MOCK_DEVICE);
    setStep('device_found');
  }, []);

  // Step 3 — user taps "Connect Now" when device is found
  const connectToDevice = useCallback(async () => {
    if (cancelledRef.current) return;
    setConnState('connecting');
    setStep('connecting_to_device');
    await sleep(2400);
    if (cancelledRef.current) return;

    setConnState('connected');
    setStep('idle');
    startPolling();
  }, [startPolling]);

  const disconnect = useCallback(() => {
    cancelledRef.current = true;
    stopPolling();
    setData(null);
    setDeviceName(null);
    setConnState('disconnected');
    setStep('idle');
    setError(null);
  }, [stopPolling]);

  useEffect(() => () => {
    cancelledRef.current = true;
    stopPolling();
  }, [stopPolling]);

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
