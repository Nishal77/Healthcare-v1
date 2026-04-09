/**
 * WatchMetricsRow — advanced wearable metrics
 *
 * Two rows of white cards matching the MetricsGrid style:
 *  Row 1 (3 cards): Blood O₂ · HRV · Body Temp
 *  Row 2 (2 cards): Respiratory Rate · Stress Level
 *
 * Cards show "—" when no watch is connected, same as MetricsGrid.
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

// ── Card ─────────────────────────────────────────────────────────────────────
interface WatchCardProps {
  icon:        ComponentProps<typeof Ionicons>['name'];
  iconColor:   string;
  label:       string;
  value:       string;
  unit:        string;
  statusDot?:  string;    // color — omit to hide dot
  statusText?: string;
  hasData:     boolean;
  flex?:       number;
}

function WatchCard({
  icon, iconColor, label,
  value, unit,
  statusDot, statusText,
  hasData,
  flex = 1,
}: WatchCardProps) {
  const live = hasData && value !== '—';

  return (
    <View style={{
      flex,
      borderRadius:    22,
      backgroundColor: '#FFFFFF',
      padding:         14,
      minHeight:       130,
      shadowColor:     '#0A0A0A',
      shadowOffset:    { width: 0, height: 2 },
      shadowOpacity:   0.07,
      shadowRadius:    10,
      elevation:       3,
      justifyContent:  'space-between',
    }}>

      {/* Top: icon */}
      <Ionicons name={icon} size={22} color={live ? iconColor : '#D1D5DB'} />

      {/* Bottom: value block + status */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
          <Text style={{
            fontSize:          28,
            fontWeight:        '700',
            color:             live ? '#1A1A1A' : '#D1D5DB',
            letterSpacing:     -0.8,
            lineHeight:        32,
            includeFontPadding: false,
          }}>
            {live ? value : '—'}
          </Text>
          {live && (
            <Text style={{ fontSize: 10, color: '#8A8A8E', fontWeight: '400', marginBottom: 4 }}>
              {unit}
            </Text>
          )}
        </View>

        <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280', marginTop: 2, letterSpacing: 0.1 }}>
          {label}
        </Text>

        {statusDot && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
            <View style={{
              width:           6,
              height:          6,
              borderRadius:    3,
              backgroundColor: live ? statusDot : '#D1D5DB',
            }} />
            <Text style={{
              fontSize:  10,
              fontWeight: '600',
              color:      live ? statusDot : '#D1D5DB',
              letterSpacing: 0.1,
            }}>
              {live ? statusText : '—'}
            </Text>
          </View>
        )}
      </View>

    </View>
  );
}

// ── Stress gauge mini-bar ─────────────────────────────────────────────────────
function StressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <View style={{
      height:        5,
      borderRadius:  3,
      backgroundColor: '#F3F4F6',
      marginTop:     6,
      overflow:      'hidden',
    }}>
      <View style={{
        width:         `${Math.min(pct, 100)}%`,
        height:        '100%',
        borderRadius:  3,
        backgroundColor: color,
      }} />
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface WatchMetricsRowProps {
  spo2?:            number;
  hrv?:             number;
  bodyTemp?:        number;
  respiratoryRate?: number;
  stressLevel?:     number;
  hasData?:         boolean;
}

