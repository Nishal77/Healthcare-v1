/**
 * AI Health Assistant Chat Screen
 *
 * Flow:
 *   Home SearchBar tap → navigate here (keyboard opens immediately)
 *   Empty state → greeting + suggested topic cards + quick chips
 *   After first message → FlatList conversation thread
 *
 * (+) button → AttachMenu (Take photo / Add photos & files / Scan doc / Share vitals)
 */

import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AttachMenu }    from '../components/chat/attach-menu';
import { ChatGreeting }  from '../components/chat/chat-greeting';
import { ChatHeader }    from '../components/chat/chat-header';
import { ChatInput }     from '../components/chat/chat-input';
import { MessageBubble, TypingIndicator } from '../components/chat/message-bubble';
import type { Message }  from '../components/chat/message-bubble';
import { QuickChips }    from '../components/chat/quick-chips';
import { SuggestedTopics } from '../components/chat/suggested-topics';
import { useAuth }         from '@/hooks/useAuth';

// ── AI response engine (replace with real API call) ──────────────────────────
const AI_RESPONSES: Record<string, string> = {
  default:
    "I'm your Vedarogya AI health assistant. I can help analyze symptoms, interpret vitals, suggest Ayurvedic remedies, or guide your wellness journey. What would you like to explore?",
  vitals:
    "To analyze your vitals in real time, connect your smartwatch via the Home screen. Once connected, I can review your heart rate, SpO₂, HRV and body temperature and flag any Ayurvedic imbalances.",
  symptom:
    "Please describe your symptoms in detail — duration, intensity and when they started. I'll cross-reference them with your recent biometric data and Ayurvedic dosha profile.",
  sleep:
    "Quality sleep is essential for all three doshas. Vata types benefit from an early bedtime (10 PM) while Pitta types should avoid screens after 9 PM. Want a personalized sleep protocol?",
  nutrition:
    "Your diet should align with your dominant dosha. Kapha types thrive on light, warm, spiced foods; Pitta on cooling bitter greens; Vata on grounding warm oily foods. Shall I build a meal plan?",
  heart:
    "A healthy resting heart rate is 60–100 bpm; athletes often see 40–60 bpm. Connect your smartwatch and I'll monitor trends and alert you to irregularities automatically.",
  stress:
    "Chronic stress disturbs Vata dosha, leading to anxiety and insomnia. Ayurvedic techniques: Ashwagandha (500 mg), Pranayama breathing, and Abhyanga self-massage. Want a guided protocol?",
  meditation:
    "Even 10 minutes of daily meditation significantly reduces cortisol and balances all three doshas. I recommend Nadi Shodhana (alternate-nostril breathing) to start. Want step-by-step guidance?",
  hydration:
    "Your ideal water intake depends on body weight, activity level and climate. A good rule: drink half your body weight (lbs) in ounces daily. Ayurveda prefers warm water for better digestion.",
  photo:
    "I've received your image. For a thorough analysis, please describe any associated symptoms — location, duration, and changes you've noticed. Our clinical AI will review the image alongside your health profile.",
  scan:
    "Document received. I'll extract the key values from your health report and cross-reference them with your dosha profile. This may take a moment — I'll notify you when the analysis is ready.",
  vitals_share:
    "Thank you for sharing your current vitals. Based on today's readings I can see areas worth discussing. Would you like me to generate a full dosha report or flag anything unusual?",
};

