import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeelingPrompt }     from './feeling-prompt';
import { HealthStatusCard }  from './health-status-card';
import { HomeHeader }        from './home-header';
import { SearchBar }         from './search-bar';

interface HeroSectionProps {
  userName?:      string;
  watchConnected?: boolean;
  onAvatarPress?: () => void;
  onWatchPress?:  () => void;
}

export function HeroSection({ userName = 'Guest', watchConnected = false, onAvatarPress, onWatchPress }: HeroSectionProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top + 16 }}>
      <HomeHeader
        name={userName}
        hasNotification
        watchConnected={watchConnected}
        onAvatarPress={onAvatarPress}
        onWatchPress={onWatchPress}
      />
      <FeelingPrompt />
      {/* SearchBar navigates to /chat internally */}
      <SearchBar />
      {/* Health status card — below the search bar */}
      <HealthStatusCard />
      <View style={{ height: 8 }} />
    </View>
  );
}