export function WatchMetricsRow({
  spo2            = 0,
  hrv             = 0,
  bodyTemp        = 0,
  respiratoryRate = 0,
  stressLevel     = 0,
  hasData         = false,
}: WatchMetricsRowProps) {

  // SpO2
  const spo2Status = spo2 >= 98 ? 'Optimal' : spo2 >= 95 ? 'Normal' : 'Low';
  const spo2Color  = spo2 >= 98 ? '#0B7ABE' : spo2 >= 95 ? '#2C6E49' : '#EF4444';

  // HRV
  const hrvStatus = hrv >= 50 ? 'Good' : hrv >= 30 ? 'Fair' : 'Low';
  const hrvColor  = hrv >= 50 ? '#C4860A' : hrv >= 30 ? '#D97706' : '#EF4444';

  // Body temp
  const tempStatus = bodyTemp > 0 && bodyTemp < 99.5 ? 'Normal' : bodyTemp >= 99.5 ? 'Elevated' : '—';
  const tempColor  = bodyTemp >= 99.5 ? '#EF4444' : '#2C6E49';

  // Respiratory rate
  const respStatus = respiratoryRate >= 12 && respiratoryRate <= 20 ? 'Normal'
    : respiratoryRate > 0 ? 'Review' : '—';
  const respColor  = respiratoryRate > 20 ? '#EF4444' : '#2C6E49';

  // Stress
  const stressLabel = stressLevel > 70 ? 'High'
    : stressLevel > 40 ? 'Moderate'
    : stressLevel > 0  ? 'Low'
    : '—';
  const stressColor = stressLevel > 70 ? '#EF4444'
    : stressLevel > 40 ? '#F59E0B'
    : '#22C55E';

  return (
    <View style={{ gap: 12 }}>

      {/* Row 1: Blood O₂ · HRV · Body Temp */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <WatchCard
          icon="water-outline"  iconColor="#2196F3"
          label="Blood O₂"
          value={spo2 > 0 ? String(spo2) : '—'}
          unit="%"
          statusDot={spo2Color} statusText={spo2Status}
          hasData={hasData}
        />
        <WatchCard
          icon="pulse-outline"  iconColor="#C4860A"
          label="HRV"
          value={hrv > 0 ? String(hrv) : '—'}
          unit="ms"
          statusDot={hrvColor} statusText={hrvStatus}
          hasData={hasData}
        />
        <WatchCard
          icon="thermometer-outline"  iconColor="#DC2626"
          label="Body Temp"
          value={bodyTemp > 0 ? String(bodyTemp) : '—'}
          unit="°F"
          statusDot={tempColor} statusText={tempStatus}
          hasData={hasData}
        />
      </View>

      {/* Row 2: Respiratory Rate · Stress Level */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <WatchCard
          icon="partly-sunny-outline"  iconColor="#6366F1"
          label="Respiratory Rate"
          value={respiratoryRate > 0 ? String(respiratoryRate) : '—'}
          unit="brpm"
          statusDot={respColor} statusText={respStatus}
          hasData={hasData}
          flex={1}
        />

        {/* Stress card — custom layout with bar */}
        <View style={{
          flex:            1,
          borderRadius:    22,
          backgroundColor: '#FFFFFF',
          padding:         14,
          minHeight:       130,
          shadowColor:     '#0A0A0A',
          shadowOffset:    { width: 0, height: 2 },
          shadowOpacity:   0.07,
          shadowRadius:    10,
          elevation:       3,
          justifyContent:  'space-between',
        }}>
          <Ionicons
            name="analytics-outline"
            size={22}
            color={hasData && stressLevel > 0 ? '#F59E0B' : '#D1D5DB'}
          />

          <View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
              <Text style={{
                fontSize:          28,
                fontWeight:        '700',
                color:             hasData && stressLevel > 0 ? '#1A1A1A' : '#D1D5DB',
                letterSpacing:     -0.8,
                lineHeight:        32,
                includeFontPadding: false,
              }}>
                {hasData && stressLevel > 0 ? String(stressLevel) : '—'}
              </Text>
              {hasData && stressLevel > 0 && (
                <Text style={{ fontSize: 10, color: '#8A8A8E', fontWeight: '400', marginBottom: 4 }}>
                  /100
                </Text>
              )}
            </View>

            <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280', marginTop: 2 }}>
              Stress Level
            </Text>

            {hasData && stressLevel > 0 ? (
              <>
                <StressBar pct={stressLevel} color={stressColor} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: stressColor }} />
                  <Text style={{ fontSize: 10, fontWeight: '600', color: stressColor }}>{stressLabel}</Text>
                </View>
              </>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' }} />
                <Text style={{ fontSize: 10, fontWeight: '600', color: '#D1D5DB' }}>—</Text>
              </View>
            )}
          </View>
        </View>
      </View>

    </View>
  );
}
