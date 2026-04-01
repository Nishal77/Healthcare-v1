export type DoshaType = 'vata' | 'pitta' | 'kapha';
export type MetricStatus = 'optimal' | 'normal' | 'elevated' | 'low' | 'critical';
export type WatchConnectionState = 'unavailable' | 'disconnected' | 'connecting' | 'connected';

export type ConnectionStep =
  | 'idle'
  | 'checking_bluetooth'
  | 'bluetooth_off'
  | 'scanning'
  | 'device_found'
  | 'connecting_to_device'
  | 'failed';

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
  deviceName: string | null;
  startScan: () => Promise<void>;
  connectToDevice: () => Promise<void>;
  enableBluetooth: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  error: string | null;
}
