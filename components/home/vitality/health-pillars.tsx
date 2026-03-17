import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface PillarCardProps {
  title: string;
  subtitle: string;
  current: number;
  total: number;
  icon: string;
  bgColor: string;
  iconBgColor: string;
  accentColor: string;
  barColor: string;
  emoji: string;
  onPress?: () => void;
}

function PillarCard({
  title,
  subtitle,
  current,
  total,
  icon,
  bgColor,
  iconBgColor,
  accentColor,
  barColor,
  emoji,
  onPress,
}: PillarCardProps) {
  const progress = Math.min(current / total, 1);
  const pct = Math.round(progress * 100);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flex: 1,
        backgroundColor: bgColor,
        borderRadius: 20,
        padding: 16,
        shadowColor: accentColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
        minHeight: 148,
      }}>

      {/* Top row: icon + arrow */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: iconBgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name={icon} size={20} color={accentColor} />
        </View>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 10,
            backgroundColor: iconBgColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="arrow-up-forward" size={13} color={accentColor} />
        </View>
      </View>

      {/* Title */}
      <Text style={{ fontSize: 13, fontWeight: '600', color: accentColor, opacity: 0.75, marginBottom: 2 }}>
        {subtitle}
      </Text>
      <Text style={{ fontSize: 15, fontWeight: '800', color: accentColor, marginBottom: 10, letterSpacing: -0.3 }}>
        {title}
      </Text>

      {/* Circular-style progress ring (simplified arc using View) */}
      <View style={{ marginBottom: 10 }}>
        <View style={{ height: 5, backgroundColor: `${accentColor}22`, borderRadius: 3 }}>
          <View
            style={{
              width: `${pct}%`,
              height: 5,
              backgroundColor: barColor,
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      {/* Score */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: accentColor, letterSpacing: -0.5 }}>
          {current}
        </Text>
        <Text style={{ fontSize: 12, color: accentColor, opacity: 0.5, fontWeight: '500' }}>
          /{total}
        </Text>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 13, fontWeight: '700', color: barColor }}>{pct}%</Text>
      </View>
    </TouchableOpacity>
  );
}

interface HealthPillarsProps {
  physicalScore?: number;
  physicalTotal?: number;
  mentalScore?: number;
  mentalTotal?: number;
  onPhysicalPress?: () => void;
  onMentalPress?: () => void;
}

export function HealthPillars({
  physicalScore = 215,
  physicalTotal = 1499,
  mentalScore = 459,
  mentalTotal = 980,
  onPhysicalPress,
  onMentalPress,
}: HealthPillarsProps) {
  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 12 }}>
      <PillarCard
        title="Physical"
        subtitle="Health Score"
        current={physicalScore}
        total={physicalTotal}
        icon="body-outline"
        bgColor="#FFF7ED"
        iconBgColor="#FFEDD5"
        accentColor="#92400E"
        barColor="#F97316"
        emoji="💪"
        onPress={onPhysicalPress}
      />
      <PillarCard
        title="Mental"
        subtitle="Wellness Score"
        current={mentalScore}
        total={mentalTotal}
        icon="happy-outline"
        bgColor="#F0FDF4"
        iconBgColor="#DCFCE7"
        accentColor="#14532D"
        barColor="#22C55E"
        emoji="🧠"
        onPress={onMentalPress}
      />
    </View>
  );
}
