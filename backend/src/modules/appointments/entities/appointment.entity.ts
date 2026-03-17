import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentType = 'in_person' | 'telehealth';

@Entity('appointments')
@Index(['patientId'])
@Index(['providerId'])
@Index(['scheduledAt'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  patientId!: string;

  @Column()
  providerId!: string;

  @Column({ type: 'timestamptz' })
  scheduledAt!: Date;

  @Column({ default: 30 })
  durationMinutes!: number;

  @Column({ type: 'varchar', default: 'scheduled' })
  status!: AppointmentStatus;

  @Column({ type: 'varchar', default: 'in_person' })
  type!: AppointmentType;

  @Column({ nullable: true })
  reason?: string;

  // PHI: clinical notes
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  meetingLink?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
