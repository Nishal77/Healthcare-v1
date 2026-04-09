/**
 * WatchConnectSheet
 * Premium bottom sheet triggered by the watch icon in HomeHeader.
 * Contains all BLE connection steps — idle → scanning → devices → connected.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ConnectionStep, ScannedDevice } from '../../src/health/types';

// ─── Sub-components ───────────────────────────────────────────────────────────

function IconTile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <View style={{
      width: 52, height: 52, borderRadius: 16,
      backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
    }}>
      {children}
    </View>
  );
}

function DarkBtn({ onPress, disabled, icon, label }: {
  onPress: () => void; disabled?: boolean; icon: string; label: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={{
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             8,
        backgroundColor: disabled ? '#D1D5DB' : '#0D1117',
        borderRadius:    18,
        paddingVertical: 16,
        shadowColor:     '#0D1117',
        shadowOffset:    { width: 0, height: 6 },
        shadowOpacity:   disabled ? 0 : 0.25,
        shadowRadius:    14,
        elevation:       disabled ? 0 : 6,
      }}>
      <Ionicons name={icon as any} size={16} color="#FFFFFF" />
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.2 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function GhostBtn({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }}>{label}</Text>
    </TouchableOpacity>
  );
}

function signalBars(rssi: number) {
  if (rssi >= -55) return 4;
  if (rssi >= -67) return 3;
  if (rssi >= -80) return 2;
  return 1;
}

function SignalIcon({ rssi }: { rssi: number }) {
  const bars = signalBars(rssi);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={{
          width: 3, height: 3 + i * 3, borderRadius: 2,
          backgroundColor: i <= bars ? '#2C6E49' : '#E5E7EB',
        }} />
      ))}
    </View>
  );
}

// Animated scan ripple
function ScanRipple() {
  const rings = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const anims = rings.map((r, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 450),
        Animated.timing(r, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(r, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]))
    );
    Animated.parallel(anims).start();
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={{ width: 90, height: 90, alignItems: 'center', justifyContent: 'center' }}>
      {rings.map((r, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', width: 90, height: 90, borderRadius: 45,
          borderWidth: 1.5, borderColor: '#2C6E49',
          opacity:   r.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.35, 0] }),
          transform: [{ scale: r.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }) }],
        }} />
      ))}
      <IconTile bg="#F0F7F3">
        <Ionicons name="watch-outline" size={26} color="#2C6E49" />
      </IconTile>
    </View>
  );
}

// Animated progress bar for connecting state
function ConnectingBar() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 1100, useNativeDriver: false }),
      Animated.timing(anim, { toValue: 0, duration: 350, useNativeDriver: false }),
    ])).start();
    return () => anim.stopAnimation();
  }, []);
  return (
    <View style={{ width: '100%', height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
      <Animated.View style={{
        height: 3, borderRadius: 2, backgroundColor: '#2C6E49',
        width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
      }} />
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface WatchConnectSheetProps {
  visible:           boolean;
  onClose:           () => void;
  connectionStep:    ConnectionStep;
  scannedDevices:    ScannedDevice[];
  connectedDevice:   ScannedDevice | null;
  onStartScan:       () => void;
  onSelectDevice:    (d: ScannedDevice) => void;
  onEnableBluetooth: () => void;
  onRetry:           () => void;
  error?:            string | null;
}

// ─── Sheet ────────────────────────────────────────────────────────────────────

export function WatchConnectSheet({
  visible, onClose,
  connectionStep, scannedDevices, connectedDevice,
  onStartScan, onSelectDevice, onEnableBluetooth, onRetry, error,
}: WatchConnectSheetProps) {
  const insets  = useSafeAreaInsets();
  const slideY  = useRef(new Animated.Value(600)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: 0, useNativeDriver: true,
          damping: 22, stiffness: 220, mass: 0.9,
        }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: 600, duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>

      {/* Backdrop */}
      <Animated.View style={{
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', opacity,
      }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        transform: [{ translateY: slideY }],
        backgroundColor:      '#FFFFFF',
        borderTopLeftRadius:  32,
        borderTopRightRadius: 32,
        paddingBottom:        insets.bottom + 24,
        shadowColor:          '#000',
        shadowOffset:         { width: 0, height: -8 },
        shadowOpacity:        0.14,
        shadowRadius:         28,
        elevation:            30,
      }}>

        {/* Drag handle */}
        <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 4 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0E5' }} />
        </View>

        {/* Sheet header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24,
        }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0D1117', letterSpacing: -0.5 }}>
              Connect Watch
            </Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 3 }}>
              Sync live biometrics · Heart Rate · SpO₂ · HRV
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: '#F3F4F6',
              alignItems: 'center', justifyContent: 'center',
            }}>
            <Ionicons name="close" size={17} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* ── Step content ─────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 24, gap: 16 }}>

          {/* Dev build required */}
          {connectionStep === 'dev_build_required' && (
            <>
              <View style={{ alignItems: 'center', gap: 14 }}>
                <IconTile bg="#FEF8EE">
                  <Ionicons name="construct-outline" size={26} color="#C4860A" />
                </IconTile>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#0D1117', textAlign: 'center' }}>
                  Dev Build Required
                </Text>
                <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
                  Bluetooth isn't available in Expo Go. Run{' '}
                  <Text style={{ fontFamily: 'monospace', color: '#0D1117', fontWeight: '600' }}>
                    {Platform.OS === 'ios' ? 'pnpm ios' : 'pnpm android'}
                  </Text>
                  {' '}to unlock watch sync.
                </Text>
              </View>
              <View style={{ backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, gap: 10 }}>
                {[
                  'Real BLE device scanning',
                  'Live heart rate, SpO₂ & HRV',
                  Platform.OS === 'ios' ? 'Apple HealthKit sync' : 'Google Health Connect',
                ].map(t => (
                  <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="checkmark" size={12} color="#16A34A" />
                    </View>
                    <Text style={{ fontSize: 13, color: '#374151', fontWeight: '500' }}>{t}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Idle */}
          {connectionStep === 'idle' && (
            <>
              <View style={{ alignItems: 'center', gap: 16, paddingVertical: 8 }}>
                <IconTile bg="#F0F7F3">
                  <Ionicons name="watch-outline" size={28} color="#2C6E49" />
                </IconTile>
                <View style={{ alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#0D1117' }}>
                    No watch connected
                  </Text>
                  <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 19 }}>
                    Scan for nearby Bluetooth devices to pull live biometrics into your Ayurvedic health profile
                  </Text>
                </View>
                {/* Metric pills */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { color: '#2C6E49', label: 'Heart Rate' },
                    { color: '#0B6E8B', label: 'SpO₂' },
                    { color: '#C4860A', label: 'HRV' },
                  ].map(m => (
                    <View key={m.label} style={{
                      flexDirection: 'row', alignItems: 'center', gap: 5,
                      backgroundColor: '#F9FAFB', borderRadius: 20,
                      paddingHorizontal: 12, paddingVertical: 6,
                      borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
                    }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: m.color }} />
                      <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600' }}>{m.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <DarkBtn onPress={onStartScan} icon="bluetooth-outline" label="Scan for Devices" />
            </>
          )}

          {/* Checking BT */}
          {connectionStep === 'checking_bluetooth' && (
            <View style={{ alignItems: 'center', paddingVertical: 28, gap: 16 }}>
              <ActivityIndicator size="large" color="#2C6E49" />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#0D1117' }}>Checking Bluetooth…</Text>
            </View>
          )}

          {/* Bluetooth off */}
          {connectionStep === 'bluetooth_off' && (
            <>
              <View style={{ alignItems: 'center', gap: 14, paddingVertical: 8 }}>
                <IconTile bg="#FEF3F3">
                  <Ionicons name="bluetooth-outline" size={26} color="#DC2626" />
                </IconTile>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#0D1117' }}>Bluetooth is Off</Text>
                <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 19 }}>
                  Turn on Bluetooth to scan for your watch
                </Text>
              </View>
              <DarkBtn onPress={onEnableBluetooth} icon="settings-outline" label="Open Bluetooth Settings" />
              <GhostBtn onPress={onRetry} label="Cancel" />
            </>
          )}

          {/* Scanning */}
          {connectionStep === 'scanning' && (
            <View style={{ alignItems: 'center', gap: 20, paddingVertical: 12 }}>
              <ScanRipple />
              <View style={{ alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0D1117' }}>Scanning for watches…</Text>
                <Text style={{ fontSize: 13, color: '#9CA3AF' }}>Keep your watch awake and nearby</Text>
              </View>
              <GhostBtn onPress={onRetry} label="Cancel" />
            </View>
          )}

          {/* Devices found */}
          {connectionStep === 'devices_found' && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0D1117' }}>
                  {scannedDevices.length} device{scannedDevices.length !== 1 ? 's' : ''} found
                </Text>
                <TouchableOpacity
                  onPress={onStartScan}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="refresh-outline" size={13} color="#2C6E49" />
                  <Text style={{ fontSize: 12, color: '#2C6E49', fontWeight: '600' }}>Rescan</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                <View style={{ gap: 10 }}>
                  {scannedDevices.map(device => (
                    <TouchableOpacity
                      key={device.id}
                      onPress={() => onSelectDevice(device)}
                      activeOpacity={0.82}
                      style={{
                        flexDirection: 'row', alignItems: 'center', gap: 14,
                        backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14,
                        borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
                      }}>
                      <IconTile bg="#F0F7F3">
                        <Ionicons name="watch" size={22} color="#2C6E49" />
                      </IconTile>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#0D1117', letterSpacing: -0.2 }}>
                          {device.name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <SignalIcon rssi={device.rssi} />
                          <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>
                            {device.rssi} dBm
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        backgroundColor: '#0D1117', borderRadius: 12,
                        paddingHorizontal: 14, paddingVertical: 8,
                      }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Connect</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <GhostBtn onPress={onRetry} label="Cancel" />
            </>
          )}

          {/* Connecting */}
          {connectionStep === 'connecting_to_device' && connectedDevice && (
            <View style={{ alignItems: 'center', gap: 18, paddingVertical: 16 }}>
              <IconTile bg="#F0F7F3">
                <ActivityIndicator size="small" color="#2C6E49" />
              </IconTile>
              <View style={{ alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0D1117' }}>
                  Connecting to {connectedDevice.name}…
                </Text>
                <Text style={{ fontSize: 13, color: '#9CA3AF' }}>Keep your watch close</Text>
              </View>
              <ConnectingBar />
            </View>
          )}

          {/* Reading health */}
          {connectionStep === 'reading_health' && (
            <View style={{ alignItems: 'center', paddingVertical: 28, gap: 16 }}>
              <ActivityIndicator size="large" color="#2C6E49" />
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#0D1117' }}>Reading health data…</Text>
            </View>
          )}

          {/* Failed */}
          {connectionStep === 'failed' && (
            <>
              <View style={{ alignItems: 'center', gap: 14, paddingVertical: 8 }}>
                <IconTile bg="#FEF3F3">
                  <Ionicons name="close-circle-outline" size={28} color="#DC2626" />
                </IconTile>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#0D1117' }}>Connection Failed</Text>
                {error && (
                  <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', lineHeight: 19 }}>
                    {error}
                  </Text>
                )}
              </View>
              <DarkBtn onPress={onRetry} icon="refresh-outline" label="Try Again" />
              <GhostBtn onPress={onClose} label="Dismiss" />
            </>
          )}

        </View>
      </Animated.View>
    </Modal>
  );
}
