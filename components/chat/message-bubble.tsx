import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

export interface Message {
  id:        string;
  text:      string;
  from:      'user' | 'ai';
  timestamp: Date;
}

// ── Typing indicator ─────────────────────────────────────────────────────────
export function TypingIndicator() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(d, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 350, useNativeDriver: true }),
          Animated.delay(540 - i * 180),
        ]),
      ),
    );
    Animated.parallel(anims).start();
    return () => anims.forEach(a => a.stop());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginBottom: 6 }}>
      {/* AI avatar */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#2C6E49',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
        <Ionicons name="leaf" size={14} color="#FFFFFF" />
      </View>

      {/* Bubble */}
      <View
        style={{
          backgroundColor: '#F3F4F6',
          borderRadius: 18,
          borderBottomLeftRadius: 6,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}>
        {dots.map((d, i) => (
          <Animated.View
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: '#9CA3AF',
              opacity: d,
              transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
            }}
          />
        ))}
      </View>
    </View>
  );
}

// ── Single message bubble ────────────────────────────────────────────────────
interface BubbleProps {
  message: Message;
  showAvatar?: boolean;
}

export function MessageBubble({ message, showAvatar = true }: BubbleProps) {
  const isUser = message.from === 'user';
  const timeStr = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 10,
        marginBottom: 10,
        paddingHorizontal: 16,
      }}>

      {/* Avatar (AI only) */}
      {!isUser && showAvatar && (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#2C6E49',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginBottom: 2,
          }}>
          <Ionicons name="leaf" size={14} color="#FFFFFF" />
        </View>
      )}

      {/* Spacer when AI avatar hidden */}
      {!isUser && !showAvatar && <View style={{ width: 32 }} />}

      {/* Bubble content */}
      <View style={{ maxWidth: '72%' }}>
        <View
          style={
            isUser
              ? {
                  backgroundColor: '#0F1923',
                  borderRadius: 18,
                  borderBottomRightRadius: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 11,
                }
              : {
                  backgroundColor: '#F3F4F6',
                  borderRadius: 18,
                  borderBottomLeftRadius: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 11,
                  borderWidth: 1,
                  borderColor: '#ECEAE6',
                }
          }>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: isUser ? '#FFFFFF' : '#0F1923',
              fontWeight: '400',
            }}>
            {message.text}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 10,
            color: '#9CA3AF',
            marginTop: 4,
            fontWeight: '400',
            textAlign: isUser ? 'right' : 'left',
            paddingHorizontal: 4,
          }}>
          {timeStr}
        </Text>
      </View>
    </Animated.View>
  );
}
