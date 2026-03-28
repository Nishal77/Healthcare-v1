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
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingTop: 4,
        paddingBottom: 2,
      }}>
      <View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '800',
            color: '#0F1923',
            letterSpacing: -0.6,
            lineHeight: 26,
          }}>
          Your Vitals
        </Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3, fontWeight: '500' }}>
          Updated 2 min ago
        </Text>
      </View>

      <TouchableOpacity
        onPress={onSeeAll}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: '#F0F7F3',
          paddingHorizontal: 13,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
        <Ionicons name="bar-chart-outline" size={13} color="#2C6E49" />
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#2C6E49' }}>Details</Text>
      </TouchableOpacity>
    </View>
  );
}
