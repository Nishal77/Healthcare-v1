import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { FEATURED_LESSON } from '../learn-data';

export function FeaturedLessonCard() {
  return (
    // ── Shadow lives on outer wrapper so overflow:hidden doesn't clip it ──
    <TouchableOpacity
      activeOpacity={0.96}
      style={{
        marginHorizontal: 20,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
        elevation: 10,
      }}>

      {/* Inner clip layer — holds border + rounds the image corners */}
      <View
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
        }}>

        {/* ── Media area ──────────────────────────────────────── */}
        <View style={{ height: 224 }}>
          {/* Sample image */}
          <Image
            source={require('@/assets/images/avatar-sample.jpg')}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {/* Solid dark overlay — no gradient */}
          <View
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.52)',
            }}
          />

          {/* Featured badge */}
          <View
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#2C6E49',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 999,
            }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF' }} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.6 }}>
              {FEATURED_LESSON.tag.toUpperCase()}
            </Text>
          </View>

          {/* Play button */}
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              top: '50%',
              marginTop: -28,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.55)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="play" size={22} color="#FFFFFF" style={{ marginLeft: 3 }} />
          </View>

          {/* Duration badge */}
          <View
            style={{
              position: 'absolute',
              bottom: 14,
              right: 14,
              backgroundColor: 'rgba(0,0,0,0.6)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
            <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600' }}>
              {FEATURED_LESSON.duration}
            </Text>
          </View>
        </View>

        {/* ── White content area ───────────────────────────────── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 18,
            borderTopWidth: 0.5,
            borderTopColor: 'rgba(0,0,0,0.07)',
          }}>
          {/* Inner top highlight — premium surface feel */}
          <View
            style={{
              position: 'absolute',
              top: 0, left: 20, right: 20,
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          />

          <Text
            style={{
              fontSize: 19,
              fontWeight: '700',
              color: '#0D1117',
              letterSpacing: -0.4,
              lineHeight: 25,
              marginBottom: 6,
            }}>
            {FEATURED_LESSON.title}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: '#6B7280',
              lineHeight: 19,
              marginBottom: 16,
            }}>
            {FEATURED_LESSON.description}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Ionicons name="person-outline" size={13} color="#9CA3AF" />
                <Text
                  style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}
                  numberOfLines={1}>
                  {FEATURED_LESSON.instructor}
                </Text>
              </View>

              <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#E5E7EB' }} />

              <View
                style={{
                  backgroundColor: '#F0FDF4',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}>
                <Text style={{ fontSize: 11, color: '#2C6E49', fontWeight: '600' }}>
                  {FEATURED_LESSON.level}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: '#0D1117',
                paddingHorizontal: 16,
                paddingVertical: 9,
                borderRadius: 999,
              }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFFFFF' }}>Begin</Text>
              <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
