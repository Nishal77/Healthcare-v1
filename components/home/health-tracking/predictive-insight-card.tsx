import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

interface InsightPoint {
  label: string;
  value: string;
  color: string;
}

interface PredictiveInsightCardProps {
  doshaType?: string;
  insight?: string;
  points?: InsightPoint[];
  onLearnMore?: () => void;
}

export function PredictiveInsightCard({
  doshaType = 'Vata-Pitta',
  insight = 'Your vitals suggest a Vata imbalance this week. Evening walks and warm sesame oil massage may restore balance.',
  points = [
    { label: 'Stress Risk', value: 'Moderate', color: '#F97316' },
    { label: 'Immunity', value: 'Good', color: '#22C55E' },
    { label: 'Sleep Quality', value: 'Fair', color: '#A855F7' },
  ],
  onLearnMore,
}: PredictiveInsightCardProps) {
  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#2C6E49',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      }}>

      {/* Gradient-like layered background */}
      <View
        style={{
          backgroundColor: '#1A3C2E',
          padding: 20,
        }}>

        {/* Decorative circles */}
        <View
          style={{
            position: 'absolute',
            top: -30,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(44,110,73,0.35)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -20,
            left: 40,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(74,222,128,0.08)',
          }}
        />

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: 'rgba(74,222,128,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="leaf-outline" size={18} color="#4ADE80" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: 0.8 }}>
              AI VAIDYA · PREDICTIVE ANALYSIS
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginTop: 1 }}>
              Prakriti: {doshaType}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(74,222,128,0.15)',
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'rgba(74,222,128,0.3)',
            }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#4ADE80' }}>TODAY</Text>
          </View>
        </View>

        {/* Insight text */}
        <Text
          style={{
            fontSize: 14,
            lineHeight: 21,
            color: 'rgba(255,255,255,0.78)',
            marginBottom: 16,
            fontStyle: 'italic',
          }}>
          &quot;{insight}&quot;
        </Text>

        {/* Insight points */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {points.map(({ label, value, color }) => (
            <View
              key={label}
              style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
              }}>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{label}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color }}>{value}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={onLearnMore}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: '#2C6E49',
            borderRadius: 14,
            paddingVertical: 12,
          }}>
          <Ionicons name="leaf-outline" size={16} color="#FFFFFF" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
            View Ayurvedic Recommendations
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
