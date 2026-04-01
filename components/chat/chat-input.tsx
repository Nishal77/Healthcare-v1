import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ChatInputProps {
  value:        string;
  onChange:     (t: string) => void;
  onSend:       () => void;
  onMic?:       () => void;
  onAttach?:    () => void;
  isTypingAI?:  boolean;
  disabled?:    boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onMic,
  onAttach,
  isTypingAI = false,
  disabled = false,
}: ChatInputProps) {
  const hasText   = value.trim().length > 0;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse the send button when activated
  useEffect(() => {
    if (hasText) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.88, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [hasText]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'ios' ? 4 : 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 10,
        }}>

        {/* Attach (+) button */}
        <TouchableOpacity
          onPress={onAttach}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#ECEAE6',
            flexShrink: 0,
            marginBottom: 2,
          }}>
          <Text style={{ fontSize: 22, color: '#6B7280', lineHeight: 26, fontWeight: '300' }}>+</Text>
        </TouchableOpacity>

        {/* Input pill */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            backgroundColor: '#F9F9F8',
            borderRadius: 22,
            borderWidth: 1,
            borderColor: '#ECEAE6',
            paddingHorizontal: 16,
            paddingVertical: 10,
            gap: 10,
            minHeight: 44,
          }}>
          <TextInput
            style={{
              flex: 1,
              fontSize: 14,
              color: '#0F1923',
              maxHeight: 100,
              lineHeight: 20,
            }}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={hasText ? onSend : undefined}
            editable={!disabled}
            autoCorrect
            autoCapitalize="sentences"
          />

          {/* Mic icon (when no text) */}
          {!hasText && (
            <TouchableOpacity
              onPress={onMic}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="mic-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Send button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }], flexShrink: 0, marginBottom: 2 }}>
          <TouchableOpacity
            onPress={onSend}
            disabled={!hasText || disabled}
            activeOpacity={0.85}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: hasText ? '#2C6E49' : '#E5E7EB',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {isTypingAI ? (
              <Ionicons name="ellipsis-horizontal" size={18} color={hasText ? '#FFFFFF' : '#9CA3AF'} />
            ) : (
              <Ionicons name="send" size={16} color={hasText ? '#FFFFFF' : '#9CA3AF'} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}
