import { IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import type { RecordType } from '../entities/medical-record.entity';

export class CreateMedicalRecordDto {
  @IsUUID()
  patientId!: string;

  @IsIn(['diagnosis', 'medication', 'lab_result', 'imaging', 'procedure', 'note'])
  type!: RecordType;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
