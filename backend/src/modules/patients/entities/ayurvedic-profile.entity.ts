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
 * Stores the user's Ayurvedic / wellness profile collected during onboarding.
 * Not PHI by itself, but combined with user identity it becomes sensitive.
 */
@Entity('ayurvedic_profiles')
export class AyurvedicProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column()
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // ── Ayurvedic Profile (Step 5) ────────────────────────────────────────────

  /** Prakriti / Dosha: Vata | Pitta | Kapha | Tridosha | "I'll discover later" */
  @Column({ nullable: true })
  prakriti?: string;

  /**
   * Multi-select: Stress & Anxiety, Digestion, Weight Management, Sleep Quality,
   * Immunity, Energy Levels, Skin Health, Joint Pain, Other
   */
  @Column({ type: 'jsonb', nullable: true })
  healthConcerns?: string[];

  /** Sattvic | Vegetarian | Vegan | Non-Vegetarian | Jain */
  @Column({ nullable: true })
  dietPreference?: string;

  /** Early Riser | Night Owl | Irregular | Balanced */
  @Column({ nullable: true })
  lifestyle?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
