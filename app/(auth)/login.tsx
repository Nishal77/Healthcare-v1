import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-blue-700 mb-2">Vedarogya</Text>
      <Text className="text-gray-500 mb-10 text-center">
        Secure healthcare at your fingertips
      </Text>

      {/* TODO: Add login form — email, password, submit */}

      <Link href="/(auth)/register">
        <Text className="text-blue-500 mt-4">Don&apos;t have an account? Register</Text>
      </Link>
    </View>
  );
}
