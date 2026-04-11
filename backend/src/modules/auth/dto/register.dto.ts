import {
  IsArray,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsEmail,
  IsNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { UserRole } from '../../users/entities/user.entity';

// ── Step 1 — Account Setup ────────────────────────────────────────────────────

export class RegisterDto {
  @IsEmail({}, { message: 'Enter a valid email address' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  // ── Step 2 — Personal Details ───────────────────────────────────────────────

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone!: string;

  /**
   * Date of birth as displayed in the wheel picker: "DD / MM / YYYY"
   * Stored normalised as ISO date "YYYY-MM-DD" in the database.
   */
  @IsString()
  @IsNotEmpty({ message: 'Date of birth is required' })
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty({ message: 'Gender is required' })
  gender!: string;

  // ── Step 4 — Body Metrics ───────────────────────────────────────────────────

  @IsString()
  @IsNotEmpty({ message: 'Height is required' })
  heightCm!: string;

  @IsString()
  @IsNotEmpty({ message: 'Weight is required' })
  weightKg!: string;

  @IsString()
  @IsNotEmpty({ message: 'Blood group is required' })
  bloodGroup!: string;

  @IsString()
  @IsNotEmpty({ message: 'Activity level is required' })
  activityLevel!: string;

  // ── Step 5 — Ayurvedic Profile ──────────────────────────────────────────────

  @IsString()
  @IsNotEmpty({ message: 'Prakriti / Dosha is required' })
  prakriti!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Select at least one health concern' })
  @IsString({ each: true })
  healthConcerns!: string[];

  @IsString()
  @IsNotEmpty({ message: 'Diet preference is required' })
  dietPreference!: string;

  @IsString()
  @IsNotEmpty({ message: 'Lifestyle is required' })
  lifestyle!: string;

  // ── Step 6 — Medical History ────────────────────────────────────────────────

  @IsArray()
  @ArrayMinSize(1, { message: 'Select at least one condition' })
  @IsString({ each: true })
  existingConditions!: string[];

  @IsString()
  @IsNotEmpty({ message: 'Current medications field is required (enter None if not applicable)' })
  currentMedications!: string;

  @IsString()
  @IsNotEmpty({ message: 'Allergies field is required (enter None if not applicable)' })
  knownAllergies!: string;

  @IsString()
  @IsNotEmpty({ message: 'Ayurvedic treatment status is required' })
  onAyurvedicTreatment!: string;

  // ── Step 7 — Emergency Contact ──────────────────────────────────────────────

  @IsString()
  @IsNotEmpty({ message: 'Emergency contact name is required' })
  emergencyContactName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Emergency contact relationship is required' })
  emergencyContactRelation!: string;

  @IsString()
  @IsNotEmpty({ message: 'Emergency contact phone is required' })
  emergencyContactPhone!: string;

  // ── Internal — set by the app, not the user ─────────────────────────────────

  @IsOptional()
  @IsIn(['patient', 'provider'])
  role?: UserRole;
}
