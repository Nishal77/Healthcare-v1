import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeelingPrompt } from './feeling-prompt';
import { HomeHeader } from './home-header';
import { SearchBar } from './search-bar';

interface HeroSectionProps {
  userName?: string;
}

export function HeroSection({ userName = 'Sajibur Rahman' }: HeroSectionProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-blue-50 overflow-hidden"
      style={{ paddingTop: insets.top + 8, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>

      {/* ── Decorative blobs ─────────────────────────────────── */}
      <View
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-100"
        style={{ opacity: 0.6 }}
      />
      <View
        className="absolute top-24 -right-6 w-28 h-28 rounded-full bg-blue-200"
        style={{ opacity: 0.35 }}
      />
      <View
        className="absolute -top-6 left-32 w-20 h-20 rounded-full bg-sky-200"
        style={{ opacity: 0.3 }}
      />

      {/* ── Content ──────────────────────────────────────────── */}
      <HomeHeader name={userName} hasNotification />
      <FeelingPrompt />
      <SearchBar />

      {/* Bottom breathing room */}
      <View className="h-6" />
    </View>
  );
}
