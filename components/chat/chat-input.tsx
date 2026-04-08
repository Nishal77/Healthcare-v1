/**
 * ChatInput
 *
 * Layout (matches reference images exactly):
 *   [+]   [Type a message...  🎤]   [●◼◼◼]
 *
 * - (+) circle: opens AttachMenu
 * - Input pill: auto-expands, keyboard opens on focus
 * - Mic inside input (right): shown when empty
 * - Dark filled circle (right): waveform icon when idle → send arrow when typing
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { forwardRef, useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ChatInputProps {
  value:       string;
  onChange:    (t: string) => void;
  onSend:      () => void;
  onMic?:      () => void;
  onAttach?:   () => void;
  isTypingAI?: boolean;
  disabled?:   boolean;
  autoFocus?:  boolean;
}

// Waveform bars — replicate the sound-wave icon seen in reference image 2 & 3
function WaveformIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  const heights = [0.4, 0.7, 1, 0.7, 0.4];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2.5 }}>
      {heights.map((h, i) => (
        <View
          key={i}
          style={{
            width: size * 0.12,
            height: size * h,
            borderRadius: size * 0.06,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
}

export const ChatInput = forwardRef<TextInput, ChatInputProps>(
  function ChatInput(
    {
      value,
      onChange,
      onSend,
      onMic,
      onAttach,
      isTypingAI = false,
      disabled   = false,
      autoFocus  = false,
    },
    ref,
  ) {
    const hasText    = value.trim().length > 0;
    const scaleAnim  = useRef(new Animated.Value(1)).current;

    // Pulse send button on first keystroke
    useEffect(() => {
      if (hasText) {
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 0.85, duration: 90,  useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, bounciness: 12 }),
        ]).start();
      }
    }, [hasText]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 6 : 10,
          backgroundColor: '#FFFFFF',
        }}>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>

          {/* ── (+) Attach button ──────────────────────────────────────── */}
          <TouchableOpacity
            onPress={onAttach}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              flexShrink: 0,
              marginBottom: 1,
            }}>
            <Ionicons name="add" size={22} color="#374151" />
          </TouchableOpacity>

          {/* ── Input pill ─────────────────────────────────────────────── */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
              backgroundColor: '#F3F4F6',
              borderRadius: 22,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              paddingLeft: 16,
              paddingRight: 12,
              paddingVertical: Platform.OS === 'ios' ? 11 : 8,
              gap: 8,
              minHeight: 44,
            }}>

            <TextInput
              ref={ref}
              style={{
                flex: 1,
                fontSize: 15,
                color: '#0F1923',
                maxHeight: 110,
                lineHeight: 21,
                paddingTop: 0,
                paddingBottom: 0,
              }}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={value}
              onChangeText={onChange}
              multiline
              blurOnSubmit={false}
              editable={!disabled}
              autoCorrect
              autoCapitalize="sentences"
              autoFocus={autoFocus}
              keyboardAppearance="light"
            />

            {/* Mic — shown only when input is empty */}
            {!hasText && (
              <TouchableOpacity
                onPress={onMic}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{ marginBottom: Platform.OS === 'ios' ? 1 : 3 }}>
                <Ionicons name="mic-outline" size={21} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* ── Send / Waveform button ─────────────────────────────────── */}
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              flexShrink: 0,
              marginBottom: 1,
            }}>
            <TouchableOpacity
              onPress={hasText ? onSend : onMic}
              disabled={isTypingAI}
              activeOpacity={0.82}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: hasText ? '#2C6E49' : '#0F1923',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {isTypingAI ? (
                /* Three pulsing dots while AI is responding */
                <View style={{ flexDirection: 'row', gap: 3 }}>
                  {[0, 1, 2].map(i => (
                    <View
                      key={i}
                      style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFFFFF', opacity: 0.6 }}
                    />
                  ))}
                </View>
              ) : hasText ? (
                /* Send arrow */
                <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
              ) : (
                /* Waveform icon — idle state */
                <WaveformIcon color="#FFFFFF" size={22} />
              )}
            </TouchableOpacity>
          </Animated.View>

        </View>
      </View>
    );
  },
);
