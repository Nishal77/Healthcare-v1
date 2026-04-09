import { apiRequest } from '../client';

// ── Shared types (mirrors backend entity) ─────────────────────────────────────

export type EntryType = 'meal' | 'water' | 'mood' | 'exercise' | 'medicine' | 'note';
export type DayPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface FoodLogEntry {
  id:           string;
  userId:       string;
  entryType:    EntryType;
  title:        string;
  detail:       string;
  displayValue: string;
  numericValue: number | null;
  unit:         string | null;
  moodEmoji:    string | null;
  period:       DayPeriod;
  loggedAt:     string;   // ISO string
  createdAt:    string;
}

export interface CreateFoodLogPayload {
  entryType:    EntryType;
  title:        string;
  detail?:      string;
  displayValue?: string;
  numericValue?: number;
  unit?:        string;
  moodEmoji?:   string;
  loggedAt?:    string;   // ISO string — defaults to now on backend
}

export interface DailySummary {
  date:             string;
  totalCalories:    number;
  totalWaterMl:     number;
  totalExerciseMin: number;
  mealCount:        number;
  medicineCount:    number;
  calorieGoal:      number;
  waterGoalMl:      number;
}

export interface WeekDay {
  date:        string;
  dayLabel:    string;
  calories:    number;
  waterMl:     number;
  exerciseMin: number;
}

// ── API client ────────────────────────────────────────────────────────────────

export const foodLogApi = {
  /** Add a new log entry. */
  create: (payload: CreateFoodLogPayload, token: string) =>
    apiRequest<FoodLogEntry>('/food-log', {
      method: 'POST',
      body:   payload,
      token,
    }),

  /** All entries for a calendar date ("2024-04-09"). */
  getByDate: (date: string, token: string) =>
    apiRequest<FoodLogEntry[]>(`/food-log?date=${date}`, { token }),

  /** Daily totals for the given date. */
  getSummary: (date: string, token: string) =>
    apiRequest<DailySummary>(`/food-log/summary?date=${date}`, { token }),

  /** Mon–Sun aggregation for the week containing date. */
  getWeek: (date: string, token: string) =>
    apiRequest<WeekDay[]>(`/food-log/week?date=${date}`, { token }),

  /** Soft-delete a log entry. */
  delete: (id: string, token: string) =>
    apiRequest<void>(`/food-log/${id}`, { method: 'DELETE', token }),
};
