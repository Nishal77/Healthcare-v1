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
 * HIPAA: PHI entity — medical history.
 * All access must be logged. Encrypt columns before production.
 */
@Entity('medical_histories')
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column()
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // ── Medical History (Step 6) ──────────────────────────────────────────────

  /**
   * PHI: multi-select conditions.
   * Values: None | Diabetes | Hypertension | Thyroid | Asthma |
   *         Heart Disease | PCOS | Arthritis | Other
   */
  @Column({ type: 'jsonb', nullable: true })
  existingConditions?: string[];

  /** PHI: free-text medications list ("None" if not applicable) */
  @Column({ type: 'text', nullable: true })
  currentMedications?: string;

  /** PHI: free-text allergies ("None" if not applicable) */
  @Column({ type: 'text', nullable: true })
  knownAllergies?: string;

  /** Yes | No | Occasionally */
  @Column({ nullable: true })
  onAyurvedicTreatment?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
