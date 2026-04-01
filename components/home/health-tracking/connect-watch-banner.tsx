import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ConnectionStep, ScannedDevice } from '../../../src/health/types';

interface ConnectWatchBannerProps {
  connectionStep: ConnectionStep;
  scannedDevices: ScannedDevice[];
  connectedDevice: ScannedDevice | null;
  onStartScan: () => void;
  onSelectDevice: (d: ScannedDevice) => void;
  onEnableBluetooth: () => void;
  onRetry: () => void;
  error?: string | null;
}

// ── Small helpers ────────────────────────────────────────────────────────────

function IconTile({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </View>
  );
}

function DarkBtn({ onPress, disabled, children }: { onPress: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={{ backgroundColor: disabled ? '#9CA3AF' : '#0F1923', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
      {children}
    </TouchableOpacity>
  );
}

function GhostBtn({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', paddingTop: 2 }}>
      <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>{label}</Text>
    </TouchableOpacity>
  );
}

// RSSI → 1-4 bar count
function signalBars(rssi: number): number {
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
        <View key={i} style={{ width: 3, height: 3 + i * 3, borderRadius: 2, backgroundColor: i <= bars ? '#2C6E49' : '#E5E7EB' }} />
      ))}
    </View>
  );
}

// ── Animated scan ripple ─────────────────────────────────────────────────────
function ScanRipple() {
  const rings = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const anims = rings.map((r, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 450),
        Animated.timing(r, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(r, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])),
    );
    Animated.parallel(anims).start();
    return () => anims.forEach(a => a.stop());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
      {rings.map((r, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', width: 80, height: 80, borderRadius: 40,
          borderWidth: 1.5, borderColor: '#2C6E49',
          opacity: r.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.4, 0] }),
          transform: [{ scale: r.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
        }} />
      ))}
      <IconTile bg="#F0F7F3"><Ionicons name="watch-outline" size={22} color="#2C6E49" /></IconTile>
    </View>
  );
}

