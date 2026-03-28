import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

const CARD_SHADOW = {
  shadowColor: '#0F1923',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 4,
} as const;

interface MetricProps {
  icon: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
}

function WatchMetricCard({ icon, iconColor, iconBg, label, value, unit, status, statusColor }: MetricProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 13,
        ...CARD_SHADOW,
      }}>
      {/* Icon */}
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <Ionicons name={icon} size={15} color={iconColor} />
      </View>

      {/* Number */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: 3 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F1923', lineHeight: 24, letterSpacing: -0.6 }}>
          {value}
        </Text>
        <Text style={{ fontSize: 9, color: '#9CA3AF', fontWeight: '600', marginBottom: 2, letterSpacing: 0.2 }}>
          {unit}
        </Text>
      </View>

      {/* Label */}
      <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '600', marginBottom: 8, letterSpacing: 0.1 }}>
        {label}
      </Text>

      {/* Status */}
      <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor, letterSpacing: 0.2 }}>
        {status}
      </Text>
    </View>
  );
}

export function WatchMetricsRow() {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <WatchMetricCard
        icon="water-outline"
        iconColor="#0B6E8B"
        iconBg="#EFF7FA"
        label="Blood O₂"
        value="98"
        unit="%"
        status="Optimal"
        statusColor="#0B6E8B"
      />
      <WatchMetricCard
        icon="pulse-outline"
        iconColor="#C4860A"
        iconBg="#FEF8EE"
        label="HRV"
        value="42"
        unit="ms"
        status="Moderate"
        statusColor="#C4860A"
      />
      <WatchMetricCard
        icon="thermometer-outline"
        iconColor="#B83A3A"
        iconBg="#FEF3F3"
        label="Body Temp"
        value="98.4"
        unit="°F"
        status="Normal"
        statusColor="#2C6E49"
      />
    </View>
  );
}
