/**
 * LogEntrySheet
 * Premium bottom-sheet modal for logging health activities.
 * Replicates the "What do you vibe with?" chip-selection UI
 * adapted for health tracking: Nutrition / Fitness / Wellness.
 *
 * Flow:
 *  1. User sees chip grid — tap to select
 *  2. Selected chips reveal an inline input row
 *  3. Footer shows count + "Log it" CTA
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
  iconColor:   string;
  iconBg:      string;
  section:     Section;
  inputKind:   InputKind;
  placeholder: string;
  unit?:       string;
}

// ─── Options data ─────────────────────────────────────────────────────────────

const OPTIONS: Option[] = [
  // Nutrition
  { id:'water',   label:'Water',    icon:'water-outline',      iconColor:'#38BDF8', iconBg:'#F0F9FF', section:'Nutrition', inputKind:'ml',     placeholder:'250',               unit:'ml'    },
  { id:'meal',    label:'Meal',     icon:'restaurant-outline', iconColor:'#F97316', iconBg:'#FFF7ED', section:'Nutrition', inputKind:'text',   placeholder:'What did you eat?'              },
  { id:'coffee',  label:'Coffee',   icon:'cafe-outline',       iconColor:'#92400E', iconBg:'#FEF3C7', section:'Nutrition', inputKind:'ml',     placeholder:'250',               unit:'ml'    },
  { id:'snack',   label:'Snack',    icon:'nutrition-outline',  iconColor:'#10B981', iconBg:'#ECFDF5', section:'Nutrition', inputKind:'text',   placeholder:'What was the snack?'            },
  // Fitness
  { id:'running', label:'Running',  icon:'walk-outline',       iconColor:'#EF4444', iconBg:'#FEF2F2', section:'Fitness',   inputKind:'min',    placeholder:'30',                unit:'min'   },
  { id:'gym',     label:'Gym',      icon:'barbell-outline',    iconColor:'#8B5CF6', iconBg:'#F5F3FF', section:'Fitness',   inputKind:'min',    placeholder:'60',                unit:'min'   },
  { id:'yoga',    label:'Yoga',     icon:'body-outline',       iconColor:'#F59E0B', iconBg:'#FFFBEB', section:'Fitness',   inputKind:'min',    placeholder:'45',                unit:'min'   },
  { id:'cycling', label:'Cycling',  icon:'bicycle-outline',    iconColor:'#06B6D4', iconBg:'#ECFEFF', section:'Fitness',   inputKind:'min',    placeholder:'30',                unit:'min'   },
  { id:'steps',   label:'Steps',    icon:'footsteps-outline',  iconColor:'#2C6E49', iconBg:'#F0FBF5', section:'Fitness',   inputKind:'number', placeholder:'8000',              unit:'steps' },
  // Wellness
  { id:'mood',    label:'Mood',     icon:'happy-outline',      iconColor:'#F59E0B', iconBg:'#FFFBEB', section:'Wellness',  inputKind:'mood',   placeholder:''                               },
  { id:'sleep',   label:'Sleep',    icon:'moon-outline',       iconColor:'#6366F1', iconBg:'#EEF2FF', section:'Wellness',  inputKind:'number', placeholder:'8',                 unit:'hrs'   },
  { id:'weight',  label:'Weight',   icon:'scale-outline',      iconColor:'#EC4899', iconBg:'#FDF2F8', section:'Wellness',  inputKind:'number', placeholder:'70',                unit:'kg'    },
  { id:'meds',    label:'Medicine', icon:'medical-outline',    iconColor:'#EF4444', iconBg:'#FEF2F2', section:'Wellness',  inputKind:'text',   placeholder:'Medication name'                },
];

const SECTIONS: Section[] = ['Nutrition', 'Fitness', 'Wellness'];

const MOODS = ['😔','😐','🙂','😊','😄'];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A single selectable chip */
function Chip({
  opt, selected, onToggle,
}: { opt: Option; selected: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={{
        flexDirection:    'row',
        alignItems:       'center',
        gap:              7,
        paddingHorizontal:13,
        paddingVertical:  9,
        borderRadius:     30,
        backgroundColor:  selected ? opt.iconBg      : '#F5F6F8',
        borderWidth:      selected ? 1.5             : 0,
        borderColor:      selected ? opt.iconColor   : 'transparent',
        marginRight:      8,
        marginBottom:     8,
      }}>
      <Ionicons name={opt.icon} size={15} color={selected ? opt.iconColor : '#9CA3AF'} />
      <Text style={{
        fontSize:   13,
        fontWeight: selected ? '600' : '400',
        color:      selected ? opt.iconColor : '#374151',
      }}>
        {opt.label}
      </Text>
    </TouchableOpacity>
  );
}

