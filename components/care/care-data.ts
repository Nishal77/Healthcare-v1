// ─── Content types and data for the Care / Daily Tracking screen ─────────────

export type EntryType = 'meal' | 'water' | 'mood' | 'exercise' | 'medicine' | 'note';

export interface TrackEntry {
  id: string;
  time: string;   // display "07:30 AM"
  hour: number;   // 0–23 for period sorting
  type: EntryType;
  title: string;
  detail: string;
  value: string;  // "320 kcal" | "500 ml" | "Taken ✓" etc.
}

export interface DaySummary {
  caloriesLeft: number;
  caloriesTarget: number;
  caloriesLoss: number;
  caloriesLossTarget: number;
  exercisesCompleted: number;
  exercisesTarget: number;
  timeSpentHr: number;
  timeSpentTarget: number;
}

// ─── Entry type visual config ──────────────────────────────────────────────────
export const ENTRY_TYPE_CONFIG: Record<
  EntryType,
  { color: string; bgColor: string; iconName: string; label: string }
> = {
  meal:     { color: '#16A34A', bgColor: '#F0FDF4', iconName: 'restaurant-outline',   label: 'Meal' },
  water:    { color: '#2563EB', bgColor: '#EFF6FF', iconName: 'water-outline',         label: 'Water' },
  mood:     { color: '#D97706', bgColor: '#FFFBEB', iconName: 'happy-outline',         label: 'Mood' },
  exercise: { color: '#DC2626', bgColor: '#FEF2F2', iconName: 'barbell-outline',       label: 'Exercise' },
  medicine: { color: '#7C3AED', bgColor: '#F5F3FF', iconName: 'medkit-outline',        label: 'Medicine' },
  note:     { color: '#4B5563', bgColor: '#F9FAFB', iconName: 'document-text-outline', label: 'Note' },
};

// ─── Day summary data ──────────────────────────────────────────────────────────
export const DAY_SUMMARY: DaySummary = {
  caloriesLeft: 1568,
  caloriesTarget: 2200,
  caloriesLoss: 800,
  caloriesLossTarget: 1000,
  exercisesCompleted: 14,
  exercisesTarget: 15,
  timeSpentHr: 2.3,
  timeSpentTarget: 4,
};

// ─── Time periods ──────────────────────────────────────────────────────────────
export type Period = 'morning' | 'afternoon' | 'evening' | 'night';

export const PERIOD_CONFIG: Record<
  Period,
  { label: string; subLabel: string; hourRange: [number, number] }
> = {
  morning:   { label: 'Morning',   subLabel: '12:00 AM – 12:00 PM', hourRange: [0, 11] },
  afternoon: { label: 'Afternoon', subLabel: '12:00 PM – 6:00 PM',  hourRange: [12, 17] },
  evening:   { label: 'Evening',   subLabel: '6:00 PM – 10:00 PM',  hourRange: [18, 21] },
  night:     { label: 'Night',     subLabel: '10:00 PM – 11:59 PM', hourRange: [22, 23] },
};

export const PERIODS: Period[] = ['morning', 'afternoon', 'evening', 'night'];

// ─── Sample tracking entries ───────────────────────────────────────────────────
export const SAMPLE_ENTRIES: TrackEntry[] = [
  { id: 'e1',  time: '07:00 AM', hour: 7,  type: 'meal',     title: 'Breakfast',         detail: 'Oatmeal with mixed fruits & honey',   value: '320 kcal' },
  { id: 'e2',  time: '07:30 AM', hour: 7,  type: 'water',    title: 'Morning Water',      detail: '2 glasses · warm with lemon',          value: '500 ml' },
  { id: 'e3',  time: '08:15 AM', hour: 8,  type: 'mood',     title: 'Morning Mood',       detail: 'Feeling energetic & focused',           value: '😊 Good' },
  { id: 'e4',  time: '10:30 AM', hour: 10, type: 'meal',     title: 'Morning Snack',      detail: 'Banana & a handful of almonds',         value: '180 kcal' },
  { id: 'e5',  time: '12:45 PM', hour: 12, type: 'meal',     title: 'Lunch',              detail: 'Brown rice · dal · sabzi · salad',      value: '520 kcal' },
  { id: 'e6',  time: '01:30 PM', hour: 13, type: 'water',    title: 'Post-Lunch Water',   detail: '1 glass · room temperature',            value: '250 ml' },
  { id: 'e7',  time: '03:00 PM', hour: 15, type: 'exercise', title: 'Afternoon Walk',     detail: '30 min · light outdoor walk',           value: '150 kcal' },
  { id: 'e8',  time: '04:00 PM', hour: 16, type: 'medicine', title: 'Ashwagandha',        detail: '500 mg capsule · with warm water',      value: 'Taken ✓' },
  { id: 'e9',  time: '07:00 PM', hour: 19, type: 'meal',     title: 'Dinner',             detail: 'Khichdi · curd · papad',               value: '480 kcal' },
  { id: 'e10', time: '09:00 PM', hour: 21, type: 'mood',     title: 'Evening Mood',       detail: 'Calm, relaxed after a good day',        value: '😌 Relaxed' },
  { id: 'e11', time: '10:30 PM', hour: 22, type: 'medicine', title: 'Triphala Churna',    detail: 'Night dose · with warm water',          value: 'Taken ✓' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getEntriesForPeriod(entries: TrackEntry[], period: Period): TrackEntry[] {
  const [start, end] = PERIOD_CONFIG[period].hourRange;
  return entries.filter(e => e.hour >= start && e.hour <= end);
}
