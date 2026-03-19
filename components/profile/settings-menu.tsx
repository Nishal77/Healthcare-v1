import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'password',
    icon: 'lock-closed',
    iconBg: '#EFF6FF',
    iconColor: '#3B82F6',
    title: 'Change Password',
    subtitle: 'Update your account password',
  },
  {
    id: 'notifications',
    icon: 'notifications-outline',
    iconBg: '#FFF7ED',
    iconColor: '#F97316',
    title: 'Notifications',
    subtitle: 'Manage your alerts & reminders',
  },
  {
    id: 'health-data',
    icon: 'heart-outline',
    iconBg: '#FFF1F2',
    iconColor: '#F43F5E',
    title: 'Health Data',
    subtitle: 'Sync wearables & health records',
  },
  {
    id: 'privacy',
    icon: 'shield-outline',
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
    title: 'Privacy & Security',
    subtitle: 'Manage data sharing & access',
  },
  {
    id: 'refer',
    icon: 'people-outline',
    iconBg: '#FFF7ED',
    iconColor: '#D97706',
    title: 'Refer & Earn',
    subtitle: 'Invite friends, earn wellness points',
  },
];

export function SettingsMenu() {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: '#9CA3AF',
          letterSpacing: 0.8,
          marginBottom: 12,
        }}>
        SETTINGS
      </Text>

      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#F3F4F6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 2,
        }}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={item.onPress}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
              borderBottomColor: '#F9FAFB',
            }}>
            {/* Icon */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: item.iconBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}>
              <Ionicons name={item.icon} size={20} color={item.iconColor} />
            </View>

            {/* Text */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{item.subtitle}</Text>
            </View>

            {/* Chevron */}
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
