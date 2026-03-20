import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CareHeaderProps {
  hasNotification?: boolean;
  onNotificationPress?: () => void;
}

export function CareHeader({
  hasNotification = true,
  onNotificationPress,
}: CareHeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>

        {/* Title */}
        <View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: '800',
              color: '#0D1117',
              letterSpacing: -0.6,
              lineHeight: 34,
            }}>
            Care
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#9CA3AF',
              fontWeight: '500',
              marginTop: 4,
              letterSpacing: 0.1,
            }}>
            Daily Health Journal
          </Text>
        </View>

        {/* Right: bell + live clock */}
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <TouchableOpacity
            onPress={onNotificationPress}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            }}>
            <Ionicons name="notifications-outline" size={20} color="#1C1C1E" />
            {hasNotification && (
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 7,
                  height: 7,
                  borderRadius: 3.5,
                  backgroundColor: '#E53E3E',
                  borderWidth: 1.5,
                  borderColor: '#FFFFFF',
                }}
              />
            )}
          </TouchableOpacity>

          {/* Live running clock */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: '#F3F4F6',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.07)',
            }}>
            {/* Pulsing live dot */}
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#2C6E49',
              }}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: '#4B5563',
                // tabular-nums keeps digits fixed-width so clock doesn't jitter
                fontVariant: ['tabular-nums'],
              }}>
              {timeStr}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
