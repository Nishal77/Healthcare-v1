import { Text, View } from 'react-native';

export function FeelingPrompt() {
  return (
    <View className="px-5 pt-5 pb-1 gap-1">
      <Text
        className="text-[32px] font-bold leading-tight tracking-tight"
        style={{ color: '#1A1A1A' }}>
        How are you{'\n'}feeling today?
      </Text>
      <Text className="text-sm font-medium mt-1" style={{ color: '#2C6E49' }}>
        Ayurveda · Predictive Health AI
      </Text>
    </View>
  );
}
