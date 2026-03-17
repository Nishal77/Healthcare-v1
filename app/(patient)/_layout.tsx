import { Stack } from 'expo-router';

export default function PatientLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ title: 'My Profile' }} />
      <Stack.Screen name="records" options={{ title: 'Medical Records' }} />
      <Stack.Screen name="appointments" options={{ title: 'Appointments' }} />
    </Stack>
  );
}