/** Inline input row that appears when a chip is selected */
function InputRow({ opt, value, onChange }: {
  opt:      Option;
  value:    string;
  onChange: (v: string) => void;
}) {
  if (opt.inputKind === 'mood') {
    return (
      <View style={{
        flexDirection:    'row',
        alignItems:       'center',
        backgroundColor:  '#F5F6F8',
        borderRadius:     14,
        padding:          12,
        marginBottom:     10,
        gap:              6,
      }}>
        <Ionicons name={opt.icon} size={16} color={opt.iconColor} />
        <Text style={{ fontSize: 12.5, fontWeight:'600', color: opt.iconColor, flex: 1 }}>
          {opt.label}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {MOODS.map((m, i) => (
            <TouchableOpacity
              key={m}
              onPress={() => onChange(String(i))}
              style={{
                width: 32, height: 32,
                borderRadius: 16,
                backgroundColor: value === String(i) ? opt.iconBg : 'transparent',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: value === String(i) ? 1.5 : 0,
                borderColor: opt.iconColor,
              }}>
              <Text style={{ fontSize: 18 }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{
      flexDirection:    'row',
      alignItems:       'center',
      backgroundColor:  '#F5F6F8',
      borderRadius:     14,
      paddingHorizontal:14,
      paddingVertical:  11,
      marginBottom:     10,
      gap:              10,
    }}>
      <Ionicons name={opt.icon} size={16} color={opt.iconColor} />
      <Text style={{ fontSize: 13, fontWeight:'600', color: opt.iconColor, width: 62 }}>
        {opt.label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={opt.placeholder}
        placeholderTextColor="#C4C9D4"
        keyboardType={opt.inputKind === 'text' ? 'default' : 'numeric'}
        style={{
          flex:       1,
          fontSize:   14,
          fontWeight: '500',
          color:      '#0D1117',
          padding:    0,
        }}
      />
      {opt.unit && (
        <Text style={{ fontSize: 12.5, fontWeight:'500', color:'#9CA3AF' }}>
          {opt.unit}
        </Text>
      )}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  visible:  boolean;
  onClose:  () => void;
}

export function LogEntrySheet({ visible, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [values,   setValues  ] = useState<Record<string, string>>({});

  const slideY  = useRef(new Animated.Value(600)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Animate in when visible changes
  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY,  { toValue: 0,   useNativeDriver: true, damping: 22, stiffness: 220 }),
        Animated.timing(opacity, { toValue: 1,   duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY,  { toValue: 600, duration: 280, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0,   duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function setValue(id: string, v: string) {
    setValues(prev => ({ ...prev, [id]: v }));
  }

  function handleLog() {
    console.log('Logging entries:', Object.fromEntries(
      [...selected].map(id => [id, values[id] ?? ''])
    ));
    setSelected(new Set());
    setValues({});
    onClose();
  }

  const selectedOpts = OPTIONS.filter(o => selected.has(o.id));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>

      {/* Backdrop */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          opacity,
        }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={{
        position:        'absolute',
        left: 0, right: 0, bottom: 0,
        transform:       [{ translateY: slideY }],
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius:  28,
        borderTopRightRadius: 28,
        maxHeight:            '88%',
        shadowColor:          '#000',
        shadowOffset:         { width: 0, height: -4 },
        shadowOpacity:        0.12,
        shadowRadius:         20,
        elevation:            24,
      }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

          {/* Handle */}
          <View style={{ alignItems:'center', paddingTop: 12, paddingBottom: 4 }}>
            <View style={{
              width: 36, height: 4,
              borderRadius: 2,
              backgroundColor: '#E5E7EB',
            }} />
          </View>

          {/* Header */}
          <View style={{
            flexDirection:  'row',
            alignItems:     'center',
            paddingHorizontal: 20,
            paddingTop:     12,
            paddingBottom:  6,
          }}>
            <TouchableOpacity onPress={onClose} style={{ padding: 4, marginRight: 12 }}>
              <Ionicons name="close" size={22} color="#374151" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize:     20,
                fontWeight:   '800',
                color:        '#0D1117',
                letterSpacing:-0.4,
              }}>
                What would you like to log?
              </Text>
              <Text style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 2 }}>
                Select activities to track today
              </Text>
            </View>
          </View>

          <ScrollView
            style={{ paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">

            {/* ── Chip sections ─────────────────────────────────── */}
            {SECTIONS.map(section => {
              const opts = OPTIONS.filter(o => o.section === section);
              return (
                <View key={section} style={{ marginTop: 20 }}>
                  <Text style={{
                    fontSize:     15,
                    fontWeight:   '700',
                    color:        '#0D1117',
                    letterSpacing:-0.2,
                    marginBottom: 10,
                  }}>
                    {section}
                  </Text>
                  <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
                    {opts.map(opt => (
                      <Chip
                        key={opt.id}
                        opt={opt}
                        selected={selected.has(opt.id)}
                        onToggle={() => toggle(opt.id)}
                      />
                    ))}
                  </View>
                </View>
              );
            })}

            {/* ── Inline inputs for selected items ──────────────── */}
            {selectedOpts.length > 0 && (
              <View style={{ marginTop: 24 }}>
                <Text style={{
                  fontSize:     12,
                  fontWeight:   '600',
                  color:        '#9CA3AF',
                  letterSpacing: 0.4,
                  marginBottom:  10,
                }}>
                  ENTER DETAILS
                </Text>
                {selectedOpts.map(opt => (
                  <InputRow
                    key={opt.id}
                    opt={opt}
                    value={values[opt.id] ?? ''}
                    onChange={v => setValue(opt.id, v)}
                  />
                ))}
              </View>
            )}

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* ── Footer ─────────────────────────────────────────── */}
          <View style={{
            position:         'absolute',
            bottom:           0,
            left: 0, right:   0,
            backgroundColor:  '#FFFFFF',
            borderTopWidth:   1,
            borderTopColor:   '#F3F4F6',
            paddingHorizontal:20,
            paddingVertical:  16,
            flexDirection:    'row',
            alignItems:       'center',
            justifyContent:   'space-between',
          }}>
            <Text style={{ fontSize: 13, fontWeight:'500', color:'#9CA3AF' }}>
              {selected.size} / {OPTIONS.length} selected
            </Text>
            <TouchableOpacity
              onPress={selected.size > 0 ? handleLog : undefined}
              activeOpacity={selected.size > 0 ? 0.8 : 1}
              style={{
                backgroundColor:  selected.size > 0 ? '#0D1117' : '#E5E7EB',
                borderRadius:     30,
                paddingHorizontal:28,
                paddingVertical:  13,
              }}>
              <Text style={{
                fontSize:   14,
                fontWeight: '700',
                color:      selected.size > 0 ? '#FFFFFF' : '#9CA3AF',
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
