/**
 * EatingGuide
 * Today's food log — renders live FoodLogEntry[] from the useFoodLog hook.
 */
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { DailySummary, FoodLogEntry } from '@/src/api/endpoints/food-log';

// ─── Static recommendation card ───────────────────────────────────────────────

const RECOMMENDATION = {
  icon:     'leaf-outline' as const,
  iconColor:'#16A34A',
  label:    "Today's Pick",
  title:    'Quinoa Power Bowl',
  subtitle: 'High protein · complex carbs · ~520 kcal',
};

// ─── Entry type → visual config ───────────────────────────────────────────────

const TYPE_STYLE: Record<string, {
  icon:  React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bg:    string;
}> = {
  meal:     { icon: 'restaurant-outline', color: '#F97316', bg: '#FFF7ED' },
  water:    { icon: 'water-outline',      color: '#38BDF8', bg: '#F0F9FF' },
  exercise: { icon: 'barbell-outline',    color: '#8B5CF6', bg: '#F5F3FF' },
  mood:     { icon: 'happy-outline',      color: '#F59E0B', bg: '#FFFBEB' },
  medicine: { icon: 'medical-outline',    color: '#EF4444', bg: '#FFF0F0' },
  note:     { icon: 'create-outline',     color: '#6B7280', bg: '#F5F6F8' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  const d  = new Date(iso);
  const h  = d.getHours();
  const m  = String(d.getMinutes()).padStart(2, '0');
  const am = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${am}`;
}

function dateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day:     'numeric',
    month:   'short',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EntryCard({ entry }: { entry: FoodLogEntry }) {
  const style = TYPE_STYLE[entry.entryType] ?? TYPE_STYLE.note;
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={{
        flexDirection:    'row',
        alignItems:       'center',
        backgroundColor:  '#F5F6F8',
        borderRadius:     18,
        paddingVertical:  15,
        paddingHorizontal:16,
        marginBottom:     10,
        gap:              14,
      }}>

      {/* Icon tile */}
      <View style={{
        width: 42, height: 42,
        borderRadius:    13,
        backgroundColor: style.bg,
        alignItems:      'center',
        justifyContent:  'center',
        flexShrink:      0,
      }}>
        <Ionicons name={style.icon} size={19} color={style.color} />
      </View>

      {/* Title + detail */}
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize:     14,
          fontWeight:   '700',
          color:        '#0D1117',
          letterSpacing:-0.2,
          marginBottom: 2,
        }}>
          {entry.title}
        </Text>
        <Text style={{ fontSize: 11.5, color: '#9CA3AF' }} numberOfLines={1}>
          {entry.detail
            ? entry.detail
            : entry.displayValue || entry.entryType}
        </Text>
      </View>

      {/* Right side: display value + time */}
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        {!!entry.displayValue && (
          <View style={{
            backgroundColor:  '#F0FBF5',
            borderRadius:     20,
            paddingHorizontal:8,
            paddingVertical:  3,
          }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#2C6E49' }}>
              {entry.displayValue}
            </Text>
          </View>
        )}
        <View style={{
          backgroundColor:  '#EBEBEF',
          borderRadius:     20,
          paddingHorizontal:9,
          paddingVertical:  3,
        }}>
          <Text style={{
            fontSize:   11,
            fontWeight: '600',
            color:      '#6B7280',
            fontVariant:['tabular-nums'],
          }}>
            {formatTime(entry.loggedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={{
      alignItems:     'center',
      justifyContent: 'center',
      paddingVertical: 32,
      gap: 8,
    }}>
      <Ionicons name="leaf-outline" size={34} color="#D1D5DB" />
      <Text style={{ fontSize: 14, color: '#9CA3AF', fontWeight: '500' }}>
        Nothing logged yet
      </Text>
      <Text style={{ fontSize: 12, color: '#C4C9D4' }}>
        Tap the + button to add your first entry
      </Text>
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  entries:  FoodLogEntry[];
  summary:  DailySummary | null;
  date?:    Date;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function EatingGuide({ entries, summary, date = new Date() }: Props) {
  const totalKcal = summary?.totalCalories ?? 0;

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 4 }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <View style={{ marginBottom: 14 }}>
        <View style={{
          flexDirection:  'row',
          alignItems:     'flex-end',
          justifyContent: 'space-between',
        }}>
          <Text style={{
            fontSize:     17,
            fontWeight:   '700',
            color:        '#0D1117',
            letterSpacing:-0.3,
          }}>
            Today's Intake
          </Text>
          {/* Total kcal badge */}
          <View style={{
            backgroundColor: '#F0FBF5',
            borderRadius:    20,
            paddingHorizontal:10,
            paddingVertical:  4,
          }}>
            <Text style={{
              fontSize:   11.5,
              fontWeight: '600',
              color:      '#2C6E49',
            }}>
              {totalKcal} kcal
            </Text>
          </View>
        </View>
        <Text style={{
          fontSize:   12.5,
          fontWeight: '400',
          color:      '#9CA3AF',
          marginTop:  3,
        }}>
          {dateLabel(date)}
        </Text>
      </View>

      {/* ── Recommendation card ───────────────────────────────────── */}
      <TouchableOpacity
        activeOpacity={0.82}
        style={{
          flexDirection:    'row',
          alignItems:       'center',
          backgroundColor:  '#F5F6F8',
          borderRadius:     18,
          paddingVertical:  16,
          paddingHorizontal:16,
          gap:    14,
          marginBottom: 22,
        }}>

        <Ionicons
          name={RECOMMENDATION.icon}
          size={26}
          color={RECOMMENDATION.iconColor}
        />

        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize:     10.5,
            fontWeight:   '600',
            color:        RECOMMENDATION.iconColor,
            letterSpacing: 0.5,
            marginBottom:  2,
          }}>
            {RECOMMENDATION.label.toUpperCase()}
          </Text>
          <Text style={{
            fontSize:   14,
            fontWeight: '700',
            color:      '#0D1117',
            letterSpacing:-0.2,
            marginBottom:3,
          }}>
            {RECOMMENDATION.title}
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
            {RECOMMENDATION.subtitle}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color="#C4C9D4" />
      </TouchableOpacity>

      {/* ── Log entries ─────────────────────────────────────────────── */}
      <Text style={{
        fontSize:     13,
        fontWeight:   '600',
        color:        '#6B7280',
        letterSpacing: 0.2,
        marginBottom:  10,
      }}>
        LOGGED TODAY
        {entries.length > 0 && (
          <Text style={{ fontWeight: '400', color: '#C4C9D4' }}>
            {'  '}{entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </Text>
        )}
      </Text>

      {entries.length === 0
        ? <EmptyState />
        : entries.map(entry => <EntryCard key={entry.id} entry={entry} />)
      }

    </View>
  );
}
