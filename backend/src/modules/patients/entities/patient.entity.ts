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
 * HIPAA: PHI entity — all access must be logged via AuditLogService.
 * Columns containing PHI are marked with a comment for future encryption migration.
 */
@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column()
  userId!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  // PHI: date of birth
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  bloodType?: string;

  // PHI: allergies
  @Column({ type: 'simple-array', nullable: true })
  allergies?: string[];

  // PHI: emergency contact
  @Column({ nullable: true })
  emergencyContactName?: string;

  @Column({ nullable: true })
  emergencyContactPhone?: string;

  // PHI: insurance
  @Column({ nullable: true })
  insuranceProvider?: string;

  @Column({ nullable: true })
  insurancePolicyNumber?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
