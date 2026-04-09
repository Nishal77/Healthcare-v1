/**
 * Register — 4-step premium onboarding flow
 *
 * Step 1 · Account Setup   — Name, Email, Password
 * Step 2 · Personal Info   — Phone, DOB, Gender, Blood Group
 * Step 3 · Health Profile  — Height, Weight, Conditions, Allergies
 * Step 4 · Emergency Contact — Name, Relation, Phone
 *
 * Animates between steps with a slide transition.
 * Matches the reference image UI: rounded inputs, black pill CTA.
 */
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
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
import { useAuth } from '@/hooks/useAuth';

const { width: SW } = Dimensions.get('window');

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;
const INPUT_H     = 58;
const INPUT_R     = 16;
const PILL_R      = 999;

// ── Password strength ─────────────────────────────────────────────────────────

function pwStrength(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8)        s++;
  if (/[A-Z]/.test(pw))     s++;
  if (/[a-z]/.test(pw))     s++;
  if (/\d/.test(pw))         s++;
  if (/[@$!%*?&]/.test(pw)) s++;
  s = Math.min(s, 4);
  const map = [
    { label: '',       color: '#E5E7EB' },
    { label: 'Weak',   color: '#EF4444' },
    { label: 'Fair',   color: '#F59E0B' },
    { label: 'Good',   color: '#3B82F6' },
    { label: 'Strong', color: '#22C55E' },
  ];
  return { score: s, ...map[s] };
}

const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

// ── Reusable field components ─────────────────────────────────────────────────

interface FieldProps {
  icon?:        React.ComponentProps<typeof Ionicons>['name'];
  placeholder:  string;
  value:        string;
  onChange:     (v: string) => void;
  secure?:      boolean;
  showToggle?:  boolean;
  onToggle?:    () => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' | 'decimal-pad';
  returnKey?:   'done' | 'next';
  onSubmit?:    () => void;
  autoFocus?:   boolean;
  editable?:    boolean;
}

