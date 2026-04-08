import { Text, View } from 'react-native';

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getQuestion(): string {
  const h = new Date().getHours();
  if (h < 12) return "It's a great day to check your health!\nHow can I help you today?";
  if (h < 17) return "How are you feeling this afternoon?\nWhat can I help you with?";
  return "Hope your day went well!\nHow can I assist your health journey?";
}

interface ChatGreetingProps {
  name?: string;
}

export function ChatGreeting({ name = 'there' }: ChatGreetingProps) {
  const firstName = name.split(' ')[0];
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 20 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#737373',
          marginBottom: 6,
          letterSpacing: 0.1,
        }}>
        {getTimeGreeting()}, {firstName}!
      </Text>
      <Text
        style={{
          fontSize: 28,
          fontWeight: '600',
          color: '#000000',
          lineHeight: 34,
          letterSpacing: -0.8,
        }}>
        {getQuestion()}
      </Text>
    </View>
  );
}
