/**
 * Splash Screen
 *
 * First screen the user sees when opening the app.
 * • Animated logo fade + scale
 * • After 2.2 s → redirects based on session:
 *     - Logged in  → /(tabs)/
 *     - Seen onboarding → /(auth)/login
 *     - First time → /onboarding
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/hooks/useAuth';

const KEY_SEEN_ONBOARDING = 'vedarogya_seen_onboarding';

export default function SplashScreen() {
  const router  = useRouter();
  const { isSignedIn, isLoading } = useAuth();

  // Animation values
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.82)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue:         1,
        duration:        700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue:         1,
        damping:         18,
        stiffness:       160,
        useNativeDriver: true,
      }),
    ]).start();

    // Wait until auth hydration is done then navigate
    const timer = setTimeout(async () => {
      if (isLoading) return; // wait more if still hydrating

      if (isSignedIn) {
        router.replace('/(tabs)');
        return;
      }

      try {
        const seen = await AsyncStorage.getItem(KEY_SEEN_ONBOARDING);
        router.replace(seen ? '/(auth)/login' : '/onboarding');
      } catch {
        router.replace('/onboarding');
      }
    }, 2200);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSignedIn]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated logo group */}
      <Animated.View
        style={[
          styles.logoGroup,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}>

        {/* Icon circle */}
        <View style={styles.iconCircle}>
          <Ionicons name="leaf" size={42} color="#2C6E49" />
        </View>

        {/* App name */}
        <Text style={styles.appName}>Vedarogya</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Your Holistic Health Companion</Text>
      </Animated.View>

      {/* Subtle bottom version */}
      <Animated.Text style={[styles.version, { opacity: fadeAnim }]}>
        v1.0
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: '#1565C0',
    alignItems:      'center',
    justifyContent:  'center',
  },
  logoGroup: {
    alignItems: 'center',
    gap:        14,
  },
  iconCircle: {
    width:           96,
    height:          96,
    borderRadius:    48,
    backgroundColor: '#FFFFFF',
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.25,
    shadowRadius:    20,
    elevation:       12,
    marginBottom:    8,
  },
  appName: {
    fontSize:      36,
    fontWeight:    '800',
    color:         '#FFFFFF',
    letterSpacing: -0.8,
  },
  tagline: {
    fontSize:   14,
    fontWeight: '400',
    color:      'rgba(255,255,255,0.78)',
    letterSpacing: 0.2,
  },
  version: {
    position:   'absolute',
    bottom:     36,
    fontSize:   12,
    color:      'rgba(255,255,255,0.35)',
    fontWeight: '500',
  },
});
