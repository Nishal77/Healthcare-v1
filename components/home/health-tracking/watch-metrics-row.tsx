/**
 * WatchMetricsRow
 *
 * Three compact cards for advanced watch metrics:
 *   Blood O₂ · HRV · Body Temp
 *
 * Tinted card backgrounds, coloured icon tiles, status badge.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

interface CardDef {
  icon:       ComponentProps<typeof Ionicons>['name'];
  iconColor:  string;
  iconBg:     string;
  cardBg:     string;
  borderColor:string;
  label:      string;
  value:      string;
  unit:       string;
  status:     string;
  statusColor:string;
}

function WatchMetricCard({ card, hasData }: { card: CardDef; hasData: boolean }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: card.cardBg,
        borderRadius: 18,
        padding: 13,
        borderWidth: 1,
        borderColor: card.borderColor,
        gap: 2,
        minHeight: 120,
      }}>

      {/* Icon */}
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: card.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}>
        <Ionicons name={card.icon} size={17} color={card.iconColor} />
      </View>

      {/* Value */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginBottom: 2 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: hasData ? '#0F1923' : '#D1D5DB',
            letterSpacing: -0.7,
            lineHeight: 26,
          }}>
          {hasData ? card.value : '—'}
        </Text>
        {hasData && card.value !== '—' && (
          <Text style={{ fontSize: 9, color: '#9CA3AF', fontWeight: '500', marginBottom: 3 }}>
            {card.unit}
          </Text>
        )}
      </View>

      {/* Label */}
      <Text style={{ fontSize: 11, fontWeight: '500', color: '#6B7280', letterSpacing: 0.1 }}>
        {card.label}
      </Text>

      {/* Status pill */}
      <View
        style={{
          alignSelf: 'flex-start',
          marginTop: 6,
          backgroundColor: hasData ? `${card.statusColor}15` : '#F3F4F6',
          borderRadius: 20,
          paddingHorizontal: 7,
          paddingVertical: 3,
        }}>
        <Text
          style={{
            fontSize: 9.5,
            fontWeight: '700',
            color: hasData ? card.statusColor : '#D1D5DB',
            letterSpacing: 0.2,
          }}>
          {hasData ? card.status : '—'}
        </Text>
      </View>
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
  const spo2Color   = spo2 >= 98 ? '#0B6E8B' : spo2 >= 95 ? '#2C6E49' : '#EA580C';
  const hrvStatus   = hrv >= 50 ? 'Good' : hrv >= 30 ? 'Fair' : 'Low';
  const hrvColor    = hrv >= 50 ? '#D97706' : hrv >= 30 ? '#C4860A' : '#EA580C';
  const tempStatus  = bodyTemp > 0 && bodyTemp < 99.5 ? 'Normal' : bodyTemp >= 99.5 ? 'Elevated' : '—';
  const tempColor   = bodyTemp >= 99.5 ? '#EA580C' : '#B83A3A';

  const CARDS: CardDef[] = [
    {
      icon:       'water-outline',
      iconColor:  '#0B6E8B',
      iconBg:     '#E6F4F9',
      cardBg:     '#F2F9FC',
      borderColor:'#BAE6FD30',
      label:      'Blood O₂',
      value:      spo2 > 0 ? String(spo2) : '—',
      unit:       '%',
      status:     spo2 > 0 ? spo2Status : '—',
      statusColor: spo2Color,
    },
    {
      icon:       'pulse-outline',
      iconColor:  '#C4860A',
      iconBg:     '#FEF9E7',
      cardBg:     '#FFFDF5',
      borderColor:'#FDE68A30',
      label:      'HRV',
      value:      hrv > 0 ? String(hrv) : '—',
      unit:       'ms',
      status:     hrv > 0 ? hrvStatus : '—',
      statusColor: hrvColor,
    },
    {
      icon:       'thermometer-outline',
      iconColor:  '#B83A3A',
      iconBg:     '#FEF2F2',
      cardBg:     '#FFF8F8',
      borderColor:'#FECACA30',
      label:      'Body Temp',
      value:      bodyTemp > 0 ? String(bodyTemp) : '—',
      unit:       '°F',
      status:     bodyTemp > 0 ? tempStatus : '—',
      statusColor: tempColor,
    },
  ];

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {CARDS.map(card => (
        <WatchMetricCard key={card.label} card={card} hasData={hasData} />
      ))}
    </View>
  );
}
