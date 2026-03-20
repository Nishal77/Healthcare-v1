import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ENTRY_TYPE_CONFIG, type EntryType } from '../track-data';

// ─── Entry type tabs ───────────────────────────────────────────────────────────
const ENTRY_TYPES: EntryType[] = ['meal', 'water', 'mood', 'exercise', 'medicine', 'note'];

// ─── Meal sub-types ────────────────────────────────────────────────────────────
const MEAL_SUBTYPES = [
  { id: 'breakfast', label: 'Breakfast', iconName: 'sunny-outline' },
  { id: 'lunch',     label: 'Lunch',     iconName: 'partly-sunny-outline' },
  { id: 'dinner',    label: 'Dinner',    iconName: 'moon-outline' },
  { id: 'snack',     label: 'Snack',     iconName: 'cafe-outline' },
];

// ─── Mood options ──────────────────────────────────────────────────────────────
const MOOD_OPTIONS = [
  { id: 'great',  emoji: '😄', label: 'Great' },
  { id: 'good',   emoji: '😊', label: 'Good' },
  { id: 'okay',   emoji: '😐', label: 'Okay' },
  { id: 'tired',  emoji: '😴', label: 'Tired' },
  { id: 'unwell', emoji: '🤒', label: 'Unwell' },
];

// ─── Context-sensitive placeholders ───────────────────────────────────────────
const PLACEHOLDERS: Record<EntryType, { main: string; value: string; showValue: boolean }> = {
  meal:     { main: 'Describe what you ate or drank…',          value: 'Calories  e.g. 320 kcal',   showValue: true },
  water:    { main: 'e.g. warm lemon water, coconut water…',    value: 'Amount  e.g. 500 ml',        showValue: true },
  mood:     { main: 'How are you feeling right now?',            value: '',                           showValue: false },
  exercise: { main: 'e.g. 30 min brisk walk, 20 min yoga…',     value: 'Duration  e.g. 30 min',      showValue: true },
  medicine: { main: 'Medicine or supplement name and dosage…',   value: 'Dosage  e.g. 500 mg',        showValue: true },
  note:     { main: 'Add a health observation or note…',         value: '',                           showValue: false },
};

