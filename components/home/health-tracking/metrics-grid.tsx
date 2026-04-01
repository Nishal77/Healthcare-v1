import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

const CARD_SHADOW = {
  borderWidth: 1,
  borderColor: '#ECEAE6',
} as const;

function StepsCard({ steps = 0, hasData = false }: { steps?: number; hasData?: boolean }) {
  const goal = 8000;
  const pct  = Math.min(Math.round((steps / goal) * 100), 100);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, ...CARD_SHADOW }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 }}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            backgroundColor: '#F0F7F3',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="walk-outline" size={16} color="#2C6E49" />
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.2 }}>Steps</Text>
      </View>

      <Text style={{ fontSize: 30, fontWeight: '800', color: hasData ? '#0F1923' : '#D1D5DB', lineHeight: 34, letterSpacing: -1 }}>
        {hasData ? steps.toLocaleString() : '—'}
      </Text>

      <View style={{ marginTop: 10, gap: 4 }}>
        <View style={{ height: 3, backgroundColor: '#F0EFEC', borderRadius: 2 }}>
          <View
            style={{
              width: `${pct}%`,
              height: 3,
              backgroundColor: '#2C6E49',
              borderRadius: 2,
              opacity: 0.7,
            }}
          />
        </View>
        <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '500' }}>
          {pct}% of {(goal / 1000).toFixed(0)}k goal
        </Text>
      </View>
    </View>
  );
}

function WaterCard({ liters = 0, hasData = false }: { liters?: number; hasData?: boolean }) {
  const goal = 2.5;
  const pct  = Math.min(Math.round((liters / goal) * 100), 100);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, ...CARD_SHADOW }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 }}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            backgroundColor: '#EFF7FA',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="water-outline" size={16} color="#0B6E8B" />
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.2 }}>Water</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: hasData ? '#0F1923' : '#D1D5DB', lineHeight: 34, letterSpacing: -1 }}>
          {hasData ? liters : '—'}
        </Text>
        {hasData && <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginBottom: 3 }}>L</Text>}
      </View>

      <View style={{ marginTop: 10, gap: 4 }}>
        <View style={{ height: 3, backgroundColor: '#F0EFEC', borderRadius: 2 }}>
          <View
            style={{
              width: `${pct}%`,
              height: 3,
              backgroundColor: '#0B6E8B',
              borderRadius: 2,
              opacity: 0.7,
            }}
          />
        </View>
        <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '500' }}>
          {pct}% of {goal}L goal
        </Text>
      </View>
    </View>
  );
}

interface MetricsGridProps {
  steps?: number;
  waterLiters?: number;
  hasData?: boolean;
}

export function MetricsGrid({ steps = 0, waterLiters = 0, hasData = false }: MetricsGridProps) {
  return (
    <View style={{ flex: 1, gap: 12 }}>
      <StepsCard steps={hasData ? steps : 0} hasData={hasData} />
      <WaterCard liters={hasData ? waterLiters : 0} hasData={hasData} />
    </View>
  );
}
