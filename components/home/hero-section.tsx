import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeelingPrompt } from './feeling-prompt';
import { HomeHeader }    from './home-header';
import { SearchBar }     from './search-bar';

interface HeroSectionProps {
  userName?: string;
}

export function HeroSection({ userName = 'Guest' }: HeroSectionProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top + 16 }}>
      <HomeHeader name={userName} hasNotification />
      <FeelingPrompt />
      {/* SearchBar navigates to /chat internally — no prop needed */}
      <SearchBar />
      <View style={{ height: 24 }} />
    </View>
  );
}
