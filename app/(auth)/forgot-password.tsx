import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-blue-700 mb-2">Reset Password</Text>
      <Text className="text-gray-500 mb-10 text-center">
        We&apos;ll send a secure reset link to your registered email address.
      </Text>

      {/* TODO: Add email input + send reset link button */}

      <Link href="/(auth)/login">
        <Text className="text-blue-500 mt-4">Back to Sign In</Text>
      </Link>
    </View>
  );
}
