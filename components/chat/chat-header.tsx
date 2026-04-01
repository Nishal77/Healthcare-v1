import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface ChatHeaderProps {
  onBack?: () => void;
  onMenu?: () => void;
}

export function ChatHeader({ onBack, onMenu }: ChatHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}>

      {/* Logo */}
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: '#2C6E49',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Title */}
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F1923', letterSpacing: -0.3 }}>
          AI Health Assistant
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2C6E49' }} />
          <Text style={{ fontSize: 11, fontWeight: '500', color: '#2C6E49' }}>Online</Text>
        </View>
      </View>

      {/* Menu */}
      <TouchableOpacity
        onPress={onMenu}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          backgroundColor: '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="menu-outline" size={22} color="#0F1923" />
      </TouchableOpacity>
    </View>
  );
}
