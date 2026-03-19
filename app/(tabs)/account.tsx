import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile/profile-header';
import { SettingsMenu } from '@/components/profile/settings-menu';
import { UpgradeBanner } from '@/components/profile/upgrade-banner';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}>

      <ProfileHeader
        name="Nishal N Poojary"
        handle="@nishal.poojary"
        email="nishal@vedarogya.in"
        tier="Premium Member"
      />

      {/* Thin divider */}
      <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 20, marginBottom: 20 }} />

      <UpgradeBanner />

      <View style={{ height: 24 }} />

      <SettingsMenu />
    </ScrollView>
  );
}
