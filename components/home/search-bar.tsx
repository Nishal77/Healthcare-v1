import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
  onMicPress?: () => void;
}

export function SearchBar({
  placeholder = 'Search a doctor, medicins, etc...',
  onPress,
  onMicPress,
}: SearchBarProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="mx-5 mt-5 mb-1"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
      }}>
      <View className="flex-row items-center bg-white rounded-2xl px-4 py-3.5 gap-3">
        {/* Search icon */}
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />

        {/* Input */}
        <TextInput
          className="flex-1 text-sm text-gray-700"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={false}
          pointerEvents="none"
        />

        {/* Divider */}
        <View className="w-px h-5 bg-gray-200" />

        {/* Mic button */}
        <TouchableOpacity
          onPress={onMicPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="mic-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