function Field({
  icon, placeholder, value, onChange,
  secure, showToggle, onToggle,
  keyboardType = 'default', returnKey = 'next',
  onSubmit, autoFocus, editable = true,
}: FieldProps) {
  return (
    <View style={f.wrapper}>
      {icon ? <Ionicons name={icon} size={17} color="#ADADB8" style={f.icon} /> : null}
      <TextInput
        style={[f.input, icon ? {} : { paddingLeft: 4 }, showToggle ? { paddingRight: 48 } : {}]}
        placeholder={placeholder}
        placeholderTextColor="#ADADB8"
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        autoComplete={
          keyboardType === 'email-address' ? 'email' :
          secure ? 'new-password' : 'off'
        }
        returnKeyType={returnKey}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        editable={editable}
      />
      {showToggle && onToggle ? (
        <TouchableOpacity onPress={onToggle} style={f.eye} activeOpacity={0.6}>
          <Ionicons
            name={secure ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color="#ADADB8"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// Half-width field (for name row, height/weight row)
function HalfField(props: FieldProps) {
  return (
    <View style={{ flex: 1 }}>
      <Field {...props} />
    </View>
  );
}

// Select pill (Gender, Blood Group, etc.)
function SelectPill({
  options, value, onChange, label,
}: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <View style={sel.wrap}>
      <Text style={sel.label}>{label}</Text>
      <View style={sel.row}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            activeOpacity={0.75}
            style={[sel.pill, value === opt && sel.pillActive]}>
            <Text style={[sel.pillText, value === opt && sel.pillTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Step progress bar ─────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <View style={sb.row}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View key={i} style={[sb.seg, i < current ? sb.done : i === current - 1 ? sb.active : sb.idle]} />
      ))}
    </View>
  );
}

// ── Step content components ───────────────────────────────────────────────────

// STEP 1 ─ Account Setup
function Step1({
  firstName, setFirstName,
  lastName,  setLastName,
  email,     setEmail,
  password,  setPassword,
  confirmPw, setConfirmPw,
  showPw,    setShowPw,
  showCPw,   setShowCPw,
}: Record<string, string | boolean | ((v: string) => void) | ((v: boolean) => void)>) {
  const strength = pwStrength(password as string);
  return (
    <View style={st.block}>
      {/* Name row */}
      <View style={st.row}>
        <HalfField
          placeholder="First Name"
          value={firstName as string}
          onChange={setFirstName as (v: string) => void}
        />
        <HalfField
          placeholder="Last Name"
          value={lastName as string}
          onChange={setLastName as (v: string) => void}
        />
      </View>

      <Field
        icon="mail-outline"
        placeholder="Email Address"
        value={email as string}
        onChange={setEmail as (v: string) => void}
        keyboardType="email-address"
      />

      <Field
        icon="lock-closed-outline"
        placeholder="Password"
        value={password as string}
        onChange={setPassword as (v: string) => void}
        secure={showPw === false}
        showToggle
        onToggle={() => (setShowPw as (v: boolean) => void)(!showPw)}
      />

      {/* Strength meter */}
      {(password as string).length > 0 && (
        <View style={st.strengthWrap}>
          <View style={st.strengthBars}>
            {([1, 2, 3, 4] as const).map(i => (
              <View
                key={i}
                style={[
                  st.bar,
                  { backgroundColor: i <= strength.score ? strength.color : '#E5E7EB' },
                ]}
              />
            ))}
          </View>
          {strength.score > 0 && (
            <Text style={[st.strengthLabel, { color: strength.color }]}>
              {strength.label}
            </Text>
          )}
        </View>
      )}

      <Field
        icon="lock-closed-outline"
        placeholder="Confirm Password"
        value={confirmPw as string}
        onChange={setConfirmPw as (v: string) => void}
        secure={showCPw === false}
        showToggle
        onToggle={() => (setShowCPw as (v: boolean) => void)(!showCPw)}
        returnKey="done"
      />

      {/* Match badge */}
      {(confirmPw as string).length > 0 && (
        <View style={st.matchRow}>
          <Ionicons
            name={(confirmPw as string) === (password as string) ? 'checkmark-circle' : 'close-circle'}
            size={13}
            color={(confirmPw as string) === (password as string) ? '#22C55E' : '#EF4444'}
          />
          <Text style={[st.matchText, {
            color: (confirmPw as string) === (password as string) ? '#22C55E' : '#EF4444',
          }]}>
            {(confirmPw as string) === (password as string) ? 'Passwords match' : 'Passwords do not match'}
          </Text>
        </View>
      )}
    </View>
  );
}

// STEP 2 ─ Personal Info
function Step2({
  phone, setPhone,
  dob,   setDob,
  gender, setGender,
  bloodGroup, setBloodGroup,
}: Record<string, string | ((v: string) => void)>) {
  return (
    <View style={st.block}>
      <Field
        icon="call-outline"
        placeholder="Phone Number"
        value={phone as string}
        onChange={setPhone as (v: string) => void}
        keyboardType="phone-pad"
      />

      <Field
        icon="calendar-outline"
        placeholder="Date of Birth  (DD / MM / YYYY)"
        value={dob as string}
        onChange={setDob as (v: string) => void}
        keyboardType="numeric"
      />

      <SelectPill
        label="Gender"
        options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
        value={gender as string}
        onChange={setGender as (v: string) => void}
      />

      <SelectPill
        label="Blood Group"
        options={['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']}
        value={bloodGroup as string}
        onChange={setBloodGroup as (v: string) => void}
      />
    </View>
  );
}

// STEP 3 ─ Health Profile
function Step3({
  heightCm, setHeightCm,
  weightKg, setWeightKg,
  conditions, setConditions,
  allergies,  setAllergies,
  dosha, setDosha,
}: Record<string, string | ((v: string) => void)>) {
  return (
    <View style={st.block}>
      <View style={st.row}>
        <HalfField
          icon="resize-outline"
          placeholder="Height (cm)"
          value={heightCm as string}
          onChange={setHeightCm as (v: string) => void}
          keyboardType="decimal-pad"
        />
        <HalfField
          icon="scale-outline"
          placeholder="Weight (kg)"
          value={weightKg as string}
          onChange={setWeightKg as (v: string) => void}
          keyboardType="decimal-pad"
        />
      </View>

      <SelectPill
        label="Ayurvedic Dosha (optional)"
        options={['Vata', 'Pitta', 'Kapha', 'Not sure']}
        value={dosha as string}
        onChange={setDosha as (v: string) => void}
      />

      <View style={f.wrapper}>
        <Ionicons name="medkit-outline" size={17} color="#ADADB8" style={f.icon} />
        <TextInput
          style={[f.input]}
          placeholder="Medical conditions (e.g. Diabetes, Asthma)"
          placeholderTextColor="#ADADB8"
          value={conditions as string}
          onChangeText={setConditions as (v: string) => void}
          autoCapitalize="sentences"
          returnKeyType="next"
          multiline={false}
        />
      </View>

      <View style={f.wrapper}>
        <Ionicons name="alert-circle-outline" size={17} color="#ADADB8" style={f.icon} />
        <TextInput
          style={[f.input]}
          placeholder="Allergies (e.g. Penicillin, Peanuts)"
          placeholderTextColor="#ADADB8"
          value={allergies as string}
          onChangeText={setAllergies as (v: string) => void}
          autoCapitalize="sentences"
          returnKeyType="done"
        />
      </View>
    </View>
  );
}

// STEP 4 ─ Emergency Contact
function Step4({
  ecName, setEcName,
  ecRelation, setEcRelation,
  ecPhone, setEcPhone,
  ecPhone2, setEcPhone2,
}: Record<string, string | ((v: string) => void)>) {
  return (
    <View style={st.block}>
      {/* Info card */}
      <View style={ec.infoCard}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#2C6E49" />
        <Text style={ec.infoText}>
          Emergency contacts are only accessed by healthcare providers in critical situations.
        </Text>
      </View>

      <Field
        icon="person-outline"
        placeholder="Contact Full Name"
        value={ecName as string}
        onChange={setEcName as (v: string) => void}
      />

      <SelectPill
        label="Relationship"
        options={['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other']}
        value={ecRelation as string}
        onChange={setEcRelation as (v: string) => void}
      />

      <Field
        icon="call-outline"
        placeholder="Primary Phone Number"
        value={ecPhone as string}
        onChange={setEcPhone as (v: string) => void}
        keyboardType="phone-pad"
      />

      <Field
        icon="call-outline"
        placeholder="Secondary Phone (optional)"
        value={ecPhone2 as string}
        onChange={setEcPhone2 as (v: string) => void}
        keyboardType="phone-pad"
        returnKey="done"
      />
    </View>
  );
}

// ── Step meta ─────────────────────────────────────────────────────────────────

const STEP_META = [
  {
    title:    'Create Account',
    subtitle: 'Join Vedarogya — your health, your data',
    icon:     'person-add-outline' as const,
  },
  {
    title:    'Personal Info',
    subtitle: 'Help us personalise your experience',
    icon:     'id-card-outline' as const,
  },
  {
    title:    'Health Profile',
    subtitle: 'Your health, understood holistically',
    icon:     'fitness-outline' as const,
  },
  {
    title:    'Emergency Contact',
    subtitle: 'Who should we contact in an emergency?',
    icon:     'shield-outline' as const,
  },
];

// ── Main screen ───────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const router     = useRouter();
  const insets     = useSafeAreaInsets();
  const { register } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1
  const [firstName,  setFirstName ] = useState('');
  const [lastName,   setLastName  ] = useState('');
  const [email,      setEmail     ] = useState('');
  const [password,   setPassword  ] = useState('');
  const [confirmPw,  setConfirmPw ] = useState('');
  const [showPw,     setShowPw    ] = useState(false);
  const [showCPw,    setShowCPw   ] = useState(false);

  // Step 2
  const [phone,      setPhone     ] = useState('');
  const [dob,        setDob       ] = useState('');
  const [gender,     setGender    ] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  // Step 3
  const [heightCm,   setHeightCm  ] = useState('');
  const [weightKg,   setWeightKg  ] = useState('');
  const [conditions, setConditions] = useState('');
  const [allergies,  setAllergies ] = useState('');
  const [dosha,      setDosha     ] = useState('');

  // Step 4
  const [ecName,     setEcName    ] = useState('');
  const [ecRelation, setEcRelation] = useState('');
  const [ecPhone,    setEcPhone   ] = useState('');
  const [ecPhone2,   setEcPhone2  ] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError    ] = useState<string | null>(null);

  // Slide animation
  const slideX = useRef(new Animated.Value(0)).current;

  function animateStep(dir: 'forward' | 'back', next: number) {
    const offset = dir === 'forward' ? SW : -SW;
    slideX.setValue(offset);
    setStep(next);
    Animated.spring(slideX, {
      toValue:         0,
      damping:         22,
      stiffness:       200,
      useNativeDriver: true,
    }).start();
  }

  function validateStep(): string | null {
    if (step === 1) {
      if (!firstName.trim()) return 'First name is required.';
      if (!lastName.trim())  return 'Last name is required.';
      if (!email.trim())     return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email.';
      if (password.length < 8) return 'Password must be at least 8 characters.';
      if (!PW_REGEX.test(password)) return 'Password needs uppercase, lowercase, number & special char (@$!%*?&).';
      if (password !== confirmPw) return 'Passwords do not match.';
    }
    if (step === 2) {
      if (!phone.trim()) return 'Phone number is required.';
    }
    if (step === 4) {
      if (!ecName.trim()) return 'Emergency contact name is required.';
      if (!ecPhone.trim()) return 'Emergency contact phone is required.';
    }
    return null;
  }

  async function handleNext() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);

    if (step < TOTAL_STEPS) {
      animateStep('forward', step + 1);
      return;
    }

    // Final submit
    setIsLoading(true);
    try {
      await register(email.trim(), password, firstName.trim(), lastName.trim());
      router.replace('/(tabs)');
    } catch (e) {
      setError((e as Error).message ?? 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    setError(null);
    if (step > 1) {
      animateStep('back', step - 1);
    } else {
      // Guard: if reached via replace() there is no history — go back to login
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(auth)/login');
      }
    }
  }

  const meta = STEP_META[step - 1];
  const isLastStep = step === TOTAL_STEPS;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />
      <View style={[s.statusCover, { height: insets.top }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <ScrollView
          contentContainerStyle={[s.scroll, { paddingTop: insets.top + 16 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Nav bar ─────────────────────────────────────────────── */}
          <View style={s.navBar}>
            <TouchableOpacity onPress={handleBack} style={s.backBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color="#1C1C1E" />
            </TouchableOpacity>
            <Text style={s.stepLabel}>
              Step {step} of {TOTAL_STEPS}
            </Text>
          </View>

          {/* ── Progress bar ─────────────────────────────────────────── */}
          <StepBar current={step} />

          {/* ── Step header ──────────────────────────────────────────── */}
          <Animated.View
            style={[s.header, { transform: [{ translateX: slideX }] }]}>
            <View style={s.stepIconWrap}>
              <Ionicons name={meta.icon} size={22} color="#2C6E49" />
            </View>
            <Text style={s.title}>{meta.title}</Text>
            <Text style={s.subtitle}>{meta.subtitle}</Text>
          </Animated.View>

          {/* ── Error pill ───────────────────────────────────────────── */}
          {error ? (
            <View style={s.errorPill}>
              <Ionicons name="alert-circle-outline" size={14} color="#DC2626" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* ── Step content (slides) ────────────────────────────────── */}
          <Animated.View style={{ transform: [{ translateX: slideX }] }}>
            {step === 1 && (
              <Step1
                firstName={firstName}  setFirstName={setFirstName}
                lastName={lastName}    setLastName={setLastName}
                email={email}          setEmail={setEmail}
                password={password}    setPassword={setPassword}
                confirmPw={confirmPw}  setConfirmPw={setConfirmPw}
                showPw={showPw}        setShowPw={setShowPw as unknown as (v: string) => void}
                showCPw={showCPw}      setShowCPw={setShowCPw as unknown as (v: string) => void}
              />
            )}
            {step === 2 && (
              <Step2
                phone={phone}          setPhone={setPhone}
                dob={dob}              setDob={setDob}
                gender={gender}        setGender={setGender}
                bloodGroup={bloodGroup} setBloodGroup={setBloodGroup}
              />
            )}
            {step === 3 && (
              <Step3
                heightCm={heightCm}    setHeightCm={setHeightCm}
                weightKg={weightKg}    setWeightKg={setWeightKg}
                conditions={conditions} setConditions={setConditions}
                allergies={allergies}  setAllergies={setAllergies}
                dosha={dosha}          setDosha={setDosha}
              />
            )}
            {step === 4 && (
              <Step4
                ecName={ecName}        setEcName={setEcName}
                ecRelation={ecRelation} setEcRelation={setEcRelation}
                ecPhone={ecPhone}      setEcPhone={setEcPhone}
                ecPhone2={ecPhone2}    setEcPhone2={setEcPhone2}
              />
            )}
          </Animated.View>

          {/* ── CTA ─────────────────────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={isLoading ? 1 : 0.88}
            style={[s.ctaBtn, isLoading && s.ctaBtnDim]}>
            {isLoading
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <>
                  <Text style={s.ctaText}>
                    {isLastStep ? 'Create Account' : 'Continue'}
                  </Text>
                  {!isLastStep && (
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  )}
                </>
            }
          </TouchableOpacity>

          {/* ── Skip (steps 2–3 only, step 4 optional is handled by empty fields) */}
          {(step === 2 || step === 3) && (
            <TouchableOpacity
              onPress={() => { setError(null); animateStep('forward', step + 1); }}
              activeOpacity={0.7}
              style={s.skipBtn}>
              <Text style={s.skipText}>Skip for now</Text>
            </TouchableOpacity>
          )}

          {/* ── Sign In link (step 1 only) ────────────────────────────── */}
          {step === 1 && (
            <View style={s.signInRow}>
              <Text style={s.signInText}>
                {'Already have an account? '}
                <Text
                  style={s.signInLink}
                  onPress={() => router.replace('/(auth)/login')}>
                  Sign In
                </Text>
              </Text>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Field styles ──────────────────────────────────────────────────────────────

const f = StyleSheet.create({
  wrapper: {
    flexDirection:    'row',
    alignItems:       'center',
    backgroundColor:  '#F2F2F7',
    borderRadius:     INPUT_R,
    paddingHorizontal:16,
    height:           INPUT_H,
    marginBottom:     12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex:     1,
    fontSize: 15,
    color:    '#0D1117',
    height:   '100%',
    fontWeight: '400',
  },
  eye: {
    position: 'absolute',
    right:    16,
    padding:  6,
  },
});

// ── Select pill styles ────────────────────────────────────────────────────────

const sel = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    fontSize:      12,
    fontWeight:    '600',
    color:         '#8A8A96',
    letterSpacing: 0.4,
    marginBottom:  8,
    paddingLeft:   2,
  },
  row: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical:   9,
    borderRadius:      PILL_R,
    backgroundColor:   '#F2F2F7',
  },
  pillActive: {
    backgroundColor: '#0D1117',
  },
  pillText: {
    fontSize:   13.5,
    fontWeight: '500',
    color:      '#6B7280',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});

// ── Step bar styles ───────────────────────────────────────────────────────────

const sb = StyleSheet.create({
  row: {
    flexDirection:  'row',
    gap:            6,
    marginBottom:   28,
  },
  seg: {
    flex:         1,
    height:       4,
    borderRadius: 2,
  },
  done: {
    backgroundColor: '#2C6E49',
  },
  active: {
    backgroundColor: '#0D1117',
  },
  idle: {
    backgroundColor: '#E5E7EB',
  },
});

// ── Step block style ──────────────────────────────────────────────────────────

const st = StyleSheet.create({
  block: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap:           12,
    marginBottom:  0,
  },
  strengthWrap: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              10,
    marginTop:        -6,
    marginBottom:     6,
    paddingHorizontal:2,
  },
  strengthBars: {
    flexDirection: 'row',
    flex:          1,
    gap:           5,
  },
  bar: {
    flex:         1,
    height:       4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize:   12,
    fontWeight: '600',
    minWidth:   44,
    textAlign:  'right',
  },
  matchRow: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              5,
    paddingHorizontal:2,
    marginTop:        -6,
    marginBottom:     8,
  },
  matchText: {
    fontSize:   12,
    fontWeight: '500',
  },
});

// ── Emergency contact styles ──────────────────────────────────────────────────

const ec = StyleSheet.create({
  infoCard: {
    flexDirection:    'row',
    alignItems:       'flex-start',
    gap:              10,
    backgroundColor:  '#F0FBF5',
    borderRadius:     14,
    padding:          14,
    marginBottom:     18,
  },
  infoText: {
    flex:       1,
    fontSize:   13,
    color:      '#374151',
    lineHeight: 18,
  },
});

// ── Root styles ───────────────────────────────────────────────────────────────

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

  // Nav bar
  navBar: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   20,
  },
  backBtn: {
    width:           42,
    height:          42,
    borderRadius:    13,
    backgroundColor: '#F2F2F7',
    alignItems:      'center',
    justifyContent:  'center',
  },
  stepLabel: {
    fontSize:   13,
    fontWeight: '500',
    color:      '#8A8A96',
  },

  // Header
  header: {
    marginBottom: 24,
  },
  stepIconWrap: {
    width:           44,
    height:          44,
    borderRadius:    14,
    backgroundColor: '#F0FBF5',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    14,
  },
  title: {
    fontSize:      30,
    fontWeight:    '800',
    color:         '#0D1117',
    letterSpacing: -0.7,
    marginBottom:  6,
  },
  subtitle: {
    fontSize:   14.5,
    color:      '#8A8A96',
    lineHeight: 20,
    fontWeight: '400',
  },

  // Error
  errorPill: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              7,
    backgroundColor:  '#FEF2F2',
    borderRadius:     12,
    paddingVertical:  10,
    paddingHorizontal:14,
    marginBottom:     12,
  },
  errorText: {
    fontSize:   13,
    color:      '#DC2626',
    flex:       1,
    lineHeight: 18,
  },

  // CTA
  ctaBtn: {
    backgroundColor: '#1C1C1E',
    borderRadius:    PILL_R,
    height:          58,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       8,
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
  ctaText: {
    fontSize:      16,
    fontWeight:    '600',
    color:         '#FFFFFF',
    letterSpacing: 0.1,
  },

  // Skip
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  skipText: {
    fontSize:   14,
    color:      '#ADADB8',
    fontWeight: '500',
  },

  // Sign In
  signInRow: {
    alignItems:      'center',
    marginTop:       16,
  },
  signInText: {
    fontSize: 14,
    color:    '#8A8A96',
  },
  signInLink: {
    fontWeight:    '700',
    color:         '#0D1117',
    letterSpacing: -0.1,
  },
});
