import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogService } from '../audit-log/audit-log.service';
import { DoshaAnalysisService } from './dosha-analysis.service';
import type { SyncHealthDataDto } from './dto/sync-health-data.dto';
import { HealthReading } from './entities/health-reading.entity';

@Injectable()
export class HealthSyncService {
  constructor(
    @InjectRepository(HealthReading)
    private readonly readingRepo: Repository<HealthReading>,
    private readonly doshaService: DoshaAnalysisService,
    private readonly auditLog: AuditLogService,
  ) {}

  async syncReading(userId: string, dto: SyncHealthDataDto, ip: string) {
    const reading = this.readingRepo.create({
      userId,
      heartRate:   dto.heartRate,
      spo2:        dto.spo2,
      hrv:         dto.hrv,
      steps:       dto.steps,
      sleepHours:  dto.sleepHours,
      calories:    dto.calories,
      bodyTemp:    dto.bodyTemp,
      waterLiters: dto.waterLiters,
      deviceSource: dto.deviceSource,
      recordedAt:  new Date(dto.recordedAt),
    });

    const saved = await this.readingRepo.save(reading);

    const analysis = this.doshaService.analyze(saved);
    const savedAnalysis = await this.doshaService.saveAnalysis(analysis);

    await this.auditLog.log({
      userId,
      action: 'HEALTH_SYNC',
      resourceType: 'HealthReading',
      resourceId: saved.id,
      ipAddress: ip,
    });

    return { reading: saved, analysis: savedAnalysis };
  }

  async getLatestReading(userId: string) {
    return this.readingRepo.findOne({
      where: { userId },
      order: { recordedAt: 'DESC' },
    });
  }

  async getReadingHistory(userId: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.readingRepo
      .createQueryBuilder('r')
      .where('r.userId = :userId', { userId })
      .andWhere('r.recordedAt >= :since', { since })
      .orderBy('r.recordedAt', 'DESC')
      .getMany();
  }

  async getDoshaHistory(userId: string) {
    return this.doshaService.getHistoryForUser(userId);
  }

  async getLatestDoshaAnalysis(userId: string) {
    return this.doshaService.getLatestForUser(userId);
  }
}
