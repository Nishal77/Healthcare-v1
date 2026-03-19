import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeelingPrompt } from './feeling-prompt';
import { HomeHeader } from './home-header';
import { SearchBar } from './search-bar';

interface HeroSectionProps {
  userName?: string;
  onAiQuery?: (text: string) => void;
}

export function HeroSection({ userName = 'Guest', onAiQuery }: HeroSectionProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: '#FFFFFF', paddingTop: insets.top + 16 }}>
      <HomeHeader name={userName} hasNotification />
      <FeelingPrompt />
      <SearchBar onSubmit={onAiQuery} />
      <View style={{ height: 24 }} />
    </View>
  );
}
