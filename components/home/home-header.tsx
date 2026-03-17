import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning!';
  if (h < 17) return 'Good afternoon!';
  return 'Good evening!';
}

interface HomeHeaderProps {
  name?: string;
  hasNotification?: boolean;
  onNotificationPress?: () => void;
}

export function HomeHeader({
  name = 'Guest',
  hasNotification = true,
  onNotificationPress,
}: HomeHeaderProps) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
      {/* ── Avatar + greeting ──────────────────────────────── */}
      <View className="flex-row items-center gap-3">
        {/* Avatar circle with initials */}
        <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
          <Text className="text-white text-base font-bold">{initials}</Text>
        </View>

        <View>
          <Text className="text-gray-400 text-sm font-medium">{getGreeting()}</Text>
          <Text className="text-gray-900 text-base font-bold">{name}</Text>
        </View>
      </View>

      {/* ── Notification bell ─────────────────────────────── */}
      <TouchableOpacity
        onPress={onNotificationPress}
        className="w-11 h-11 rounded-full bg-white items-center justify-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}>
        <Ionicons name="notifications-outline" size={20} color="#1C1C1E" />
        {hasNotification && (
          <View className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500" />
        )}
      </TouchableOpacity>
    </View>
  );
}
