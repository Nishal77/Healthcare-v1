import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { FoodLog, periodFromHour } from './food-log.entity';
import { CreateFoodLogDto } from './dto/create-food-log.dto';

// ── Response shapes ───────────────────────────────────────────────────────────

export interface DailySummary {
  date:              string;
  totalCalories:     number;
  totalWaterMl:      number;
  totalExerciseMin:  number;
  mealCount:         number;
  medicineCount:     number;
  calorieGoal:       number;   // static default — personalisation comes later
  waterGoalMl:       number;
}

export interface WeekDay {
  date:         string;   // "2024-04-09"
  dayLabel:     string;   // "Mo"
  calories:     number;
  waterMl:      number;
  exerciseMin:  number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns [dayStart, dayEnd] as UTC Date objects from a local "YYYY-MM-DD" string. */
function dayBounds(dateStr: string): [Date, Date] {
  const base = new Date(`${dateStr}T00:00:00.000Z`);
  const end  = new Date(`${dateStr}T23:59:59.999Z`);
  return [base, end];
}

/** Returns "YYYY-MM-DD" for each day of the ISO week containing `dateStr`. */
function weekDays(dateStr: string): string[] {
  const d   = new Date(`${dateStr}T00:00:00.000Z`);
  const dow = d.getUTCDay();                // 0 = Sun
  const mon = new Date(d);
  mon.setUTCDate(d.getUTCDate() - ((dow + 6) % 7)); // back to Monday

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(mon);
    day.setUTCDate(mon.getUTCDate() + i);
    return day.toISOString().slice(0, 10);
  });
}

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable()
export class FoodLogService {
  constructor(
    @InjectRepository(FoodLog)
    private readonly repo: Repository<FoodLog>,
  ) {}

  // ── Create ──────────────────────────────────────────────────────────────────
  async create(userId: string, dto: CreateFoodLogDto): Promise<FoodLog> {
    const loggedAt = dto.loggedAt ? new Date(dto.loggedAt) : new Date();
    const period   = periodFromHour(loggedAt.getHours());

    const entry = this.repo.create({
      userId,
      entryType:    dto.entryType,
      title:        dto.title,
      detail:       dto.detail       ?? '',
      displayValue: dto.displayValue ?? '',
      numericValue: dto.numericValue ?? null,
      unit:         dto.unit         ?? null,
      moodEmoji:    dto.moodEmoji    ?? null,
      loggedAt,
      period,
    });

    return this.repo.save(entry);
  }

  // ── Get entries for a single date ──────────────────────────────────────────
  async findByDate(userId: string, dateStr: string): Promise<FoodLog[]> {
    const [start, end] = dayBounds(dateStr);

    return this.repo.find({
      where: {
        userId,
        loggedAt: Between(start, end),
      },
      order: { loggedAt: 'ASC' },
    });
  }

  // ── Daily summary (totals) ─────────────────────────────────────────────────
  async getDailySummary(userId: string, dateStr: string): Promise<DailySummary> {
    const entries = await this.findByDate(userId, dateStr);

    const totalCalories    = this.sumUnit(entries, 'kcal');
    const totalWaterMl     = this.sumUnit(entries, 'ml');
    const totalExerciseMin = this.sumUnit(entries, 'min');
    const mealCount        = entries.filter(e => e.entryType === 'meal').length;
    const medicineCount    = entries.filter(e => e.entryType === 'medicine').length;

    return {
      date: dateStr,
      totalCalories,
      totalWaterMl,
      totalExerciseMin,
      mealCount,
      medicineCount,
      calorieGoal: 2000,
      waterGoalMl: 2500,
    };
  }

  // ── Weekly aggregation (Mon–Sun of the week containing dateStr) ─────────────
  async getWeeklySummary(userId: string, dateStr: string): Promise<WeekDay[]> {
    const days = weekDays(dateStr);

    const results = await Promise.all(
      days.map(async (d, idx) => {
        const entries = await this.findByDate(userId, d);
        return {
          date:        d,
          dayLabel:    DAY_LABELS[idx],
          calories:    this.sumUnit(entries, 'kcal'),
          waterMl:     this.sumUnit(entries, 'ml'),
          exerciseMin: this.sumUnit(entries, 'min'),
        };
      }),
    );

    return results;
  }

  // ── Delete (soft-delete — keeps audit trail) ────────────────────────────────
  async remove(userId: string, id: string): Promise<void> {
    const entry = await this.repo.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Log entry ${id} not found`);
    }
    if (entry.userId !== userId) {
      throw new ForbiddenException('Cannot delete another user\'s log entry');
    }

    await this.repo.softDelete(id);
  }

  // ── Internal helpers ────────────────────────────────────────────────────────
  private sumUnit(entries: FoodLog[], unit: string): number {
    return entries
      .filter(e => e.unit === unit && e.numericValue != null)
      .reduce((sum, e) => sum + (e.numericValue ?? 0), 0);
  }
}
