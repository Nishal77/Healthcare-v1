import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────
type RowType = 'arrow' | 'toggle' | 'value' | 'badge' | 'destructive';

interface Row {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  type: RowType;
  value?: string;
  badge?: string;
  badgeColor?: string;
  toggleKey?: string;
}

interface Section {
  title: string;
  rows: Row[];
}

// ─── Section definitions ─────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    title: 'Account',
    rows: [
      {
        id: 'account-details',
        icon: 'person-outline',
        iconBg: '#EFF6FF',
        iconColor: '#3B82F6',
        title: 'Account Details',
        subtitle: 'Personal info & patient ID',
        type: 'arrow',
      },
      {
        id: 'wearables',
        icon: 'watch-outline',
        iconBg: '#F0FDF4',
        iconColor: '#2C6E49',
        title: 'Linked Wearables',
        subtitle: 'Sync data from smartwatch & fitness bands',
        type: 'value',
        value: '1 Device',
      },
      {
        id: 'health-prefs',
        icon: 'leaf-outline',
        iconBg: '#FAFAF0',
        iconColor: '#65A30D',
        title: 'Health Preferences',
        subtitle: 'Dosha type, diet & wellness goals',
        type: 'arrow',
      },
      {
        id: 'insurance',
        icon: 'card-outline',
        iconBg: '#FFF7ED',
        iconColor: '#D97706',
        title: 'Insurance Information',
        subtitle: 'Link your health insurance provider',
        type: 'arrow',
      },
    ],
  },
  {
    title: 'Health & Medical',
    rows: [
      {
        id: 'medical-id',
        icon: 'medkit-outline',
        iconBg: '#FFF1F2',
        iconColor: '#F43F5E',
        title: 'Medical ID & Vitals',
        subtitle: 'Blood type, allergies & critical conditions',
        type: 'badge',
        badge: 'Important',
        badgeColor: '#F43F5E',
      },
      {
        id: 'emergency-contact',
        icon: 'call-outline',
        iconBg: '#FFF7ED',
        iconColor: '#EA580C',
        title: 'Emergency Contact',
        subtitle: 'Who to call in case of emergency',
        type: 'arrow',
      },
      {
        id: 'prescription-reminders',
        icon: 'alarm-outline',
        iconBg: '#F5F3FF',
        iconColor: '#7C3AED',
        title: 'Prescription Reminders',
        subtitle: "Get notified when it's time for medication",
        type: 'toggle',
        toggleKey: 'prescriptionReminders',
      },
      {
        id: 'ayurveda-consult',
        icon: 'flower-outline',
        iconBg: '#F0FDF4',
        iconColor: '#2C6E49',
        title: 'Ayurveda Consultation Prefs',
        subtitle: 'Language, session type & Vaidya preference',
        type: 'arrow',
      },
    ],
  },
  {
    title: 'Care Team',
    rows: [
      {
        id: 'doctors',
        icon: 'people-outline',
        iconBg: '#EFF6FF',
        iconColor: '#3B82F6',
        title: 'My Doctors & Providers',
        subtitle: 'View and manage your care team',
        type: 'value',
        value: '3 Providers',
      },
      {
        id: 'pharmacy',
        icon: 'storefront-outline',
        iconBg: '#F0FDF4',
        iconColor: '#16A34A',
        title: 'Pharmacy Preferences',
        subtitle: 'Set default pharmacy for prescriptions',
        type: 'arrow',
      },
      {
        id: 'telemedicine',
        icon: 'videocam-outline',
        iconBg: '#F5F3FF',
        iconColor: '#7C3AED',
        title: 'Telemedicine Settings',
        subtitle: 'Camera, mic & connection preferences',
        type: 'arrow',
      },
    ],
  },
  {
    title: 'Security',
    rows: [
      {
        id: 'password',
        icon: 'lock-closed-outline',
        iconBg: '#EFF6FF',
        iconColor: '#3B82F6',
        title: 'Change Password',
        type: 'arrow',
      },
      {
        id: 'face-id',
        icon: 'scan-outline',
        iconBg: '#F0FDF4',
        iconColor: '#2C6E49',
        title: 'Face ID / Biometric',
        subtitle: 'Use biometrics for quick login',
        type: 'toggle',
        toggleKey: 'faceId',
      },
      {
        id: 'smart-auth',
        icon: 'shield-half-outline',
        iconBg: '#F5F3FF',
        iconColor: '#7C3AED',
        title: 'Smart Authentication',
        subtitle: 'Skip login within 15 sec of device unlock',
        type: 'toggle',
        toggleKey: 'smartAuth',
      },
      {
        id: 'two-fa',
        icon: 'key-outline',
        iconBg: '#FFF7ED',
        iconColor: '#D97706',
        title: 'Two-Factor Authentication',
        type: 'badge',
        badge: 'Set Up',
        badgeColor: '#D97706',
      },
    ],
  },
  {
    title: 'App Preferences',
    rows: [
      {
        id: 'notifications',
        icon: 'notifications-outline',
        iconBg: '#FFF7ED',
        iconColor: '#F97316',
        title: 'Notifications',
        subtitle: 'Appointments, reminders & health alerts',
        type: 'value',
        value: 'On',
      },
      {
        id: 'appointment-reminders',
        icon: 'calendar-outline',
        iconBg: '#EFF6FF',
        iconColor: '#3B82F6',
        title: 'Appointment Reminders',
        subtitle: 'Get reminded before scheduled visits',
        type: 'toggle',
        toggleKey: 'appointmentReminders',
      },
      {
        id: 'language',
        icon: 'language-outline',
        iconBg: '#EFF6FF',
        iconColor: '#6366F1',
        title: 'Language',
        type: 'value',
        value: 'English',
      },
      {
        id: 'dark-mode',
        icon: 'moon-outline',
        iconBg: '#F5F3FF',
        iconColor: '#7C3AED',
        title: 'Dark Mode',
        type: 'toggle',
        toggleKey: 'darkMode',
      },
      {
        id: 'units',
        icon: 'speedometer-outline',
        iconBg: '#F0FDF4',
        iconColor: '#16A34A',
        title: 'Measurement Units',
        type: 'value',
        value: 'Metric',
      },
    ],
  },
  {
    title: 'Privacy & Data',
    rows: [
      {
        id: 'data-sharing',
        icon: 'share-social-outline',
        iconBg: '#F0FDF4',
        iconColor: '#2C6E49',
        title: 'Health Data Sharing',
        subtitle: 'Control which providers can view your data',
        type: 'arrow',
      },
      {
        id: 'provider-access',
        icon: 'eye-outline',
        iconBg: '#EFF6FF',
        iconColor: '#3B82F6',
        title: 'Provider Access Control',
        subtitle: 'Manage doctor access to your records',
        type: 'arrow',
      },
      {
        id: 'export',
        icon: 'download-outline',
        iconBg: '#F5F3FF',
        iconColor: '#7C3AED',
        title: 'Export My Health Data',
        subtitle: 'Download a copy of your records',
        type: 'arrow',
      },
      {
        id: 'delete',
        icon: 'trash-outline',
        iconBg: '#FFF1F2',
        iconColor: '#F43F5E',
        title: 'Delete Account',
        subtitle: 'Permanently remove your account & data',
        type: 'destructive',
      },
    ],
  },
];

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
      onPress={row.type !== 'toggle' ? undefined : undefined}
      activeOpacity={row.type === 'toggle' ? 1 : 0.6}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#F3F4F6',
      }}>

      {/* Icon */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: isDestructive ? '#FFF1F2' : row.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14,
        }}>
        <Ionicons name={row.icon} size={19} color={isDestructive ? '#F43F5E' : row.iconColor} />
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: isDestructive ? '#F43F5E' : '#111827',
            marginBottom: row.subtitle ? 2 : 0,
          }}>
          {row.title}
        </Text>
        {row.subtitle ? (
          <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 17 }}>{row.subtitle}</Text>
        ) : null}
      </View>

      {/* Right control */}
      {row.type === 'toggle' && row.toggleKey && (
        <Switch
          value={toggleValue}
          onValueChange={val => onToggle(row.toggleKey!, val)}
          trackColor={{ false: '#E5E7EB', true: '#2C6E49' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E5E7EB"
        />
      )}
      {row.type === 'value' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 14, color: '#9CA3AF', fontWeight: '500' }}>{row.value}</Text>
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        </View>
      )}
      {row.type === 'badge' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              backgroundColor: `${row.badgeColor ?? '#D97706'}18`,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: row.badgeColor ?? '#D97706' }}>
              {row.badge}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        </View>
      )}
      {(row.type === 'arrow' || row.type === 'destructive') && (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={isDestructive ? '#FECDD3' : '#D1D5DB'}
        />
      )}
    </TouchableOpacity>
  );
}

// ─── Section block ────────────────────────────────────────────────────────────
function SectionBlock({
  section,
  toggles,
  onToggle,
}: {
  section: Section;
  toggles: Record<string, boolean>;
  onToggle: (key: string, val: boolean) => void;
}) {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          color: '#9CA3AF',
          letterSpacing: 1,
          marginBottom: 10,
          marginLeft: 4,
        }}>
        {section.title.toUpperCase()}
      </Text>
      <View
        style={{
          borderRadius: 18,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#F0F0F0',
          backgroundColor: '#FFFFFF',
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
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function SettingsMenu() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    faceId: true,
    smartAuth: true,
    darkMode: false,
    prescriptionReminders: true,
    appointmentReminders: true,
  });

  function handleToggle(key: string, val: boolean) {
    setToggles(prev => ({ ...prev, [key]: val }));
  }

  return (
    <View style={{ gap: 24 }}>
      {SECTIONS.map(section => (
        <SectionBlock
          key={section.title}
          section={section}
          toggles={toggles}
          onToggle={handleToggle}
        />
      ))}
    </View>
  );
}
