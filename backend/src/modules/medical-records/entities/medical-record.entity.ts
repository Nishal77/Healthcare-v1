import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type RecordType =
  | 'diagnosis'
  | 'medication'
  | 'lab_result'
  | 'imaging'
  | 'procedure'
  | 'note';

/**
 * HIPAA: PHI entity.
 * - Soft-deleted (never hard-deleted) for compliance.
 * - All access must be audited via AuditLogService.
 */
@Entity('medical_records')
@Index(['patientId'])
@Index(['providerId'])
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  patientId!: string;

  @Column()
  providerId!: string;

  @Column({ type: 'varchar' })
  type!: RecordType;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'simple-array', nullable: true })
  attachments?: string[];

  // HIPAA: soft-delete only
  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
