import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type DoshaType = 'vata' | 'pitta' | 'kapha';
export type AlertSeverity = 'mild' | 'moderate' | 'severe';

@Entity('dosha_analyses')
@Index(['userId'])
@Index(['analyzedAt'])
export class DoshaAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  healthReadingId!: string;

  @Column({ type: 'int' })
  vataScore!: number;

  @Column({ type: 'int' })
  pittaScore!: number;

  @Column({ type: 'int' })
  kaphaScore!: number;

  @Column({ type: 'varchar' })
  dominantDosha!: DoshaType;

  @Column({ type: 'jsonb', nullable: true })
  alerts?: Array<{
    dosha: DoshaType;
    severity: AlertSeverity;
    message: string;
    recommendation: string;
  }>;

  @Column({ type: 'text', nullable: true })
  insight?: string;

  @Column({ type: 'timestamp' })
  analyzedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
