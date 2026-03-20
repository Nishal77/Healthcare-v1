import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import type { YogaLesson } from '../learn-data';

const LEVEL_COLORS: Record<string, string> = {
  Beginner: '#2C6E49',
  Intermediate: '#D97706',
  Advanced: '#DC2626',
};

interface YogaCardProps {
  item: YogaLesson;
}

export function YogaCard({ item }: YogaCardProps) {
  return (
    // ── Shadow wrapper — must be separate from overflow:hidden ──
    <TouchableOpacity
      activeOpacity={0.94}
      style={{
        width: 168,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.09,
        shadowRadius: 12,
        elevation: 5,
      }}>

      {/* Inner clip layer */}
      <View
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
        }}>

        {/* ── Media area ──────────────────────────────────── */}
        <View style={{ height: 140 }}>
          {/* Sample image */}
          <Image
            source={require('@/assets/images/avatar-sample.jpg')}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {/* Dark overlay */}
          <View
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.56)',
            }}
          />

          {/* Category badge */}
          <View
            style={{
              position: 'absolute',
              top: 11,
              left: 11,
              backgroundColor: 'rgba(0,0,0,0.45)',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
              borderWidth: 0.5,
              borderColor: 'rgba(255,255,255,0.25)',
            }}>
            <Text
              style={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.9)',
                fontWeight: '700',
                letterSpacing: 0.3,
              }}>
              {item.category.toUpperCase()}
            </Text>
          </View>

          {/* Play button — centered */}
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              top: '50%',
              marginTop: -20,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="play" size={16} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </View>

          {/* Duration */}
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'rgba(0,0,0,0.6)',
              paddingHorizontal: 7,
              paddingVertical: 3,
              borderRadius: 6,
            }}>
            <Text style={{ fontSize: 10, color: '#FFFFFF', fontWeight: '600' }}>
              {item.duration}
            </Text>
          </View>
        </View>

        {/* ── White content ────────────────────────────────── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 13,
            borderTopWidth: 0.5,
            borderTopColor: 'rgba(0,0,0,0.06)',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#0D1117',
              letterSpacing: -0.2,
              marginBottom: 3,
            }}
            numberOfLines={1}>
            {item.title}
          </Text>

          <Text
            style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginBottom: 10 }}
            numberOfLines={1}>
            {item.instructor}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View
              style={{
                backgroundColor: '#F3F4F6',
                paddingHorizontal: 7,
                paddingVertical: 3,
                borderRadius: 6,
              }}>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: LEVEL_COLORS[item.level] ?? '#6B7280',
                }}>
                {item.level}
              </Text>
            </View>

            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="bookmark-outline" size={13} color="#6B7280" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
