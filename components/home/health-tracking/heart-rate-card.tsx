import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

function HeartRateGraph() {
  return (
    <Svg width="100%" height="72" viewBox="0 0 200 72" preserveAspectRatio="none">
      {/* Green wave — left portion rising to peak */}
      <Path
        d="M0,42 C12,30 22,54 40,42 C54,30 64,54 80,42 C90,34 98,48 112,36 C120,30 127,26 138,18"
        stroke="#22C55E"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Yellow glow halo around peak dot */}
      <Circle cx="138" cy="18" r="10" fill="rgba(251,191,36,0.22)" />
      {/* Yellow peak dot */}
      <Circle cx="138" cy="18" r="5.5" fill="#FBBF24" />
      {/* Purple/violet wave — right portion from peak */}
      <Path
        d="M138,18 C146,34 156,54 172,42 C186,30 194,54 200,44"
        stroke="#8B5CF6"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface HeartRateCardProps {
  bpm?: number;
  status?: 'normal' | 'elevated' | 'low';
}

export function HeartRateCard({ bpm = 123, status = 'normal' }: HeartRateCardProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 6,
      }}>
      {/* Header: icon + label */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FEE2E2',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="heart" size={20} color="#EF4444" />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.2 }}>
          Heart Rate
        </Text>
      </View>

      {/* SVG graph */}
      <View style={{ marginHorizontal: -4, marginBottom: 20 }}>
        <HeartRateGraph />
      </View>

      {/* BPM number */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5 }}>
        <Text
          style={{
            fontSize: 52,
            fontWeight: '800',
            color: '#1C1C1E',
            lineHeight: 56,
            letterSpacing: -2,
          }}>
          {bpm}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#9CA3AF',
            fontWeight: '500',
            marginBottom: 7,
          }}>
          Bpm
        </Text>
      </View>
    </View>
  );
}
