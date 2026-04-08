import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeelingPrompt }     from './feeling-prompt';
import { HealthStatusCard }  from './health-status-card';
import { HomeHeader }        from './home-header';
import { SearchBar }         from './search-bar';

interface HeroSectionProps {
  userName?: string;
  onAvatarPress?: () => void;
}

export function HeroSection({ userName = 'Guest', onAvatarPress }: HeroSectionProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top + 16 }}>
      <HomeHeader name={userName} hasNotification onAvatarPress={onAvatarPress} />
      <FeelingPrompt />
      {/* SearchBar navigates to /chat internally */}
      <SearchBar />
      {/* Health status card — below the search bar */}
      <HealthStatusCard />
      <View style={{ height: 8 }} />
    </View>
  );
}
