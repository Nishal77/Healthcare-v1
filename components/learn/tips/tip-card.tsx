import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

import type { AyurvedaTip } from '../learn-data';

interface TipCardProps {
  item: AyurvedaTip;
}

export function TipCard({ item }: TipCardProps) {
  return (
    // Shadow wrapper
    <TouchableOpacity
      activeOpacity={0.92}
      style={{
        width: 192,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
      }}>

      {/* Inner: border + overflow clip */}
      <View
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.09)',
          padding: 16,
        }}>

        {/* Inner top-edge highlight — premium surface */}
        <View
          style={{
            position: 'absolute',
            top: 0, left: 14, right: 14,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.9)',
          }}
        />

        {/* Icon tile — matte texture */}
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: '#EFEFEF',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.09)',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 13,
          }}>
          {/* Top-edge catch light */}
          <View
            style={{
              position: 'absolute',
              top: 0, left: 4, right: 4,
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.95)',
            }}
          />
          {/* Center glow */}
          <View
            style={{
              position: 'absolute',
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.45)',
              top: 9, alignSelf: 'center',
            }}
          />
          <Ionicons name={item.iconName as any} size={20} color="#1C1C1E" />
        </View>

        {/* Category badge */}
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#F0FDF4',
            paddingHorizontal: 7,
            paddingVertical: 2,
            borderRadius: 5,
            marginBottom: 8,
          }}>
          <Text style={{ fontSize: 9, color: '#2C6E49', fontWeight: '700', letterSpacing: 0.4 }}>
            {item.category.toUpperCase()}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: '#0D1117',
            letterSpacing: -0.2,
            marginBottom: 7,
            lineHeight: 19,
          }}
          numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 17 }} numberOfLines={3}>
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
