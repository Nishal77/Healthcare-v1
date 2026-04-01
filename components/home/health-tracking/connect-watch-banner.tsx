import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ConnectionStep } from '../../../src/health/types';

interface ConnectWatchBannerProps {
  connectionStep: ConnectionStep;
  deviceName: string | null;
  onStartScan: () => void;
  onConnectToDevice: () => void;
  onEnableBluetooth: () => void;
  onRetry: () => void;
}

function ScanRipple() {
  const r1 = useRef(new Animated.Value(0)).current;
  const r2 = useRef(new Animated.Value(0)).current;
  const r3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 1400, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      );
    Animated.parallel([pulse(r1, 0), pulse(r2, 460), pulse(r3, 920)]).start();
    return () => { r1.stopAnimation(); r2.stopAnimation(); r3.stopAnimation(); };
  }, [r1, r2, r3]);

  const ring = (anim: Animated.Value) => ({
    position: 'absolute' as const,
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: '#2C6E49',
    opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.5, 0] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }) }],
  });

  return (
    <View style={{ width: 76, height: 76, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={ring(r1)} />
      <Animated.View style={ring(r2)} />
      <Animated.View style={ring(r3)} />
      <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#F0F7F3', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <Ionicons name="watch-outline" size={22} color="#2C6E49" />
      </View>
    </View>
  );
}

function SignalBars({ strength = 3 }: { strength?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
      {[1, 2, 3, 4].map(i => (
        <View
          key={i}
          style={{
            width: 3,
            height: 4 + i * 3,
            borderRadius: 2,
            backgroundColor: i <= strength ? '#2C6E49' : '#E5E7EB',
          }}
        />
      ))}
    </View>
  );
}

function DarkButton({ onPress, children, disabled }: { onPress: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={{
        backgroundColor: disabled ? '#9CA3AF' : '#0F1923',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
      }}>
      {children}
    </TouchableOpacity>
  );
}

export function ConnectWatchBanner({
  connectionStep,
  deviceName,
  onStartScan,
  onConnectToDevice,
  onEnableBluetooth,
  onRetry,
}: ConnectWatchBannerProps) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ECEAE6',
        gap: 16,
      }}>

      {/* ── IDLE: initial prompt ─────────────────────────── */}
      {connectionStep === 'idle' && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#F0F7F3', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="watch-outline" size={22} color="#2C6E49" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923', letterSpacing: -0.3 }}>Connect your watch</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3, fontWeight: '500', lineHeight: 17 }}>
                Sync live biometrics for real-time Dosha insights
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {[
              { color: '#2C6E49', label: 'Heart Rate' },
              { color: '#0B6E8B', label: 'SpO₂' },
              { color: '#C4860A', label: 'HRV' },
            ].map(m => (
              <View key={m.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: m.color, opacity: 0.7 }} />
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '500' }}>{m.label}</Text>
              </View>
            ))}
          </View>

          <DarkButton onPress={onStartScan}>
            <Ionicons name="bluetooth-outline" size={16} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>Sync via Health Connect</Text>
          </DarkButton>
        </>
      )}

      {/* ── CHECKING BLUETOOTH ──────────────────────────── */}
      {connectionStep === 'checking_bluetooth' && (
        <View style={{ alignItems: 'center', paddingVertical: 12, gap: 12 }}>
          <ActivityIndicator size="large" color="#2C6E49" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F1923' }}>Checking Bluetooth…</Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>Looking for nearby devices</Text>
        </View>
      )}

      {/* ── BLUETOOTH OFF ───────────────────────────────── */}
      {connectionStep === 'bluetooth_off' && (
        <>
          <View style={{ alignItems: 'center', gap: 10, paddingTop: 4 }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#FEF3F3', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="bluetooth-outline" size={24} color="#B83A3A" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923', letterSpacing: -0.3 }}>Bluetooth is Off</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500', textAlign: 'center', lineHeight: 18 }}>
              Enable Bluetooth to scan and connect{'\n'}to your smartwatch
            </Text>
          </View>

          <DarkButton onPress={onEnableBluetooth}>
            <Ionicons name="settings-outline" size={15} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>Turn On Bluetooth</Text>
          </DarkButton>

          <TouchableOpacity onPress={onRetry} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>Cancel</Text>
          </TouchableOpacity>
        </>
      )}

      {/* ── SCANNING ────────────────────────────────────── */}
      {connectionStep === 'scanning' && (
        <View style={{ alignItems: 'center', gap: 14, paddingVertical: 8 }}>
          <ScanRipple />
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1923' }}>Scanning for devices…</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>Make sure your watch is nearby and awake</Text>
          </View>
          <TouchableOpacity onPress={onRetry}>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── DEVICE FOUND ────────────────────────────────── */}
      {connectionStep === 'device_found' && deviceName && (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#F0F7F3', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="watch" size={22} color="#2C6E49" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923', letterSpacing: -0.3 }}>{deviceName}</Text>
                <View style={{ backgroundColor: '#F0F7F3', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#2C6E49', letterSpacing: 0.5 }}>FOUND</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <SignalBars strength={3} />
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500' }}>Strong signal</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#F0EFEC' }} />

          <DarkButton onPress={onConnectToDevice}>
            <Ionicons name="link-outline" size={16} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>Connect Now</Text>
          </DarkButton>

          <TouchableOpacity onPress={onRetry} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>Scan again</Text>
          </TouchableOpacity>
        </>
      )}

      {/* ── CONNECTING TO DEVICE ────────────────────────── */}
      {connectionStep === 'connecting_to_device' && deviceName && (
        <View style={{ alignItems: 'center', gap: 14, paddingVertical: 8 }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#F0F7F3', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="small" color="#2C6E49" />
          </View>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F1923' }}>
              Connecting to {deviceName}…
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500' }}>
              Keep your watch close
            </Text>
          </View>
          <ConnectingProgressBar />
        </View>
      )}

      {/* ── FAILED ──────────────────────────────────────── */}
      {connectionStep === 'failed' && (
        <>
          <View style={{ alignItems: 'center', gap: 10, paddingTop: 4 }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#FEF3F3', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="close-circle-outline" size={26} color="#B83A3A" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923' }}>Connection Failed</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '500', textAlign: 'center' }}>
              Could not reach your watch.{'\n'}Make sure it is awake and nearby.
            </Text>
          </View>

          <DarkButton onPress={onRetry}>
            <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.2 }}>Try Again</Text>
          </DarkButton>
        </>
      )}
    </View>
  );
}

function ConnectingProgressBar() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]),
    ).start();
    return () => anim.stopAnimation();
  }, [anim]);

  return (
    <View style={{ width: '100%', height: 3, backgroundColor: '#F0EFEC', borderRadius: 2, overflow: 'hidden' }}>
      <Animated.View
        style={{
          height: 3,
          backgroundColor: '#2C6E49',
          borderRadius: 2,
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
}