function getAIResponse(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('vital') || t.includes('spo2') || t.includes('hrv') || t.includes('oxygen'))
    return AI_RESPONSES.vitals;
  if (t.includes('symptom') || t.includes('pain') || t.includes('sick') || t.includes('fever') || t.includes('hurt'))
    return AI_RESPONSES.symptom;
  if (t.includes('sleep') || t.includes('insomnia') || t.includes('tired') || t.includes('rest'))
    return AI_RESPONSES.sleep;
  if (t.includes('nutrition') || t.includes('diet') || t.includes('food') || t.includes('eat') || t.includes('meal'))
    return AI_RESPONSES.nutrition;
  if (t.includes('heart') || t.includes('pulse') || t.includes('bpm') || t.includes('rate'))
    return AI_RESPONSES.heart;
  if (t.includes('stress') || t.includes('anxiety') || t.includes('worry') || t.includes('panic'))
    return AI_RESPONSES.stress;
  if (t.includes('meditat') || t.includes('breath') || t.includes('calm') || t.includes('relax'))
    return AI_RESPONSES.meditation;
  if (t.includes('water') || t.includes('hydrat') || t.includes('drink'))
    return AI_RESPONSES.hydration;
  return AI_RESPONSES.default;
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const params  = useLocalSearchParams<{ query?: string }>();
  const { user } = useAuth();
  const chatUserName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Guest';

  const [messages,    setMessages]    = useState<Message[]>([]);
  const [inputText,   setInputText]   = useState(params.query ?? '');
  const [isTypingAI,  setTypingAI]    = useState(false);
  const [attachOpen,  setAttachOpen]  = useState(false);

  const listRef     = useRef<FlatList<Message>>(null);
  const inputRef    = useRef<TextInput>(null);
  const hasMessages = messages.length > 0;

  // ── Auto-focus keyboard when screen mounts ──────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  // ── Pre-fill from home screen query param ───────────────────────────────
  useEffect(() => {
    if (params.query?.trim()) setInputText(params.query.trim());
  }, [params.query]);

  // ── Scroll to bottom on new message ─────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 120);
    }
  }, [messages, isTypingAI]);

  // ── Send a text message ──────────────────────────────────────────────────
  const sendMessage = useCallback((text: string, overrideResponse?: string) => {
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

    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      const aiMsg: Message = {
        id:        `ai-${Date.now()}`,
        text:      overrideResponse ?? getAIResponse(trimmed),
        from:      'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setTypingAI(false);
    }, delay);
  }, []);

  // ── Attach menu handlers ─────────────────────────────────────────────────
  const handleAttachSelect = useCallback(async (id: string) => {
    switch (id) {
      case 'camera': {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Camera Access', 'Please allow camera access in Settings to take a photo.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.8,
          allowsEditing: true,
        });
        if (!result.canceled) {
          sendMessage('📷 [Photo attached]', AI_RESPONSES.photo);
        }
        break;
      }

      case 'files': {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Photos Access', 'Please allow photo library access in Settings.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.8,
          allowsMultipleSelection: false,
        });
        if (!result.canceled) {
          sendMessage('🖼 [Image attached]', AI_RESPONSES.photo);
        }
        break;
      }

      case 'scan': {
        // Document scanning — use camera for now; swap for a document-scanner
        // library (e.g. expo-camera with document mode) in production.
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Camera Access', 'Please allow camera access to scan documents.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 1,
          allowsEditing: false,
        });
        if (!result.canceled) {
          sendMessage('📄 [Document scanned]', AI_RESPONSES.scan);
        }
        break;
      }

      case 'vitals':
        sendMessage('📊 [Sharing current vitals]', AI_RESPONSES.vitals_share);
        break;
    }
  }, [sendMessage]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>

        {/* Dynamic Island / status bar cover */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: insets.top,
            backgroundColor: '#FFFFFF',
            zIndex: 100,
          }}
        />

        {/* Header */}
        <View style={{ paddingTop: insets.top }}>
          <ChatHeader onBack={() => router.back()} />
        </View>

        {/* Body */}
        {!hasMessages ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}>
            <ChatGreeting name={chatUserName} />
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
                showAvatar={item.from === 'ai' && (index === 0 || messages[index - 1]?.from !== 'ai')}
              />
            )}
            ListFooterComponent={isTypingAI ? (
              <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
                <TypingIndicator />
              </View>
            ) : null}
          />
        )}

        {/* Input bar */}
        <View style={{ paddingBottom: insets.bottom }}>
          <ChatInput
            ref={inputRef}
            value={inputText}
            onChange={setInputText}
            onSend={() => sendMessage(inputText)}
            onAttach={() => setAttachOpen(true)}
            isTypingAI={isTypingAI}
            disabled={isTypingAI}
            autoFocus={false}   // handled by useEffect for better timing
          />
        </View>
      </KeyboardAvoidingView>

      {/* Attach bottom-sheet — rendered outside KAV so it overlays cleanly */}
      <AttachMenu
        visible={attachOpen}
        onClose={() => setAttachOpen(false)}
        onSelect={handleAttachSelect}
      />
    </>
  );
}
