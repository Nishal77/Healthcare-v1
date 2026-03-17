import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
    private readonly auditLog: AuditLogService,
  ) {}

  async listForPatient(patientId: string, requesterId: string): Promise<Appointment[]> {
    const results = await this.repo.find({
      where: { patientId },
      order: { scheduledAt: 'DESC' },
    });

    await this.auditLog.log({
      userId: requesterId,
      action: 'READ',
      resourceType: 'Appointment',
      metadata: { patientId },
    });

    return results;
  }

  async create(patientId: string, dto: CreateAppointmentDto, requesterId: string): Promise<Appointment> {
    const appt = this.repo.create({
      ...dto,
      patientId,
      scheduledAt: new Date(dto.scheduledAt),
    });
    const saved = await this.repo.save(appt);

    await this.auditLog.log({
      userId: requesterId,
      action: 'CREATE',
      resourceType: 'Appointment',
      resourceId: saved.id,
    });

    return saved;
  }

  async cancel(id: string, requesterId: string): Promise<Appointment> {
    const appt = await this.repo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Appointment not found');

    if (appt.patientId !== requesterId) {
      throw new ForbiddenException('Cannot cancel another patient\'s appointment');
    }

    appt.status = 'cancelled';
    const saved = await this.repo.save(appt);

    await this.auditLog.log({
      userId: requesterId,
      action: 'UPDATE',
      resourceType: 'Appointment',
      resourceId: id,
      metadata: { action: 'cancel' },
    });

    return saved;
  }
}
