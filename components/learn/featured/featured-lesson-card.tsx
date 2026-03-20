import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

import { FEATURED_LESSON } from '../learn-data';

export function FeaturedLessonCard() {
  return (
    <TouchableOpacity
      activeOpacity={0.96}
      style={{
        marginHorizontal: 20,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.07)',
      }}>

      {/* ── Dark media placeholder ────────────────────────────── */}
      <View
        style={{
          height: 224,
          backgroundColor: '#0D1117',
          alignItems: 'center',
          justifyContent: 'center',
        }}>

        {/* Background icon — large, very faint green tint */}
        <Ionicons
          name="leaf-outline"
          size={96}
          color="rgba(44,110,73,0.22)"
        />

        {/* Subtle grid-dot texture rows (no gradients) */}
        {[0.06, 0.04, 0.025].map((opacity, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: i * 72,
              height: 0.5,
              backgroundColor: `rgba(255,255,255,${opacity})`,
            }}
          />
        ))}

        {/* Featured badge — top left */}
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
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
            }}
          />
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color: '#FFFFFF',
              letterSpacing: 0.6,
            }}>
            {FEATURED_LESSON.tag.toUpperCase()}
          </Text>
        </View>

        {/* Play button — centered */}
        <View
          style={{
            position: 'absolute',
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.45)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="play" size={22} color="#FFFFFF" style={{ marginLeft: 3 }} />
        </View>

        {/* Duration badge — bottom right */}
        <View
          style={{
            position: 'absolute',
            bottom: 14,
            right: 14,
            backgroundColor: 'rgba(0,0,0,0.55)',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
          }}>
          <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600' }}>
            {FEATURED_LESSON.duration}
          </Text>
        </View>
      </View>

      {/* ── White content area ────────────────────────────────── */}
      <View style={{ padding: 18 }}>
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

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {/* Instructor + level */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Ionicons name="person-outline" size={13} color="#9CA3AF" />
              <Text
                style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}
                numberOfLines={1}>
                {FEATURED_LESSON.instructor}
              </Text>
            </View>

            <View
              style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#E5E7EB' }}
            />

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

          {/* Begin CTA */}
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
    </TouchableOpacity>
  );
}
