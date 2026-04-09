/**
 * Register — 7-step Ayurvedic healthcare onboarding
 *
 * Step 1 · Account Setup       — Name · Email · Password
 * Step 2 · Personal Details    — DOB · Gender · Phone
 * Step 3 · Verify Phone        — 6-digit OTP with countdown & resend
 * Step 4 · Body Metrics        — Height · Weight · Blood Group · Activity
 * Step 5 · Ayurvedic Profile   — Prakriti · Health Concerns · Diet · Lifestyle
 * Step 6 · Medical History     — Conditions · Medications · Allergies
 * Step 7 · Emergency Contact   — Name · Relation · Phone
 *
 * All steps mandatory — no skip.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
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
import { authApi } from '@/src/api/endpoints/auth';
import { DateWheelPicker } from '@/components/ui/date-wheel-picker';

const { width: SW } = Dimensions.get('window');

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 7;
const INPUT_H     = 56;
const INPUT_R     = 14;
const PILL_R      = 999;
const GREEN       = '#2C6E49';
const DARK        = '#0D1117';
const GRAY_BG     = '#F2F2F7';
const GRAY_TEXT   = '#ADADB8';
const LABEL_COLOR = '#8A8A96';

// ── Password strength ─────────────────────────────────────────────────────────

const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

function pwStrength(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8)        s++;
  if (/[A-Z]/.test(pw))      s++;
  if (/[a-z]/.test(pw))      s++;
  if (/\d/.test(pw))          s++;
  if (/[@$!%*?&]/.test(pw))  s++;
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

// ── Shared Field ──────────────────────────────────────────────────────────────

interface FieldProps {
  icon?:         React.ComponentProps<typeof Ionicons>['name'];
  placeholder:   string;
  value:         string;
  onChange:      (v: string) => void;
  secure?:       boolean;
  showToggle?:   boolean;
  onToggle?:     () => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' | 'decimal-pad' | 'number-pad';
  returnKey?:    'done' | 'next';
  onSubmit?:     () => void;
  autoFocus?:    boolean;
  contentType?:  'emailAddress' | 'newPassword' | 'telephoneNumber' | 'none';
  capitalize?:   'none' | 'sentences' | 'words' | 'characters';
}

function Field({
  icon, placeholder, value, onChange,
  secure, showToggle, onToggle,
  keyboardType = 'default',
  returnKey    = 'next',
  onSubmit,
  autoFocus,
  contentType,
  capitalize,
}: FieldProps) {
  const autoCap =
    capitalize ?? (keyboardType === 'email-address' ? 'none' : 'sentences');

  return (
    <View style={f.wrapper}>
      {icon ? <Ionicons name={icon} size={17} color={GRAY_TEXT} style={f.icon} /> : null}
      <TextInput
        style={[f.input, showToggle ? { paddingRight: 48 } : {}]}
        placeholder={placeholder}
        placeholderTextColor={GRAY_TEXT}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={autoCap}
        textContentType={contentType ?? 'none'}
        returnKeyType={returnKey}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
      />
      {showToggle && onToggle ? (
        <TouchableOpacity onPress={onToggle} style={f.eye} activeOpacity={0.6}>
          <Ionicons
            name={secure ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color={GRAY_TEXT}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function HalfField(props: FieldProps) {
  return <View style={{ flex: 1 }}><Field {...props} /></View>;
}

// ── Select pills ──────────────────────────────────────────────────────────────

function SelectPill({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={sel.wrap}>
      <Text style={sel.label}>{label}</Text>
      <View style={sel.row}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            activeOpacity={0.75}
            style={[sel.pill, value === opt && sel.active]}>
            <Text style={[sel.text, value === opt && sel.textActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function MultiSelectPill({
  label, options, value, onChange, columns,
}: {
  label:    string;
  options:  string[];
  value:    string[];
  onChange: (v: string[]) => void;
  columns?: boolean;
}) {
  function toggle(opt: string) {
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  }
  return (
    <View style={sel.wrap}>
      <Text style={sel.label}>{label}</Text>
      <View style={[sel.row, columns && { flexWrap: 'wrap' }]}>
        {options.map(opt => {
          const on = value.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => toggle(opt)}
              activeOpacity={0.75}
              style={[sel.pill, on && sel.active]}>
              <Text style={[sel.text, on && sel.textActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <View style={sb.row}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View
          key={i}
          style={[
            sb.seg,
            i < current - 1  ? sb.done
            : i === current - 1 ? sb.active
            : sb.idle,
          ]}
        />
      ))}
    </View>
  );
}

// ── OTP boxes ─────────────────────────────────────────────────────────────────

interface OtpBoxesProps {
  digits:    string[];
  setDigits: (d: string[]) => void;
  refs:      React.MutableRefObject<(TextInput | null)[]>;
}

function OtpBoxes({ digits, setDigits, refs }: OtpBoxesProps) {
  const [focusedIdx, setFocusedIdx] = useState(-1);

  function handleChange(index: number, raw: string) {
    const cleaned = raw.replace(/[^0-9]/g, '');

    // Handle paste / SMS autofill
    if (cleaned.length > 1) {
      const next = [...digits];
      for (let j = 0; j < cleaned.length && index + j < 6; j++) {
        next[index + j] = cleaned[j];
      }
      setDigits(next);
      const last = Math.min(index + cleaned.length - 1, 5);
      refs.current[last]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (cleaned && index < 5) refs.current[index + 1]?.focus();
  }

  function handleKey(index: number, key: string) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={otp.boxRow}>
      {digits.map((d, i) => {
        const isFocused = focusedIdx === i;
        const isFilled  = d.length > 0;
        return (
          <View
            key={i}
            style={[
              otp.boxWrap,
              isFilled  && otp.boxWrapFilled,
              isFocused && otp.boxWrapFocused,
            ]}>
            <TextInput
              ref={r => { refs.current[i] = r; }}
              style={otp.boxInput}
              value={d}
              onChangeText={v => handleChange(i, v)}
              onKeyPress={e => handleKey(i, e.nativeEvent.key)}
              onFocus={() => setFocusedIdx(i)}
              onBlur={() => setFocusedIdx(-1)}
              keyboardType="number-pad"
              maxLength={6}
              textContentType={i === 0 ? 'oneTimeCode' : 'none'}
              caretHidden
            />
          </View>
        );
      })}
    </View>
  );
}

// ── Step 1 — Account Setup ────────────────────────────────────────────────────

interface S1Props {
  firstName:    string; setFirstName: (v: string) => void;
  lastName:     string; setLastName:  (v: string) => void;
  email:        string; setEmail:     (v: string) => void;
  password:     string; setPassword:  (v: string) => void;
  confirmPw:    string; setConfirmPw: (v: string) => void;
  showPw:       boolean; setShowPw:   (v: boolean) => void;
  showCPw:      boolean; setShowCPw:  (v: boolean) => void;
}

function Step1({ firstName, setFirstName, lastName, setLastName,
  email, setEmail, password, setPassword,
  confirmPw, setConfirmPw, showPw, setShowPw, showCPw, setShowCPw }: S1Props) {
  const strength = pwStrength(password);

  return (
    <View style={st.block}>
      <View style={st.row}>
        <HalfField placeholder="First Name" value={firstName} onChange={setFirstName} capitalize="words" />
        <HalfField placeholder="Last Name"  value={lastName}  onChange={setLastName}  capitalize="words" />
      </View>

      <Field
        icon="mail-outline"
        placeholder="Email Address"
        value={email}
        onChange={setEmail}
        keyboardType="email-address"
        contentType="emailAddress"
      />

      <Field
        icon="lock-closed-outline"
        placeholder="Password"
        value={password}
        onChange={setPassword}
        secure={!showPw}
        showToggle
        onToggle={() => setShowPw(!showPw)}
        contentType="newPassword"
      />

      {password.length > 0 && (
        <View style={st.strengthRow}>
          <View style={st.bars}>
            {([1, 2, 3, 4] as const).map(i => (
              <View
                key={i}
                style={[st.bar, { backgroundColor: i <= strength.score ? strength.color : '#E5E7EB' }]}
              />
            ))}
          </View>
          {strength.score > 0 && (
            <Text style={[st.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
          )}
        </View>
      )}

      <Field
        icon="lock-closed-outline"
        placeholder="Confirm Password"
        value={confirmPw}
        onChange={setConfirmPw}
        secure={!showCPw}
        showToggle
        onToggle={() => setShowCPw(!showCPw)}
        returnKey="done"
      />

      {confirmPw.length > 0 && (
        <View style={st.matchRow}>
          <Ionicons
            name={confirmPw === password ? 'checkmark-circle' : 'close-circle'}
            size={13}
            color={confirmPw === password ? '#22C55E' : '#EF4444'}
          />
          <Text style={[st.matchText, { color: confirmPw === password ? '#22C55E' : '#EF4444' }]}>
            {confirmPw === password ? 'Passwords match' : 'Passwords do not match'}
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Step 2 — Personal Details ─────────────────────────────────────────────────

interface S2Props {
  dob: string; setDob: (v: string) => void;
  gender: string; setGender: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
}

function Step2({ dob, setDob, gender, setGender, phone, setPhone }: S2Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const hasDate    = dob.trim().length > 0;
  const displayDob = hasDate ? dob : '';

  return (
    <View style={st.block}>

      {/* DOB — tappable wheel picker trigger */}
      <TouchableOpacity
        onPress={() => setPickerOpen(true)}
        activeOpacity={0.75}
        style={dob2.trigger}>
        <Ionicons
          name="calendar-outline"
          size={17}
          color={hasDate ? DARK : GRAY_TEXT}
          style={{ marginRight: 10 }}
        />
        <Text style={[dob2.triggerText, hasDate && dob2.triggerTextFilled]}>
          {hasDate ? displayDob : 'Date of Birth  (DD / MM / YYYY)'}
        </Text>
        <Ionicons
          name="chevron-down"
          size={15}
          color={hasDate ? '#6B7280' : GRAY_TEXT}
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>

      <SelectPill
        label="Gender"
        options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
        value={gender}
        onChange={setGender}
      />

      <Field
        icon="call-outline"
        placeholder="Mobile Number (for OTP)"
        value={phone}
        onChange={setPhone}
        keyboardType="phone-pad"
        contentType="telephoneNumber"
        returnKey="done"
      />

      <View style={st.phoneNote}>
        <Ionicons name="shield-checkmark-outline" size={13} color={GREEN} />
        <Text style={st.phoneNoteText}>
          We will send a one-time code to verify this number.
        </Text>
      </View>

      {/* Wheel picker modal */}
      <DateWheelPicker
        visible={pickerOpen}
        value={dob}
        onChange={setDob}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

