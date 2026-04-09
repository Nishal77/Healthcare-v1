import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { AuthProvider } from '@/hooks/useAuth';

export const unstable_settings = {
  // Fallback to splash when navigating directly to a deep link
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Splash */}
        <Stack.Screen name="index"       options={{ animation: 'none' }} />
        {/* Onboarding carousel */}
        <Stack.Screen name="onboarding"  options={{ animation: 'fade' }} />
        {/* Auth stack (login, register, forgot-password) */}
        <Stack.Screen name="(auth)"      options={{ animation: 'slide_from_right' }} />
        {/* Main app */}
        <Stack.Screen name="(tabs)"      />
        {/* Chat overlay */}
        <Stack.Screen name="chat"        options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="modal"       options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
