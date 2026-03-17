import { Text, View } from 'react-native';

export default function PatientProfileScreen() {
  return (
    <View className="flex-1 bg-white px-6 py-8">
      <Text className="text-2xl font-bold text-blue-700 mb-4">Patient Profile</Text>
      {/* TODO: Display patient demographics, emergency contacts, insurance */}
      <Text className="text-gray-400">Profile information will appear here.</Text>
    </View>
  );
}
