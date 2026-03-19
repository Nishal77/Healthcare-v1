import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileHeaderProps {
  name: string;
  email: string;
  phone: string;
  tier?: string;
  onEdit?: () => void;
}

export function ProfileHeader({
  name,
  email,
  phone,
  tier = 'Premium Member',
  onEdit,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();

  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 24 }}>
      {/* Top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>
          My Profile
        </Text>
        <TouchableOpacity
          onPress={onEdit}
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: '#F0FDF4',
            borderWidth: 1.5,
            borderColor: '#BBF7D0',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="pencil-outline" size={18} color="#2C6E49" />
        </TouchableOpacity>
      </View>

      {/* Avatar + info */}
      <View style={{ alignItems: 'center', gap: 10 }}>
        {/* Avatar ring */}
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            padding: 3,
            backgroundColor: '#FFFFFF',
            shadowColor: '#2C6E49',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 8,
          }}>
          <View
            style={{
              flex: 1,
              borderRadius: 999,
              backgroundColor: '#2C6E49',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 }}>
              {initials}
            </Text>
          </View>
        </View>

        {/* Name */}
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.3 }}>
          {name}
        </Text>

        {/* Email + Phone */}
        <Text style={{ fontSize: 13, color: '#6B7280' }}>
          {email} | {phone}
        </Text>

        {/* Tier badge */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#F0FDF4',
            borderWidth: 1,
            borderColor: '#BBF7D0',
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 20,
          }}>
          <Ionicons name="shield-checkmark" size={14} color="#2C6E49" />
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C6E49' }}>{tier}</Text>
        </View>
      </View>
    </View>
  );
}