// ── Step 3 — OTP Verification ─────────────────────────────────────────────────

interface S3Props {
  digits:    string[];
  setDigits: (d: string[]) => void;
  refs:      React.MutableRefObject<(TextInput | null)[]>;
  phone:     string;
  onResend:  () => Promise<void>;
}

function Step3({ digits, setDigits, refs, phone, onResend }: S3Props) {
  const [seconds,       setSeconds]       = useState(120);
  const [canResend,     setCanResend]     = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (seconds <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1_000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function handleResend() {
    setResendLoading(true);
    try {
      await onResend();
      setDigits(Array(6).fill(''));
      setSeconds(120);
      setCanResend(false);
      refs.current[0]?.focus();
    } finally {
      setResendLoading(false);
    }
  }

  const mm       = Math.floor(seconds / 60);
  const ss       = seconds % 60;
  const pct      = seconds / 120;
  const filledCount = digits.filter(d => d).length;

  return (
    <View style={otp.container}>

      {/* ── Icon — double-ring glow ──────────────────────────────── */}
      <View style={otp.iconOuter}>
        <View style={otp.iconInner}>
          <Ionicons name="phone-portrait-outline" size={30} color={GREEN} />
        </View>
      </View>

      {/* ── Heading ──────────────────────────────────────────────── */}
      <Text style={otp.title}>Verify Your Phone</Text>
      <Text style={otp.sub}>We sent a 6-digit code to</Text>
      <View style={otp.phonePill}>
        <Ionicons name="call-outline" size={13} color={GREEN} />
        <Text style={otp.phoneNum}>{phone}</Text>
      </View>

      {/* ── OTP boxes ────────────────────────────────────────────── */}
      <OtpBoxes digits={digits} setDigits={setDigits} refs={refs} />

      {/* ── Progress dots ────────────────────────────────────────── */}
      <View style={otp.dotsRow}>
        {digits.map((_, i) => (
          <View
            key={i}
            style={[otp.dot, i < filledCount && otp.dotFilled]}
          />
        ))}
      </View>

      {/* ── Timer ────────────────────────────────────────────────── */}
      {!canResend ? (
        <View style={otp.timerCard}>
          <View style={otp.timerLabelRow}>
            <Ionicons name="time-outline" size={13} color="#94A3B8" />
            <Text style={otp.timerLabel}>
              Code expires in{' '}
              <Text style={otp.timerCount}>
                {mm}:{ss.toString().padStart(2, '0')}
              </Text>
            </Text>
          </View>
          {/* thin progress bar */}
          <View style={otp.timerTrack}>
            <View style={[otp.timerFill, { width: `${pct * 100}%` as any }]} />
          </View>
        </View>
      ) : (
        <View style={otp.expiredBadge}>
          <Ionicons name="alert-circle-outline" size={13} color="#F59E0B" />
          <Text style={otp.expiredText}>Code expired</Text>
        </View>
      )}

      {/* ── Resend ───────────────────────────────────────────────── */}
      <View style={otp.resendRow}>
        <Text style={otp.resendLabel}>{"Didn't receive it?  "}</Text>
        <TouchableOpacity
          onPress={canResend ? handleResend : undefined}
          activeOpacity={canResend ? 0.7 : 1}
          disabled={!canResend || resendLoading}
          style={canResend ? otp.resendBtnActive : otp.resendBtnIdle}>
          {resendLoading
            ? <ActivityIndicator size="small" color={GREEN} />
            : <Text style={[otp.resendText, canResend && otp.resendTextActive]}>
                Resend Code
              </Text>
          }
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ── Step 4 — Body Metrics ─────────────────────────────────────────────────────

interface S4Props {
  heightCm:      string; setHeightCm:      (v: string) => void;
  weightKg:      string; setWeightKg:      (v: string) => void;
  bloodGroup:    string; setBloodGroup:    (v: string) => void;
  activityLevel: string; setActivityLevel: (v: string) => void;
}

function Step4({ heightCm, setHeightCm, weightKg, setWeightKg,
  bloodGroup, setBloodGroup, activityLevel, setActivityLevel }: S4Props) {
  return (
    <View style={st.block}>
      <View style={st.row}>
        <HalfField
          icon="resize-outline"
          placeholder="Height (cm)"
          value={heightCm}
          onChange={setHeightCm}
          keyboardType="decimal-pad"
        />
        <HalfField
          icon="barbell-outline"
          placeholder="Weight (kg)"
          value={weightKg}
          onChange={setWeightKg}
          keyboardType="decimal-pad"
        />
      </View>

      <SelectPill
        label="Blood Group"
        options={['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']}
        value={bloodGroup}
        onChange={setBloodGroup}
      />

      <SelectPill
        label="Activity Level"
        options={['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']}
        value={activityLevel}
        onChange={setActivityLevel}
      />
    </View>
  );
}

// ── Step 5 — Ayurvedic Profile ────────────────────────────────────────────────

interface S5Props {
  dosha:          string;   setDosha:          (v: string)   => void;
  healthConcerns: string[]; setHealthConcerns: (v: string[]) => void;
  dietPreference: string;   setDietPreference: (v: string)   => void;
  lifestyle:      string;   setLifestyle:      (v: string)   => void;
}

function Step5({ dosha, setDosha, healthConcerns, setHealthConcerns,
  dietPreference, setDietPreference, lifestyle, setLifestyle }: S5Props) {
  return (
    <View style={st.block}>
      {/* Prakriti card */}
      <View style={st.prakCard}>
        <Ionicons name="leaf-outline" size={16} color={GREEN} />
        <Text style={st.prakText}>
          Prakriti is your unique mind-body constitution in Ayurveda. Select the
          one that resonates most, or choose "I'll discover later."
        </Text>
      </View>

      <SelectPill
        label="Prakriti / Dosha"
        options={['Vata', 'Pitta', 'Kapha', 'Tridosha', "I'll discover later"]}
        value={dosha}
        onChange={setDosha}
      />

      <MultiSelectPill
        label="Primary Health Concerns  (select all that apply)"
        options={[
          'Stress & Anxiety', 'Digestion', 'Weight Management',
          'Sleep Quality', 'Immunity', 'Energy Levels',
          'Skin Health', 'Joint Pain', 'Other',
        ]}
        value={healthConcerns}
        onChange={setHealthConcerns}
        columns
      />

      <SelectPill
        label="Diet Preference"
        options={['Sattvic', 'Vegetarian', 'Vegan', 'Non-Vegetarian', 'Jain']}
        value={dietPreference}
        onChange={setDietPreference}
      />

      <SelectPill
        label="Daily Lifestyle"
        options={['Early Riser', 'Night Owl', 'Irregular', 'Balanced']}
        value={lifestyle}
        onChange={setLifestyle}
      />
    </View>
  );
}

// ── Step 6 — Medical History ──────────────────────────────────────────────────

interface S6Props {
  conditions:          string[]; setConditions:          (v: string[]) => void;
  medications:         string;   setMedications:         (v: string)   => void;
  allergies:           string;   setAllergies:           (v: string)   => void;
  ayurvedicTreatment:  string;   setAyurvedicTreatment:  (v: string)   => void;
}

function Step6({ conditions, setConditions, medications, setMedications,
  allergies, setAllergies, ayurvedicTreatment, setAyurvedicTreatment }: S6Props) {
  return (
    <View style={st.block}>
      <View style={st.prakCard}>
        <Ionicons name="information-circle-outline" size={16} color="#3B82F6" style={{ marginTop: 1 }} />
        <Text style={[st.prakText, { color: '#374151' }]}>
          Your medical history is encrypted and only shared with your care team.
          If a field does not apply, enter <Text style={{ fontWeight: '700' }}>"None"</Text>.
        </Text>
      </View>

      <MultiSelectPill
        label="Existing Conditions  (select all that apply)"
        options={[
          'None', 'Diabetes', 'Hypertension', 'Thyroid',
          'Asthma', 'Heart Disease', 'PCOS', 'Arthritis', 'Other',
        ]}
        value={conditions}
        onChange={setConditions}
        columns
      />

      <View style={f.wrapper}>
        <Ionicons name="medkit-outline" size={17} color={GRAY_TEXT} style={f.icon} />
        <TextInput
          style={f.input}
          placeholder="Current Medications  (or type None)"
          placeholderTextColor={GRAY_TEXT}
          value={medications}
          onChangeText={setMedications}
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </View>

      <View style={f.wrapper}>
        <Ionicons name="alert-circle-outline" size={17} color={GRAY_TEXT} style={f.icon} />
        <TextInput
          style={f.input}
          placeholder="Known Allergies  (or type None)"
          placeholderTextColor={GRAY_TEXT}
          value={allergies}
          onChangeText={setAllergies}
          autoCapitalize="sentences"
          returnKeyType="done"
        />
      </View>

      <SelectPill
        label="Currently on Ayurvedic Treatment?"
        options={['Yes', 'No', 'Occasionally']}
        value={ayurvedicTreatment}
        onChange={setAyurvedicTreatment}
      />
    </View>
  );
}

// ── Step 7 — Emergency Contact ────────────────────────────────────────────────

interface S7Props {
  ecName:     string; setEcName:     (v: string) => void;
  ecRelation: string; setEcRelation: (v: string) => void;
  ecPhone:    string; setEcPhone:    (v: string) => void;
}

function Step7({ ecName, setEcName, ecRelation, setEcRelation, ecPhone, setEcPhone }: S7Props) {
  return (
    <View style={st.block}>
      <View style={ec.card}>
        <Ionicons name="shield-checkmark-outline" size={20} color={GREEN} style={{ marginTop: 1 }} />
        <Text style={ec.text}>
          Emergency contacts are only contacted by healthcare providers in a
          critical situation. This information is encrypted at rest.
        </Text>
      </View>

      <Field
        icon="person-outline"
        placeholder="Contact Full Name"
        value={ecName}
        onChange={setEcName}
        capitalize="words"
      />

      <SelectPill
        label="Relationship to You"
        options={['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other']}
        value={ecRelation}
        onChange={setEcRelation}
      />

      <Field
        icon="call-outline"
        placeholder="Emergency Phone Number"
        value={ecPhone}
        onChange={setEcPhone}
        keyboardType="phone-pad"
        contentType="telephoneNumber"
        returnKey="done"
      />
    </View>
  );
}

// ── Step metadata ─────────────────────────────────────────────────────────────

const STEP_META: Array<{
  title:    string;
  subtitle: string;
  icon:     React.ComponentProps<typeof Ionicons>['name'];
}> = [
  {
    title:    'Create Account',
    subtitle: 'Join Vedarogya — your health, your story',
    icon:     'person-add-outline',
  },
  {
    title:    'Personal Details',
    subtitle: 'Help us personalise your wellness journey',
    icon:     'id-card-outline',
  },
  {
    title:    'Verify Your Phone',
    subtitle: '', // OTP step has its own full-screen header
    icon:     'phone-portrait-outline',
  },
  {
    title:    'Body Metrics',
    subtitle: 'Your physical baseline for accurate insights',
    icon:     'body-outline',
  },
  {
    title:    'Ayurvedic Profile',
    subtitle: 'Discover your unique mind-body constitution',
    icon:     'leaf-outline',
  },
  {
    title:    'Medical History',
    subtitle: 'Secure, encrypted, shared only with your care team',
    icon:     'medkit-outline',
  },
  {
    title:    'Emergency Contact',
    subtitle: 'Who should we call in a critical situation?',
    icon:     'shield-outline',
  },
];

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const router          = useRouter();
  const insets          = useSafeAreaInsets();
  const { register }    = useAuth();
  const scrollRef       = useRef<ScrollView>(null);
  const otpRefs         = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);

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
  const [dob,        setDob       ] = useState('');
  const [gender,     setGender    ] = useState('');
  const [phone,      setPhone     ] = useState('');

  // Step 3 — OTP
  const [otpDigits,  setOtpDigits ] = useState<string[]>(Array(6).fill(''));

  // Step 4
  const [heightCm,      setHeightCm     ] = useState('');
  const [weightKg,      setWeightKg     ] = useState('');
  const [bloodGroup,    setBloodGroup   ] = useState('');
  const [activityLevel, setActivityLevel] = useState('');

  // Step 5
  const [dosha,          setDosha         ] = useState('');
  const [healthConcerns, setHealthConcerns] = useState<string[]>([]);
  const [dietPreference, setDietPreference] = useState('');
  const [lifestyle,      setLifestyle     ] = useState('');

  // Step 6
  const [conditions,         setConditions        ] = useState<string[]>([]);
  const [medications,        setMedications       ] = useState('');
  const [allergies,          setAllergies         ] = useState('');
  const [ayurvedicTreatment, setAyurvedicTreatment] = useState('');

  // Step 7
  const [ecName,     setEcName    ] = useState('');
  const [ecRelation, setEcRelation] = useState('');
  const [ecPhone,    setEcPhone   ] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError    ] = useState<string | null>(null);

  // Slide animation
  const slideX = useRef(new Animated.Value(0)).current;

  function animateStep(dir: 'forward' | 'back', next: number) {
    const from = dir === 'forward' ? SW : -SW;
    slideX.setValue(from);
    setStep(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    Animated.spring(slideX, {
      toValue:         0,
      damping:         22,
      stiffness:       200,
      useNativeDriver: true,
    }).start();
  }

  // Auto-focus first OTP box when step 3 mounts
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 400);
      return () => clearTimeout(t);
    }
  }, [step]);

  // ── Validation ─────────────────────────────────────────────────────────────

  function validateStep(): string | null {
    switch (step) {
      case 1:
        if (!firstName.trim())  return 'First name is required.';
        if (!lastName.trim())   return 'Last name is required.';
        if (!email.trim())      return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
                                return 'Enter a valid email address.';
        if (password.length < 8) return 'Password must be at least 8 characters.';
        if (!PW_REGEX.test(password))
                                return 'Password needs uppercase, lowercase, number & special character (@$!%*?&).';
        if (password !== confirmPw) return 'Passwords do not match.';
        break;

      case 2:
        if (!dob.trim())        return 'Please select your date of birth.';
        if (!gender)            return 'Please select your gender.';
        if (!phone.trim())      return 'Mobile number is required.';
        if (phone.trim().replace(/\D/g, '').length < 10)
                                return 'Enter a valid 10-digit mobile number.';
        break;

      case 3:
        if (otpDigits.some(d => !d)) return 'Please enter all 6 digits of the OTP.';
        break;

      case 4:
        if (!heightCm.trim())   return 'Height is required.';
        if (!weightKg.trim())   return 'Weight is required.';
        if (!bloodGroup)        return 'Please select your blood group.';
        if (!activityLevel)     return 'Please select your activity level.';
        break;

      case 5:
        if (!dosha)                   return 'Please select your Prakriti / Dosha.';
        if (healthConcerns.length === 0) return 'Select at least one health concern.';
        if (!dietPreference)          return 'Please select your diet preference.';
        if (!lifestyle)               return 'Please select your lifestyle.';
        break;

      case 6:
        if (conditions.length === 0)  return 'Select at least one condition (choose "None" if not applicable).';
        if (!medications.trim())      return 'Please list current medications (or enter "None").';
        if (!allergies.trim())        return 'Please list known allergies (or enter "None").';
        if (!ayurvedicTreatment)      return 'Please indicate if you are on Ayurvedic treatment.';
        break;

      case 7:
        if (!ecName.trim())           return 'Emergency contact name is required.';
        if (!ecRelation)              return 'Please select the relationship.';
        if (!ecPhone.trim())          return 'Emergency contact phone is required.';
        if (ecPhone.trim().replace(/\D/g, '').length < 10)
                                      return 'Enter a valid emergency contact number.';
        break;
    }
    return null;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  // TODO: wire real SMS gateway before production
  const handleResendOtp = useCallback(async () => {
    // no-op for now — any 6-digit code is accepted
  }, []);

  async function handleNext() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);

    // Step 2 → 3: skip real OTP send, just navigate
    if (step === 2) {
      animateStep('forward', 3);
      setTimeout(() => otpRefs.current[0]?.focus(), 500);
      return;
    }

    // Step 3: skip real verification — any 6 digits pass
    if (step === 3) {
      animateStep('forward', 4);
      return;
    }

    // Steps 4–6: just slide
    if (step < TOTAL_STEPS) {
      animateStep('forward', step + 1);
      return;
    }

    // Step 7: final registration
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
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(auth)/login');
      }
    }
  }

  const meta       = STEP_META[step - 1];
  const isLastStep = step === TOTAL_STEPS;
  const isOtpStep  = step === 3;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" />
      <View style={[s.statusCover, { height: insets.top }]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[s.scroll, { paddingTop: insets.top + 16 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Nav bar ───────────────────────────────────────────── */}
          <View style={s.navBar}>
            <TouchableOpacity onPress={handleBack} style={s.backBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color={DARK} />
            </TouchableOpacity>
            <Text style={s.stepLabel}>Step {step} of {TOTAL_STEPS}</Text>
          </View>

          {/* ── Progress bar ──────────────────────────────────────── */}
          <StepBar current={step} />

          {/* ── Step header (skip for OTP step — it has its own) ──── */}
          {!isOtpStep && (
            <Animated.View style={[s.header, { transform: [{ translateX: slideX }] }]}>
              <View style={s.stepIcon}>
                <Ionicons name={meta.icon} size={22} color={GREEN} />
              </View>
              <Text style={s.title}>{meta.title}</Text>
              <Text style={s.subtitle}>{meta.subtitle}</Text>
            </Animated.View>
          )}

          {/* ── Error banner ──────────────────────────────────────── */}
          {error ? (
            <View style={s.errorPill}>
              <Ionicons name="alert-circle-outline" size={14} color="#DC2626" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* ── Step content ──────────────────────────────────────── */}
          <Animated.View style={{ transform: [{ translateX: slideX }] }}>
            {step === 1 && (
              <Step1
                firstName={firstName}  setFirstName={setFirstName}
                lastName={lastName}    setLastName={setLastName}
                email={email}          setEmail={setEmail}
                password={password}    setPassword={setPassword}
                confirmPw={confirmPw}  setConfirmPw={setConfirmPw}
                showPw={showPw}        setShowPw={setShowPw}
                showCPw={showCPw}      setShowCPw={setShowCPw}
              />
            )}
            {step === 2 && (
              <Step2
                dob={dob}     setDob={setDob}
                gender={gender} setGender={setGender}
                phone={phone}  setPhone={setPhone}
              />
            )}
            {step === 3 && (
              <Step3
                digits={otpDigits}
                setDigits={setOtpDigits}
                refs={otpRefs}
                phone={phone}
                onResend={handleResendOtp}
              />
            )}
            {step === 4 && (
              <Step4
                heightCm={heightCm}           setHeightCm={setHeightCm}
                weightKg={weightKg}           setWeightKg={setWeightKg}
                bloodGroup={bloodGroup}       setBloodGroup={setBloodGroup}
                activityLevel={activityLevel} setActivityLevel={setActivityLevel}
              />
            )}
            {step === 5 && (
              <Step5
                dosha={dosha}                       setDosha={setDosha}
                healthConcerns={healthConcerns}     setHealthConcerns={setHealthConcerns}
                dietPreference={dietPreference}     setDietPreference={setDietPreference}
                lifestyle={lifestyle}               setLifestyle={setLifestyle}
              />
            )}
            {step === 6 && (
              <Step6
                conditions={conditions}               setConditions={setConditions}
                medications={medications}             setMedications={setMedications}
                allergies={allergies}                 setAllergies={setAllergies}
                ayurvedicTreatment={ayurvedicTreatment} setAyurvedicTreatment={setAyurvedicTreatment}
              />
            )}
            {step === 7 && (
              <Step7
                ecName={ecName}         setEcName={setEcName}
                ecRelation={ecRelation} setEcRelation={setEcRelation}
                ecPhone={ecPhone}       setEcPhone={setEcPhone}
              />
            )}
          </Animated.View>

          {/* ── CTA ──────────────────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={isLoading ? 1 : 0.88}
            style={[s.cta, isLoading && s.ctaDim]}>
            {isLoading
              ? <ActivityIndicator size="small" color="#FFFFFF" />
              : <>
                  <Text style={s.ctaText}>
                    {isLastStep   ? 'Create Account'
                    : isOtpStep  ? 'Verify & Continue'
                    : 'Continue'}
                  </Text>
                  {!isLastStep && (
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
                  )}
                </>
            }
          </TouchableOpacity>

          {/* ── Sign in link (step 1 only) ────────────────────────── */}
          {step === 1 && (
            <View style={s.signInRow}>
              <Text style={s.signInText}>
                {'Already have an account? '}
                <Text style={s.signInLink} onPress={() => router.replace('/(auth)/login')}>
                  Sign In
                </Text>
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Field styles ──────────────────────────────────────────────────────────────

const f = StyleSheet.create({
  wrapper: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   GRAY_BG,
    borderRadius:      INPUT_R,
    paddingHorizontal: 16,
    height:            INPUT_H,
    marginBottom:      10,
  },
  icon:  { marginRight: 10 },
  input: {
    flex:     1,
    fontSize: 15,
    color:    DARK,
    height:   '100%',
  },
  eye: {
    position: 'absolute',
    right:    14,
    padding:  6,
  },
});

// ── DOB trigger styles ────────────────────────────────────────────────────────

const dob2 = StyleSheet.create({
  trigger: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   GRAY_BG,
    borderRadius:      INPUT_R,
    paddingHorizontal: 16,
    height:            INPUT_H,
    marginBottom:      10,
  },
  triggerText: {
    fontSize:   15,
    color:      GRAY_TEXT,
    flex:       1,
  },
  triggerTextFilled: {
    color:      DARK,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

// ── Select pill styles ────────────────────────────────────────────────────────

const sel = StyleSheet.create({
  wrap:  { marginBottom: 14 },
  label: {
    fontSize:      11.5,
    fontWeight:    '600',
    color:         LABEL_COLOR,
    letterSpacing: 0.3,
    marginBottom:  8,
    paddingLeft:   2,
  },
  row: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           8,
  },
  pill: {
    paddingHorizontal: 15,
    paddingVertical:   8,
    borderRadius:      PILL_R,
    backgroundColor:   GRAY_BG,
  },
  active:     { backgroundColor: DARK },
  text:       { fontSize: 13, fontWeight: '500', color: '#6B7280' },
  textActive: { color: '#FFFFFF' },
});

// ── Step bar styles ───────────────────────────────────────────────────────────

const sb = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap:           5,
    marginBottom:  28,
  },
  seg:    { flex: 1, height: 4, borderRadius: 2 },
  done:   { backgroundColor: GREEN },
  active: { backgroundColor: DARK },
  idle:   { backgroundColor: '#E5E7EB' },
});

// ── Step block styles ─────────────────────────────────────────────────────────

const st = StyleSheet.create({
  block: { marginBottom: 8 },
  row:   { flexDirection: 'row', gap: 10, marginBottom: 0 },

  // Password strength
  strengthRow: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    marginTop:         -4,
    marginBottom:      6,
    paddingHorizontal: 2,
  },
  bars: { flexDirection: 'row', flex: 1, gap: 5 },
  bar:  { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '600', minWidth: 44, textAlign: 'right' },

  // Match indicator
  matchRow: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    paddingHorizontal: 2,
    marginTop:         -4,
    marginBottom:      8,
  },
  matchText: { fontSize: 12, fontWeight: '500' },

  // Phone note
  phoneNote: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    marginTop:         -4,
    marginBottom:      6,
    paddingHorizontal: 2,
  },
  phoneNoteText: {
    fontSize:   12,
    color:      '#6B7280',
    flex:       1,
    lineHeight: 16,
  },

  // Prakriti info card
  prakCard: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    gap:               8,
    backgroundColor:   '#F0FBF5',
    borderRadius:      12,
    padding:           12,
    marginBottom:      14,
  },
  prakText: {
    flex:       1,
    fontSize:   12.5,
    color:      '#374151',
    lineHeight: 18,
  },
});

