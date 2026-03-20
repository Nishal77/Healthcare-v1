import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface LearnHeaderProps {
  hasNotification?: boolean;
  onNotificationPress?: () => void;
}

export function LearnHeader({
  hasNotification = true,
  onNotificationPress,
}: LearnHeaderProps) {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '800',
              color: '#0D1117',
              letterSpacing: -0.6,
              lineHeight: 34,
            }}>
            Learn
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#9CA3AF',
              fontWeight: '500',
              marginTop: 4,
              letterSpacing: 0.1,
            }}>
            Ayurveda · Yoga · Wellness
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNotificationPress}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}>
          <Ionicons name="notifications-outline" size={20} color="#1C1C1E" />
          {hasNotification && (
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: '#E53E3E',
                borderWidth: 1.5,
                borderColor: '#FFFFFF',
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
