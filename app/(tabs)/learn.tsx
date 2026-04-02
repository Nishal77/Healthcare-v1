import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeaturedLessonCard } from '@/components/learn/featured/featured-lesson-card';
import { LearnHeader } from '@/components/learn/learn-header';
import { RemediesSection } from '@/components/learn/remedies/remedies-section';
import { TipsSection } from '@/components/learn/tips/tips-section';
import { YogaSection } from '@/components/learn/yoga/yoga-section';

export default function LearnTab() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F5EC' }}>

      {/* Fixed white cover behind the Dynamic Island / status bar */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: '#F9F5EC',
          zIndex: 100,
        }}
        pointerEvents="none"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 110,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>

        <LearnHeader />
        <FeaturedLessonCard />
        <YogaSection />
        <RemediesSection />
        <TipsSection />

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}