// ── OTP styles ────────────────────────────────────────────────────────────────

const otp = StyleSheet.create({
  container: {
    alignItems:   'center',
    paddingTop:   4,
    marginBottom: 8,
  },

  // Icon — double ring
  iconOuter: {
    width:           88,
    height:          88,
    borderRadius:    44,
    backgroundColor: 'rgba(44,110,73,0.07)',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    24,
  },
  iconInner: {
    width:           64,
    height:          64,
    borderRadius:    32,
    backgroundColor: '#EBF6F0',
    alignItems:      'center',
    justifyContent:  'center',
  },

  // Heading
  title: {
    fontSize:      26,
    fontWeight:    '800',
    color:         DARK,
    letterSpacing: -0.6,
    marginBottom:  8,
    textAlign:     'center',
  },
  sub: {
    fontSize:     13.5,
    color:        LABEL_COLOR,
    marginBottom: 10,
    textAlign:    'center',
  },

  // Phone pill
  phonePill: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    backgroundColor:   '#F0FBF5',
    borderRadius:      999,
    paddingVertical:   6,
    paddingHorizontal: 14,
    marginBottom:      28,
  },
  phoneNum: {
    fontSize:      14,
    fontWeight:    '700',
    color:         DARK,
    letterSpacing: 0.5,
  },

  // Boxes row
  boxRow: {
    flexDirection:  'row',
    gap:            9,
    justifyContent: 'center',
    marginBottom:   16,
  },

  // Each box wrapper (border lives here, not on TextInput)
  boxWrap: {
    width:           48,
    height:          62,
    borderRadius:    16,
    backgroundColor: '#F5F6F8',
    borderWidth:     1.5,
    borderColor:     '#EAECF0',
    alignItems:      'center',
    justifyContent:  'center',
    // no shadow when empty
  },
  boxWrapFilled: {
    backgroundColor: '#FFFFFF',
    borderColor:     DARK,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.07,
    shadowRadius:    6,
    elevation:       3,
  },
  boxWrapFocused: {
    borderColor:     GREEN,
    borderWidth:     1.5,
    backgroundColor: '#FFFFFF',
    shadowColor:     GREEN,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.18,
    shadowRadius:    8,
    elevation:       2,
  },
  boxInput: {
    width:       '100%',
    height:      '100%',
    textAlign:   'center',
    fontSize:    26,
    fontWeight:  '700',
    color:       DARK,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },

  // Progress dots under boxes
  dotsRow: {
    flexDirection:  'row',
    gap:            6,
    justifyContent: 'center',
    marginBottom:   20,
  },
  dot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: '#E2E8F0',
  },
  dotFilled: {
    backgroundColor: GREEN,
    width:           16,
    borderRadius:    3,
  },

  // Timer card
  timerCard: {
    width:             '85%',
    backgroundColor:   '#F8FAFC',
    borderRadius:      14,
    paddingHorizontal: 16,
    paddingVertical:   12,
    marginBottom:      16,
    alignItems:        'center',
    gap:               8,
  },
  timerLabelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  timerLabel: {
    fontSize:   13,
    color:      '#64748B',
  },
  timerCount: {
    fontWeight: '700',
    color:      DARK,
  },
  timerTrack: {
    width:           '100%',
    height:          3,
    backgroundColor: '#E2E8F0',
    borderRadius:    999,
    overflow:        'hidden',
  },
  timerFill: {
    height:          '100%',
    backgroundColor: GREEN,
    borderRadius:    999,
  },

  // Expired badge
  expiredBadge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    backgroundColor:   '#FFFBEB',
    borderRadius:      999,
    paddingVertical:   6,
    paddingHorizontal: 12,
    marginBottom:      16,
  },
  expiredText: {
    fontSize:   12.5,
    fontWeight: '600',
    color:      '#B45309',
  },

  // Resend
  resendRow: {
    flexDirection: 'row',
    alignItems:    'center',
    flexWrap:      'wrap',
    justifyContent:'center',
    marginTop:     2,
  },
  resendLabel: {
    fontSize: 13.5,
    color:    LABEL_COLOR,
  },
  resendBtnIdle: {
    paddingVertical:   4,
    paddingHorizontal: 2,
  },
  resendBtnActive: {
    paddingVertical:   4,
    paddingHorizontal: 2,
  },
  resendText: {
    fontSize:   13.5,
    fontWeight: '600',
    color:      '#CBD5E1',
  },
  resendTextActive: {
    color: GREEN,
  },
});

