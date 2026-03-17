import { Text, View } from 'react-native';

export function FeelingPrompt() {
  return (
    <View className="px-5 pt-6 pb-1">
      <Text className="text-gray-900 text-[32px] font-bold leading-tight tracking-tight">
        How are you{'\n'}feeling today?
      </Text>
    </View>
  );
}
