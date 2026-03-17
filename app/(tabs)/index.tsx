import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={{ height: 178, width: 290, bottom: 0, left: 0, position: 'absolute' }}
        />
      }>
      {/* NativeWind hello text */}
      <View className="items-center py-4">
        <Text className="text-blue-500 text-2xl font-bold">Hello</Text>
      </View>

      <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={{ gap: 8, marginBottom: 8 }}>
        <ThemedText type="subtitle">Vedarogya</ThemedText>
        <ThemedText>
          Your personal healthcare companion. Track appointments, access medical records, and
          connect with your care team — securely and privately.
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ gap: 8, marginBottom: 8 }}>
        <ThemedText type="subtitle">Get Started</ThemedText>
        <ThemedText>
          Navigate the tabs below to explore your health dashboard, upcoming appointments, and
          medical history.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
