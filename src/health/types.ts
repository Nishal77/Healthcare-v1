export type DoshaType = 'vata' | 'pitta' | 'kapha';
export type MetricStatus = 'optimal' | 'normal' | 'elevated' | 'low' | 'critical';

export type WatchConnectionState =
  | 'unavailable'    // native modules not present (Expo Go)
  | 'disconnected'
  | 'connecting'
  | 'connected';

export type ConnectionStep =
  | 'idle'
  | 'checking_bluetooth'
  | 'bluetooth_off'
  | 'scanning'
  | 'devices_found'
  | 'connecting_to_device'
  | 'reading_health'
  | 'failed'
  | 'dev_build_required';  // Expo Go — no native BLE module

export interface ScannedDevice {
  id: string;       // BLE UUID (iOS) or MAC (Android)
  name: string;     // real advertised device name
  rssi: number;     // signal strength — used for ordering
}

export interface DoshaAlert {
  dosha: DoshaType;
  severity: 'mild' | 'moderate' | 'severe';
  message: string;
  recommendation: string;
}

export interface HealthData {
  heartRate: number;
  spo2: number;
  hrv: number;
  steps: number;
  waterLiters: number;
  sleepHours: number;
  calories: number;
  bodyTemp: number;
  respiratoryRate: number;   // breaths per minute — 0 when unavailable
  stressLevel: number;       // 0–100 score derived from HRV — 0 when unavailable
  nadiType: string;
  heartRateStatus: MetricStatus;
  spo2Status: MetricStatus;
  doshaAlerts: DoshaAlert[];
  lastUpdated: Date;
}

export interface HealthHookReturn {
  data: HealthData | null;
  connectionState: WatchConnectionState;
  connectionStep: ConnectionStep;
  scannedDevices: ScannedDevice[];
  connectedDevice: ScannedDevice | null;
  startScan: () => void;
  selectDevice: (device: ScannedDevice) => Promise<void>;
  enableBluetooth: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  error: string | null;
}
