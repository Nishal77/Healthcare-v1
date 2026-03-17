import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchBarProps {
  onSubmit?: (text: string) => void;
  onMicPress?: () => void;
}

export function SearchBar({ onSubmit, onMicPress }: SearchBarProps) {
  const [query, setQuery] = useState('');

  function handleSubmit() {
    if (query.trim()) onSubmit?.(query.trim());
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
      <View
        className="flex-row items-center bg-white rounded-2xl px-4 gap-3"
        style={{ paddingVertical: Platform.OS === 'ios' ? 14 : 10 }}>

        {/* Search / AI icon */}
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />

        {/* Editable AI input */}
        <TextInput
          className="flex-1 text-sm"
          style={{ color: '#1A1A1A', fontSize: 14 }}
          placeholder="Describe symptoms or ask your AI..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="send"
          multiline={false}
          autoCorrect
          autoCapitalize="sentences"
          blurOnSubmit
        />

        {/* Divider */}
        <View className="w-px h-5" style={{ backgroundColor: '#E5E7EB' }} />

        {/* Send (when typing) or Mic */}
        {query.trim().length > 0 ? (
          <TouchableOpacity onPress={handleSubmit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="send" size={18} color="#2C6E49" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onMicPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="mic-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
