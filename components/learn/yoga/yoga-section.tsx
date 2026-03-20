import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { YOGA_LESSONS } from '../learn-data';
import { YogaCard } from './yoga-card';

export function YogaSection() {
  return (
    <View style={{ marginTop: 34 }}>
      {/* Section header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 16,
        }}>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#0D1117',
              letterSpacing: -0.3,
            }}>
            Yoga & Pranayama
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, fontWeight: '500' }}>
            {YOGA_LESSONS.length} classes · Updated weekly
          </Text>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#F3F4F6',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#1C1C1E' }}>See all</Text>
          <Ionicons name="chevron-forward" size={12} color="#1C1C1E" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={YOGA_LESSONS}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
        renderItem={({ item }) => <YogaCard item={item} />}
      />
    </View>
  );
}
