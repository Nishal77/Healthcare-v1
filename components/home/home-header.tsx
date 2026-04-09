import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TouchableOpacity, View } from 'react-native';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning!';
  if (h < 17) return 'Good afternoon!';
  return 'Good evening!';
}

interface HomeHeaderProps {
  name?:                string;
  hasNotification?:     boolean;
  watchConnected?:      boolean;
  onNotificationPress?: () => void;
  onWatchPress?:        () => void;
  onAvatarPress?:       () => void;
}

export function HomeHeader({
  name = 'Guest',
  hasNotification  = true,
  watchConnected   = false,
  onNotificationPress,
  onWatchPress,
  onAvatarPress,
}: HomeHeaderProps) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={{
      flexDirection:  'row',
      alignItems:     'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop:     8,
      paddingBottom:  4,
    }}>

      {/* ── Left: avatar + greeting ─────────────────────────────── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity
          onPress={onAvatarPress}
          activeOpacity={0.75}
          style={{
            width: 46, height: 46,
            borderRadius: 23,
            backgroundColor: '#2C6E49',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
            {initials}
          </Text>
        </TouchableOpacity>

        <View>
          <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '400' }}>
            {getGreeting()}
          </Text>
          <Text style={{ fontSize: 15, color: '#1A1A1A', fontWeight: '600', letterSpacing: -0.2 }}>
            {name}
          </Text>
        </View>
      </View>

      {/* ── Right: watch connect + notification ─────────────────── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

        {/* Watch connect button */}
        <TouchableOpacity
          onPress={onWatchPress}
          activeOpacity={0.75}
          style={{
            flexDirection:    'row',
            alignItems:       'center',
            gap:              6,
            height:           38,
            paddingHorizontal:12,
            borderRadius:     19,
            backgroundColor:  watchConnected ? '#F0FDF4' : '#F4F4F4',
            borderWidth:      1,
            borderColor:      watchConnected
              ? 'rgba(34,197,94,0.25)'
              : 'rgba(0,0,0,0.07)',
          }}>
          {/* Live dot — only when connected */}
          {watchConnected && (
            <View style={{
              width: 6, height: 6,
              borderRadius: 3,
              backgroundColor: '#22C55E',
            }} />
          )}
          <Ionicons
            name="watch-outline"
            size={16}
            color={watchConnected ? '#16A34A' : '#6B7280'}
          />
          <Text style={{
            fontSize:      12,
            fontWeight:    '600',
            color:         watchConnected ? '#16A34A' : '#6B7280',
            letterSpacing: 0.1,
          }}>
            {watchConnected ? 'Live' : 'Connect'}
          </Text>
        </TouchableOpacity>

        {/* Notification bell */}
        <TouchableOpacity
          onPress={onNotificationPress}
          activeOpacity={0.75}
          style={{
            width:           42,
            height:          42,
            borderRadius:    21,
            backgroundColor: '#FFFFFF',
            alignItems:      'center',
            justifyContent:  'center',
            shadowColor:     '#000',
            shadowOffset:    { width: 0, height: 2 },
            shadowOpacity:   0.07,
            shadowRadius:    8,
            elevation:       3,
          }}>
          <Ionicons name="notifications-outline" size={20} color="#1C1C1E" />
          {hasNotification && (
            <View style={{
              position:        'absolute',
              top:             9,
              right:           9,
              width:           7,
              height:          7,
              borderRadius:    4,
              backgroundColor: '#E53E3E',
              borderWidth:     1.5,
              borderColor:     '#FFFFFF',
            }} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
