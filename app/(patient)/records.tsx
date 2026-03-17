import { Text, View } from 'react-native';

export default function MedicalRecordsScreen() {
  return (
    <View className="flex-1 bg-white px-6 py-8">
      <Text className="text-2xl font-bold text-blue-700 mb-4">Medical Records</Text>
      {/* TODO: HIPAA-compliant display of diagnoses, medications, lab results */}
      <Text className="text-gray-400">Your medical records will appear here.</Text>
    </View>
  );
}
