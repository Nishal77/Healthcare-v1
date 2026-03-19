import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface AccountInfoCardProps {
  patientName: string;
  patientId: string;
  appointments: number;
  healthScore: number;
  onCopy?: () => void;
}

export function AccountInfoCard({
  patientName,
  patientId,
  appointments,
  healthScore,
  onCopy,
}: AccountInfoCardProps) {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 18,
          borderWidth: 1,
          borderColor: '#F3F4F6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 3,
        }}>
        {/* Name + ID row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>
              {patientName}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
              Patient ID: {patientId}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onCopy}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="copy-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: '#F9FAFB', marginBottom: 14 }} />

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#F0FDF4',
              borderRadius: 14,
              padding: 14,
            }}>
            <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Appointments</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#2C6E49' }}>
              {appointments}
            </Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Total visits</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#EFF6FF',
              borderRadius: 14,
              padding: 14,
            }}>
            <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Health Score</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#1D4ED8' }}>
              {healthScore}
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#93C5FD' }}>/100</Text>
            </Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Very good</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
