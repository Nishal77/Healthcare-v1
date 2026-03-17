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
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
      }}>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#111827',
            letterSpacing: -0.3,
          }}>
          Health Dashboard
        </Text>
        <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
          Live · Synced just now
        </Text>
      </View>

      <TouchableOpacity
        onPress={onSeeAll}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: '#F0FDF4',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        }}>
        <Ionicons name="pulse-outline" size={14} color="#2C6E49" />
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#2C6E49' }}>See all</Text>
      </TouchableOpacity>
    </View>
  );
}
