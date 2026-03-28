import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface GoalsBannerProps {
  goalsCompleted?: number;
  onLearnMore?: () => void;
}

export function PredictiveInsightCard({ goalsCompleted = 2, onLearnMore }: GoalsBannerProps) {
  return (
    <View
      style={{
        backgroundColor: '#F4F4F4',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}>
      {/* Crown icon in white circle */}
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}>
        <Ionicons name="trophy" size={22} color="#22C55E" />
      </View>

      {/* Text block */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.2 }}>
          Completed {goalsCompleted} goals
        </Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, fontWeight: '500' }}>
          Keep upgrading to get benefits
        </Text>
      </View>

      {/* Detail button */}
      <TouchableOpacity
        onPress={onLearnMore}
        activeOpacity={0.8}
        style={{
          backgroundColor: '#1C1C1E',
          borderRadius: 22,
          paddingHorizontal: 18,
          paddingVertical: 10,
        }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>Detail</Text>
      </TouchableOpacity>
    </View>
  );
}
