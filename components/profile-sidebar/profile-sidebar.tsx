/**
 * ProfileSidebar
 * Twitter/X-style drawer that replicates the profile page UI exactly.
 * Open:  tap avatar in HomeHeader
 * Close: tap the dim overlay on the right
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_W         = Dimensions.get('window').width;
export const SIDEBAR_W = SCREEN_W * 0.82;

// ─── Types ────────────────────────────────────────────────────────────────────

type RowType = 'arrow' | 'toggle' | 'value' | 'badge' | 'destructive';

interface Row {
  id:         string;
  icon:       React.ComponentProps<typeof Ionicons>['name'];
  title:      string;
  subtitle?:  string;
  type:       RowType;
  value?:     string;
  badge?:     string;
  badgeAlert?: boolean;
  toggleKey?: string;
}

interface Section {
  title: string;
  rows:  Row[];
}

// ─── Section data (mirrors the profile page SettingsMenu) ─────────────────────

const SECTIONS: Section[] = [
  {
    title: 'Account',
    rows: [
      { id: 'account-details', icon: 'person-outline',    title: 'Account Details',   subtitle: 'Personal info & patient ID',            type: 'arrow' },
      { id: 'wearables',       icon: 'watch-outline',     title: 'Linked Wearables',  subtitle: 'Sync data from smartwatch & fitness bands', type: 'value', value: '1 Device' },
      { id: 'health-prefs',    icon: 'leaf-outline',      title: 'Health Preferences',subtitle: 'Dosha type, diet & wellness goals',     type: 'arrow' },
      { id: 'insurance',       icon: 'card-outline',      title: 'Insurance',         subtitle: 'Link your health insurance provider',   type: 'arrow' },
    ],
  },
  {
    title: 'Health & Medical',
    rows: [
      { id: 'medical-id',   icon: 'medkit-outline',  title: 'Medical ID & Vitals', subtitle: 'Blood type, allergies & conditions', type: 'badge', badge: 'Important', badgeAlert: true },
      { id: 'emergency',    icon: 'call-outline',    title: 'Emergency Contact',   subtitle: 'Who to call in an emergency',        type: 'arrow' },
      { id: 'prescriptions',icon: 'alarm-outline',  title: 'Prescription Reminders',                                               type: 'toggle', toggleKey: 'prescriptionReminders' },
    ],
  },
  {
    title: 'Security',
    rows: [
      { id: 'password',   icon: 'lock-closed-outline', title: 'Change Password',          type: 'arrow' },
      { id: 'face-id',    icon: 'scan-outline',        title: 'Face ID / Biometric', subtitle: 'Quick biometric login', type: 'toggle', toggleKey: 'faceId' },
      { id: 'two-fa',     icon: 'key-outline',         title: 'Two-Factor Auth',          type: 'badge', badge: 'Set Up' },
    ],
  },
  {
    title: 'App Preferences',
    rows: [
      { id: 'notifications', icon: 'notifications-outline', title: 'Notifications', subtitle: 'Alerts & reminders', type: 'value', value: 'On' },
      { id: 'dark-mode',     icon: 'moon-outline',          title: 'Dark Mode',                                     type: 'toggle', toggleKey: 'darkMode' },
      { id: 'language',      icon: 'language-outline',      title: 'Language',                                      type: 'value', value: 'English' },
    ],
  },
  {
    title: 'Privacy & Data',
    rows: [
      { id: 'data-sharing', icon: 'share-social-outline', title: 'Health Data Sharing', subtitle: 'Control provider access',    type: 'arrow' },
      { id: 'export',       icon: 'download-outline',     title: 'Export My Data',      subtitle: 'Download your health records', type: 'arrow' },
      { id: 'delete',       icon: 'trash-outline',        title: 'Delete Account',      subtitle: 'Permanently remove account',  type: 'destructive' },
    ],
  },
];

// ─── Icon tile — exact same as settings-menu.tsx ──────────────────────────────

function IconTile({ name, destructive = false }: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  destructive?: boolean;
}) {
  return (
    <View
      style={{
        width: 42, height: 42,
        borderRadius: 13,
        backgroundColor: destructive ? '#FFF0F0' : '#EFEFEF',
        borderWidth: 0.5,
        borderColor: destructive ? 'rgba(220,38,38,0.12)' : 'rgba(0,0,0,0.09)',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* Top-edge highlight — matte surface effect */}
      <View style={{ position: 'absolute', top: 0, left: 5, right: 5, height: 1, backgroundColor: 'rgba(255,255,255,0.95)' }} />
      {/* Soft center glow */}
      <View style={{ position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.45)', top: 7, left: 7 }} />
      <Ionicons name={name} size={19} color={destructive ? '#DC2626' : '#0A0A0A'} />
    </View>
  );
}

