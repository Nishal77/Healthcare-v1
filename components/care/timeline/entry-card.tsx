import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

import { ENTRY_TYPE_CONFIG, type TrackEntry } from '../care-data';

interface EntryCardProps {
  entry: TrackEntry;
  isLast?: boolean;
}

export function EntryCard({ entry, isLast }: EntryCardProps) {
  const config = ENTRY_TYPE_CONFIG[entry.type];
  const [timePart, meridiem] = entry.time.split(' ');

  return (
    <View style={{ flexDirection: 'row', marginBottom: 2 }}>

      {/* ── Time column ─────────────────────────────────────── */}
      <View style={{ width: 58, paddingTop: 13, alignItems: 'flex-end', paddingRight: 12 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: '#4B5563',
            fontVariant: ['tabular-nums'],
          }}>
          {timePart}
        </Text>
        <Text style={{ fontSize: 9, color: '#C4C4C6', fontWeight: '600', letterSpacing: 0.3 }}>
          {meridiem}
        </Text>
      </View>

      {/* ── Timeline track ───────────────────────────────────── */}
      <View style={{ width: 24, alignItems: 'center', paddingTop: 14 }}>
        {/* Colored dot */}
        <View
          style={{
            width: 9,
            height: 9,
            borderRadius: 4.5,
            backgroundColor: config.color,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            shadowColor: config.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 2,
          }}
        />
        {/* Connector line */}
        {!isLast && (
          <View
            style={{
              width: 1.5,
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.07)',
              marginTop: 5,
            }}
          />
        )}
      </View>

      {/* ── Entry card ───────────────────────────────────────── */}
      <View style={{ flex: 1, paddingLeft: 10, paddingBottom: 12 }}>
        {/* Shadow wrapper */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={{
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}>
          {/* Inner border + clip */}
          <View
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.08)',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              gap: 12,
            }}>
            {/* Inner top highlight */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 12,
                right: 12,
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.9)',
              }}
            />

            {/* Icon tile */}
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                backgroundColor: config.bgColor,
                borderWidth: 1,
                borderColor: `${config.color}25`,
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
              <Ionicons name={config.iconName as any} size={20} color={config.color} />
            </View>

            {/* Title + detail */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#0D1117',
                  letterSpacing: -0.2,
                  marginBottom: 2,
                }}>
                {entry.title}
              </Text>
              <Text
                style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 16 }}
                numberOfLines={1}>
                {entry.detail}
              </Text>
            </View>

            {/* Value badge */}
            <View
              style={{
                backgroundColor: '#F3F4F6',
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: 9,
                borderWidth: 0.5,
                borderColor: 'rgba(0,0,0,0.07)',
                flexShrink: 0,
              }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151' }}>
                {entry.value}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
