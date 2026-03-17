import { Text, View } from 'react-native';

export function FeelingPrompt() {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4, gap: 6 }}>
      {/* Conversational warm opener */}
      <Text
        style={{
          fontSize: 13,
          fontWeight: '500',
          color: '#2C6E49',
          letterSpacing: 0.3,
          textTransform: 'uppercase',
        }}>
        Your AI Vaidya is listening
      </Text>

      {/* Main conversational heading */}
      <Text
        style={{
          fontSize: 30,
          fontWeight: '800',
          color: '#111827',
          lineHeight: 38,
          letterSpacing: -0.5,
        }}>
        What's your body{'\n'}telling you today?
      </Text>

      {/* Supporting line */}
      <Text
        style={{
          fontSize: 14,
          color: '#6B7280',
          lineHeight: 20,
          marginTop: 2,
        }}>
        Share a symptom, mood, or question —{'\n'}I'll guide you with ancient wisdom &amp; AI.
      </Text>
    </View>
  );
}
