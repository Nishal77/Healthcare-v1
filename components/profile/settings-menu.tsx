import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────
type RowType = 'arrow' | 'toggle' | 'value' | 'badge' | 'destructive';

interface Row {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  type: RowType;
  value?: string;
  badge?: string;
  badgeType?: 'alert' | 'neutral' | 'action';
  toggleKey?: string;
}

interface Section {
  title: string;
  rows: Row[];
}

// ─── Premium textured icon tile ───────────────────────────────────────────────
// Monochrome matte tile with micro-highlight — brushed-surface effect
function IconTile({ name }: { name: React.ComponentProps<typeof Ionicons>['name'] }) {
  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: '#EFEFEF',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.09)',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* Top-edge light reflection — simulates matte surface catch */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 5,
          right: 5,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      />
      {/* Soft center glow — depth without gradient */}
      <View
        style={{
          position: 'absolute',
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: 'rgba(255,255,255,0.45)',
          top: 7,
          left: 7,
        }}
      />
      {/* Icon */}
      <Ionicons name={name} size={19} color="#0A0A0A" />
    </View>
  );
}

// ─── Section header with rule ─────────────────────────────────────────────────
function SectionLabel({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, marginBottom: 10 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#212122ff'}}>
        {title}
      </Text>
      <View style={{ flex: 1, height: 0.5, backgroundColor: 'rgba(0,0,0,0.07)' }} />
    </View>
  );
}

