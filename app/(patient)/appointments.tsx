import { Text, View } from 'react-native';

export default function AppointmentsScreen() {
  return (
    <View className="flex-1 bg-white px-6 py-8">
      <Text className="text-2xl font-bold text-blue-700 mb-4">Appointments</Text>
      {/* TODO: List upcoming and past appointments, allow booking/cancellation */}
      <Text className="text-gray-400">Your appointments will appear here.</Text>
    </View>
  );
}
