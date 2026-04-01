/**
 * WatchMetricsRow — Premium 3-col watch metric cards
 *
 * Design: square tinted cards, large icon tile at top,
 * large value, label, coloured status dot + text.
 * Matches the bottom row of reference image 2.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

interface CardDef {
  icon:        ComponentProps<typeof Ionicons>['name'];
  iconColor:   string;
  iconBg:      string;
  bgBase:      string;
  bgBlob:      string;
  shadowColor: string;
  label:       string;
  value:       string;
  unit:        string;
  status:      string;
  statusColor: string;
}

function WatchMetricCard({ card, hasData }: { card: CardDef; hasData: boolean }) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 136,
        shadowColor: card.shadowColor,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.11,
        shadowRadius: 12,
        elevation: 4,
      }}>

      <View style={{ flex: 1, backgroundColor: card.bgBase }}>

        {/* Blob */}
        <View
          style={{
            position: 'absolute',
            top: -18,
            right: -18,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: card.bgBlob,
          }}
        />

        <View style={{ flex: 1, padding: 14, justifyContent: 'space-between' }}>

          {/* Icon tile */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              backgroundColor: card.iconBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name={card.icon} size={20} color={card.iconColor} />
          </View>

          {/* Value + unit + label + status */}
          <View style={{ gap: 1 }}>
            {/* Value */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '800',
                  color: hasData ? '#0F1923' : '#D1D5DB',
                  letterSpacing: -0.8,
                  lineHeight: 30,
                  includeFontPadding: false,
                }}>
                {hasData ? card.value : '—'}
              </Text>
              {hasData && card.value !== '—' && (
                <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '500', marginBottom: 3 }}>
                  {card.unit}
                </Text>
              )}
            </View>

            {/* Label */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: '#6B7280',
                marginTop: 1,
                letterSpacing: 0.1,
              }}>
              {card.label}
            </Text>

            {/* Status */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginTop: 5,
              }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: hasData && card.status !== '—' ? card.statusColor : '#E5E7EB',
                }}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: hasData && card.status !== '—' ? card.statusColor : '#D1D5DB',
                  letterSpacing: 0.1,
                }}>
                {hasData ? card.status : '—'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Props & logic ─────────────────────────────────────────────────────────────
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
  const spo2Color   = spo2 >= 98 ? '#0B6E8B' : spo2 >= 95 ? '#2C6E49' : '#EF4444';
  const hrvStatus   = hrv >= 50 ? 'Good' : hrv >= 30 ? 'Fair' : 'Low';
  const hrvColor    = hrv >= 50 ? '#D97706' : hrv >= 30 ? '#C4860A' : '#EF4444';
  const tempStatus  = bodyTemp === 0 ? '—' : bodyTemp < 99.5 ? 'Normal' : 'Elevated';
  const tempColor   = bodyTemp >= 99.5 ? '#EF4444' : '#B83A3A';

  const CARDS: CardDef[] = [
    {
      icon:        'water-outline',
      iconColor:   '#1E90D6',
      iconBg:      '#D1EDFB',
      bgBase:      '#EEF7FD',
      bgBlob:      '#C4E8F720',
      shadowColor: '#1E90D6',
      label:       'Blood O₂',
      value:       spo2 > 0 ? String(spo2) : '—',
      unit:        '%',
      status:      spo2 > 0 ? spo2Status : '—',
      statusColor: spo2Color,
    },
    {
      icon:        'pulse-outline',
      iconColor:   '#C4860A',
      iconBg:      '#FEF0C7',
      bgBase:      '#FFFCF0',
      bgBlob:      '#FDE68A20',
      shadowColor: '#C4860A',
      label:       'HRV',
      value:       hrv > 0 ? String(hrv) : '—',
      unit:        'ms',
      status:      hrv > 0 ? hrvStatus : '—',
      statusColor: hrvColor,
    },
    {
      icon:        'thermometer-outline',
      iconColor:   '#DC2626',
      iconBg:      '#FEE2E2',
      bgBase:      '#FFF5F5',
      bgBlob:      '#FECACA20',
      shadowColor: '#DC2626',
      label:       'Body Temp',
      value:       bodyTemp > 0 ? String(bodyTemp) : '—',
      unit:        '°F',
      status:      bodyTemp > 0 ? tempStatus : '—',
      statusColor: tempColor,
    },
  ];

  return (
    <View style={{ flexDirection: 'row', gap: 11 }}>
      {CARDS.map(card => (
        <WatchMetricCard key={card.label} card={card} hasData={hasData} />
      ))}
    </View>
  );
}
