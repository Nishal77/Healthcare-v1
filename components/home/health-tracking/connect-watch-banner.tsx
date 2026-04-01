import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ConnectWatchBannerProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export function ConnectWatchBanner({ onConnect, isConnecting }: ConnectWatchBannerProps) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ECEAE6',
        gap: 16,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: '#F0F7F3',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="watch-outline" size={22} color="#2C6E49" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923', letterSpacing: -0.3 }}>
            Connect your watch
          </Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3, fontWeight: '500', lineHeight: 17 }}>
            Sync live biometrics via Google Health Connect for real-time Dosha insights
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#2C6E49', opacity: 0.6 }} />
          <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '500' }}>Heart Rate</Text>
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#0B6E8B', opacity: 0.6 }} />
          <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '500' }}>SpO₂</Text>
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#C4860A', opacity: 0.6 }} />
          <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '500' }}>HRV</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onConnect}
        disabled={isConnecting}
        activeOpacity={0.85}
        style={{
          backgroundColor: '#0F1923',
          borderRadius: 14,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
        }}>
        {isConnecting ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>
              Connecting...
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="bluetooth-outline" size={16} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>
              Sync via Health Connect
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
