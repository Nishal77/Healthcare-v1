import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

interface MetricCardProps {
  iconName: string;
  iconColor: string;
  label: string;
  value: string;
  unit: string;
  trend?: string;
  trendUp?: boolean;
  bgColor: string;
  iconBgColor: string;
  valueColor: string;
  progress?: number;
  progressColor?: string;
}

export function MetricCard({
  iconName,
  iconColor,
  label,
  value,
  unit,
  trend,
  trendUp,
  bgColor,
  iconBgColor,
  valueColor,
  progress,
  progressColor,
}: MetricCardProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: bgColor,
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}>
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: iconBgColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}>
        <Ionicons name={iconName as any} size={20} color={iconColor} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginBottom: 2 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: valueColor, lineHeight: 30, letterSpacing: -0.5 }}>
          {value}
        </Text>
        <Text style={{ fontSize: 12, color: valueColor, opacity: 0.6, marginBottom: 3, fontWeight: '500' }}>
          {unit}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: valueColor, opacity: 0.55, fontWeight: '500', marginBottom: 8 }}>
        {label}
      </Text>
      {progress !== undefined && progressColor && (
        <View style={{ height: 4, backgroundColor: progressColor + '30', borderRadius: 2, marginBottom: 8 }}>
          <View
            style={{
              width: (Math.min(progress * 100, 100)).toString() + '%',
              height: 4,
              backgroundColor: progressColor,
              borderRadius: 2,
            }}
          />
        </View>
      )}
      {trend && (
        <Text style={{ fontSize: 11, color: trendUp ? '#16A34A' : '#DC2626', fontWeight: '600' }}>
          {trendUp ? '\u25B2' : '\u25BC'} {trend}
        </Text>
      )}
    </View>
  );
}