// ─── Props ─────────────────────────────────────────────────────────────────────
interface AddEntrySheetProps {
  visible: boolean;
  initialType?: EntryType;
  onClose: () => void;
  onSave?: (entry: { type: EntryType; subType?: string; description: string; value: string; mood?: string }) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function nowTimeStr() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function AddEntrySheet({ visible, initialType = 'meal', onClose, onSave }: AddEntrySheetProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [activeType, setActiveType] = useState<EntryType>(initialType);
  const [mealSubType, setMealSubType] = useState('breakfast');
  const [selectedMood, setSelectedMood] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  // Reset state whenever sheet opens with a new type
  useEffect(() => {
    if (visible) {
      setActiveType(initialType);
      setDescription('');
      setValue('');
      setSelectedMood('');
      setMealSubType('breakfast');
      // Small delay lets the modal animate in first
      const t = setTimeout(() => inputRef.current?.focus(), 380);
      return () => clearTimeout(t);
    }
  }, [visible, initialType]);

  const ph = PLACEHOLDERS[activeType];
  const typeConfig = ENTRY_TYPE_CONFIG[activeType];

  function handleSave() {
    if (!description.trim() && !selectedMood) return;
    onSave?.({
      type: activeType,
      subType: activeType === 'meal' ? mealSubType : undefined,
      description: description.trim(),
      value: value.trim(),
      mood: selectedMood || undefined,
    });
    onClose();
  }

  const canSave = description.trim().length > 0 || (activeType === 'mood' && selectedMood !== '');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>

      {/* Dimmed backdrop — tap to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingBottom: insets.bottom + 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 24,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: 'rgba(0,0,0,0.08)',
          }}>

          {/* ── Drag handle ── */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB' }} />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 }}>

            {/* ── Header row ── */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#0D1117', letterSpacing: -0.4 }}>
                  Log Entry
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C6E49' }} />
                  <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>
                    {todayLabel()} · {nowTimeStr()}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: '#F3F4F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.07)',
                }}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {/* ── Entry type selector ── */}
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 }}>
              ENTRY TYPE
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20 }}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 4 }}>
              {ENTRY_TYPES.map(type => {
                const cfg = ENTRY_TYPE_CONFIG[type];
                const isActive = activeType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setActiveType(type)}
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      borderRadius: 999,
                      backgroundColor: isActive ? '#0D1117' : '#F3F4F6',
                      borderWidth: 1,
                      borderColor: isActive ? '#0D1117' : 'rgba(0,0,0,0.08)',
                    }}>
                    <Ionicons
                      name={cfg.iconName as any}
                      size={14}
                      color={isActive ? '#FFFFFF' : cfg.color}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: isActive ? '#FFFFFF' : '#1C1C1E',
                      }}>
                      {cfg.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ── Meal sub-type ── */}
            {activeType === 'meal' && (
              <View style={{ marginTop: 18 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 }}>
                  MEAL TYPE
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {MEAL_SUBTYPES.map(m => {
                    const isActive = mealSubType === m.id;
                    return (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => setMealSubType(m.id)}
                        activeOpacity={0.8}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 12,
                          backgroundColor: isActive ? '#F0FDF4' : '#FAFAFA',
                          borderWidth: 1,
                          borderColor: isActive ? '#2C6E49' : 'rgba(0,0,0,0.08)',
                        }}>
                        <Ionicons
                          name={m.iconName as any}
                          size={13}
                          color={isActive ? '#2C6E49' : '#9CA3AF'}
                        />
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: isActive ? '#2C6E49' : '#6B7280',
                          }}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ── Mood picker ── */}
            {activeType === 'mood' && (
              <View style={{ marginTop: 18 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 }}>
                  HOW ARE YOU FEELING?
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {MOOD_OPTIONS.map(m => {
                    const isActive = selectedMood === m.id;
                    return (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => setSelectedMood(m.id)}
                        activeOpacity={0.8}
                        style={{ alignItems: 'center', gap: 6 }}>
                        <View
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isActive ? '#0D1117' : '#F3F4F6',
                            borderWidth: 1,
                            borderColor: isActive ? '#0D1117' : 'rgba(0,0,0,0.08)',
                          }}>
                          <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '600',
                            color: isActive ? '#0D1117' : '#9CA3AF',
                          }}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ── Description input ── */}
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 }}>
                {activeType === 'mood' ? 'ADD A NOTE (OPTIONAL)' : 'DESCRIPTION'}
              </Text>
              <View
                style={{
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: 'rgba(0,0,0,0.1)',
                  backgroundColor: '#FAFAFA',
                  overflow: 'hidden',
                  // Premium inner top-edge highlight
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }}>
                {/* Icon + label inside input top */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingHorizontal: 14,
                    paddingTop: 12,
                  }}>
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: typeConfig.bgColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons name={typeConfig.iconName as any} size={14} color={typeConfig.color} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: typeConfig.color }}>
                    {typeConfig.label}
                  </Text>
                </View>

                <TextInput
                  ref={inputRef}
                  value={description}
                  onChangeText={setDescription}
                  placeholder={ph.main}
                  placeholderTextColor="#C4C4C6"
                  multiline
                  numberOfLines={3}
                  style={{
                    paddingHorizontal: 14,
                    paddingTop: 8,
                    paddingBottom: 14,
                    fontSize: 15,
                    color: '#0D1117',
                    lineHeight: 22,
                    minHeight: 72,
                    textAlignVertical: 'top',
                  }}
                />
              </View>
            </View>

            {/* ── Value / amount input ── */}
            {ph.showValue && (
              <View style={{ marginTop: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 }}>
                  AMOUNT / CALORIES
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: 'rgba(0,0,0,0.1)',
                    backgroundColor: '#FAFAFA',
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    elevation: 1,
                  }}>
                  <Ionicons name="calculator-outline" size={16} color="#9CA3AF" />
                  <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder={ph.value}
                    placeholderTextColor="#C4C4C6"
                    keyboardType="default"
                    returnKeyType="done"
                    style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: '500',
                      color: '#0D1117',
                    }}
                  />
                </View>
              </View>
            )}

            {/* ── Save button ── */}
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.88}
              disabled={!canSave}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginTop: 24,
                paddingVertical: 16,
                borderRadius: 18,
                backgroundColor: canSave ? '#0D1117' : '#E5E7EB',
                shadowColor: canSave ? '#0D1117' : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: canSave ? 0.2 : 0,
                shadowRadius: 10,
                elevation: canSave ? 6 : 0,
                // Premium top-edge highlight
                borderWidth: 1,
                borderColor: canSave ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              }}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={canSave ? '#FFFFFF' : '#9CA3AF'}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: canSave ? '#FFFFFF' : '#9CA3AF',
                  letterSpacing: -0.2,
                }}>
                Save Entry
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={canSave ? '#FFFFFF' : '#9CA3AF'}
              />
            </TouchableOpacity>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
