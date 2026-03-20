import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

import type { HomeRemedy } from '../learn-data';

// ─── Reuses the same premium matte icon tile from settings-menu ───────────────
function RemedyIconTile({ name }: { name: React.ComponentProps<typeof Ionicons>['name'] }) {
  return (
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#EFEFEF',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.09)',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
      {/* Top-edge white catch */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 5,
          right: 5,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      />
      {/* Soft center glow */}
      <View
        style={{
          position: 'absolute',
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,0.45)',
          top: 9,
          alignSelf: 'center',
        }}
      />
      <Ionicons name={name} size={22} color="#1C1C1E" />
    </View>
  );
}

interface RemedyCardProps {
  item: HomeRemedy;
  isLast?: boolean;
}

export function RemedyCard({ item, isLast }: RemedyCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        marginBottom: isLast ? 0 : 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.06)',
      }}>

      <RemedyIconTile name={item.iconName as any} />

      <View style={{ flex: 1 }}>
        {/* Symptom badge */}
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#F0FDF4',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 5,
            marginBottom: 5,
          }}>
          <Text
            style={{
              fontSize: 9,
              color: '#2C6E49',
              fontWeight: '700',
              letterSpacing: 0.4,
            }}>
            {item.symptom.toUpperCase()}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 15,
            fontWeight: '700',
            color: '#0D1117',
            letterSpacing: -0.2,
            marginBottom: 3,
          }}>
          {item.title}
        </Text>

        <Text
          style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 17 }}
          numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );
}
