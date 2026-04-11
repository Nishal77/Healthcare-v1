import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile/profile-header';
import { SettingsMenu }  from '@/components/profile/settings-menu';
import { useAuth }       from '@/hooks/useAuth';

export default function AccountScreen() {
  const insets      = useSafeAreaInsets();
  const { user }    = useAuth();

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Guest';

  // Derive a handle from the email prefix (e.g. "nishal.poojary@gmail.com" → "@nishal.poojary")
  const handle = user
    ? `@${user.email.split('@')[0]}`
    : '@guest';

  const email = user?.email ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      {/* Fixed white bar covers the Dynamic Island on scroll */}
      <View
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: insets.top,
          backgroundColor: '#FFFFFF',
          zIndex: 100,
        }}
        pointerEvents="none"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ top: insets.top }}
        bounces={false}>

        <ProfileHeader
          name={fullName}
          handle={handle}
          email={email}
          tier="Premium Member"
        />

        {/* Thin divider */}
        <View style={{ height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 20, marginBottom: 20 }} />

        {/* <UpgradeBanner /> */}

        <View style={{ height: 8 }} />

        <SettingsMenu />
      </ScrollView>
    </View>
  );
}
