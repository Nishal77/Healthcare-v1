import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

// Dot-grid texture rendered with pure Views — no SVG, no images
function DotTexture() {
  const COLS = 14;
  const ROWS = 4;
  const dots = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      dots.push(
        <View
          key={`${r}-${c}`}
          style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: 'rgba(255,255,255,0.07)',
            margin: 5,
          }}
        />
      );
    }
  }
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '55%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        alignContent: 'flex-start',
      }}
      pointerEvents="none">
      {dots}
    </View>
  );
}

interface UpgradeBannerProps {
  onUpgrade?: () => void;
}

export function UpgradeBanner({ onUpgrade }: UpgradeBannerProps) {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          borderRadius: 22,
          backgroundColor: '#0A0A0A',
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
        }}>

        {/* Dot-grid texture on the right half */}
        <DotTexture />

        {/* Gold top accent line */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 24,
            right: 24,
            height: 1.5,
            backgroundColor: 'rgba(245,158,11,0.45)',
            borderRadius: 1,
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 }}>

          {/* Flash icon — square tile */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: '#F59E0B',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#F59E0B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 6,
            }}>
            <Ionicons name="flash" size={22} color="#000000" />
          </View>

          {/* Text block */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>
                Become an
              </Text>
              <View
                style={{
                  backgroundColor: '#F59E0B',
                  paddingHorizontal: 9,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#000000'}}>
                  PRO
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              AI insights, unlimited tracking & Vaidya sessions
            </Text>
          </View>

          {/* Choose button */}
          <TouchableOpacity
            onPress={onUpgrade}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 18,
              paddingVertical: 11,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 4,
            }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#0A0A0A'}}>
              Choose
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
