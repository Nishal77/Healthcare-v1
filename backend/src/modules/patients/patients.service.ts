import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogService } from '../audit-log/audit-log.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly repo: Repository<Patient>,
    private readonly auditLog: AuditLogService,
  ) {}

  async findByUserId(userId: string): Promise<Patient> {
    const patient = await this.repo.findOne({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');
    return patient;
  }

  async findOrCreate(userId: string): Promise<Patient> {
    const existing = await this.repo.findOne({ where: { userId } });
    if (existing) return existing;
    return this.repo.save(this.repo.create({ userId }));
  }

  async update(userId: string, dto: UpdatePatientDto, requesterId: string): Promise<Patient> {
    const patient = await this.findByUserId(userId);
    Object.assign(patient, dto);
    const saved = await this.repo.save(patient);

    await this.auditLog.log({
      userId: requesterId,
      action: 'UPDATE',
      resourceType: 'Patient',
      resourceId: patient.id,
    });

    return saved;
  }
}
