import { useRef, useState } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthDashboard }           from '@/components/home/health-tracking/health-dashboard';
import { HeroSection }               from '@/components/home/hero-section';
import { ProfileSidebar, SIDEBAR_W } from '@/components/profile-sidebar/profile-sidebar';

const SCREEN_W  = Dimensions.get('window').width;
// How far the main card shifts right — feels like Twitter/X
const MAIN_SHIFT = SIDEBAR_W * 0.55;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 0 = closed, 1 = open — drives both sidebar and main content together
  const progress = useRef(new Animated.Value(0)).current;

  function openSidebar() {
    setSidebarOpen(true);
    Animated.spring(progress, {
      toValue:         1,
      useNativeDriver: true,
      damping:         22,
      stiffness:       200,
      mass:            1,
    }).start();
  }

  function closeSidebar() {
    Animated.spring(progress, {
      toValue:         0,
      useNativeDriver: true,
      damping:         24,
      stiffness:       220,
    }).start(() => setSidebarOpen(false));
  }

  // Main card slides right + shrinks + rounds its corners as sidebar opens
  const mainTranslateX   = progress.interpolate({ inputRange: [0, 1], outputRange: [0, MAIN_SHIFT] });
  const mainScale        = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.88]       });
  const mainBorderRadius = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 20]         });

  return (
    <View style={{ flex: 1, backgroundColor: '#111111' }}>

      {/* Sidebar sits behind the main content; revealed as main slides right */}
      <ProfileSidebar
        visible={sidebarOpen}
        onClose={closeSidebar}
        progress={progress}
        name="Nishal N Poojary"
        email="nishal@vedarogya.app"
      />

      {/* Main content — animates right on sidebar open */}
      <Animated.View
        style={{
          flex:            1,
          backgroundColor: '#FFFFFF',
          transform:       [{ translateX: mainTranslateX }, { scale: mainScale }],
          borderRadius:    mainBorderRadius,
          overflow:        'hidden',
          shadowColor:     '#000',
          shadowOffset:    { width: -4, height: 0 },
          shadowOpacity:   0.22,
          shadowRadius:    20,
          elevation:       20,
        }}>

        {/* Dynamic Island / status bar cover */}
        <View
          style={{
            position:        'absolute',
            top: 0, left: 0, right: 0,
            height:          insets.top,
            backgroundColor: '#FFFFFF',
            zIndex:          100,
          }}
          pointerEvents="none"
        />

        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{ top: insets.top }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          scrollEnabled={!sidebarOpen}>

          <HeroSection
            userName="Nishal N Poojary"
            onAvatarPress={openSidebar}
          />
          <HealthDashboard />
        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
}
