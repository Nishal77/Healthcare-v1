import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthDashboard }     from '@/components/home/health-tracking/health-dashboard';
import { HeroSection }         from '@/components/home/hero-section';
import { WatchConnectSheet }   from '@/components/home/watch-connect-sheet';
import { useSidebar }          from '@/context/sidebar-context';
import { useWatchBluetooth }   from '@/hooks/useWatchBluetooth';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { openSidebar } = useSidebar();
  const ble = useWatchBluetooth();

  const [watchSheetOpen, setWatchSheetOpen] = useState(false);
  const isConnected = ble.connectionState === 'connected';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

      {/* Dynamic Island / status bar cover */}
      <View
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: insets.top, backgroundColor: '#FFFFFF', zIndex: 100,
        }}
        pointerEvents="none"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{ top: insets.top }}
        keyboardShouldPersistTaps="handled"
        bounces={false}>

        <HeroSection
          userName="Nishal N Poojary"
          onAvatarPress={openSidebar}
          watchConnected={isConnected}
          onWatchPress={() => setWatchSheetOpen(true)}
        />
        <HealthDashboard />
      </ScrollView>

      {/* Watch connect bottom sheet — opens from header watch icon */}
      <WatchConnectSheet
        visible={watchSheetOpen}
        onClose={() => setWatchSheetOpen(false)}
        connectionStep={ble.connectionStep}
        scannedDevices={ble.scannedDevices}
        connectedDevice={ble.connectedDevice}
        onStartScan={ble.startScan}
        onSelectDevice={ble.selectDevice}
        onEnableBluetooth={ble.enableBluetooth}
        onRetry={ble.disconnect}
        error={ble.error}
      />
    </View>
  );
}
