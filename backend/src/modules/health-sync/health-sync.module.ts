import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { DoshaAnalysisService } from './dosha-analysis.service';
import { DoshaAnalysis } from './entities/dosha-analysis.entity';
import { HealthReading } from './entities/health-reading.entity';
import { HealthSyncController } from './health-sync.controller';
import { HealthSyncService } from './health-sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthReading, DoshaAnalysis]),
    AuditLogModule,
  ],
  controllers: [HealthSyncController],
  providers: [HealthSyncService, DoshaAnalysisService],
  exports: [HealthSyncService],
})
export class HealthSyncModule {}
