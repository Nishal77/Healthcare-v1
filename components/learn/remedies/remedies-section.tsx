import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

import { HOME_REMEDIES } from '../learn-data';
import { RemedyCard } from './remedy-card';

export function RemediesSection() {
  return (
    <View style={{ marginTop: 34, paddingHorizontal: 20 }}>
      {/* Section header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
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
            Home Remedies
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, fontWeight: '500' }}>
            Ayurveda-based natural healing
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

      {HOME_REMEDIES.map((remedy, index) => (
        <RemedyCard
          key={remedy.id}
          item={remedy}
          isLast={index === HOME_REMEDIES.length - 1}
        />
      ))}
    </View>
  );
}
