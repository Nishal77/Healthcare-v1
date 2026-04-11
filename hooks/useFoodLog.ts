/**
 * useFoodLog
 *
 * Manages all food / activity log state for a given calendar date.
 * Handles:
 *   • Fetching entries from the backend
 *   • Optimistic add (UI updates instantly, rolls back on error)
 *   • Optimistic delete
 *   • Daily summary aggregation (calories, water, etc.)
 *
 * Auth token is read from AsyncStorage (same pattern as the rest of the app).
 * Falls back to demo data when the backend is unreachable (dev / no network).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { storageGet } from '../src/storage';
import {
  type CreateFoodLogPayload,
  type DailySummary,
  type FoodLogEntry,
  type WeekDay,
  foodLogApi,
} from '../src/api/endpoints/food-log';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a Date as "YYYY-MM-DD" in local time. */
export function toDateStr(d: Date = new Date()): string {
  const y  = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${dy}`;
}

/** Display time label: "07:30 AM" */
function formatTime(iso: string): string {
  const d  = new Date(iso);
  const h  = d.getHours();
  const m  = String(d.getMinutes()).padStart(2, '0');
  const am = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${am}`;
}

/** Map backend entry to the shape used by the timeline components. */
export function toTrackEntry(e: FoodLogEntry) {
  const d = new Date(e.loggedAt);
  return {
    id:     e.id,
    time:   formatTime(e.loggedAt),
    hour:   d.getHours(),
    type:   e.entryType,
    title:  e.title,
    detail: e.detail,
    value:  e.displayValue,
  };
}

async function getToken(): Promise<string | null> {
  return storageGet('access_token');
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseFoodLogReturn {
  entries:     FoodLogEntry[];
  summary:     DailySummary | null;
  weekData:    WeekDay[];
  loading:     boolean;
  error:       string | null;
  addEntry:    (payload: CreateFoodLogPayload) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  refresh:     () => Promise<void>;
}

export function useFoodLog(date?: string): UseFoodLogReturn {
  const dateStr = date ?? toDateStr();

  const [entries,  setEntries]  = useState<FoodLogEntry[]>([]);
  const [summary,  setSummary]  = useState<DailySummary | null>(null);
  const [weekData, setWeekData] = useState<WeekDay[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // Keep dateStr ref so callbacks don't stale-close over the wrong date
  const dateRef = useRef(dateStr);
  dateRef.current = dateStr;

  // ── Fetch all data for the current date ──────────────────────────────────
  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        // No auth token — show empty state (user needs to log in)
        setEntries([]);
        setSummary(null);
        setWeekData([]);
        return;
      }

      const [fetchedEntries, fetchedSummary, fetchedWeek] = await Promise.all([
        foodLogApi.getByDate(dateRef.current, token),
        foodLogApi.getSummary(dateRef.current, token),
        foodLogApi.getWeek(dateRef.current, token),
      ]);

      setEntries(fetchedEntries);
      setSummary(fetchedSummary);
      setWeekData(fetchedWeek);
    } catch (e) {
      setError((e as Error).message ?? 'Could not load your log');
    } finally {
      setLoading(false);
    }
  }, []); // date changes handled via dateRef

  // Re-fetch whenever the date changes
  useEffect(() => { void fetch(); }, [dateStr, fetch]);

  // ── Add entry — optimistic update ────────────────────────────────────────
  const addEntry = useCallback(async (payload: CreateFoodLogPayload) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    // Optimistic: create a temporary entry immediately
    const tempId    = `temp-${Date.now()}`;
    const now       = new Date().toISOString();
    const tempEntry: FoodLogEntry = {
      id:           tempId,
      userId:       '',
      entryType:    payload.entryType,
      title:        payload.title,
      detail:       payload.detail       ?? '',
      displayValue: payload.displayValue ?? '',
      numericValue: payload.numericValue ?? null,
      unit:         payload.unit         ?? null,
      moodEmoji:    payload.moodEmoji    ?? null,
      period:       'morning',
      loggedAt:     payload.loggedAt ?? now,
      createdAt:    now,
    };

    setEntries(prev => [...prev, tempEntry].sort(
      (a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
    ));

    try {
      const saved = await foodLogApi.create(payload, token);
      // Replace the temp entry with the real one from the server
      setEntries(prev =>
        prev.map(e => e.id === tempId ? saved : e)
            .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime())
      );
      // Refresh the summary totals
      const newSummary = await foodLogApi.getSummary(dateRef.current, token);
      setSummary(newSummary);
    } catch (e) {
      // Roll back the optimistic entry on failure
      setEntries(prev => prev.filter(entry => entry.id !== tempId));
      throw e;
    }
  }, []);

  // ── Delete entry — optimistic update ─────────────────────────────────────
  const deleteEntry = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    // Optimistic: remove immediately
    setEntries(prev => prev.filter(e => e.id !== id));

    try {
      await foodLogApi.delete(id, token);
      // Refresh summary
      const newSummary = await foodLogApi.getSummary(dateRef.current, token);
      setSummary(newSummary);
    } catch (e) {
      // Restore the deleted entry on failure
      await fetch();
      throw e;
    }
  }, [fetch]);

  return { entries, summary, weekData, loading, error, addEntry, deleteEntry, refresh: fetch };
}
