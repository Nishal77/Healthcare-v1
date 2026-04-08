/**
 * ProfileSidebar
 * Twitter/X-style drawer — slides in from the left while the main
 * screen shifts right and scales down.
 *
 * Open:  tap avatar in HomeHeader
 * Close: tap the dim overlay on the right, or the × button
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_W    = Dimensions.get('window').width;
export const SIDEBAR_W = SCREEN_W * 0.78;

// ─── Types ────────────────────────────────────────────────────────────────────

type RowType = 'arrow' | 'toggle' | 'value' | 'destructive';

interface NavItem {
  id:       string;
  icon:     React.ComponentProps<typeof Ionicons>['name'];
  label:    string;
  sub?:     string;
  type:     RowType;
  value?:   string;
  toggleKey?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// ─── Nav data ─────────────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'My Health',
    items: [
      { id: 'appointments', icon: 'calendar-outline',    label: 'Appointments',     sub: 'View upcoming visits',            type: 'arrow'  },
      { id: 'records',      icon: 'document-text-outline',label: 'Medical Records',  sub: 'History & test results',          type: 'arrow'  },
      { id: 'care-team',   icon: 'people-outline',       label: 'Care Team',        sub: '3 providers linked',              type: 'value', value: '3' },
      { id: 'wearables',   icon: 'watch-outline',        label: 'Wearables',        sub: 'Sync smartwatch data',            type: 'value', value: '1' },
      { id: 'ayurveda',    icon: 'flower-outline',       label: 'Ayurveda Prefs',   sub: 'Dosha, diet & goals',            type: 'arrow'  },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 'notifications', icon: 'notifications-outline', label: 'Notifications', sub: 'Alerts & reminders',   type: 'value', value: 'On'      },
      { id: 'dark-mode',    icon: 'moon-outline',          label: 'Dark Mode',                                   type: 'toggle', toggleKey: 'darkMode'  },
      { id: 'face-id',      icon: 'scan-outline',          label: 'Face ID',        sub: 'Biometric login',     type: 'toggle', toggleKey: 'faceId'    },
      { id: 'security',     icon: 'shield-half-outline',   label: 'Security',       sub: 'Password & 2FA',      type: 'arrow'  },
      { id: 'privacy',      icon: 'eye-outline',           label: 'Privacy & Data', sub: 'Data sharing controls', type: 'arrow' },
    ],
  },
];

// ─── Small icon tile ──────────────────────────────────────────────────────────

function IconTile({
  name,
  destructive = false,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  destructive?: boolean;
}) {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 11,
        backgroundColor: destructive ? '#FFF0F0' : '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: destructive ? 'rgba(220,38,38,0.12)' : 'rgba(0,0,0,0.06)',
      }}>
      <Ionicons name={name} size={16} color={destructive ? '#DC2626' : '#1C1C1E'} />
    </View>
  );
}

// ─── Nav row ─────────────────────────────────────────────────────────────────

function NavRow({
  item,
  toggles,
  onToggle,
  isLast,
}: {
  item:     NavItem;
  toggles:  Record<string, boolean>;
  onToggle: (key: string, val: boolean) => void;
  isLast:   boolean;
}) {
  const destructive = item.type === 'destructive';
  return (
    <TouchableOpacity
      activeOpacity={item.type === 'toggle' ? 1 : 0.55}
      style={{
        flexDirection:     'row',
        alignItems:        'center',
        paddingVertical:   11,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: 'rgba(0,0,0,0.055)',
      }}>
      <IconTile name={item.icon} destructive={destructive} />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={{
            fontSize:      14,
            fontWeight:    '600',
            color:         destructive ? '#DC2626' : '#0D1117',
            letterSpacing: -0.2,
          }}>
          {item.label}
        </Text>
        {item.sub ? (
          <Text style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 1 }}>{item.sub}</Text>
        ) : null}
      </View>

      {/* Right control */}
      {item.type === 'toggle' && item.toggleKey && (
        <Switch
          value={toggles[item.toggleKey] ?? false}
          onValueChange={val => onToggle(item.toggleKey!, val)}
          trackColor={{ false: '#D1D5DB', true: '#2C6E49' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#D1D5DB"
          style={{ transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }] }}
        />
      )}

      {item.type === 'value' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }}>{item.value}</Text>
          <Ionicons name="chevron-forward" size={13} color="#C7C7CC" />
        </View>
      )}

      {(item.type === 'arrow' || item.type === 'destructive') && (
        <Ionicons
          name="chevron-forward"
          size={13}
          color={destructive ? '#FECACA' : '#C7C7CC'}
        />
      )}
    </TouchableOpacity>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProfileSidebarProps {
  visible:  boolean;
  onClose:  () => void;
  /** Animated value driven by the parent — 0 = closed, 1 = open */
  progress: Animated.Value;
  name:     string;
  email?:   string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileSidebar({
  visible,
  onClose,
  progress,
  name,
  email = 'nishal@vedarogya.app',
}: ProfileSidebarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [toggles, setToggles] = React.useState<Record<string, boolean>>({
    darkMode: false,
    faceId:   true,
  });

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Sidebar translates in from the left
  const translateX = progress.interpolate({
    inputRange:  [0, 1],
    outputRange: [-SIDEBAR_W, 0],
  });

  // Overlay dims as sidebar opens
  const overlayOpacity = progress.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 0.45],
  });

  if (!visible) return null;

  return (
    <>
      {/* Dim overlay — tap to close */}
      <Animated.View
        pointerEvents="auto"
        style={{
          position:        'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#000000',
          opacity:          overlayOpacity,
          zIndex:           50,
        }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sidebar panel */}
      <Animated.View
        style={{
          position:    'absolute',
          top: 0, left: 0, bottom: 0,
          width:       SIDEBAR_W,
          transform:   [{ translateX }],
          zIndex:      100,
          shadowColor: '#000',
          shadowOffset:{ width: 6, height: 0 },
          shadowOpacity: 0.18,
          shadowRadius:  24,
          elevation:     30,
        }}>

        {/* White card */}
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

          {/* ── Top safe area padding ────────────────────────────── */}
          <View style={{ paddingTop: insets.top }} />

          {/* ── Close button ─────────────────────────────────────── */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 18, paddingTop: 8 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32, height: 32,
                borderRadius: 16,
                backgroundColor: '#F3F4F6',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* ── Profile card ──────────────────────────────────────── */}
          <View style={{ paddingHorizontal: 22, paddingTop: 14, paddingBottom: 22 }}>
            {/* Avatar */}
            <View
              style={{
                width: 64, height: 64,
                borderRadius: 32,
                backgroundColor: '#2C6E49',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}>
              <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>
                {initials}
              </Text>
            </View>

            {/* Name + email */}
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0D1117', letterSpacing: -0.5 }}>
              {name}
            </Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 3 }}>{email}</Text>

            {/* Edit Profile pill */}
            <TouchableOpacity
              onPress={() => { onClose(); router.push('/profile' as any); }}
              style={{
                alignSelf:        'flex-start',
                marginTop:        14,
                flexDirection:    'row',
                alignItems:       'center',
                gap:              6,
                backgroundColor:  '#F3F4F6',
                paddingHorizontal:14,
                paddingVertical:  8,
                borderRadius:     20,
              }}>
              <Ionicons name="pencil-outline" size={13} color="#0D1117" />
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#0D1117' }}>
                Edit Profile
              </Text>
            </TouchableOpacity>

            {/* Health stats row */}
            <View
              style={{
                flexDirection:    'row',
                marginTop:        18,
                gap:              1,
                backgroundColor:  '#F8F9FA',
                borderRadius:     16,
                overflow:         'hidden',
              }}>
              {[
                { label: 'Appointments', value: '4' },
                { label: 'Records',      value: '12' },
                { label: 'Providers',    value: '3' },
              ].map((stat, i) => (
                <View
                  key={stat.label}
                  style={{
                    flex:          1,
                    alignItems:    'center',
                    paddingVertical: 12,
                    borderRightWidth: i < 2 ? 1 : 0,
                    borderRightColor: 'rgba(0,0,0,0.06)',
                  }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#0D1117', letterSpacing: -0.5 }}>
                    {stat.value}
                  </Text>
                  <Text style={{ fontSize: 10.5, color: '#9CA3AF', marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 0.5, backgroundColor: 'rgba(0,0,0,0.07)', marginHorizontal: 22, marginBottom: 8 }} />

          {/* ── Scrollable nav ────────────────────────────────────── */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: insets.bottom + 100 }}
            showsVerticalScrollIndicator={false}>

            {NAV_GROUPS.map(group => (
              <View key={group.title} style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontSize:      11,
                    fontWeight:    '700',
                    color:         '#C4C9D4',
                    letterSpacing: 1,
                    marginBottom:  8,
                  }}>
                  {group.title.toUpperCase()}
                </Text>

                {group.items.map((item, idx) => (
                  <NavRow
                    key={item.id}
                    item={item}
                    toggles={toggles}
                    onToggle={(key, val) => setToggles(prev => ({ ...prev, [key]: val }))}
                    isLast={idx === group.items.length - 1}
                  />
                ))}
              </View>
            ))}

            {/* Sign out */}
            <View style={{ marginTop: 28 }}>
              <TouchableOpacity
                style={{
                  flexDirection:    'row',
                  alignItems:       'center',
                  gap:              12,
                  paddingVertical:  13,
                }}>
                <IconTile name="log-out-outline" destructive />
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#DC2626' }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* ── Bottom safe area cover ────────────────────────────── */}
          <View style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: insets.bottom + 16,
            backgroundColor: '#FFFFFF',
          }} />
        </View>
      </Animated.View>
    </>
  );
}