// ─── Single row ───────────────────────────────────────────────────────────────
function SettingsRow({
  row,
  isLast,
  toggleValue,
  onToggle,
}: {
  row: Row;
  isLast: boolean;
  toggleValue: boolean;
  onToggle: (key: string, val: boolean) => void;
}) {
  const isDestructive = row.type === 'destructive';

  return (
    <TouchableOpacity
      activeOpacity={row.type === 'toggle' ? 1 : 0.55}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 0.5,
        borderBottomColor: 'rgba(0,0,0,0.06)',
      }}>

      {/* Icon tile */}
      <View style={{ marginRight: 14 }}>
        {isDestructive ? (
          <View
            style={{
              width: 42, height: 42, borderRadius: 13,
              backgroundColor: '#FFF0F0',
              borderWidth: 0.5,
              borderColor: 'rgba(220,38,38,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name={row.icon} size={19} color="#DC2626" />
          </View>
        ) : (
          <IconTile name={row.icon} />
        )}
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: isDestructive ? '#DC2626' : '#0A0A0A',
            letterSpacing: -0.2,
            marginBottom: row.subtitle ? 2 : 0,
          }}>
          {row.title}
        </Text>
        {row.subtitle ? (
          <Text style={{ fontSize: 12, color: '#AEAEB2', lineHeight: 17, fontWeight: '400' }}>
            {row.subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right control */}
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
          <Text style={{ fontSize: 14, color: '#AEAEB2', fontWeight: '500' }}>{row.value}</Text>
          <Ionicons name="chevron-forward" size={15} color="#C7C7CC" />
        </View>
      )}

      {row.type === 'badge' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: row.badgeType === 'alert' ? '#FF3B30' : '#0A0A0A',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 }}>
              {row.badge}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={15} color="#C7C7CC" />
        </View>
      )}

      {(row.type === 'arrow' || row.type === 'destructive') && (
        <Ionicons
          name="chevron-forward"
          size={15}
          color={isDestructive ? '#FECACA' : '#C7C7CC'}
        />
      )}
    </TouchableOpacity>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({
  section,
  toggles,
  onToggle,
}: {
  section: Section;
  toggles: Record<string, boolean>;
  onToggle: (key: string, val: boolean) => void;
}) {
  return (
    <View>
      <SectionLabel title={section.title} />
      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            overflow: 'hidden',
            borderWidth: 0.5,
            borderColor: 'rgba(0,0,0,0.07)',
          }}>
          {section.rows.map((row, idx) => (
            <SettingsRow
              key={row.id}
              row={row}
              isLast={idx === section.rows.length - 1}
              toggleValue={row.toggleKey ? (toggles[row.toggleKey] ?? false) : false}
              onToggle={onToggle}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Section data ─────────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    title: 'Account',
    rows: [
      { id: 'account-details', icon: 'person-outline', title: 'Account Details', subtitle: 'Personal info & patient ID', type: 'arrow' },
      { id: 'wearables', icon: 'watch-outline', title: 'Linked Wearables', subtitle: 'Sync data from smartwatch & fitness bands', type: 'value', value: '1 Device' },
      { id: 'health-prefs', icon: 'leaf-outline', title: 'Health Preferences', subtitle: 'Dosha type, diet & wellness goals', type: 'arrow' },
      { id: 'insurance', icon: 'card-outline', title: 'Insurance Information', subtitle: 'Link your health insurance provider', type: 'arrow' },
    ],
  },
  {
    title: 'Health & Medical',
    rows: [
      { id: 'medical-id', icon: 'medkit-outline', title: 'Medical ID & Vitals', subtitle: 'Blood type, allergies & critical conditions', type: 'badge', badge: 'Important', badgeType: 'alert' },
      { id: 'emergency', icon: 'call-outline', title: 'Emergency Contact', subtitle: 'Who to call in case of emergency', type: 'arrow' },
      { id: 'prescriptions', icon: 'alarm-outline', title: 'Prescription Reminders', subtitle: "Get notified when it's time for medication", type: 'toggle', toggleKey: 'prescriptionReminders' },
      { id: 'ayurveda', icon: 'flower-outline', title: 'Ayurveda Consultation Prefs', subtitle: 'Language, session type & Vaidya preference', type: 'arrow' },
    ],
  },
  {
    title: 'Care Team',
    rows: [
      { id: 'doctors', icon: 'people-outline', title: 'My Doctors & Providers', subtitle: 'View and manage your care team', type: 'value', value: '3 Providers' },
      { id: 'pharmacy', icon: 'storefront-outline', title: 'Pharmacy Preferences', subtitle: 'Set default pharmacy for prescriptions', type: 'arrow' },
      { id: 'telemedicine', icon: 'videocam-outline', title: 'Telemedicine Settings', subtitle: 'Camera, mic & connection preferences', type: 'arrow' },
    ],
  },
  {
    title: 'Security',
    rows: [
      { id: 'password', icon: 'lock-closed-outline', title: 'Change Password', type: 'arrow' },
      { id: 'face-id', icon: 'scan-outline', title: 'Face ID / Biometric', subtitle: 'Use biometrics for quick login', type: 'toggle', toggleKey: 'faceId' },
      { id: 'smart-auth', icon: 'shield-half-outline', title: 'Smart Authentication', subtitle: 'Skip login within 15 sec of device unlock', type: 'toggle', toggleKey: 'smartAuth' },
      { id: 'two-fa', icon: 'key-outline', title: 'Two-Factor Authentication', type: 'badge', badge: 'Set Up', badgeType: 'neutral' },
    ],
  },
  {
    title: 'App Preferences',
    rows: [
      { id: 'notifications', icon: 'notifications-outline', title: 'Notifications', subtitle: 'Appointments, reminders & health alerts', type: 'value', value: 'On' },
      { id: 'appt-reminders', icon: 'calendar-outline', title: 'Appointment Reminders', subtitle: 'Get reminded before scheduled visits', type: 'toggle', toggleKey: 'appointmentReminders' },
      { id: 'language', icon: 'language-outline', title: 'Language', type: 'value', value: 'English' },
      { id: 'dark-mode', icon: 'moon-outline', title: 'Dark Mode', type: 'toggle', toggleKey: 'darkMode' },
      { id: 'units', icon: 'speedometer-outline', title: 'Measurement Units', type: 'value', value: 'Metric' },
    ],
  },
  {
    title: 'Privacy & Data',
    rows: [
      { id: 'data-sharing', icon: 'share-social-outline', title: 'Health Data Sharing', subtitle: 'Control which providers can view your data', type: 'arrow' },
      { id: 'provider-access', icon: 'eye-outline', title: 'Provider Access Control', subtitle: 'Manage doctor access to your records', type: 'arrow' },
      { id: 'export', icon: 'download-outline', title: 'Export My Health Data', subtitle: 'Download a copy of your records', type: 'arrow' },
      { id: 'delete', icon: 'trash-outline', title: 'Delete Account', subtitle: 'Permanently remove your account & data', type: 'destructive' },
    ],
  },
];

// ─── Export ───────────────────────────────────────────────────────────────────
export function SettingsMenu() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    faceId: true,
    smartAuth: true,
    darkMode: false,
    prescriptionReminders: true,
    appointmentReminders: true,
  });

  return (
    <View style={{ gap: 24 }}>
      {SECTIONS.map(section => (
        <SectionCard
          key={section.title}
          section={section}
          toggles={toggles}
          onToggle={(key, val) => setToggles(prev => ({ ...prev, [key]: val }))}
        />
      ))}
    </View>
  );
}
