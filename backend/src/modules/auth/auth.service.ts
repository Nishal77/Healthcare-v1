import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AyurvedicProfile } from '../patients/entities/ayurvedic-profile.entity';
import { EmergencyContact } from '../patients/entities/emergency-contact.entity';
import { MedicalHistory } from '../patients/entities/medical-history.entity';
import { Patient } from '../patients/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './strategies/jwt.strategy';

// ── In-memory OTP store ───────────────────────────────────────────────────────
// TODO (production): replace with Redis + real SMS gateway (Twilio / MSG91).
interface OtpEntry {
  hash:      string;
  expiresAt: number;
}

// ── Date normalisation ────────────────────────────────────────────────────────

/**
 * Converts the wheel-picker format "DD / MM / YYYY" → "YYYY-MM-DD" for
 * storage as a PostgreSQL date column.
 */
function normaliseDob(raw: string): string {
  // Strip spaces then split on "/"
  const parts = raw.replace(/\s/g, '').split('/');
  if (parts.length !== 3) return raw; // pass through if already ISO
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

@Injectable()
export class AuthService {
  private readonly otpStore = new Map<string, OtpEntry>();

  constructor(
    private readonly dataSource:    DataSource,
    private readonly usersService:  UsersService,
    private readonly jwtService:    JwtService,
    private readonly config:        ConfigService,
    private readonly auditLog:      AuditLogService,
  ) {}

  // ── OTP (dev bypass — wire real SMS before production) ────────────────────

  async sendOtp(phone: string): Promise<{ expiresIn: number }> {
    const code      = Math.floor(100_000 + Math.random() * 900_000).toString();
    const hash      = await bcrypt.hash(code, 8);
    const expiresAt = Date.now() + 5 * 60 * 1_000; // 5 minutes

    this.otpStore.set(phone, { hash, expiresAt });

    // TODO: send via SMS gateway in production
    console.log(`[OTP DEV] Phone: ${phone} → Code: ${code}`);

    return { expiresIn: 120 };
  }

  async verifyOtp(phone: string, otp: string): Promise<{ verified: boolean }> {
    const stored = this.otpStore.get(phone);

    if (!stored) {
      throw new BadRequestException(
        'No OTP found for this number. Please request a new code.',
      );
    }

    if (Date.now() > stored.expiresAt) {
      this.otpStore.delete(phone);
      throw new BadRequestException('OTP has expired. Please request a new code.');
    }

    const valid = await bcrypt.compare(otp, stored.hash);
    if (!valid) {
      throw new UnauthorizedException('Incorrect OTP. Please try again.');
    }

    this.otpStore.delete(phone); // one-time use
    return { verified: true };
  }

  // ── Registration — single transaction ─────────────────────────────────────

  /**
   * Creates all records atomically:
   *   users → patient_profiles → ayurvedic_profiles → medical_histories → emergency_contacts
   *
   * If any step fails the entire transaction rolls back — no orphan rows.
   */
  async register(dto: RegisterDto, ip?: string) {
    // ── 1. Duplicate email guard (fast path before opening transaction) ────
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('An account with this email already exists.');

    // ── 2. Atomic multi-table insert ──────────────────────────────────────
    let newUser: User;

    await this.dataSource.transaction(async (manager) => {
      // ── 2a. User (auth) ───────────────────────────────────────────────
      const user = manager.create(User, {
        email:        dto.email.trim().toLowerCase(),
        passwordHash: dto.password, // hashed by @BeforeInsert on User entity
        firstName:    dto.firstName.trim(),
        lastName:     dto.lastName.trim(),
        role:         dto.role ?? 'patient',
      });
      newUser = await manager.save(User, user);

      // ── 2b. Patient profile (personal details + body metrics) ─────────
      await manager.save(
        Patient,
        manager.create(Patient, {
          userId:        newUser.id,
          phone:         dto.phone.trim(),
          phoneVerified: false, // promote to true once real OTP is wired
          dateOfBirth:   normaliseDob(dto.dateOfBirth),
          gender:        dto.gender,
          heightCm:      parseFloat(dto.heightCm),
          weightKg:      parseFloat(dto.weightKg),
          bloodGroup:    dto.bloodGroup,
          activityLevel: dto.activityLevel,
        }),
      );

      // ── 2c. Ayurvedic profile ─────────────────────────────────────────
      await manager.save(
        AyurvedicProfile,
        manager.create(AyurvedicProfile, {
          userId:         newUser.id,
          prakriti:       dto.prakriti,
          healthConcerns: dto.healthConcerns,
          dietPreference: dto.dietPreference,
          lifestyle:      dto.lifestyle,
        }),
      );

      // ── 2d. Medical history ───────────────────────────────────────────
      await manager.save(
        MedicalHistory,
        manager.create(MedicalHistory, {
          userId:               newUser.id,
          existingConditions:   dto.existingConditions,
          currentMedications:   dto.currentMedications.trim(),
          knownAllergies:       dto.knownAllergies.trim(),
          onAyurvedicTreatment: dto.onAyurvedicTreatment,
        }),
      );

      // ── 2e. Emergency contact ─────────────────────────────────────────
      await manager.save(
        EmergencyContact,
        manager.create(EmergencyContact, {
          userId:       newUser.id,
          contactName:  dto.emergencyContactName.trim(),
          relationship: dto.emergencyContactRelation,
          primaryPhone: dto.emergencyContactPhone.trim(),
        }),
      );
    });

    // ── 3. Audit log (outside transaction — logging must not block signup) ─
    await this.auditLog.log({
      userId:       newUser!.id,
      action:       'CREATE',
      resourceType: 'User',
      resourceId:   newUser!.id,
      ipAddress:    ip,
      metadata:     { source: 'registration', steps: 7 },
    });

    // ── 4. Issue tokens ───────────────────────────────────────────────────
    return this.generateTokens(newUser!.id, newUser!.email, newUser!.role);
  }

  // ── Login ──────────────────────────────────────────────────────────────────

  async login(dto: LoginDto, ip?: string) {
    const user = await this.usersService.findByEmail(dto.email, true);

    if (!user) {
      await this.auditLog.log({
        action:       'LOGIN_FAILED',
        resourceType: 'Auth',
        ipAddress:    ip,
        metadata:     { email: dto.email },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await user.comparePassword(dto.password);
    if (!valid) {
      await this.auditLog.log({
        userId:       user.id,
        action:       'LOGIN_FAILED',
        resourceType: 'Auth',
        ipAddress:    ip,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    const hash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hash);

    await this.auditLog.log({
      userId:       user.id,
      action:       'LOGIN',
      resourceType: 'Auth',
      ipAddress:    ip,
    });

    return tokens;
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    await this.auditLog.log({
      userId,
      action:       'LOGOUT',
      resourceType: 'Auth',
    });
  }

  // ── Token generation ──────────────────────────────────────────────────────

  private async generateTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret:    this.config.getOrThrow('jwt.secret'),
        expiresIn: this.config.get('jwt.expiresIn', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret:    this.config.getOrThrow('jwt.refreshSecret'),
        expiresIn: this.config.get('jwt.refreshExpiresIn', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
