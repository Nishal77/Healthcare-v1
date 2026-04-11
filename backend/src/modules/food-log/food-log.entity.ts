import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';

// ── Entry type mirrors the mobile app's EntryType ────────────────────────────
export type EntryType = 'meal' | 'water' | 'mood' | 'exercise' | 'medicine' | 'note';
export type DayPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

/** Derives the time-of-day period from an hour (0–23). */
export function periodFromHour(hour: number): DayPeriod {
  if (hour >= 0  && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 17) return 'afternoon';
  if (hour >= 18 && hour <= 21) return 'evening';
  return 'night';
}

@Entity('food_logs')
@Index(['userId', 'loggedAt'])          // fast daily/weekly queries
@Index(['userId', 'entryType'])         // filter by type
export class FoodLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ── Owner ──────────────────────────────────────────────────────────────────
  @Column('uuid')
  @Index()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', lazy: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // ── Core fields ────────────────────────────────────────────────────────────
  /** What kind of entry: meal, water, mood, exercise, medicine, note */
  @Column({ type: 'varchar', length: 20 })
  entryType!: EntryType;

  /** Short title shown in the timeline card ("Breakfast", "Morning Water", …) */
  @Column({ length: 120 })
  title!: string;

  /** Longer description ("Brown rice · dal · sabzi · salad") */
  @Column({ length: 300, nullable: true })
  detail?: string;

  /**
   * Human-readable display value shown on the right badge:
   *   "320 kcal" | "500 ml" | "Taken ✓" | "😊 Good"
   * Stored as-is so the UI can render it directly.
   */
  @Column({ length: 80, nullable: true })
  displayValue?: string;

  /**
   * Machine-readable quantity for aggregation (calories totals, water total …).
   * NULL for non-numeric entries (mood, medicine notes).
   */
  @Column({ type: 'float', nullable: true })
  numericValue?: number | null;

  /** Unit of numericValue: 'kcal', 'ml', 'min', 'steps', 'kg', 'hrs' */
  @Column({ length: 20, nullable: true })
  unit?: string | null;

  /** Emoji for mood entries: '😊', '😔', '😐' … */
  @Column({ length: 8, nullable: true })
  moodEmoji?: string | null;

  // ── Time ──────────────────────────────────────────────────────────────────
  /** The actual moment of the activity (user-supplied or current time). */
  @Column({ type: 'timestamptz' })
  loggedAt!: Date;

  /** Derived from loggedAt hour — stored for fast period-group queries. */
  @Column({ type: 'varchar', length: 12 })
  period!: DayPeriod;

  // ── Timestamps ────────────────────────────────────────────────────────────
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  /** Soft-delete — HIPAA audit compliance. */
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;
}
