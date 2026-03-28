import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

// Dosha color system aligned with Ayurvedic tradition
const DOSHA = {
  vata:  { color: '#4B5569', bg: '#F1F2F5', label: 'Vata',  sub: 'Ether · Air'   },
  pitta: { color: '#C4860A', bg: '#FEF8EE', label: 'Pitta', sub: 'Fire · Water'   },
  kapha: { color: '#2C6E49', bg: '#F0F7F3', label: 'Kapha', sub: 'Earth · Water'  },
} as const;

interface DoshaBarProps {
  type: keyof typeof DOSHA;
  percentage: number;
  isDominant: boolean;
}

function DoshaBar({ type, percentage, isDominant }: DoshaBarProps) {
  const d = DOSHA[type];
  return (
    <View style={{ gap: 6 }}>
      {/* Label row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F1923' }}>{d.label}</Text>
          <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>{d.sub}</Text>
          {isDominant && (
            <View style={{ backgroundColor: d.bg, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 }}>
              <Text style={{ fontSize: 9, fontWeight: '800', color: d.color, letterSpacing: 0.5 }}>
                HIGH
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 13, fontWeight: '800', color: d.color, letterSpacing: -0.3 }}>
          {percentage}%
        </Text>
      </View>

      {/* Progress track */}
      <View style={{ height: 6, backgroundColor: '#F0EFEC', borderRadius: 3, overflow: 'hidden' }}>
        <View
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: d.color,
            borderRadius: 3,
            opacity: isDominant ? 1 : 0.6,
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
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor: '#ECEAE6',
        gap: 16,
      }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: '#F0F7F3',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="leaf" size={17} color="#2C6E49" />
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1923', letterSpacing: -0.3 }}>
              Dosha Balance
            </Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginTop: 1 }}>
              Prakriti Analysis
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#F0F7F3',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 5,
          }}>
          <Ionicons name="sparkles" size={10} color="#2C6E49" />
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#2C6E49', letterSpacing: 0.5 }}>
            AI
          </Text>
        </View>
      </View>

      {/* Three dosha bars */}
      <View style={{ gap: 13 }}>
        <DoshaBar type="vata"  percentage={vata}  isDominant={dominant === 'vata'}  />
        <DoshaBar type="pitta" percentage={pitta} isDominant={dominant === 'pitta'} />
        <DoshaBar type="kapha" percentage={kapha} isDominant={dominant === 'kapha'} />
      </View>

      {/* Divider + Insight */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#F0EFEC', paddingTop: 14 }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              backgroundColor: '#FEF8EE',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
            }}>
            <Ionicons name="bulb-outline" size={13} color="#C4860A" />
          </View>
          <Text style={{ flex: 1, fontSize: 12, lineHeight: 19, color: '#4B5563', fontWeight: '500' }}>
            {insight}
          </Text>
        </View>
      </View>
    </View>
  );
}
