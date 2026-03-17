import { Text, View } from 'react-native';

function getQuestion() {
  const h = new Date().getHours();
  if (h < 12) return 'How are you\nfeeling today?';
  if (h < 17) return 'How are you\ndoing today?';
  return 'How are you\nfeeling right now?';
}

export function FeelingPrompt() {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4 }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: '600',
          color: '#111827',
          lineHeight: 42,
          letterSpacing: -0.5,
        }}>
        {getQuestion()}
      </Text>
    </View>
  );
}
