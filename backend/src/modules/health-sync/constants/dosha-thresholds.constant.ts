export const DOSHA_THRESHOLDS = {
  heartRate: {
    pittaAggravated: 100,   // bpm above this = Pitta elevated
    vataBradycardia: 55,    // bpm below this = Vata imbalance
    critical: 120,
  },
  spo2: {
    optimal: 98,
    normal: 95,
    kaphaWarning: 95,       // below this = Kapha congestion
    critical: 90,
  },
  sleep: {
    vataDisturbance: 5,     // hours below this = Vata disturbed
    optimal: 7,
  },
  steps: {
    kaphaExcess: 2000,      // below this = Kapha excess (sedentary)
    vataBalance: 8000,      // hitting this = Vata balanced
  },
  hrv: {
    pittaTension: 30,       // below this = stress / Pitta
    vataAnxiety: 80,        // above this = anxiety / Vata
  },
} as const;

export const DOSHA_COLORS = {
  pitta: '#E85D75',
  vata:  '#4A90D9',
  kapha: '#7CB9A8',
} as const;
