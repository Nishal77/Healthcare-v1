import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

interface DoshaBarProps {
  label: string;
  sublabel: string;
  percentage: number;
  color: string;
  bgColor: string;
  isDominant?: boolean;
}

function DoshaBar({ label, sublabel, percentage, color, bgColor, isDominant }: DoshaBarProps) {
  return (
    <View style={{ gap: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#1C1C1E' }}>{label}</Text>
          <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>{sublabel}</Text>
          {isDominant && (
            <View
              style={{
                backgroundColor: color + '20',
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}>
              <Text style={{ fontSize: 9, fontWeight: '800', color, letterSpacing: 0.4 }}>
                DOMINANT
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 13, fontWeight: '800', color }}>{percentage}%</Text>
      </View>

      {/* Track */}
      <View
        style={{
          height: 7,
          backgroundColor: '#F3F4F6',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
        <View
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}

interface DoshaBalanceCardProps {
  vata?: number;
  pitta?: number;
  kapha?: number;
  insight?: string;
}

export function DoshaBalanceCard({
  vata = 32,
  pitta = 45,
  kapha = 23,
  insight = 'Pitta is slightly elevated. Favour cooling foods, avoid spicy meals after 6 PM, and take a 15-min evening walk.',
}: DoshaBalanceCardProps) {
  const dominant = pitta >= vata && pitta >= kapha ? 'pitta' : vata >= kapha ? 'vata' : 'kapha';

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 16,
        elevation: 6,
        gap: 14,
      }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: '#F0FDF4',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="leaf" size={18} color="#2C6E49" />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.3 }}>
              Dosha Balance
            </Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginTop: 1 }}>
              Prakriti Analysis
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#F0FDF4',
            borderRadius: 10,
            paddingHorizontal: 9,
            paddingVertical: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
          <Ionicons name="sparkles" size={11} color="#2C6E49" />
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#2C6E49', letterSpacing: 0.3 }}>
            AI INSIGHT
          </Text>
        </View>
      </View>

      {/* Three dosha bars */}
      <View style={{ gap: 11 }}>
        <DoshaBar
          label="Vata"
          sublabel="Ether · Air"
          percentage={vata}
          color="#6366F1"
          bgColor="#EEF2FF"
          isDominant={dominant === 'vata'}
        />
        <DoshaBar
          label="Pitta"
          sublabel="Fire · Water"
          percentage={pitta}
          color="#F97316"
          bgColor="#FFF7ED"
          isDominant={dominant === 'pitta'}
        />
        <DoshaBar
          label="Kapha"
          sublabel="Earth · Water"
          percentage={kapha}
          color="#22C55E"
          bgColor="#F0FDF4"
          isDominant={dominant === 'kapha'}
        />
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />

      {/* AI insight text */}
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: '#FFF7ED',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 1,
          }}>
          <Text style={{ fontSize: 14 }}>🌿</Text>
        </View>
        <Text
          style={{
            flex: 1,
            fontSize: 12,
            lineHeight: 18,
            color: '#4B5563',
            fontWeight: '500',
          }}>
          {insight}
        </Text>
      </View>
    </View>
  );
}
