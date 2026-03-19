import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccountInfoCard } from '@/components/profile/account-info-card';
import { AccountTabs } from '@/components/profile/account-tabs';
import { ProfileHeader } from '@/components/profile/profile-header';
import { SettingsMenu } from '@/components/profile/settings-menu';

type Tab = 'details' | 'records';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('details');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}>

      {/* Header: avatar, name, tier badge */}
      <ProfileHeader
        name="Nishal N Poojary"
        email="nishal@vedarogya.in"
        phone="+91 98765 43210"
        tier="Premium Member"
      />

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 20 }} />

      {/* Tab switcher */}
      <AccountTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'details' ? (
        <>
          {/* Account info card */}
          <AccountInfoCard
            patientName="Nishal N Poojary"
            patientId="VDR-2024-00142"
            appointments={12}
            healthScore={84}
          />

          {/* Settings menu */}
          <SettingsMenu />

          {/* Sign out */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                backgroundColor: '#FFF1F2',
                borderRadius: 16,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#FECDD3',
              }}>
              <Ionicons name="log-out-outline" size={20} color="#F43F5E" />
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#F43F5E' }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        /* Health Records placeholder */
        <View style={{ paddingHorizontal: 20, paddingTop: 40, alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              backgroundColor: '#F0FDF4',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="document-text-outline" size={36} color="#2C6E49" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
            Health Records
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22 }}>
            Your medical history, prescriptions and{'\n'}lab results will appear here.
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 8,
              backgroundColor: '#2C6E49',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 14,
            }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>
              Upload Records
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
