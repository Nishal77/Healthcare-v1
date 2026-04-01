import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('health_readings')
@Index(['userId'])
@Index(['recordedAt'])
export class HealthReading {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: 'int', nullable: true })
  heartRate?: number;

  @Column({ type: 'int', nullable: true })
  spo2?: number;

  @Column({ type: 'int', nullable: true })
  hrv?: number;

  @Column({ type: 'int', nullable: true })
  steps?: number;

  @Column({ type: 'float', nullable: true })
  sleepHours?: number;

  @Column({ type: 'int', nullable: true })
  calories?: number;

  @Column({ type: 'float', nullable: true })
  bodyTemp?: number;

  @Column({ type: 'float', nullable: true })
  waterLiters?: number;

  @Column({ type: 'varchar', nullable: true })
  nadiType?: string;

  @Column({ type: 'varchar', nullable: true })
  deviceSource?: string;

  @Column({ type: 'timestamp' })
  recordedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
