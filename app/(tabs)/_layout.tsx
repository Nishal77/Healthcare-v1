import { Tabs } from 'expo-router';
import { Animated, Dimensions, View } from 'react-native';

import { CustomTabBar }                  from '@/components/custom-tab-bar';
import { ProfileSidebar, SIDEBAR_W }     from '@/components/profile-sidebar/profile-sidebar';
import { SidebarProvider, useSidebar }   from '@/context/sidebar-context';
import { useAuth }                       from '@/hooks/useAuth';

const SCREEN_W   = Dimensions.get('window').width;
const MAIN_SHIFT = SIDEBAR_W * 0.55;   // how far right the whole app slides

// Inner layout — reads context, applies animation to the full tab navigator
function TabsWithSidebar() {
  const { isOpen, progress, closeSidebar } = useSidebar();
  const { user } = useAuth();

  const mainTranslateX   = progress.interpolate({ inputRange: [0, 1], outputRange: [0, MAIN_SHIFT] });
  const mainScale        = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.88]       });
  const mainBorderRadius = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 20]         });

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Guest';
  const handle = user ? `@${user.email.split('@')[0]}` : '@guest';
  const email  = user?.email ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: '#111111' }}>

      {/* Sidebar — sits behind the main content, revealed as it slides right */}
      <ProfileSidebar
        visible={isOpen}
        onClose={closeSidebar}
        progress={progress}
        name={fullName}
        handle={handle}
        email={email}
      />

      {/* Entire app — tab screens + tab bar — all shift together */}
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

        <Tabs
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}>
          <Tabs.Screen name="index"   />
          <Tabs.Screen name="track"   />
          <Tabs.Screen name="learn"   />
          <Tabs.Screen name="care"    />
          <Tabs.Screen name="profile" />
          <Tabs.Screen name="explore" options={{ href: null }} />
        </Tabs>
      </Animated.View>
    </View>
  );
}

// Root layout — provides context then renders the animated shell
export default function TabLayout() {
  return (
    <SidebarProvider>
      <TabsWithSidebar />
    </SidebarProvider>
  );
}