// ─── Section label + rule — exact same as settings-menu.tsx ──────────────────

function SectionLabel({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#212122' }}>{title}</Text>
      <View style={{ flex: 1, height: 0.5, backgroundColor: 'rgba(0,0,0,0.07)' }} />
    </View>
  );
}

// ─── Settings row — exact same style as settings-menu.tsx ────────────────────

function SettingsRow({ row, isLast, toggleValue, onToggle }: {
  row:         Row;
  isLast:      boolean;
  toggleValue: boolean;
  onToggle:    (key: string, val: boolean) => void;
}) {
  const destructive = row.type === 'destructive';
  return (
    <TouchableOpacity
      activeOpacity={row.type === 'toggle' ? 1 : 0.55}
      style={{
        flexDirection:     'row',
        alignItems:        'center',
        paddingVertical:   13,
        paddingHorizontal: 14,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: 'rgba(0,0,0,0.06)',
      }}>

      <View style={{ marginRight: 13 }}>
        <IconTile name={row.icon} destructive={destructive} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize:      14,
          fontWeight:    '600',
          color:         destructive ? '#DC2626' : '#0A0A0A',
          letterSpacing: -0.2,
          marginBottom:  row.subtitle ? 2 : 0,
        }}>
          {row.title}
        </Text>
        {row.subtitle ? (
          <Text style={{ fontSize: 11.5, color: '#AEAEB2', lineHeight: 16 }}>{row.subtitle}</Text>
        ) : null}
      </View>

      {row.type === 'toggle' && row.toggleKey && (
        <Switch
          value={toggleValue}
          onValueChange={val => onToggle(row.toggleKey!, val)}
          trackColor={{ false: '#D1D5DB', true: '#2C6E49' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#D1D5DB"
        />
      )}

      {row.type === 'value' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 13, color: '#AEAEB2', fontWeight: '500' }}>{row.value}</Text>
          <Ionicons name="chevron-forward" size={14} color="#C7C7CC" />
        </View>
      )}

      {row.type === 'badge' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{
            backgroundColor: row.badgeAlert ? '#FF3B30' : '#0A0A0A',
            paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8,
          }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 }}>
              {row.badge}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color="#C7C7CC" />
        </View>
      )}

      {(row.type === 'arrow' || row.type === 'destructive') && (
        <Ionicons name="chevron-forward" size={14} color={destructive ? '#FECACA' : '#C7C7CC'} />
      )}
    </TouchableOpacity>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProfileSidebarProps {
  visible:  boolean;
  onClose:  () => void;
  progress: Animated.Value;
  name:     string;
  handle?:  string;
  email?:   string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfileSidebar({
  visible,
  onClose,
  progress,
  name,
  handle = '@nishal.poojary',
  email  = 'nishal@vedarogya.in',
}: ProfileSidebarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [toggles, setToggles] = React.useState<Record<string, boolean>>({
    faceId:                 true,
    darkMode:               false,
    prescriptionReminders:  true,
  });

  const sidebarTranslateX = progress.interpolate({
    inputRange:  [0, 1],
    outputRange: [-SIDEBAR_W, 0],
  });

  const overlayOpacity = progress.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 0.45],
  });

  if (!visible) return null;

  return (
    <>
      {/* Dim backdrop — tap to close */}
      <Animated.View
        pointerEvents="auto"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#000000',
          opacity: overlayOpacity,
          zIndex:  50,
        }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sidebar panel */}
      <Animated.View
        style={{
          position:  'absolute',
          top: 0, left: 0, bottom: 0,
          width:     SIDEBAR_W,
          transform: [{ translateX: sidebarTranslateX }],
          zIndex:    100,
          shadowColor:    '#000',
          shadowOffset:   { width: 8, height: 0 },
          shadowOpacity:  0.18,
          shadowRadius:   28,
          elevation:      30,
        }}>

        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>

            {/* ── Profile header — mirrors profile-header.tsx exactly ── */}
            <View style={{
              paddingTop:        insets.top + 16,
              paddingHorizontal: 20,
              paddingBottom:     28,
              backgroundColor:   '#FFFFFF',
            }}>

              {/* Top bar: title + logout */}
              <View style={{
                flexDirection:  'row',
                alignItems:     'center',
                justifyContent: 'space-between',
                marginBottom:   28,
              }}>
                <Text style={{ fontSize: 26, fontWeight: '700', color: '#111827', letterSpacing: -0.4 }}>
                  Profile
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    width: 38, height: 38,
                    borderRadius: 19,
                    backgroundColor: '#FFF1F2',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {/* Avatar + info — centered, mirrors profile page */}
              <View style={{ alignItems: 'center', gap: 10 }}>

                {/* Photo avatar */}
                <View style={{
                  width: 100, height: 100,
                  borderRadius: 50,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.18,
                  shadowRadius: 14,
                  elevation: 10,
                  backgroundColor: '#F3F4F6',
                  marginBottom: 4,
                }}>
                  <Image
                    source={require('@/assets/images/avatar-sample.jpg')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>

                {/* Handle */}
                <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }}>
                  {handle}
                </Text>

                {/* Name */}
                <Text style={{ fontSize: 22, fontWeight: '600', color: '#111827', marginTop: -4 }}>
                  {name}
                </Text>

                {/* Email */}
                <Text style={{ fontSize: 13, color: '#6B7280' }}>
                  E-mail:{' '}
                  <Text style={{ color: '#374151', fontWeight: '600' }}>{email}</Text>
                </Text>

                {/* Edit Profile — dark pill, full width, matches profile page */}
                <TouchableOpacity
                  onPress={() => { onClose(); router.push('/profile' as any); }}
                  activeOpacity={0.85}
                  style={{
                    marginTop:         6,
                    flexDirection:     'row',
                    alignItems:        'center',
                    alignSelf:         'stretch',
                    justifyContent:    'center',
                    gap:               6,
                    backgroundColor:   '#111827',
                    paddingVertical:   13,
                    borderRadius:      24,
                  }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
                    Edit Profile
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.45)" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider — matches profile page */}
            <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 20, marginBottom: 24 }} />

            {/* ── Settings sections — same card style as SettingsMenu ── */}
            <View style={{ gap: 24 }}>
              {SECTIONS.map(section => (
                <View key={section.title}>
                  <View style={{ paddingHorizontal: 20 }}>
                    <SectionLabel title={section.title} />
                    <View style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius:    18,
                      overflow:        'hidden',
                      borderWidth:     0.5,
                      borderColor:     'rgba(0,0,0,0.07)',
                    }}>
                      {section.rows.map((row, idx) => (
                        <SettingsRow
                          key={row.id}
                          row={row}
                          isLast={idx === section.rows.length - 1}
                          toggleValue={row.toggleKey ? (toggles[row.toggleKey] ?? false) : false}
                          onToggle={(key, val) => setToggles(prev => ({ ...prev, [key]: val }))}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>

          </ScrollView>
        </View>
      </Animated.View>
    </>
  );
}
