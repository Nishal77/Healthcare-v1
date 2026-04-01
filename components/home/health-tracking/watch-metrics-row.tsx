/**
 * WatchMetricsRow
 *
 * Same design rules as MetricsGrid:
 *  • LinearGradient bg — top light, bottom richer tint
 *  • NO shadow, NO border
 *  • Bare icon (no tile), large value, status dot + text
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

interface CardDef {
  icon:        ComponentProps<typeof Ionicons>['name'];
  iconColor:   string;
  gradTop:     string;
  gradBot:     string;
  label:       string;
  value:       string;
  unit:        string;
  status:      string;
  statusColor: string;
}

function WatchMetricCard({ card, hasData }: { card: CardDef; hasData: boolean }) {
  const showStatus = hasData && card.value !== '—' && card.status !== '—';

  return (
    <View style={{ flex: 1, borderRadius: 22, overflow: 'hidden', minHeight: 136 }}>
      <LinearGradient
        colors={[card.gradTop, card.gradBot]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1, padding: 14, justifyContent: 'space-between' }}>

        {/* Bare icon — top */}
        <Ionicons name={card.icon} size={22} color={card.iconColor} />

        {/* Value + label + status — bottom */}
        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
            <Text style={{
              fontSize: 28,
              fontWeight: '700',
              color: hasData && card.value !== '—' ? '#1A1A1A' : '#C8C8C8',
              letterSpacing: -0.8,
              lineHeight: 32,
              includeFontPadding: false,
            }}>
              {hasData ? card.value : '—'}
            </Text>
            {hasData && card.value !== '—' && (
              <Text style={{ fontSize: 10, color: '#8A8A8E', fontWeight: '400', marginBottom: 4 }}>
                {card.unit}
              </Text>
            )}
          </View>

          <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280', letterSpacing: 0.1 }}>
            {card.label}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <View style={{
              width: 6, height: 6, borderRadius: 3,
              backgroundColor: showStatus ? card.statusColor : '#D1D5DB',
            }} />
            <Text style={{
              fontSize: 10, fontWeight: '600', letterSpacing: 0.1,
              color: showStatus ? card.statusColor : '#C8C8C8',
            }}>
              {showStatus ? card.status : '—'}
            </Text>
          </View>
        </View>

      </LinearGradient>
    </View>
  );
}

interface WatchMetricsRowProps {
  spo2?:     number;
  hrv?:      number;
  bodyTemp?: number;
  hasData?:  boolean;
}

export function WatchMetricsRow({
  spo2     = 0,
  hrv      = 0,
  bodyTemp = 0,
  hasData  = false,
}: WatchMetricsRowProps) {

  const spo2Status  = spo2 >= 98 ? 'Optimal' : spo2 >= 95 ? 'Normal' : 'Low';
  const spo2Color   = spo2 >= 98 ? '#0B7ABE' : spo2 >= 95 ? '#2C6E49' : '#EF4444';
  const hrvStatus   = hrv >= 50 ? 'Good' : hrv >= 30 ? 'Fair' : 'Low';
  const hrvColor    = hrv >= 50 ? '#C4860A' : hrv >= 30 ? '#D97706' : '#EF4444';
  const tempStatus  = bodyTemp === 0 ? '—' : bodyTemp < 99.5 ? 'Normal' : 'Elevated';
  const tempColor   = bodyTemp >= 99.5 ? '#EF4444' : '#B83A3A';

  const CARDS: CardDef[] = [
    {
      icon:        'water-outline',
      iconColor:   '#2196F3',
      gradTop:     '#FFFFFF',
      gradBot:     '#C9E8FB',
      label:       'Blood O₂',
      value:       spo2 > 0 ? String(spo2) : '—',
      unit:        '%',
      status:      spo2 > 0 ? spo2Status : '—',
      statusColor: spo2Color,
    },
    {
      icon:        'pulse-outline',
      iconColor:   '#C4860A',
      gradTop:     '#FFFFFF',
      gradBot:     '#FDE9A8',
      label:       'HRV',
      value:       hrv > 0 ? String(hrv) : '—',
      unit:        'ms',
      status:      hrv > 0 ? hrvStatus : '—',
      statusColor: hrvColor,
    },
    {
      icon:        'thermometer-outline',
      iconColor:   '#DC2626',
      gradTop:     '#FFFFFF',
      gradBot:     '#FCCACA',
      label:       'Body Temp',
      value:       bodyTemp > 0 ? String(bodyTemp) : '—',
      unit:        '°F',
      status:      bodyTemp > 0 ? tempStatus : '—',
      statusColor: tempColor,
    },
  ];

  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {CARDS.map(card => (
        <WatchMetricCard key={card.label} card={card} hasData={hasData} />
      ))}
    </View>
  );
}
