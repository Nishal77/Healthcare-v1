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

  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isPremium = tier.toLowerCase().includes('premium') || tier.toLowerCase().includes('pro');

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 20,
        paddingBottom: 28,
        backgroundColor: '#FFFFFF',
      }}>

      {/* Top navigation row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>
            Profile
          </Text>
        </View>
        <TouchableOpacity
          onPress={onLogout}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280' }}>Logout</Text>
          <Ionicons name="log-out-outline" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Avatar + info centered */}
      <View style={{ alignItems: 'center', gap: 8 }}>
        {/* Avatar with premium ring */}
        <View
          style={{
            padding: isPremium ? 3 : 2,
            borderRadius: 999,
            backgroundColor: isPremium ? '#2C6E49' : '#E5E7EB',
            shadowColor: '#2C6E49',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isPremium ? 0.3 : 0.1,
            shadowRadius: 14,
            elevation: 8,
            marginBottom: 4,
          }}>
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: '#1A3C2E',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2.5,
              borderColor: '#FFFFFF',
            }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 }}>
              {initials}
            </Text>
          </View>
          {isPremium && (
            <View
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: '#F59E0B',
                borderWidth: 2,
                borderColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="star" size={11} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Handle */}
        <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }}>
          {handle}
        </Text>

        {/* Name */}
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.3, marginTop: -2 }}>
          {name}
        </Text>

        {/* Email */}
        <Text style={{ fontSize: 13, color: '#6B7280' }}>
          E-mail: <Text style={{ color: '#374151', fontWeight: '500' }}>{email}</Text>
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
            paddingHorizontal: 24,
            paddingVertical: 10,
            borderRadius: 22,
            shadowColor: '#2C6E49',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 6,
          }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
            Edit Profile
          </Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
