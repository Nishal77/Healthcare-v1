import { Text, View } from 'react-native';

function getWarmGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { line1: 'Good morning!', line2: 'How are you feeling today?' };
  if (h < 17) return { line1: 'Good afternoon!', line2: 'How are you doing today?' };
  return { line1: 'Good evening!', line2: 'How are you feeling right now?' };
}

export function FeelingPrompt() {
  const { line1, line2 } = getWarmGreeting();

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4 }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: '800',
          color: '#111827',
          lineHeight: 42,
          letterSpacing: -0.5,
        }}>
        {line1}{'\n'}{line2}
      </Text>
    </View>
  );
}