// ── Progress bar for connecting ───────────────────────────────────────────────
function ConnectingBar() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 1100, useNativeDriver: false }),
      Animated.timing(anim, { toValue: 0, duration: 350, useNativeDriver: false }),
    ])).start();
    return () => anim.stopAnimation();
  }, [anim]);
  return (
    <View style={{ width: '100%', height: 3, backgroundColor: '#F0EFEC', borderRadius: 2, overflow: 'hidden' }}>
      <Animated.View style={{ height: 3, borderRadius: 2, backgroundColor: '#2C6E49', width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
    </View>
  );
}

// ── Main Banner ───────────────────────────────────────────────────────────────
export function ConnectWatchBanner({
  connectionStep,
  scannedDevices,
  connectedDevice,
  onStartScan,
  onSelectDevice,
  onEnableBluetooth,
  onRetry,
  error,
}: ConnectWatchBannerProps) {
  return (
    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#ECEAE6', gap: 16 }}>

      {/* ── Expo Go: dev build required ─────────────────────── */}
      {connectionStep === 'dev_build_required' && (
        <>
          <View style={{ alignItems: 'center', gap: 10, paddingTop: 4 }}>
            <IconTile bg="#FEF8EE"><Ionicons name="construct-outline" size={22} color="#C4860A" /></IconTile>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923', textAlign: 'center', letterSpacing: -0.3 }}>
              Dev Build Required
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500', textAlign: 'center', lineHeight: 18 }}>
              Bluetooth scanning is not available in Expo Go.{'\n'}
              Run{' '}
              <Text style={{ fontFamily: 'monospace', color: '#0F1923' }}>
                {Platform.OS === 'ios' ? 'pnpm ios' : 'pnpm android'}
              </Text>
              {' '}to build the dev client and unlock live watch sync.
            </Text>
          </View>
          <View style={{ backgroundColor: '#F9F9F8', borderRadius: 12, padding: 12, gap: 6 }}>
            {[
              { icon: 'checkmark-circle-outline', color: '#2C6E49', text: 'Real BLE device scanning' },
              { icon: 'checkmark-circle-outline', color: '#2C6E49', text: 'Live heart rate, SpO₂, HRV' },
              {
                icon: 'checkmark-circle-outline',
                color: '#2C6E49',
                text: Platform.OS === 'ios' ? 'Apple HealthKit sync' : 'Google Health Connect sync',
              },
            ].map(r => (
              <View key={r.text} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name={r.icon as 'checkmark-circle-outline'} size={14} color={r.color} />
                <Text style={{ fontSize: 12, color: '#4B5563', fontWeight: '500' }}>{r.text}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ── Idle: initial prompt ────────────────────────────── */}
      {connectionStep === 'idle' && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <IconTile bg="#F0F7F3"><Ionicons name="watch-outline" size={22} color="#2C6E49" /></IconTile>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923', letterSpacing: -0.3 }}>Connect your watch</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3, fontWeight: '500', lineHeight: 17 }}>
                Scan for nearby Bluetooth devices and pull live biometrics
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {[{ c: '#2C6E49', l: 'Heart Rate' }, { c: '#0B6E8B', l: 'SpO₂' }, { c: '#C4860A', l: 'HRV' }].map(m => (
              <View key={m.l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: m.c, opacity: 0.8 }} />
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '500' }}>{m.l}</Text>
              </View>
            ))}
          </View>
          <DarkBtn onPress={onStartScan}>
            <Ionicons name="bluetooth-outline" size={15} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>Scan for Devices</Text>
          </DarkBtn>
        </>
      )}

      {/* ── Checking BT ─────────────────────────────────────── */}
      {connectionStep === 'checking_bluetooth' && (
        <View style={{ alignItems: 'center', paddingVertical: 14, gap: 12 }}>
          <ActivityIndicator size="large" color="#2C6E49" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F1923' }}>Checking Bluetooth…</Text>
        </View>
      )}

      {/* ── Bluetooth off ───────────────────────────────────── */}
      {connectionStep === 'bluetooth_off' && (
        <>
          <View style={{ alignItems: 'center', gap: 10, paddingTop: 4 }}>
            <IconTile bg="#FEF3F3"><Ionicons name="bluetooth-outline" size={24} color="#B83A3A" /></IconTile>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923', letterSpacing: -0.3 }}>Bluetooth is Off</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500', textAlign: 'center', lineHeight: 18 }}>
              Turn on Bluetooth to scan for your watch
            </Text>
          </View>
          <DarkBtn onPress={onEnableBluetooth}>
            <Ionicons name="settings-outline" size={15} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>Open Bluetooth Settings</Text>
          </DarkBtn>
          <GhostBtn onPress={onRetry} label="Cancel" />
        </>
      )}

      {/* ── Scanning ────────────────────────────────────────── */}
      {connectionStep === 'scanning' && (
        <View style={{ alignItems: 'center', gap: 14, paddingVertical: 8 }}>
          <ScanRipple />
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1923' }}>Scanning for watches…</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>Keep your watch awake and nearby</Text>
          </View>
          <GhostBtn onPress={onRetry} label="Cancel" />
        </View>
      )}

      {/* ── Devices found ───────────────────────────────────── */}
      {connectionStep === 'devices_found' && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1923', letterSpacing: -0.2 }}>
              {scannedDevices.length} device{scannedDevices.length !== 1 ? 's' : ''} found
            </Text>
            <TouchableOpacity onPress={onStartScan} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="refresh-outline" size={13} color="#2C6E49" />
              <Text style={{ fontSize: 11, color: '#2C6E49', fontWeight: '600' }}>Rescan</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled>
            <View style={{ gap: 8 }}>
              {scannedDevices.map(device => (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => onSelectDevice(device)}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    backgroundColor: '#F9F9F8',
                    borderRadius: 14,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ECEAE6',
                  }}>
                  <IconTile bg="#F0F7F3">
                    <Ionicons name="watch" size={20} color="#2C6E49" />
                  </IconTile>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1923', letterSpacing: -0.2 }}>{device.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <SignalIcon rssi={device.rssi} />
                      <Text style={{ fontSize: 10, color: '#9CA3AF', fontWeight: '500' }}>
                        {device.rssi} dBm
                      </Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: '#0F1923', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF' }}>Connect</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <GhostBtn onPress={onRetry} label="Cancel" />
        </>
      )}

      {/* ── Connecting ──────────────────────────────────────── */}
      {connectionStep === 'connecting_to_device' && connectedDevice && (
        <View style={{ alignItems: 'center', gap: 14, paddingVertical: 8 }}>
          <IconTile bg="#F0F7F3"><ActivityIndicator size="small" color="#2C6E49" /></IconTile>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1923' }}>
              Connecting to {connectedDevice.name}…
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>Keep your watch close</Text>
          </View>
          <ConnectingBar />
        </View>
      )}

      {/* ── Reading health data ──────────────────────────────── */}
      {connectionStep === 'reading_health' && (
        <View style={{ alignItems: 'center', gap: 12, paddingVertical: 8 }}>
          <ActivityIndicator size="large" color="#2C6E49" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F1923' }}>Reading health data…</Text>
        </View>
      )}

      {/* ── Failed ──────────────────────────────────────────── */}
      {connectionStep === 'failed' && (
        <>
          <View style={{ alignItems: 'center', gap: 10, paddingTop: 4 }}>
            <IconTile bg="#FEF3F3"><Ionicons name="close-circle-outline" size={26} color="#B83A3A" /></IconTile>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923' }}>Connection Failed</Text>
            {error ? (
              <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500', textAlign: 'center', lineHeight: 18 }}>
                {error}
              </Text>
            ) : null}
          </View>
          <DarkBtn onPress={onRetry}>
            <Ionicons name="refresh-outline" size={15} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>Try Again</Text>
          </DarkBtn>
        </>
      )}

    </View>
  );
}
