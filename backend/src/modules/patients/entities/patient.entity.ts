import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * HIPAA: PHI entity.
 * All access must be logged via AuditLogService.
 * Columns containing PHI are marked — target for field-level encryption in v2.
 */
@Entity('patient_profiles')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column()
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // ── Personal Details (Step 2) ─────────────────────────────────────────────

  /** PHI: phone number */
  @Column({ nullable: true })
  phone?: string;

  @Column({ default: false })
  phoneVerified!: boolean;

  /** PHI: date of birth — stored as ISO date string (YYYY-MM-DD) */
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  gender?: string;

  // ── Body Metrics (Step 4) ─────────────────────────────────────────────────

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  heightCm?: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true })
  weightKg?: number;

  @Column({ nullable: true })
  bloodGroup?: string;

  @Column({ nullable: true })
  activityLevel?: string;

  // ── Timestamps ────────────────────────────────────────────────────────────

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
