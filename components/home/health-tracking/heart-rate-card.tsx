import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

// Simulated 14-point BPM history — no SVG needed
const PULSE_BARS = [58, 64, 70, 68, 76, 72, 80, 95, 110, 123, 115, 108, 98, 90];
const MAX_BPM = Math.max(...PULSE_BARS);
const MIN_BPM = Math.min(...PULSE_BARS);
const CHART_HEIGHT = 52;

function PulseChart() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 3,
        height: CHART_HEIGHT,
      }}>
      {PULSE_BARS.map((val, i) => {
        const normalized = ((val - MIN_BPM) / (MAX_BPM - MIN_BPM)) * CHART_HEIGHT * 0.82 + CHART_HEIGHT * 0.12;
        const isPeak = val === MAX_BPM;
        // Left portion green, peak yellow, right portion purple
        const barColor = isPeak ? '#FBBF24' : i < 9 ? '#22C55E' : '#8B5CF6';
        const barOpacity = isPeak ? 1 : i < 9 ? 0.7 + (i / 9) * 0.3 : 1 - (i - 9) * 0.08;

        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: normalized,
              borderRadius: 4,
              backgroundColor: barColor,
              opacity: barOpacity,
            }}
          />
        );
      })}
    </View>
  );
}

interface HeartRateCardProps {
  bpm?: number;
  status?: 'normal' | 'elevated' | 'low';
  nadiType?: string;
}

export function HeartRateCard({
  bpm = 123,
  status = 'normal',
  nadiType = 'Vataja',
}: HeartRateCardProps) {
  const statusColor = status === 'elevated' ? '#F97316' : status === 'low' ? '#60A5FA' : '#22C55E';
  const statusLabel = status === 'elevated' ? 'Elevated' : status === 'low' ? 'Low' : 'Normal';

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

      {/* Header row: icon + label + live dot */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
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
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#1C1C1E', flex: 1, letterSpacing: -0.1 }}>
          Heart Rate
        </Text>
        {/* Live indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' }} />
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#22C55E', letterSpacing: 0.3 }}>LIVE</Text>
        </View>
      </View>

      {/* Bar chart — no SVG */}
      <View style={{ marginBottom: 14 }}>
        <PulseChart />
      </View>

      {/* BPM reading */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: '800',
            color: '#1C1C1E',
            lineHeight: 52,
            letterSpacing: -2,
          }}>
          {bpm}
        </Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF', fontWeight: '500', marginBottom: 6 }}>
          Bpm
        </Text>
      </View>

      {/* Ayurveda insight row */}
      <View
        style={{
          backgroundColor: '#F8F9FA',
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 8,
          gap: 6,
        }}>
        {/* Nadi Pariksha (pulse type) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '600', letterSpacing: 0.3 }}>
            NADI (PULSE)
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#6366F1' }}>{nadiType}</Text>
        </View>

        {/* Status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '600', letterSpacing: 0.3 }}>
            STATUS
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: statusColor }}>{statusLabel}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
