import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function RegisterScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-blue-700 mb-2">Create Account</Text>
      <Text className="text-gray-500 mb-10 text-center">
        Join Vedarogya — your health, your data
      </Text>

      {/* TODO: Add registration form — name, email, password, role (patient/provider) */}

      <Link href="/(auth)/login">
        <Text className="text-blue-500 mt-4">Already have an account? Sign in</Text>
      </Link>
    </View>
  );
}
