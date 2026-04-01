import type { DoshaAlert, DoshaType, MetricStatus } from './types';

export const DOSHA_COLORS: Record<DoshaType, string> = {
  pitta: '#E85D75',
  vata:  '#4A90D9',
  kapha: '#7CB9A8',
};

export function getHeartRateStatus(bpm: number): MetricStatus {
  if (bpm > 120) return 'critical';
  if (bpm > 100) return 'elevated';
  if (bpm < 45)  return 'critical';
  if (bpm < 55)  return 'low';
  return 'normal';
}

export function getSpo2Status(pct: number): MetricStatus {
  if (pct >= 98) return 'optimal';
  if (pct >= 95) return 'normal';
  if (pct >= 90) return 'low';
  return 'critical';
}

export function getNadiType(bpm: number, hrv: number): string {
  if (bpm > 90 || hrv < 30)  return 'Pittaja';
  if (bpm < 60 || hrv > 80)  return 'Vataja';
  return 'Kaphaja';
}

export function getDoshaBars(
  steps: number,
  sleepHours: number,
  heartRate: number,
  spo2: number,
): { vata: number; pitta: number; kapha: number } {
  // Pitta driven by HR and metabolism
  const pittaRaw = Math.min(100, Math.round(((heartRate - 50) / 80) * 80 + 20));
  // Vata driven by movement and sleep quality
  const vataRaw = Math.min(100, Math.round((steps / 10000) * 60 + (8 - Math.min(sleepHours, 8)) * 5));
  // Kapha driven by SpO2 and inversely by activity
  const kaphaRaw = Math.min(100, Math.round(((spo2 - 90) / 10) * 40 + (8000 - Math.min(steps, 8000)) / 200));

  const total = pittaRaw + vataRaw + kaphaRaw;
  return {
    pitta: Math.round((pittaRaw / total) * 100),
    vata:  Math.round((vataRaw  / total) * 100),
    kapha: Math.min(100, 100 - Math.round((pittaRaw / total) * 100) - Math.round((vataRaw / total) * 100)),
  };
}

export function generateDoshaAlert(
  heartRate: number,
  spo2: number,
  sleepHours: number,
  steps: number,
): DoshaAlert[] {
  const alerts: DoshaAlert[] = [];

  if (heartRate > 100) {
    alerts.push({
      dosha: 'pitta',
      severity: heartRate > 120 ? 'severe' : 'moderate',
      message: 'Pitta aggravated — heart rate elevated',
      recommendation: 'Drink cool water, sit in shade, avoid spicy food until evening.',
    });
  } else if (heartRate < 55) {
    alerts.push({
      dosha: 'vata',
      severity: 'mild',
      message: 'Vata imbalance — heart rate low',
      recommendation: 'Warm sesame oil massage, eat warm foods, avoid cold drinks.',
    });
  }

  if (spo2 < 95) {
    alerts.push({
      dosha: 'kapha',
      severity: spo2 < 90 ? 'severe' : 'mild',
      message: 'Kapha congestion — SpO₂ below optimal',
      recommendation: 'Pranayama breathing, light walk outdoors, reduce dairy intake.',
    });
  }

  if (sleepHours < 5) {
    alerts.push({
      dosha: 'vata',
      severity: 'moderate',
      message: 'Vata disturbed — insufficient sleep',
      recommendation: 'Warm milk with ashwagandha before bed, sleep before 10 PM.',
    });
  }

  if (steps < 2000) {
    alerts.push({
      dosha: 'kapha',
      severity: 'mild',
      message: 'Kapha excess — sedentary today',
      recommendation: 'A 20-minute brisk walk will balance Kapha and boost Agni.',
    });
  }

  return alerts;
}

export function buildDoshaInsight(
  vata: number,
  pitta: number,
  kapha: number,
  alerts: DoshaAlert[],
): string {
  if (alerts.length > 0) return alerts[0].recommendation;

  const dominant = pitta >= vata && pitta >= kapha ? 'pitta' : vata >= kapha ? 'vata' : 'kapha';
  const map: Record<DoshaType, string> = {
    pitta: 'Pitta is slightly elevated. Favour cooling foods, avoid spicy meals after 6 PM, and take a 15-min evening walk.',
    vata:  'Vata is dominant. Stay warm, eat nourishing cooked meals, and maintain a consistent sleep schedule.',
    kapha: 'Kapha is dominant. Start your day with warm ginger water, light exercise, and dry-brush before showering.',
  };
  return map[dominant];
}
