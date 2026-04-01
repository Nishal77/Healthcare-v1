/**
 * useWatchBluetooth
 *
 * Real BLE scanning using react-native-ble-plx.
 * - Shows actual device names found in Bluetooth range
 * - Monitors real Bluetooth power state (on / off)
 * - Connecting to a device triggers a real BLE pairing attempt
 * - In Expo Go, native modules are absent → step = 'dev_build_required'
 */

import { Linking, Platform } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ConnectionStep, ScannedDevice, WatchConnectionState } from '../src/health/types';

// ── BLE module resolution ────────────────────────────────────────────────────
// Metro maps 'react-native-ble-plx' → stub when native module is absent.
// The stub exports IS_STUB = true so we know we're running without hardware.
const bleLib = require('react-native-ble-plx') as {
  BleManager: new () => BleManagerLike;
  State: Record<string, string>;
  IS_STUB?: boolean;
};

interface BleDevice {
  id: string;
  name: string | null;
  rssi: number | null;
  connect: () => Promise<BleDevice>;
}

interface BleManagerLike {
  onStateChange(cb: (state: string) => void, emit: boolean): { remove(): void };
  state(): Promise<string>;
  startDeviceScan(
    uuids: string[] | null,
    options: { allowDuplicates?: boolean } | null,
    cb: (error: Error | null, device: BleDevice | null) => void,
  ): void;
  stopDeviceScan(): void;
  connectToDevice(id: string, options?: object): Promise<BleDevice>;
  cancelDeviceConnection(id: string): Promise<BleDevice>;
  destroy(): void;
}

const IS_NATIVE_BLE = !bleLib.IS_STUB;

// Single BleManager instance for the app lifetime
let _manager: BleManagerLike | null = null;
function getManager(): BleManagerLike | null {
  if (!IS_NATIVE_BLE) return null;
  if (!_manager) _manager = new bleLib.BleManager();
  return _manager;
}

// ── Watch name heuristics ────────────────────────────────────────────────────
// BLE devices advertise their name. Filter by common watch brand/model patterns.
const WATCH_RE = new RegExp(
  [
    'watch', 'band', 'fit', 'sport', 'health', 'smart', 'wrist',
    'noise', 'colorfit', 'galaxy\\s?watch', 'galaxy\\s?fit',
    'amazfit', 'stratos', 'zepp', 'bip', 'gtr', 'gts',
    'garmin', 'fenix', 'vivoactive', 'forerunner',
    'fitbit', 'sense', 'versa', 'charge',
    'mi\\s?band', 'mi\\s?watch', 'xiaomi',
    'fossil', 'polar', 'huawei', 'honor\\s?band',
    'realme\\s?watch', 'boat', 'fire-boltt', 'haylou', 'ticwatch',
    'oppo\\s?watch', 'oneplus\\s?watch',
  ].join('|'),
  'i',
);

