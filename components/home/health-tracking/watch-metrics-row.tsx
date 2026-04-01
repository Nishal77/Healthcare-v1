/**
 * WatchMetricsRow — 3 compact cards matching the Sleep card design language
 *
 * Same rules:
 *  • Bare icon, no tile container
 *  • Warm off-white card per metric
 *  • Large bold value
 *  • Status dot + text at bottom
 *  • Soft coloured shadow, no border
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

interface CardDef {
  icon:        ComponentProps<typeof Ionicons>['name'];
  iconColor:   string;
  cardBg:      string;
  shadowColor: string;
  label:       string;
  value:       string;
  unit:        string;
  status:      string;
  statusColor: string;
}

function WatchMetricCard({ card, hasData }: { card: CardDef; hasData: boolean }) {
  const showStatus = hasData && card.value !== '—' && card.status !== '—';

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 22,
        backgroundColor: card.cardBg,
        padding: 14,
        minHeight: 132,
        justifyContent: 'space-between',
        shadowColor: card.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.09,
        shadowRadius: 14,
        elevation: 3,
      }}>

      {/* Bare icon — top */}
      <Ionicons name={card.icon} size={22} color={card.iconColor} />

      {/* Value + unit + label + status — bottom */}
      <View style={{ gap: 2, marginTop: 12 }}>

        {/* Value + unit inline */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          <Text style={{
            fontSize: 28,
            fontWeight: '700',
            color: hasData && card.value !== '—' ? '#1A1A1A' : '#D1D5DB',
            letterSpacing: -0.8,
            lineHeight: 32,
            includeFontPadding: false,
          }}>
            {hasData ? card.value : '—'}
          </Text>
          {hasData && card.value !== '—' && (
            <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '400', marginBottom: 4 }}>
              {card.unit}
            </Text>
          )}
        </View>

        {/* Label */}
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280', letterSpacing: 0.1 }}>
          {card.label}
        </Text>

        {/* Status */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <View style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: showStatus ? card.statusColor : '#E5E7EB',
          }} />
          <Text style={{
            fontSize: 10, fontWeight: '600', letterSpacing: 0.1,
            color: showStatus ? card.statusColor : '#D1D5DB',
          }}>
            {showStatus ? card.status : '—'}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
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
      cardBg:      '#F0F8FE',
      shadowColor: '#2196F3',
      label:       'Blood O₂',
      value:       spo2 > 0 ? String(spo2) : '—',
      unit:        '%',
      status:      spo2 > 0 ? spo2Status : '—',
      statusColor: spo2Color,
    },
    {
      icon:        'pulse-outline',
      iconColor:   '#C4860A',
      cardBg:      '#FFFCF2',
      shadowColor: '#D97706',
      label:       'HRV',
      value:       hrv > 0 ? String(hrv) : '—',
      unit:        'ms',
      status:      hrv > 0 ? hrvStatus : '—',
      statusColor: hrvColor,
    },
    {
      icon:        'thermometer-outline',
      iconColor:   '#DC2626',
      cardBg:      '#FFF5F5',
      shadowColor: '#DC2626',
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
