import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

const CARD_SHADOW = {
  borderWidth: 1,
  borderColor: '#ECEAE6',
} as const;

interface MetricProps {
  icon: ComponentProps<typeof Ionicons>['name'];
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

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: 3 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F1923', lineHeight: 24, letterSpacing: -0.6 }}>
          {value}
        </Text>
        <Text style={{ fontSize: 9, color: '#9CA3AF', fontWeight: '600', marginBottom: 2, letterSpacing: 0.2 }}>
          {unit}
        </Text>
      </View>

      <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '600', marginBottom: 8, letterSpacing: 0.1 }}>
        {label}
      </Text>

      <Text style={{ fontSize: 10, fontWeight: '700', color: statusColor, letterSpacing: 0.2 }}>
        {status}
      </Text>
    </View>
  );
}

interface WatchMetricsRowProps {
  spo2?: number;
  hrv?: number;
  bodyTemp?: number;
}

export function WatchMetricsRow({ spo2 = 98, hrv = 42, bodyTemp = 98.4 }: WatchMetricsRowProps) {
  const spo2Status      = spo2 >= 98 ? 'Optimal' : spo2 >= 95 ? 'Normal' : 'Low';
  const spo2Color       = spo2 >= 98 ? '#0B6E8B' : spo2 >= 95 ? '#2C6E49' : '#C4860A';
  const hrvStatus       = hrv >= 50 ? 'Good' : hrv >= 30 ? 'Moderate' : 'Low';
  const hrvColor        = hrv >= 50 ? '#2C6E49' : '#C4860A';
  const tempStatus      = bodyTemp < 99 ? 'Normal' : 'Elevated';
  const tempStatusColor = bodyTemp < 99 ? '#2C6E49' : '#C4860A';

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <WatchMetricCard
        icon="water-outline"
        iconColor="#0B6E8B"
        iconBg="#EFF7FA"
        label="Blood O₂"
        value={String(spo2)}
        unit="%"
        status={spo2Status}
        statusColor={spo2Color}
      />
      <WatchMetricCard
        icon="pulse-outline"
        iconColor="#C4860A"
        iconBg="#FEF8EE"
        label="HRV"
        value={String(hrv)}
        unit="ms"
        status={hrvStatus}
        statusColor={hrvColor}
      />
      <WatchMetricCard
        icon="thermometer-outline"
        iconColor="#B83A3A"
        iconBg="#FEF3F3"
        label="Body Temp"
        value={String(bodyTemp)}
        unit="°F"
        status={tempStatus}
        statusColor={tempStatusColor}
      />
    </View>
  );
}
