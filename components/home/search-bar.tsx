import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import {
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchBarProps {
  onMicPress?: () => void;
}

/**
 * Tapping anywhere on this bar navigates to the full AI chat screen.
 * It is intentionally non-editable on the home screen — the real
 * TextInput lives inside app/chat.tsx (auto-focused on open).
 */
export function SearchBar({ onMicPress }: SearchBarProps) {
  const router = useRouter();

  function openChat() {
    router.push('/chat');
  }

  return (
    <View
      className="mx-5 mt-5 mb-1"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 5,
      }}>

      {/* Entire bar is a tap target — opens chat screen */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={openChat}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          paddingHorizontal: 16,
          paddingVertical: Platform.OS === 'ios' ? 14 : 12,
          gap: 12,
          borderWidth: 1,
          borderColor: '#F0EFEC',
        }}>

        {/* Search / AI icon */}
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />

        {/* Fake placeholder — not a real TextInput */}
        <View style={{ flex: 1 }}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={0}
            color="transparent"
          />
          {/* Placeholder text rendered as View so the bar can't be typed in */}
          <View pointerEvents="none">
            <Ionicons name="sparkles-outline" size={0} color="transparent" />
          </View>
          {/* Actual placeholder via nested Text-like view */}
          <PlaceholderText />
        </View>

        {/* Divider */}
        <View style={{ width: 1, height: 20, backgroundColor: '#E5E7EB' }} />

        {/* Mic button */}
        <TouchableOpacity
          onPress={onMicPress ?? openChat}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="mic-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

// Separate component to keep the file clean
import { Text } from 'react-native';
function PlaceholderText() {
  return (
    <Text
      style={{ fontSize: 14, color: '#9CA3AF', fontWeight: '400' }}
      numberOfLines={1}>
      Describe symptoms or ask your AI...
    </Text>
  );
}
