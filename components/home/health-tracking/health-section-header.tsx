import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface HealthSectionHeaderProps {
  onSeeAll?: () => void;
}

export function HealthSectionHeader({ onSeeAll }: HealthSectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        paddingBottom: 4,
      }}>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#1C1C1E',
            letterSpacing: -0.4,
          }}>
          Your Vitals
        </Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, fontWeight: '500' }}>
          Updated 2 min ago
        </Text>
      </View>

      <TouchableOpacity
        onPress={onSeeAll}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: '#E9F0EC',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
        <Ionicons name="bar-chart-outline" size={13} color="#2C6E49" />
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#2C6E49' }}>Details</Text>
      </TouchableOpacity>
    </View>
  );
}
