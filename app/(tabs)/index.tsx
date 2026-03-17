import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-white"
      style={{ paddingBottom: insets.bottom + 90 }}>
      <Text className="text-blue-500 text-3xl font-bold">Hello</Text>
    </View>
  );
}
