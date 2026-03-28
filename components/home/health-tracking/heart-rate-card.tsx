import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

// 14-point BPM history — rising to peak then settling
const PULSE_BARS = [58, 63, 68, 72, 70, 76, 80, 88, 99, 123, 112, 104, 96, 88];
const MAX_BPM = Math.max(...PULSE_BARS);
const MIN_BPM = Math.min(...PULSE_BARS);
const CHART_H = 48;

function PulseChart() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3.5, height: CHART_H }}>
      {PULSE_BARS.map((val, i) => {
        const norm = ((val - MIN_BPM) / (MAX_BPM - MIN_BPM)) * CHART_H * 0.78 + CHART_H * 0.14;
        const isPeak = val === MAX_BPM;
        // Brand palette: green rising bars → gold peak → muted green falling
        const color = isPeak ? '#C4860A' : '#2C6E49';
        const opacity = isPeak ? 1 : i < 9 ? 0.35 + (i / 9) * 0.55 : 0.9 - (i - 9) * 0.12;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: norm,
              borderRadius: 3,
              backgroundColor: color,
              opacity,
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
  const statusColor = status === 'elevated' ? '#C4860A' : status === 'low' ? '#0B6E8B' : '#2C6E49';
  const statusLabel = status === 'elevated' ? 'Elevated' : status === 'low' ? 'Low' : 'Normal';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ECEAE6',
      }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: '#FEF2F2',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 9,
          }}>
          <Ionicons name="heart" size={17} color="#B83A3A" />
        </View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F1923', flex: 1, letterSpacing: -0.1 }}>
          Heart Rate
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#2C6E49' }} />
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#2C6E49', letterSpacing: 0.6 }}>
            LIVE
          </Text>
        </View>
      </View>

      {/* Bar chart */}
      <View style={{ marginBottom: 12 }}>
        <PulseChart />
      </View>

      {/* BPM */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 14 }}>
        <Text style={{ fontSize: 46, fontWeight: '800', color: '#0F1923', lineHeight: 50, letterSpacing: -2 }}>
          {bpm}
        </Text>
        <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500', marginBottom: 6 }}>
          bpm
        </Text>
      </View>

      {/* Ayurvedic data — no box background, just clean rows */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#F0EFEC', paddingTop: 10, gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 10, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.5 }}>
            NADI
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#4B5563' }}>{nadiType}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.5 }}>
            STATUS
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: statusColor }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: statusColor }}>{statusLabel}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
