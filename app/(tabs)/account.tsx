import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile/profile-header';
import { SettingsMenu } from '@/components/profile/settings-menu';
import { UpgradeBanner } from '@/components/profile/upgrade-banner';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}>

      {/* White card behind header */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 3,
          marginBottom: 20,
        }}>
        <ProfileHeader
          name="Nishal N Poojary"
          handle="@nishal.poojary"
          email="nishal@vedarogya.in"
          tier="Premium Member"
        />
      </View>

      {/* Upgrade banner */}
      <UpgradeBanner />

      {/* Spacer */}
      <View style={{ height: 20 }} />

      {/* Settings sections */}
      <SettingsMenu />
    </ScrollView>
  );
}
