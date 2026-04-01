/**
 * AI Health Assistant Chat Screen
 *
 * Opened when the user taps the "Describe symptoms or ask your AI…" bar
 * on the home screen. Shows suggested topics and quick chips when empty,
 * then transitions to a full chat thread once messages are exchanged.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatGreeting }    from '../components/chat/chat-greeting';
import { ChatHeader }      from '../components/chat/chat-header';
import { ChatInput }       from '../components/chat/chat-input';
import { MessageBubble, TypingIndicator } from '../components/chat/message-bubble';
import type { Message }    from '../components/chat/message-bubble';
import { QuickChips }      from '../components/chat/quick-chips';
import { SuggestedTopics } from '../components/chat/suggested-topics';

// ── Simulated AI responses (replace with real API call) ──────────────────────
const AI_HEALTH_RESPONSES: Record<string, string> = {
  default:
    "I'm your Vedarogya AI health assistant. Based on your profile, I can help analyze symptoms, interpret vitals, suggest Ayurvedic remedies, or guide your wellness journey. What would you like to explore?",
  vitals:
    "To analyze your vitals, please connect your smartwatch via the Home screen. Once connected, I can review your heart rate, SpO₂, HRV and body temperature in real time and flag any Ayurvedic imbalances.",
  symptom:
    "Please describe your symptoms in as much detail as possible — duration, intensity, and when they started. I'll cross-reference them with your recent biometric data and Ayurvedic dosha profile.",
  sleep:
    "Quality sleep is essential for all three doshas. Based on Ayurveda, Vata types benefit from early bedtimes (10 PM) while Pitta types should avoid screens after 9 PM. Would you like a personalized sleep protocol?",
  nutrition:
    "Your diet should align with your dominant dosha. Kapha types thrive on light, warm, spiced foods; Pitta on cooling, bitter greens; Vata on grounding, warm, oily foods. Shall I build a meal plan for you?",
  heart:
    "A healthy resting heart rate is 60–100 bpm; athletic individuals often see 40–60 bpm. For accurate readings, connect your smartwatch and I'll monitor trends and alert you to irregularities.",
  stress:
    "Chronic stress disturbs Vata dosha, leading to anxiety and insomnia. Proven Ayurvedic techniques: Ashwagandha (500 mg), Pranayama breathing, and Abhyanga self-massage. Want a guided protocol?",
  meditation:
    "A consistent meditation practice — even 10 minutes daily — significantly reduces cortisol and balances all three doshas. I recommend Nadi Shodhana (alternate-nostril breathing) to start. Want step-by-step guidance?",
  hydration:
    "The standard 8-glasses guideline is a simplification. Your ideal intake depends on body weight, activity level and climate. A good rule: drink half your body weight (lbs) in ounces daily. Warm water is preferred in Ayurveda.",
};

function getAIResponse(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes('vital') || lower.includes('heart rate') || lower.includes('spo2') || lower.includes('hrv'))
    return AI_HEALTH_RESPONSES.vitals;
  if (lower.includes('symptom') || lower.includes('pain') || lower.includes('sick') || lower.includes('fever'))
    return AI_HEALTH_RESPONSES.symptom;
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('tired'))
    return AI_HEALTH_RESPONSES.sleep;
  if (lower.includes('nutrition') || lower.includes('diet') || lower.includes('food') || lower.includes('eat'))
    return AI_HEALTH_RESPONSES.nutrition;
  if (lower.includes('heart') || lower.includes('pulse') || lower.includes('bpm'))
    return AI_HEALTH_RESPONSES.heart;
  if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('worry'))
    return AI_HEALTH_RESPONSES.stress;
  if (lower.includes('meditat') || lower.includes('breathe') || lower.includes('calm'))
    return AI_HEALTH_RESPONSES.meditation;
  if (lower.includes('water') || lower.includes('hydrat') || lower.includes('drink'))
    return AI_HEALTH_RESPONSES.hydration;
  return AI_HEALTH_RESPONSES.default;
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const params   = useLocalSearchParams<{ query?: string }>();

  const [messages,  setMessages]  = useState<Message[]>([]);
  const [inputText, setInputText] = useState(params.query ?? '');
  const [isTypingAI, setTypingAI] = useState(false);

  const listRef   = useRef<FlatList<Message>>(null);
  const hasMessages = messages.length > 0;

  // ── Handle incoming query from home screen ──────────────────────────────
  useEffect(() => {
    if (params.query?.trim()) {
      setInputText(params.query.trim());
    }
  }, [params.query]);

  // ── Scroll to bottom whenever messages update ───────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 120);
    }
  }, [messages, isTypingAI]);

  // ── Send a message ──────────────────────────────────────────────────────
  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id:        `u-${Date.now()}`,
      text:      trimmed,
      from:      'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setTypingAI(true);

    // Simulate AI thinking delay
    const delay = 1000 + Math.random() * 800;
    setTimeout(() => {
      const aiMsg: Message = {
        id:        `ai-${Date.now()}`,
        text:      getAIResponse(trimmed),
        from:      'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setTypingAI(false);
    }, delay);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>

      {/* Dynamic Island / status bar cover */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: '#FFFFFF',
          zIndex: 100,
        }}
      />

      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <ChatHeader onBack={() => router.back()} />
      </View>

      {/* Body — empty: greeting + topics + chips; with messages: chat thread */}
      {!hasMessages ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          <ChatGreeting name="Nishal N Poojary" />
          <SuggestedTopics onSelect={sendMessage} />
          <View style={{ height: 20 }} />
          <QuickChips onSelect={sendMessage} />
        </ScrollView>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <MessageBubble
              message={item}
              showAvatar={
                item.from === 'ai' &&
                (index === 0 || messages[index - 1]?.from !== 'ai')
              }
            />
          )}
          ListFooterComponent={isTypingAI ? (
            <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
              <TypingIndicator />
            </View>
          ) : null}
        />
      )}

      {/* Input */}
      <View style={{ paddingBottom: insets.bottom }}>
        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={() => sendMessage(inputText)}
          isTypingAI={isTypingAI}
          disabled={isTypingAI}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
