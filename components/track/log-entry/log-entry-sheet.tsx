/**
 * LogEntrySheet — v2
 * Premium healthcare bottom sheet.
 * Design language: near-monochrome, dark-when-selected chips,
 * glass input card, full-bleed footer CTA.
 */
import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─── Types ────────────────────────────────────────────────────────────────────

type InputKind = 'ml' | 'text' | 'number' | 'mood' | 'min';
type Section   = 'Nutrition' | 'Fitness' | 'Wellness';

interface Option {
  id:          string;
  label:       string;
  icon:        React.ComponentProps<typeof Ionicons>['name'];
  accentColor: string;          // used only for selected icon tint
  section:     Section;
  inputKind:   InputKind;
  placeholder: string;
  unit?:       string;
}

// ─── Options ─────────────────────────────────────────────────────────────────

const OPTIONS: Option[] = [
  // Nutrition
  { id:'water',   label:'Water',    icon:'water-outline',      accentColor:'#38BDF8', section:'Nutrition', inputKind:'ml',     placeholder:'250',               unit:'ml'    },
  { id:'meal',    label:'Meal',     icon:'restaurant-outline', accentColor:'#F97316', section:'Nutrition', inputKind:'text',   placeholder:'What did you eat?'              },
  { id:'coffee',  label:'Coffee',   icon:'cafe-outline',       accentColor:'#D97706', section:'Nutrition', inputKind:'ml',     placeholder:'200',               unit:'ml'    },
  { id:'snack',   label:'Snack',    icon:'nutrition-outline',  accentColor:'#10B981', section:'Nutrition', inputKind:'text',   placeholder:'What was the snack?'            },
  // Fitness
  { id:'running', label:'Running',  icon:'walk-outline',       accentColor:'#EF4444', section:'Fitness',   inputKind:'min',    placeholder:'30',                unit:'min'   },
  { id:'gym',     label:'Gym',      icon:'barbell-outline',    accentColor:'#8B5CF6', section:'Fitness',   inputKind:'min',    placeholder:'60',                unit:'min'   },
  { id:'yoga',    label:'Yoga',     icon:'body-outline',       accentColor:'#F59E0B', section:'Fitness',   inputKind:'min',    placeholder:'45',                unit:'min'   },
  { id:'cycling', label:'Cycling',  icon:'bicycle-outline',    accentColor:'#06B6D4', section:'Fitness',   inputKind:'min',    placeholder:'30',                unit:'min'   },
  { id:'steps',   label:'Steps',    icon:'footsteps-outline',  accentColor:'#2C6E49', section:'Fitness',   inputKind:'number', placeholder:'8000',              unit:'steps' },
  // Wellness
  { id:'mood',    label:'Mood',     icon:'happy-outline',      accentColor:'#F59E0B', section:'Wellness',  inputKind:'mood',   placeholder:''                               },
  { id:'sleep',   label:'Sleep',    icon:'moon-outline',       accentColor:'#6366F1', section:'Wellness',  inputKind:'number', placeholder:'8',                 unit:'hrs'   },
  { id:'weight',  label:'Weight',   icon:'scale-outline',      accentColor:'#EC4899', section:'Wellness',  inputKind:'number', placeholder:'70',                unit:'kg'    },
  { id:'meds',    label:'Medicine', icon:'medical-outline',    accentColor:'#EF4444', section:'Wellness',  inputKind:'text',   placeholder:'Medication name'                },
];

