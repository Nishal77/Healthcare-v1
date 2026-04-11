export type UserRole = 'patient' | 'provider' | 'admin';

export interface AuthUser {
  id:            string;
  email:         string;
  role:          UserRole;
  firstName:     string;
  lastName:      string;
  emailVerified: boolean;
  isActive:      boolean;
  createdAt:     string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

/** Mirrors RegisterDto — all 7 onboarding steps. */
export interface RegisterPayload {
  // Step 1 — Account
  email:     string;
  password:  string;
  firstName: string;
  lastName:  string;
  role:      UserRole;

  // Step 2 — Personal Details
  phone:       string;
  dateOfBirth: string;
  gender:      string;

  // Step 4 — Body Metrics
  heightCm:      string;
  weightKg:      string;
  bloodGroup:    string;
  activityLevel: string;

  // Step 5 — Ayurvedic Profile
  prakriti:       string;
  healthConcerns: string[];
  dietPreference: string;
  lifestyle:      string;

  // Step 6 — Medical History
  existingConditions:   string[];
  currentMedications:   string;
  knownAllergies:       string;
  onAyurvedicTreatment: string;

  // Step 7 — Emergency Contact
  emergencyContactName:     string;
  emergencyContactRelation: string;
  emergencyContactPhone:    string;
}

export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
}
