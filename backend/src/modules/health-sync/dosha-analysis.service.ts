import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DOSHA_THRESHOLDS } from './constants/dosha-thresholds.constant';
import type { DoshaType } from './entities/dosha-analysis.entity';
import { DoshaAnalysis } from './entities/dosha-analysis.entity';
import type { HealthReading } from './entities/health-reading.entity';

interface DoshaAlert {
  dosha: DoshaType;
  severity: 'mild' | 'moderate' | 'severe';
  message: string;
  recommendation: string;
}

@Injectable()
export class DoshaAnalysisService {
  constructor(
    @InjectRepository(DoshaAnalysis)
    private readonly repo: Repository<DoshaAnalysis>,
  ) {}

  analyze(reading: HealthReading): Omit<DoshaAnalysis, 'id' | 'createdAt'> {
    const hr    = reading.heartRate    ?? 72;
    const spo2  = reading.spo2         ?? 98;
    const sleep = reading.sleepHours   ?? 7;
    const steps = reading.steps        ?? 0;
    const hrv   = reading.hrv          ?? 42;

    // Score computation (0–100 range, normalized later)
    const pittaRaw = Math.min(100, Math.round(((hr - 50) / 80) * 80 + 20));
    const vataRaw  = Math.min(100, Math.round((steps / 10000) * 60 + (8 - Math.min(sleep, 8)) * 5));
    const kaphaRaw = Math.min(100, Math.round(((spo2 - 90) / 10) * 40 + (8000 - Math.min(steps, 8000)) / 200));

    const total = pittaRaw + vataRaw + kaphaRaw || 1;
    const pitta = Math.round((pittaRaw / total) * 100);
    const vata  = Math.round((vataRaw  / total) * 100);
    const kapha = Math.min(100, 100 - pitta - vata);

    const dominant: DoshaType =
      pitta >= vata && pitta >= kapha ? 'pitta' : vata >= kapha ? 'vata' : 'kapha';

    const alerts = this.buildAlerts(hr, spo2, sleep, steps, hrv);

    const insight = alerts.length > 0
      ? alerts[0].recommendation
      : this.defaultInsight(dominant);

    return {
      userId:          reading.userId,
      healthReadingId: reading.id,
      vataScore:       vata,
      pittaScore:      pitta,
      kaphaScore:      kapha,
      dominantDosha:   dominant,
      alerts,
      insight,
      analyzedAt:      new Date(),
    };
  }

  async saveAnalysis(payload: Omit<DoshaAnalysis, 'id' | 'createdAt'>) {
    return this.repo.save(this.repo.create(payload));
  }

  async getLatestForUser(userId: string) {
    return this.repo.findOne({
      where: { userId },
      order: { analyzedAt: 'DESC' },
    });
  }

  async getHistoryForUser(userId: string, limit = 30) {
    return this.repo.find({
      where: { userId },
      order: { analyzedAt: 'DESC' },
      take: limit,
    });
  }

  private buildAlerts(
    hr: number,
    spo2: number,
    sleep: number,
    steps: number,
    hrv: number,
  ): DoshaAlert[] {
    const t = DOSHA_THRESHOLDS;
    const alerts: DoshaAlert[] = [];

    if (hr > t.heartRate.pittaAggravated) {
      alerts.push({
        dosha: 'pitta',
        severity: hr > t.heartRate.critical ? 'severe' : 'moderate',
        message: 'Pitta aggravated — heart rate elevated',
        recommendation: 'Drink cool water, sit in shade, avoid spicy food until evening.',
      });
    } else if (hr < t.heartRate.vataBradycardia) {
      alerts.push({
        dosha: 'vata',
        severity: 'mild',
        message: 'Vata imbalance — resting heart rate low',
        recommendation: 'Warm sesame oil massage, eat warm foods, avoid cold drinks.',
      });
    }

    if (spo2 < t.spo2.kaphaWarning) {
      alerts.push({
        dosha: 'kapha',
        severity: spo2 < t.spo2.critical ? 'severe' : 'mild',
        message: 'Kapha congestion — SpO₂ below optimal',
        recommendation: 'Pranayama breathing, light walk outdoors, reduce dairy intake.',
      });
    }

    if (sleep < t.sleep.vataDisturbance) {
      alerts.push({
        dosha: 'vata',
        severity: 'moderate',
        message: 'Vata disturbed — insufficient sleep',
        recommendation: 'Warm milk with ashwagandha before bed, sleep before 10 PM.',
      });
    }

    if (steps < t.steps.kaphaExcess) {
      alerts.push({
        dosha: 'kapha',
        severity: 'mild',
        message: 'Kapha excess — sedentary today',
        recommendation: 'A 20-minute brisk walk will balance Kapha and boost Agni.',
      });
    }

    if (hrv < t.hrv.pittaTension) {
      alerts.push({
        dosha: 'pitta',
        severity: 'mild',
        message: 'Pitta tension — HRV low',
        recommendation: 'Box breathing for 5 minutes; reduce screen time before bed.',
      });
    }

    return alerts;
  }

  private defaultInsight(dominant: DoshaType): string {
    const map: Record<DoshaType, string> = {
      pitta: 'Pitta is slightly elevated. Favour cooling foods, avoid spicy meals after 6 PM, and take a 15-min evening walk.',
      vata:  'Vata is dominant. Stay warm, eat nourishing cooked meals, and maintain a consistent sleep schedule.',
      kapha: 'Kapha is dominant. Start your day with warm ginger water, light exercise, and dry-brush before showering.',
    };
    return map[dominant];
  }
}
