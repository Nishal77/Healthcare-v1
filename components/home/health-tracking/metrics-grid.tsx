import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

function StepsCard({ steps = 2316 }: { steps?: number }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 6,
      }}>
      {/* Icon + label row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Text style={{ fontSize: 20 }}>👣</Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#9CA3AF' }}>Steps</Text>
      </View>

      {/* Value */}
      <Text
        style={{
          fontSize: 34,
          fontWeight: '800',
          color: '#1C1C1E',
          lineHeight: 38,
          letterSpacing: -1,
        }}>
        {steps.toLocaleString()}
      </Text>

      {/* Sublabel */}
      <Text style={{ fontSize: 12, color: '#D1D5DB', fontWeight: '500', marginTop: 3 }}>
        Steps
      </Text>
    </View>
  );
}

function WaterCard({ liters = 1.8 }: { liters?: number }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 6,
      }}>
      {/* Icon + label row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Ionicons name="water" size={20} color="#8B5CF6" />
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#9CA3AF' }}>Water</Text>
      </View>

      {/* Value + unit */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        <Text
          style={{
            fontSize: 34,
            fontWeight: '800',
            color: '#1C1C1E',
            lineHeight: 38,
            letterSpacing: -1,
          }}>
          {liters}
        </Text>
        <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500', marginBottom: 4 }}>
          Liters
        </Text>
      </View>
    </View>
  );
}

interface MetricsGridProps {
  steps?: number;
  waterLiters?: number;
  // legacy props kept for compatibility
  spo2?: number;
  sleepHours?: number;
  calories?: number;
}

export function MetricsGrid({ steps = 2316, waterLiters = 1.8 }: MetricsGridProps) {
  return (
    <View style={{ flex: 1, gap: 12 }}>
      <StepsCard steps={steps} />
      <WaterCard liters={waterLiters} />
    </View>
  );
}