function isWatchDevice(name: string | null): boolean {
  return !!name && WATCH_RE.test(name);
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useWatchBluetooth() {
  const [connState, setConnState]   = useState<WatchConnectionState>('disconnected');
  const [step, setStep]             = useState<ConnectionStep>(
    IS_NATIVE_BLE ? 'idle' : 'dev_build_required',
  );
  const [devices, setDevices]       = useState<ScannedDevice[]>([]);
  const [connected, setConnected]   = useState<ScannedDevice | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const manager       = getManager();
  const stateSubRef   = useRef<{ remove(): void } | null>(null);
  const scanTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seenIds       = useRef<Set<string>>(new Set());

  // Monitor Bluetooth power state in the background
  useEffect(() => {
    if (!manager) return;
    stateSubRef.current = manager.onStateChange(state => {
      if (state === 'PoweredOff' && step === 'scanning') {
        stopScan();
        setStep('bluetooth_off');
      }
    }, true);
    return () => stateSubRef.current?.remove();
  }, [manager, step]); // eslint-disable-line react-hooks/exhaustive-deps

  const stopScan = useCallback(() => {
    manager?.stopDeviceScan();
    if (scanTimerRef.current) { clearTimeout(scanTimerRef.current); scanTimerRef.current = null; }
  }, [manager]);

  // ── Step 1: user taps "Sync via Health Connect" ──────────────────────────
  const startScan = useCallback(async () => {
    if (!manager) {
      setStep('dev_build_required');
      return;
    }
    setError(null);
    setDevices([]);
    seenIds.current.clear();
    setStep('checking_bluetooth');

    let btState: string;
    try {
      btState = await manager.state();
    } catch (e) {
      setStep('failed');
      setError('Could not check Bluetooth state.');
      return;
    }

    if (btState !== 'PoweredOn') {
      setStep('bluetooth_off');
      return;
    }

    setStep('scanning');
    manager.startDeviceScan(null, { allowDuplicates: false }, (err, device) => {
      if (err) {
        setStep('failed');
        setError(err.message);
        stopScan();
        return;
      }
      if (!device) return;
      if (seenIds.current.has(device.id)) return;
      if (!isWatchDevice(device.name)) return;

      seenIds.current.add(device.id);
      const found: ScannedDevice = {
        id:   device.id,
        name: device.name ?? device.id,
        rssi: device.rssi ?? -999,
      };
      setDevices(prev => {
        const next = [...prev.filter(d => d.id !== found.id), found];
        // Sort strongest signal first
        next.sort((a, b) => b.rssi - a.rssi);
        return next;
      });
      setStep('devices_found');
    });

    // Auto-stop scan after 20 seconds to save battery
    scanTimerRef.current = setTimeout(() => {
      manager.stopDeviceScan();
      setDevices(prev => {
        if (prev.length === 0) {
          setStep('failed');
          setError('No watches found nearby. Make sure your watch Bluetooth is on.');
        }
        return prev;
      });
    }, 20_000);
  }, [manager, stopScan]);

  // ── Step 2: user taps "Turn On Bluetooth" ───────────────────────────────
  const enableBluetooth = useCallback(async () => {
    if (Platform.OS === 'android') {
      // On Android we can request enable directly via an intent
      try {
        await Linking.openURL('android.settings.BLUETOOTH_SETTINGS');
      } catch {
        await Linking.openSettings();
      }
    } else {
      // iOS — can only open Settings
      await Linking.openURL('App-Prefs:Bluetooth').catch(() => Linking.openSettings());
    }
    // After user returns, re-check state
    setStep('checking_bluetooth');
    try {
      const state = await manager?.state();
      if (state === 'PoweredOn') {
        setStep('idle');
        // Kick off scan automatically once BT is on
        await startScan();
      } else {
        setStep('bluetooth_off');
      }
    } catch {
      setStep('bluetooth_off');
    }
  }, [manager, startScan]);

  // ── Step 3: user taps a device from the list ────────────────────────────
  const selectDevice = useCallback(async (device: ScannedDevice) => {
    if (!manager) return;
    stopScan();
    setConnState('connecting');
    setStep('connecting_to_device');
    setError(null);

    try {
      await manager.connectToDevice(device.id, { autoConnect: false });
      setConnected(device);
      setConnState('connected');
      setStep('idle');
    } catch (e) {
      setConnState('disconnected');
      setStep('failed');
      setError(`Could not connect to ${device.name}. Keep it awake and try again.`);
    }
  }, [manager, stopScan]);

  // ── Disconnect ───────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    if (manager && connected) {
      manager.cancelDeviceConnection(connected.id).catch(() => {});
    }
    stopScan();
    setConnected(null);
    setConnState('disconnected');
    setStep('idle');
    setDevices([]);
    seenIds.current.clear();
    setError(null);
  }, [manager, connected, stopScan]);

  useEffect(() => () => {
    stopScan();
    stateSubRef.current?.remove();
  }, [stopScan]);

  return {
    connectionState: connState,
    connectionStep: step,
    scannedDevices: devices,
    connectedDevice: connected,
    startScan,
    selectDevice,
    enableBluetooth,
    disconnect,
    isLoading:
      step === 'checking_bluetooth' ||
      step === 'scanning' ||
      step === 'connecting_to_device' ||
      step === 'reading_health',
    error,
  };
}
