import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 28, backgroundColor: '#FFFFFF' }}>

      {/* Top bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: '#111827', letterSpacing: -0.4 }}>
          Profile
        </Text>
        <TouchableOpacity
          onPress={onLogout}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: '#FFF1F2',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Avatar + info */}
      <View style={{ alignItems: 'center', gap: 10 }}>

        {/* Photo avatar */}
        <View style={{ marginBottom: 4 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.18,
              shadowRadius: 14,
              elevation: 10,
              backgroundColor: '#F3F4F6',
            }}>
            <Image
              source={require('@/assets/images/avatar-sample.jpg')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Handle */}
        <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }}>{handle}</Text>

        {/* Name */}
        <Text style={{ fontSize: 22, fontWeight: '600', color: '#111827', marginTop: -4 }}>
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
            backgroundColor: '#111827',
            paddingHorizontal: 28,
            paddingVertical: 12,
            borderRadius: 24,
          }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
