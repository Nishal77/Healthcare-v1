import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileHeader } from '@/components/profile/profile-header';
import { SettingsMenu } from '@/components/profile/settings-menu';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      {/*
       * Fixed white bar that sits on top of the scroll content.
       * Covers the Dynamic Island / status bar so nothing bleeds through
       * when the user scrolls upward.
       */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
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
          name="Nishal N Poojary"
          handle="@nishal.poojary"
          email="nishal@vedarogya.in"
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
