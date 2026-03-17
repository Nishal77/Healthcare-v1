import { Text, View } from 'react-native';

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  trend?: string;
  trendUp?: boolean;
  bgColor: string;
  iconBgColor: string;
  valueColor: string;
  progress?: number; // 0–1
  progressColor?: string;
}

export function MetricCard({
  icon,
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
      {/* Icon */}
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
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>

      {/* Value + unit */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginBottom: 2 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: valueColor, lineHeight: 30, letterSpacing: -0.5 }}>
          {value}
        </Text>
        <Text style={{ fontSize: 12, color: valueColor, opacity: 0.6, marginBottom: 3, fontWeight: '500' }}>
          {unit}
        </Text>
      </View>

      {/* Label */}
      <Text style={{ fontSize: 12, color: valueColor, opacity: 0.55, fontWeight: '500', marginBottom: 8 }}>
        {label}
      </Text>

      {/* Progress bar */}
      {progress !== undefined && progressColor && (
        <View style={{ height: 4, backgroundColor: `${progressColor}30`, borderRadius: 2, marginBottom: 8 }}>
          <View
            style={{
              width: `${Math.min(progress * 100, 100)}%`,
              height: 4,
              backgroundColor: progressColor,
              borderRadius: 2,
            }}
          />
        </View>
      )}

      {/* Trend */}
      {trend && (
        <Text style={{ fontSize: 11, color: trendUp ? '#16A34A' : '#DC2626', fontWeight: '600' }}>
          {trendUp ? '▲' : '▼'} {trend}
        </Text>
      )}
    </View>
  );
}
