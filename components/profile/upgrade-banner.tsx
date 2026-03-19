import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface UpgradeBannerProps {
  onUpgrade?: () => void;
}

export function UpgradeBanner({ onUpgrade }: UpgradeBannerProps) {
  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
      <View
        style={{
          borderRadius: 20,
          backgroundColor: '#1A3C2E',
          overflow: 'hidden',
          shadowColor: '#2C6E49',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 8,
        }}>

        {/* Decorative circles */}
        <View style={{ position: 'absolute', top: -30, right: -20, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(44,110,73,0.4)' }} />
        <View style={{ position: 'absolute', bottom: -20, left: 20, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(74,222,128,0.07)' }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 }}>
          {/* Left: icon + text */}
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: 'rgba(245,158,11,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="flash" size={22} color="#F59E0B" />
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF' }}>
                Become an
              </Text>
              <View
                style={{
                  backgroundColor: '#F59E0B',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.8 }}>
                  PRO
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 17 }}>
              AI insights, unlimited tracking & Vaidya sessions
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            onPress={onUpgrade}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 12,
            }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#1A3C2E' }}>
              Choose
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
