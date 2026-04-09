/**
 * Login Screen — Premium redesign
 *
 * Matches reference image 2 exactly:
 *   • Inline nav bar: circle back button + "Login" title
 *   • Fully-pill email & password inputs
 *   • Black pill Continue / Sign In CTA
 *   • "Or" hairline divider
 *   • Apple (black icon) + Google (colorful SVG G) social buttons
 *   • "Don't have an account? Sign Up" sticky footer
 */
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Path, G, ClipPath, Defs, Rect } from 'react-native-svg';
import { useAuth } from '@/hooks/useAuth';

// ── Google G — SVG (official brand colors) ────────────────────────────────────

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <ClipPath id="clip">
          <Rect width="24" height="24" rx="0" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip)">
        {/* Blue */}
        <Path
          d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
          fill="#4285F4"
        />
        {/* Green */}
        <Path
          d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"
          fill="#34A853"
        />
        {/* Yellow */}
        <Path
          d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"
          fill="#FBBC05"
        />
        {/* Red */}
        <Path
          d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
          fill="#EA4335"
        />
      </G>
    </Svg>
  );
}

// ── Apple icon wrapper (keep native Ionicons but sized properly) ───────────────

function AppleIcon({ size = 20 }: { size?: number }) {
  return <Ionicons name="logo-apple" size={size} color="#000000" />;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const router     = useRouter();
  const insets     = useSafeAreaInsets();
  const { login }  = useAuth();

  const [email,     setEmail    ] = useState('');
  const [password,  setPassword ] = useState('');
  const [showPass,  setShowPass ] = useState(false);
  const [step,      setStep     ] = useState<'email' | 'password'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError    ] = useState<string | null>(null);

  // Password field animation
  const passOpacity   = useRef(new Animated.Value(0)).current;
  const passTranslate = useRef(new Animated.Value(16)).current;

  function revealPassword() {
    setStep('password');
    Animated.parallel([
      Animated.timing(passOpacity,   { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(passTranslate, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }),
    ]).start();
  }

  function handleContinue() {
    setError(null);
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.'); return;
    }
    if (step === 'email') { revealPassword(); return; }
    void handleSignIn();
  }

  async function handleSignIn() {
    if (!password.trim()) { setError('Please enter your password.'); return; }
    setIsLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      setError((e as Error).message ?? 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    if (step === 'password') {
      // Step back to email — just hide password field
      setStep('email');
      setPassword('');
      setError(null);
      Animated.parallel([
        Animated.timing(passOpacity,   { toValue: 0,  duration: 180, useNativeDriver: true }),
        Animated.timing(passTranslate, { toValue: 16, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      // Guard: if reached via replace() there is no history — go to onboarding
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/onboarding');
      }
    }
  }

  const canSubmit = step === 'email' ? email.trim().length > 0 : password.length > 0;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />

      {/* Status bar cover */}
      <View style={[s.statusCover, { height: insets.top }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <ScrollView
          contentContainerStyle={[s.scroll, { paddingTop: insets.top + 16 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Nav bar: circle back + "Login" title ──────────────────── */}
          <View style={s.navBar}>
            <TouchableOpacity onPress={handleBack} style={s.backBtn} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color="#1C1C1E" />
            </TouchableOpacity>
            <Text style={s.navTitle}>Login</Text>
          </View>

          {/* ── Welcome copy ───────────────────────────────────────────── */}
          <View style={s.heroBlock}>
            <Text style={s.welcome}>Welcome back</Text>
            <Text style={s.subtitle}>
              Log in to view and manage your appointments
            </Text>
          </View>

          {/* ── Error pill ─────────────────────────────────────────────── */}
          {error ? (
            <View style={s.errorPill}>
              <Ionicons name="alert-circle-outline" size={14} color="#DC2626" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* ── Email input ────────────────────────────────────────────── */}
          <View style={s.inputWrapper}>
            <Ionicons name="mail-outline" size={17} color="#ADADB8" style={s.inputIcon} />
            <TextInput
              style={s.input}
              placeholder="Email Address"
              placeholderTextColor="#ADADB8"
              value={email}
              onChangeText={v => { setEmail(v); setError(null); }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={step === 'email' ? handleContinue : undefined}
              editable={!isLoading}
            />
          </View>

          {/* ── Password input (animates in) ───────────────────────────── */}
          {step === 'password' && (
            <Animated.View
              style={[
                s.inputWrapper,
                { opacity: passOpacity, transform: [{ translateY: passTranslate }] },
              ]}>
              <Ionicons name="lock-closed-outline" size={17} color="#ADADB8" style={s.inputIcon} />
              <TextInput
                style={[s.input, { paddingRight: 48 }]}
                placeholder="Password"
                placeholderTextColor="#ADADB8"
                value={password}
                onChangeText={v => { setPassword(v); setError(null); }}
                secureTextEntry={!showPass}
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                autoFocus
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPass(p => !p)}
                style={s.eyeBtn}
                activeOpacity={0.6}>
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#ADADB8"
                />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* ── Forgot password ────────────────────────────────────────── */}
          {step === 'password' && (
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={s.forgotRow}
              activeOpacity={0.7}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* ── Continue / Sign In CTA ─────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleContinue}
            activeOpacity={canSubmit && !isLoading ? 0.88 : 1}
            style={[s.ctaBtn, (!canSubmit || isLoading) && s.ctaBtnDim]}>
            {isLoading
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <Text style={s.ctaBtnText}>
                  {step === 'email' ? 'Continue' : 'Sign In'}
                </Text>
            }
          </TouchableOpacity>

          {/* ── Or divider ─────────────────────────────────────────────── */}
          <View style={s.orRow}>
            <View style={s.orLine} />
            <Text style={s.orText}>Or</Text>
            <View style={s.orLine} />
          </View>

          {/* ── Social: Apple ──────────────────────────────────────────── */}
          <TouchableOpacity
            activeOpacity={0.78}
            style={s.socialBtn}
            onPress={() => Alert.alert('Coming Soon', 'Apple sign-in is coming soon.')}>
            <AppleIcon size={20} />
            <Text style={s.socialBtnText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* ── Social: Google ─────────────────────────────────────────── */}
          <TouchableOpacity
            activeOpacity={0.78}
            style={s.socialBtn}
            onPress={() => Alert.alert('Coming Soon', 'Google sign-in is coming soon.')}>
            <GoogleIcon size={20} />
            <Text style={s.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Footer: Sign Up link ───────────────────────────────────────── */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={s.footerText}>
          {"Don't have an account? "}
          <Text
            style={s.footerLink}
            onPress={() => router.push('/(auth)/register')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const INPUT_H  = 56;
const PILL_R   = 999;

const s = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: '#FFFFFF',
  },
  statusCover: {
    position:        'absolute',
    top: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    zIndex:          100,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom:     32,
  },

  // ── Nav bar ─────────────────────────────────────────────────────
  navBar: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            14,
    marginBottom:   36,
  },
  backBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,         // perfect circle
    backgroundColor: '#F2F2F7',
    alignItems:      'center',
    justifyContent:  'center',
  },
  navTitle: {
    fontSize:      20,
    fontWeight:    '700',
    color:         '#0D1117',
    letterSpacing: -0.4,
  },

  // ── Welcome copy ─────────────────────────────────────────────────
  heroBlock: {
    marginBottom: 28,
    gap:          6,
  },
  welcome: {
    fontSize:      26,
    fontWeight:    '700',
    color:         '#0D1117',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize:   14,
    color:      '#8A8A96',
    lineHeight: 20,
    fontWeight: '400',
  },

  // ── Error ────────────────────────────────────────────────────────
  errorPill: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              7,
    backgroundColor:  '#FEF2F2',
    borderRadius:     12,
    paddingVertical:  10,
    paddingHorizontal:14,
    marginBottom:     4,
  },
  errorText: {
    fontSize:   13,
    color:      '#DC2626',
    flex:       1,
    lineHeight: 18,
  },

  // ── Inputs ───────────────────────────────────────────────────────
  inputWrapper: {
    flexDirection:    'row',
    alignItems:       'center',
    borderWidth:      1.5,
    borderColor:      '#E8E8EE',
    borderRadius:     PILL_R,
    paddingHorizontal:18,
    backgroundColor:  '#FAFAFA',
    height:           INPUT_H,
    marginBottom:     12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex:     1,
    fontSize: 15,
    color:    '#0D1117',
    height:   '100%',
    fontWeight: '400',
  },
  eyeBtn: {
    position: 'absolute',
    right:    18,
    padding:  6,
  },

  // ── Forgot ───────────────────────────────────────────────────────
  forgotRow: {
    alignSelf:    'flex-end',
    marginTop:    -4,
    marginBottom: 4,
  },
  forgotText: {
    fontSize:   13,
    color:      '#8A8A96',
    fontWeight: '500',
  },

  // ── CTA ──────────────────────────────────────────────────────────
  ctaBtn: {
    backgroundColor: '#1C1C1E',
    borderRadius:    PILL_R,
    height:          56,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       4,
    marginBottom:    24,
    shadowColor:     '#1C1C1E',
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.22,
    shadowRadius:    18,
    elevation:       10,
  },
  ctaBtnDim: {
    backgroundColor: '#3A3A3C',
    shadowOpacity:   0,
    elevation:       0,
  },
  ctaBtnText: {
    fontSize:      16,
    fontWeight:    '600',
    color:         '#FFFFFF',
    letterSpacing: 0.1,
  },

  // ── Or divider ───────────────────────────────────────────────────
  orRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            14,
    marginBottom:   20,
  },
  orLine: {
    flex:            1,
    height:          StyleSheet.hairlineWidth,
    backgroundColor: '#D1D1D8',
  },
  orText: {
    fontSize:   13,
    color:      '#ADADB8',
    fontWeight: '500',
  },

  // ── Social buttons ───────────────────────────────────────────────
  socialBtn: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'center',
    gap:              12,
    backgroundColor:  '#F2F2F7',
    borderRadius:     PILL_R,
    height:           56,
    marginBottom:     12,
  },
  socialBtnText: {
    fontSize:      15,
    fontWeight:    '600',
    color:         '#1C1C1E',
    letterSpacing: -0.1,
  },

  // ── Footer ───────────────────────────────────────────────────────
  footer: {
    alignItems:      'center',
    paddingTop:      14,
    paddingBottom:   20,
    backgroundColor: '#FFFFFF',
  },
  footerText: {
    fontSize:   14,
    color:      '#8A8A96',
    fontWeight: '400',
  },
  footerLink: {
    fontWeight:    '700',
    color:         '#0D1117',
    letterSpacing: -0.1,
  },
});
