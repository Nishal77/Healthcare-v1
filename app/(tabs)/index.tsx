import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroSection } from '@/components/home/hero-section';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}>

      {/* ── Hero: greeting + search ─────────────────────── */}
      <HeroSection userName="Sajibur Rahman" />

      {/* ── Body placeholder ─────────────────────────────── */}
      <View className="px-5 pt-6">
        <Text className="text-blue-500 text-3xl font-bold">Hello</Text>
      </View>
    </ScrollView>
  );
}
