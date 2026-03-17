import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecord } from './entities/medical-record.entity';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly repo: Repository<MedicalRecord>,
    private readonly auditLog: AuditLogService,
  ) {}

  async listForPatient(patientId: string, requesterId: string, requesterRole: string): Promise<MedicalRecord[]> {
    // HIPAA minimum necessary: patients can only see their own records
    if (requesterRole === 'patient' && patientId !== requesterId) {
      throw new ForbiddenException('Access denied');
    }

    const records = await this.repo.find({
      where: { patientId },
      order: { date: 'DESC' },
    });

    await this.auditLog.log({
      userId: requesterId,
      action: 'READ',
      resourceType: 'MedicalRecord',
      metadata: { patientId, count: records.length },
    });

    return records;
  }

  async create(dto: CreateMedicalRecordDto, providerId: string): Promise<MedicalRecord> {
    const record = this.repo.create({ ...dto, providerId });
    const saved = await this.repo.save(record);

    await this.auditLog.log({
      userId: providerId,
      action: 'CREATE',
      resourceType: 'MedicalRecord',
      resourceId: saved.id,
    });

    return saved;
  }

  async findOne(id: string, requesterId: string, requesterRole: string): Promise<MedicalRecord> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Medical record not found');

    if (requesterRole === 'patient' && record.patientId !== requesterId) {
      throw new ForbiddenException('Access denied');
    }

    await this.auditLog.log({
      userId: requesterId,
      action: 'READ',
      resourceType: 'MedicalRecord',
      resourceId: id,
    });

    return record;
  }
}
