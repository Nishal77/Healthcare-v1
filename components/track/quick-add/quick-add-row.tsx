import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

import { ENTRY_TYPE_CONFIG, type EntryType } from '../track-data';

const QUICK_TYPES: EntryType[] = ['meal', 'water', 'mood', 'exercise', 'medicine', 'note'];

interface QuickAddRowProps {
  onAdd?: (type: EntryType) => void;
}

export function QuickAddRow({ onAdd }: QuickAddRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 20 }}>
      {QUICK_TYPES.map(type => {
        const config = ENTRY_TYPE_CONFIG[type];
        return (
          <TouchableOpacity
            key={type}
            onPress={() => onAdd?.(type)}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              paddingHorizontal: 14,
              paddingVertical: 9,
              backgroundColor: '#FFFFFF',
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.09)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}>
            <Ionicons name={config.iconName as any} size={14} color={config.color} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#1C1C1E' }}>
              + {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
