/**
 * AttachMenu
 *
 * Bottom-sheet popup triggered by the (+) button in the chat input bar.
 * Only health-relevant actions are included — no generic AI features.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import type { ComponentProps } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AttachOption {
  id:      string;
  icon:    ComponentProps<typeof Ionicons>['name'];
  label:   string;
  sub:     string;
  divider?: boolean;    // show divider ABOVE this item
}

const OPTIONS: AttachOption[] = [
  {
    id:    'camera',
    icon:  'camera-outline',
    label: 'Take photo',
    sub:   'Capture a symptom or skin condition',
  },
  {
    id:    'files',
    icon:  'attach-outline',
    label: 'Add photos & files',
    sub:   'Upload lab reports, prescriptions',
    divider: true,
  },
  {
    id:    'scan',
    icon:  'scan-outline',
    label: 'Scan document',
    sub:   'Scan prescriptions or health reports',
  },
  {
    id:    'vitals',
    icon:  'pulse-outline',
    label: 'Share my vitals',
    sub:   'Send current heart rate, SpO₂ & HRV',
    divider: true,
  },
];

interface AttachMenuProps {
  visible:  boolean;
  onClose:  () => void;
  onSelect: (id: string) => void;
}

export function AttachMenu({ visible, onClose, onSelect }: AttachMenuProps) {
  const insets   = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1,   duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0,   useNativeDriver: true, bounciness: 4 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 0,   duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>

      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            opacity: fadeAnim,
            justifyContent: 'flex-end',
          }}>

          {/* Sheet — stops tap propagation */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 10,
                paddingBottom: insets.bottom + 12,
                overflow: 'hidden',
              }}>

              {/* Drag handle */}
              <View
                style={{
                  width: 38,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#E5E7EB',
                  alignSelf: 'center',
                  marginBottom: 16,
                }}
              />

              {/* Title */}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#9CA3AF',
                  letterSpacing: 0.5,
                  paddingHorizontal: 20,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                }}>
                Attach
              </Text>

              {OPTIONS.map(opt => (
                <View key={opt.id}>
                  {opt.divider && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: '#F3F4F6',
                        marginVertical: 4,
                        marginHorizontal: 20,
                      }}
                    />
                  )}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => { onSelect(opt.id); onClose(); }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      paddingHorizontal: 20,
                      paddingVertical: 13,
                    }}>

                    {/* Icon tile */}
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        backgroundColor: '#F3F4F6',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#ECEAE6',
                      }}>
                      <Ionicons name={opt.icon} size={20} color="#0F1923" />
                    </View>

                    {/* Label + sub */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: '#0F1923', letterSpacing: -0.2 }}>
                        {opt.label}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '400', marginTop: 1 }}>
                        {opt.sub}
                      </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Cancel */}
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.75}
                style={{
                  marginHorizontal: 20,
                  marginTop: 8,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#ECEAE6',
                }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#6B7280' }}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
