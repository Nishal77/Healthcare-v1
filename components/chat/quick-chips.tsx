import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Chip {
  id: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

const CHIPS: Chip[] = [
  { id: '1', label: 'Check my heart rate',  icon: 'heart-outline'        },
  { id: '2', label: 'Sleep tips',            icon: 'moon-outline'         },
  { id: '3', label: 'Nutrition advice',      icon: 'leaf-outline'         },
  { id: '4', label: 'Stress relief',         icon: 'happy-outline'        },
  { id: '5', label: 'Meditation guide',      icon: 'body-outline'         },
  { id: '6', label: 'Hydration goal',        icon: 'water-outline'        },
];

interface QuickChipsProps {
  onSelect?: (label: string) => void;
}

export function QuickChips({ onSelect }: QuickChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 4 }}>
      {CHIPS.map(chip => (
        <TouchableOpacity
          key={chip.id}
          activeOpacity={0.75}
          onPress={() => onSelect?.(chip.label)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#F3F4F6',
            borderRadius: 22,
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderWidth: 1,
            borderColor: '#ECEAE6',
          }}>
          <Ionicons name={chip.icon} size={13} color="#4B5563" />
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', letterSpacing: 0.1 }}>
            {chip.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Spacer */}
      <View style={{ width: 4 }} />
    </ScrollView>
  );
}
