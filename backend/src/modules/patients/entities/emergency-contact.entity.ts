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
 * HIPAA: PHI entity — emergency contact information.
 * Only exposed to authenticated healthcare providers in critical scenarios.
 */
@Entity('emergency_contacts')
export class EmergencyContact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column()
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // ── Emergency Contact (Step 7) ────────────────────────────────────────────

  /** PHI: contact full name */
  @Column({ nullable: true })
  contactName?: string;

  /** Spouse | Parent | Sibling | Child | Friend | Other */
  @Column({ nullable: true })
  relationship?: string;

  /** PHI: primary phone number */
  @Column({ nullable: true })
  primaryPhone?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