// ── Emergency contact styles ──────────────────────────────────────────────────

const ec = StyleSheet.create({
  card: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    gap:               10,
    backgroundColor:   '#F0FBF5',
    borderRadius:      14,
    padding:           14,
    marginBottom:      18,
  },
  text: {
    flex:       1,
    fontSize:   13,
    color:      '#374151',
    lineHeight: 18,
  },
});

// ── Root styles ───────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
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

  // Nav
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
    backgroundColor: GRAY_BG,
    alignItems:      'center',
    justifyContent:  'center',
  },
  stepLabel: {
    fontSize:   13,
    fontWeight: '500',
    color:      LABEL_COLOR,
  },

  // Header
  header: { marginBottom: 24 },
  stepIcon: {
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
    color:         DARK,
    letterSpacing: -0.7,
    marginBottom:  6,
  },
  subtitle: {
    fontSize:   14.5,
    color:      LABEL_COLOR,
    lineHeight: 20,
  },

  // Error
  errorPill: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               7,
    backgroundColor:   '#FEF2F2',
    borderRadius:      12,
    paddingVertical:   10,
    paddingHorizontal: 14,
    marginBottom:      12,
  },
  errorText: {
    fontSize:   13,
    color:      '#DC2626',
    flex:       1,
    lineHeight: 18,
  },

  // CTA
  cta: {
    backgroundColor: DARK,
    borderRadius:    PILL_R,
    height:          58,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       8,
    shadowColor:     DARK,
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.22,
    shadowRadius:    18,
    elevation:       10,
  },
  ctaDim: {
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

  // Sign in
  signInRow: { alignItems: 'center', marginTop: 18 },
  signInText: { fontSize: 14, color: LABEL_COLOR },
  signInLink: { fontWeight: '700', color: DARK, letterSpacing: -0.1 },
});
