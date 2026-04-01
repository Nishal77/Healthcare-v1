/**
 * HealthReminders
 *
 * A horizontally scrollable strip of health reminder cards shown below the
 * search bar on the home screen. Cards glow with a soft accent colour, use
 * a thin left-border accent, and display time, priority dot and status.
 *
 * State is kept locally for now; swap `REMINDERS` with a real store / API.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ── Types ─────────────────────────────────────────────────────────────────────
type Priority  = 'high' | 'medium' | 'low';
type Category  = 'medication' | 'water' | 'exercise' | 'checkup' | 'sleep' | 'diet';

interface Reminder {
  id:       string;
  title:    string;
  subtitle: string;
  time:     string;
  category: Category;
  priority: Priority;
  done:     boolean;
}

// ── Static seed data (replace with real store) ────────────────────────────────
const SEED: Reminder[] = [
  {
    id: '1', title: 'Morning Medication',
    subtitle: 'Ashwagandha · 500 mg',
    time: '8:00 AM', category: 'medication', priority: 'high', done: false,
  },
  {
    id: '2', title: 'Drink Water',
    subtitle: '500 ml — 4 of 8 done',
    time: '10:30 AM', category: 'water', priority: 'medium', done: false,
  },
  {
    id: '3', title: 'Yoga Session',
    subtitle: 'Surya Namaskar · 20 min',
    time: '6:00 PM', category: 'exercise', priority: 'medium', done: true,
  },
  {
    id: '4', title: 'BP Checkup',
    subtitle: 'Monthly self-check',
    time: 'Today', category: 'checkup', priority: 'high', done: false,
  },
  {
    id: '5', title: 'Wind Down',
    subtitle: 'No screens after 10 PM',
    time: '10:00 PM', category: 'sleep', priority: 'low', done: false,
  },
];

// ── Design tokens per category ────────────────────────────────────────────────
const CAT_CONFIG: Record<
  Category,
  {
    icon:       ComponentProps<typeof Ionicons>['name'];
    iconColor:  string;
    iconBg:     string;
    accent:     string;   // left border + glow
    cardBg:     string;
  }
> = {
  medication: {
    icon: 'medkit-outline',      iconColor: '#B83A3A', iconBg: '#FEF2F2',
    accent: '#EF4444', cardBg: '#FFFAFA',
  },
  water: {
    icon: 'water-outline',       iconColor: '#0B6E8B', iconBg: '#EFF7FA',
    accent: '#0B6E8B', cardBg: '#F7FBFD',
  },
  exercise: {
    icon: 'barbell-outline',     iconColor: '#2C6E49', iconBg: '#F0F7F3',
    accent: '#2C6E49', cardBg: '#F7FBF9',
  },
  checkup: {
    icon: 'clipboard-outline',   iconColor: '#7C3AED', iconBg: '#F5F3FF',
    accent: '#7C3AED', cardBg: '#FAF9FF',
  },
  sleep: {
    icon: 'moon-outline',        iconColor: '#4F46E5', iconBg: '#EEF2FF',
    accent: '#4F46E5', cardBg: '#F8F9FF',
  },
  diet: {
    icon: 'nutrition-outline',   iconColor: '#C4860A', iconBg: '#FEF8EE',
    accent: '#C4860A', cardBg: '#FFFDF7',
  },
};

const PRIORITY_DOT: Record<Priority, string> = {
  high:   '#EF4444',
  medium: '#C4860A',
  low:    '#2C6E49',
};

// ── Single card ───────────────────────────────────────────────────────────────
function ReminderCard({
  item,
  onToggle,
}: {
  item:     Reminder;
  onToggle: (id: string) => void;
}) {
  const cfg      = CAT_CONFIG[item.category];
  const scaleRef = useRef(new Animated.Value(1)).current;

  function handleToggle() {
    Animated.sequence([
      Animated.timing(scaleRef, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleRef, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
    ]).start();
    onToggle(item.id);
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleRef }] }}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleToggle}
        style={{
          width: 190,
          backgroundColor: item.done ? '#F9F9F8' : cfg.cardBg,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: item.done ? '#ECEAE6' : `${cfg.accent}22`,
          borderLeftWidth: 3,
          borderLeftColor: item.done ? '#D1D5DB' : cfg.accent,
          padding: 14,
          gap: 10,
          // Subtle glow
          shadowColor: item.done ? 'transparent' : cfg.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: item.done ? 0 : 0.12,
          shadowRadius: 12,
          elevation: item.done ? 0 : 3,
          opacity: item.done ? 0.72 : 1,
        }}>

        {/* Top row: icon + priority dot + time */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: item.done ? '#F3F4F6' : cfg.iconBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons
                name={cfg.icon}
                size={17}
                color={item.done ? '#9CA3AF' : cfg.iconColor}
              />
            </View>

            {/* Priority dot */}
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: item.done ? '#D1D5DB' : PRIORITY_DOT[item.priority],
              }}
            />
          </View>

          {/* Time badge */}
          <View
            style={{
              backgroundColor: item.done ? '#F3F4F6' : `${cfg.accent}14`,
              borderRadius: 8,
              paddingHorizontal: 7,
              paddingVertical: 3,
            }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: item.done ? '#9CA3AF' : cfg.accent,
                letterSpacing: 0.1,
              }}>
              {item.time}
            </Text>
          </View>
        </View>

        {/* Title + subtitle */}
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: item.done ? '#9CA3AF' : '#0F1923',
              letterSpacing: -0.2,
              textDecorationLine: item.done ? 'line-through' : 'none',
            }}
            numberOfLines={1}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: item.done ? '#C4C9D0' : '#6B7280',
              fontWeight: '400',
              lineHeight: 15,
            }}
            numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>

        {/* Done check / tap hint */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: item.done ? '#F3F4F6' : `${cfg.accent}12`,
              borderRadius: 20,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'radio-button-off-outline'}
              size={12}
              color={item.done ? '#9CA3AF' : cfg.accent}
            />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: item.done ? '#9CA3AF' : cfg.accent,
              }}>
              {item.done ? 'Done' : 'Tap to mark'}
            </Text>
          </View>

          {!item.done && (
            <Ionicons name="chevron-forward" size={12} color="#D1D5DB" />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({
  total,
  done,
  onAddPress,
}: {
  total:      number;
  done:       number;
  onAddPress: () => void;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 12,
      }}>

      <View style={{ gap: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#0F1923',
              letterSpacing: -0.3,
            }}>
            Today's Reminders
          </Text>
          {done === total && total > 0 && (
            <View
              style={{
                backgroundColor: '#F0F7F3',
                borderRadius: 20,
                paddingHorizontal: 7,
                paddingVertical: 2,
              }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#2C6E49' }}>All done 🎉</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>
          {done}/{total} completed · {pct}%
        </Text>
      </View>

      <TouchableOpacity
        onPress={onAddPress}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: '#0F1923',
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 7,
        }}>
        <Ionicons name="add" size={14} color="#FFFFFF" />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct }: { pct: number }) {
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 14,
        height: 3,
        backgroundColor: '#F0EFEC',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
      <View
        style={{
          width: `${pct}%`,
          height: 3,
          backgroundColor: '#2C6E49',
          borderRadius: 2,
        }}
      />
    </View>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function HealthReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(SEED);

  const doneCount  = reminders.filter(r => r.done).length;
  const totalCount = reminders.length;
  const pct        = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  function toggleDone(id: string) {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, done: !r.done } : r)),
    );
  }

  function handleAddPress() {
    // TODO: open an add-reminder sheet
  }

  return (
    <View style={{ paddingTop: 6, paddingBottom: 4 }}>
      <SectionHeader total={totalCount} done={doneCount} onAddPress={handleAddPress} />
      <ProgressBar pct={pct} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, gap: 10 }}
        decelerationRate="fast"
        snapToInterval={202}>
        {reminders.map(item => (
          <ReminderCard key={item.id} item={item} onToggle={toggleDone} />
        ))}
        {/* "View all" ghost card */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            width: 80,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#ECEAE6',
            }}>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </View>
          <Text style={{ fontSize: 10, fontWeight: '600', color: '#9CA3AF', textAlign: 'center' }}>
            View{'\n'}All
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
