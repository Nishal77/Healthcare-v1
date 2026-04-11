import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AyurvedicProfile } from './entities/ayurvedic-profile.entity';
import { EmergencyContact } from './entities/emergency-contact.entity';
import { MedicalHistory } from './entities/medical-history.entity';
import { Patient } from './entities/patient.entity';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      AyurvedicProfile,
      MedicalHistory,
      EmergencyContact,
    ]),
    AuditLogModule,
  ],
  controllers: [PatientsController],
  providers:   [PatientsService],
  exports:     [PatientsService],
})
export class PatientsModule {}
