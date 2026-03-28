import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface GoalsBannerProps {
  goalsCompleted?: number;
  onLearnMore?: () => void;
}

export function PredictiveInsightCard({ goalsCompleted = 2, onLearnMore }: GoalsBannerProps) {
  return (
    <TouchableOpacity
      onPress={onLearnMore}
      activeOpacity={0.92}
      style={{
        backgroundColor: '#F8F7F4',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
      }}>
      {/* Trophy circle */}
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#0F1923',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.07,
          shadowRadius: 6,
          elevation: 3,
        }}>
        <Ionicons name="trophy-outline" size={20} color="#C4860A" />
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1923', letterSpacing: -0.2 }}>
          {goalsCompleted} goals completed today
        </Text>
        <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, fontWeight: '500' }}>
          Keep going — view your progress
        </Text>
      </View>

      {/* Chevron */}
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: '#0F1923',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
}
