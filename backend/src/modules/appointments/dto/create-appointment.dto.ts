import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import type { AppointmentType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsUUID()
  providerId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  durationMinutes?: number;

  @IsIn(['in_person', 'telehealth'])
  type!: AppointmentType;

  @IsOptional()
  @IsString()
  reason?: string;
}
