import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

interface WatchMetricProps {
  iconName: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  unit: string;
  tag: string;
  tagColor: string;
  tagBg: string;
}

function WatchMetricCard({
  iconName,
  iconColor,
  iconBg,
  label,
  value,
  unit,
  tag,
  tagColor,
  tagBg,
}: WatchMetricProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 13,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        gap: 8,
      }}>
      {/* Icon tile */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={iconName} size={17} color={iconColor} />
      </View>

      {/* Value row */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '800',
            color: '#1C1C1E',
            lineHeight: 26,
            letterSpacing: -0.8,
          }}>
          {value}
        </Text>
        <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '500', marginBottom: 2 }}>
          {unit}
        </Text>
      </View>

      {/* Label */}
      <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '600', marginTop: -4 }}>
        {label}
      </Text>

      {/* Status tag */}
      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: tagBg,
          borderRadius: 8,
          paddingHorizontal: 7,
          paddingVertical: 3,
        }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: tagColor }}>{tag}</Text>
      </View>
    </View>
  );
}

export function WatchMetricsRow() {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <WatchMetricCard
        iconName="water-outline"
        iconColor="#3B82F6"
        iconBg="#EFF6FF"
        label="Blood O₂"
        value="98"
        unit="%"
        tag="Optimal"
        tagColor="#1D4ED8"
        tagBg="#DBEAFE"
      />
      <WatchMetricCard
        iconName="pulse-outline"
        iconColor="#F59E0B"
        iconBg="#FFFBEB"
        label="HRV"
        value="42"
        unit="ms"
        tag="Moderate"
        tagColor="#B45309"
        tagBg="#FEF3C7"
      />
      <WatchMetricCard
        iconName="thermometer-outline"
        iconColor="#EF4444"
        iconBg="#FEF2F2"
        label="Body Temp"
        value="98.4"
        unit="°F"
        tag="Normal"
        tagColor="#15803D"
        tagBg="#DCFCE7"
      />
    </View>
  );
}
