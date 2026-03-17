import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface VitalitySectionProps {
  onSeeMore?: () => void;
}

export function VitalitySection({ onSeeMore }: VitalitySectionProps) {
  return (
    <View style={{ gap: 14 }}>
      {/* Section header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 10,
        }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', letterSpacing: -0.3 }}>
            Your Vitals
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>
            Updated 2 min ago
          </Text>
        </View>
        <TouchableOpacity
          onPress={onSeeMore}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#F0FDF4',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}>
          <Ionicons name="stats-chart-outline" size={13} color="#2C6E49" />
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#2C6E49' }}>Details</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
