import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';
import type { WatchConnectionState } from '../../../src/health/types';

interface HealthSectionHeaderProps {
  onSeeAll?: () => void;
  onDisconnect?: () => void;
  connectionState?: WatchConnectionState;
  lastUpdated?: Date | null;
}

function timeSince(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60)  return 'Just now';
  if (secs < 120) return '1 min ago';
  return `${Math.floor(secs / 60)} min ago`;
}

export function HealthSectionHeader({
  onSeeAll,
  onDisconnect,
  connectionState = 'disconnected',
  lastUpdated,
}: HealthSectionHeaderProps) {
  const isConnected = connectionState === 'connected';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingTop: 4,
        paddingBottom: 2,
      }}>
      <View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '800',
            color: '#0F1923',
            letterSpacing: -0.6,
            lineHeight: 26,
          }}>
          Your Vitals
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
          {isConnected && (
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#2C6E49' }} />
          )}
          <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>
            {isConnected && lastUpdated
              ? timeSince(lastUpdated)
              : 'No watch connected'}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {isConnected && (
          <TouchableOpacity
            onPress={onDisconnect}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: '#F5F5F5',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#ECEAE6',
            }}>
            <Ionicons name="power-outline" size={13} color="#9CA3AF" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onSeeAll}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: '#F0F7F3',
            paddingHorizontal: 13,
            paddingVertical: 8,
            borderRadius: 20,
          }}>
          <Ionicons name="bar-chart-outline" size={13} color="#2C6E49" />
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#2C6E49' }}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