const SECTIONS: Section[] = ['Nutrition', 'Fitness', 'Wellness'];
const MOODS = ['😔','😐','🙂','😊','😄'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ opt, selected, onToggle }: {
  opt:      Option;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.75}
      style={{
        flex:             1,
        flexDirection:    'row',
        alignItems:       'center',
        justifyContent:   'center',
        gap:              6,
        paddingVertical:  12,
        borderRadius:     30,
        backgroundColor:  selected ? '#0D1117' : '#F3F4F6',
      }}>
      <Ionicons
        name={opt.icon}
        size={14}
        color={selected ? '#FFFFFF' : '#9CA3AF'}
      />
      <Text style={{
        fontSize:      13.5,
        fontWeight:    selected ? '600' : '400',
        color:         selected ? '#FFFFFF' : '#374151',
        letterSpacing: -0.1,
      }}>
        {opt.label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Input card rows ──────────────────────────────────────────────────────────

function MoodRow({ opt, value, onChange }: {
  opt: Option; value: string; onChange: (v: string) => void;
}) {
  return (
    <View style={rowWrap}>
      <View style={{ flexDirection:'row', alignItems:'center', gap: 10, flex: 1 }}>
        <View style={[iconCircle, { backgroundColor: opt.accentColor + '18' }]}>
          <Ionicons name={opt.icon} size={15} color={opt.accentColor} />
        </View>
        <Text style={rowLabel}>{opt.label}</Text>
      </View>
      <View style={{ flexDirection:'row', gap: 7 }}>
        {MOODS.map((m, i) => (
          <TouchableOpacity
            key={m}
            onPress={() => onChange(String(i))}
            style={{
              width: 34, height: 34,
              borderRadius: 17,
              backgroundColor: value === String(i) ? '#0D1117' : '#F3F4F6',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 17 }}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function NumberRow({ opt, value, onChange, isLast }: {
  opt: Option; value: string; onChange: (v: string) => void; isLast: boolean;
}) {
  return (
    <View style={[rowWrap, !isLast && rowBorder]}>
      <View style={{ flexDirection:'row', alignItems:'center', gap: 10, flex: 1 }}>
        <View style={[iconCircle, { backgroundColor: opt.accentColor + '18' }]}>
          <Ionicons name={opt.icon} size={15} color={opt.accentColor} />
        </View>
        <Text style={rowLabel}>{opt.label}</Text>
      </View>
      <View style={{ flexDirection:'row', alignItems:'center', gap: 6 }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={opt.placeholder}
          placeholderTextColor="#C4C9D4"
          keyboardType="numeric"
          style={{
            fontSize:   18,
            fontWeight: '700',
            color:      '#0D1117',
            minWidth:   52,
            textAlign:  'right',
            padding: 0,
          }}
        />
        {opt.unit && (
          <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>
            {opt.unit}
          </Text>
        )}
      </View>
    </View>
  );
}

function TextRow({ opt, value, onChange, isLast }: {
  opt: Option; value: string; onChange: (v: string) => void; isLast: boolean;
}) {
  return (
    <View style={[rowWrap, { flexDirection:'column', alignItems:'stretch', paddingVertical: 14 }, !isLast && rowBorder]}>
      <View style={{ flexDirection:'row', alignItems:'center', gap: 10, marginBottom: 10 }}>
        <View style={[iconCircle, { backgroundColor: opt.accentColor + '18' }]}>
          <Ionicons name={opt.icon} size={15} color={opt.accentColor} />
        </View>
        <Text style={rowLabel}>{opt.label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={opt.placeholder}
        placeholderTextColor="#C4C9D4"
        multiline
        style={{
          fontSize:         14,
          fontWeight:       '400',
          color:            '#0D1117',
          padding:          0,
          minHeight:        36,
          lineHeight:       20,
        }}
      />
    </View>
  );
}

// Shared row styles
const rowWrap = {
  flexDirection:    'row' as const,
  alignItems:       'center' as const,
  justifyContent:   'space-between' as const,
  paddingVertical:  16,
  paddingHorizontal:16,
};
const rowBorder = {
  borderBottomWidth: 1,
  borderBottomColor: '#F3F4F6',
};
const iconCircle = {
  width: 30, height: 30,
  borderRadius: 10,
  alignItems:      'center' as const,
  justifyContent:  'center' as const,
};
const rowLabel = {
  fontSize:   14,
  fontWeight: '600' as const,
  color:      '#0D1117',
  letterSpacing: -0.1,
};

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function LogEntrySheet({ visible, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [values,   setValues  ] = useState<Record<string, string>>({});

  const slideY  = useRef(new Animated.Value(700)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY,  { toValue: 0,   useNativeDriver: true, damping: 24, stiffness: 240 }),
        Animated.timing(opacity, { toValue: 1,   duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY,  { toValue: 700, duration: 260, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0,   duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  function toggle(id: string) {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function setValue(id: string, v: string) {
    setValues(prev => ({ ...prev, [id]: v }));
  }

  function handleLog() {
    setSelected(new Set());
    setValues({});
    onClose();
  }

  const selectedOpts = OPTIONS.filter(o => selected.has(o.id));
  const canLog       = selected.size > 0;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>

      {/* Dim backdrop */}
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', opacity }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        transform:            [{ translateY: slideY }],
        backgroundColor:      '#FFFFFF',
        borderTopLeftRadius:  32,
        borderTopRightRadius: 32,
        maxHeight:            '92%',
        shadowColor:          '#000',
        shadowOffset:         { width: 0, height: -6 },
        shadowOpacity:        0.14,
        shadowRadius:         24,
        elevation:            30,
      }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          {/* Drag handle */}
          <View style={{ alignItems:'center', paddingTop: 14 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E5' }} />
          </View>

          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems:    'flex-start',
            paddingHorizontal: 22,
            paddingTop:    20,
            paddingBottom: 6,
            gap: 14,
          }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 34, height: 34,
                borderRadius: 17,
                backgroundColor: '#F3F4F6',
                alignItems: 'center', justifyContent: 'center',
                marginTop: 2,
              }}>
              <Ionicons name="close" size={18} color="#374151" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontSize:     22,
                  fontWeight:   '800',
                  color:        '#0D1117',
                  letterSpacing:-0.5,
                  lineHeight:   28,
                }}>
                What would you like to log?
              </Text>
              <Text style={{
                fontSize:  13,
                color:     '#9CA3AF',
                marginTop: 4,
              }}>
                Select activities to track today
              </Text>
            </View>
          </View>

          {/* Scrollable content */}
          <ScrollView
            style={{ paddingHorizontal: 22 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">

            {/* Chip sections — 3-column grid, every row fills full width */}
            {SECTIONS.map(section => {
              const opts = OPTIONS.filter(o => o.section === section);
              const rows = chunk(opts, 3);
              return (
                <View key={section} style={{ marginTop: 22 }}>
                  <Text style={{
                    fontSize:     16,
                    fontWeight:   '700',
                    color:        '#0D1117',
                    letterSpacing:-0.3,
                    marginBottom: 10,
                  }}>
                    {section}
                  </Text>
                  {rows.map((row, ri) => (
                    <View key={ri} style={{ flexDirection:'row', gap: 8, marginBottom: 8 }}>
                      {row.map(opt => (
                        <Chip
                          key={opt.id}
                          opt={opt}
                          selected={selected.has(opt.id)}
                          onToggle={() => toggle(opt.id)}
                        />
                      ))}
                      {/* Empty flex spacers so partial rows stay grid-aligned */}
                      {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, si) => (
                        <View key={`sp-${si}`} style={{ flex: 1 }} />
                      ))}
                    </View>
                  ))}
                </View>
              );
            })}

            {/* Input card */}
            {selectedOpts.length > 0 && (
              <View style={{ marginTop: 28 }}>
                <Text style={{
                  fontSize:      11,
                  fontWeight:    '600',
                  color:         '#9CA3AF',
                  letterSpacing: 1,
                  marginBottom:  10,
                }}>
                  ENTER DETAILS
                </Text>

                <View style={{
                  backgroundColor: '#FAFAFA',
                  borderRadius:    20,
                  borderWidth:     1,
                  borderColor:     '#F0F0F5',
                  overflow:        'hidden',
                }}>
                  {selectedOpts.map((opt, idx) => {
                    const isLast = idx === selectedOpts.length - 1;
                    const v = values[opt.id] ?? '';
                    const onChange = (val: string) => setValue(opt.id, val);

                    if (opt.inputKind === 'mood')
                      return <MoodRow key={opt.id} opt={opt} value={v} onChange={onChange} />;
                    if (opt.inputKind === 'text')
                      return <TextRow key={opt.id} opt={opt} value={v} onChange={onChange} isLast={isLast} />;
                    return <NumberRow key={opt.id} opt={opt} value={v} onChange={onChange} isLast={isLast} />;
                  })}
                </View>
              </View>
            )}

            <View style={{ height: 130 }} />
          </ScrollView>

          {/* Footer */}
          <View style={{
            position:         'absolute',
            bottom:           0, left: 0, right: 0,
            paddingHorizontal:22,
            paddingVertical:  18,
            flexDirection:    'row',
            alignItems:       'center',
            justifyContent:   'space-between',
            backgroundColor:  '#FFFFFF',
            borderTopWidth:   1,
            borderTopColor:   '#F3F4F6',
          }}>
            {/* Counter */}
            <View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#0D1117', letterSpacing: -0.5 }}>
                {selected.size}
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#C4C9D4' }}>
                  {' '}/ {OPTIONS.length}
                </Text>
              </Text>
              <Text style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 1 }}>selected</Text>
            </View>

            {/* CTA */}
            <TouchableOpacity
              onPress={canLog ? handleLog : undefined}
              activeOpacity={canLog ? 0.85 : 1}
              style={{
                backgroundColor:  canLog ? '#0D1117' : '#F3F4F6',
                borderRadius:     30,
                paddingHorizontal:36,
                paddingVertical:  16,
                shadowColor:      canLog ? '#0D1117' : 'transparent',
                shadowOffset:     { width: 0, height: 6 },
                shadowOpacity:    canLog ? 0.3 : 0,
                shadowRadius:     14,
                elevation:        canLog ? 8 : 0,
              }}>
              <Text style={{
                fontSize:   16,
                fontWeight: '700',
                color:      canLog ? '#FFFFFF' : '#C4C9D4',
                letterSpacing: -0.3,
              }}>
                Log it
              </Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}
