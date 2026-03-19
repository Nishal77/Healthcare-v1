import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileHeaderProps {
  name: string;
  handle: string;
  email: string;
  tier?: string;
  onEdit?: () => void;
  onLogout?: () => void;
}

export function ProfileHeader({
  name,
  handle,
  email,
  tier = 'Free Plan',
  onEdit,
  onLogout,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const isPremium = tier.toLowerCase().includes('premium') || tier.toLowerCase().includes('pro');

  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 24, backgroundColor: '#FFFFFF' }}>

      {/* Top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>
          Profile
        </Text>
        <TouchableOpacity
          onPress={onLogout}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280' }}>Logout</Text>
          <Ionicons name="log-out-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Avatar + info */}
      <View style={{ alignItems: 'center', gap: 8 }}>
        {/* Avatar */}
        <View style={{ marginBottom: 4 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: '#1A3C2E',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: '#2C6E49',
            }}>
            <Text style={{ fontSize: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 }}>
              {initials}
            </Text>
          </View>
          {isPremium && (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: '#F59E0B',
                borderWidth: 2.5,
                borderColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Handle */}
        <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }}>{handle}</Text>

        {/* Name */}
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.4, marginTop: -2 }}>
          {name}
        </Text>

        {/* Email */}
        <Text style={{ fontSize: 13, color: '#6B7280' }}>
          E-mail: <Text style={{ color: '#374151', fontWeight: '600' }}>{email}</Text>
        </Text>

        {/* Edit profile button */}
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.85}
          style={{
            marginTop: 6,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#2C6E49',
            paddingHorizontal: 28,
            paddingVertical: 11,
            borderRadius: 24,
          }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.65)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
