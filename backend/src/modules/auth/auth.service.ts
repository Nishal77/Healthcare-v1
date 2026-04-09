import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuditLogService } from '../audit-log/audit-log.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './strategies/jwt.strategy';

// ── In-memory OTP store ───────────────────────────────────────────────────────
// In production replace with Redis + Twilio/MSG91.
interface OtpEntry {
  hash:      string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly otpStore = new Map<string, OtpEntry>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService:   JwtService,
    private readonly config:        ConfigService,
    private readonly auditLog:      AuditLogService,
  ) {}

  // ── OTP ───────────────────────────────────────────────────────────────────

  async sendOtp(phone: string): Promise<{ expiresIn: number }> {
    const code      = Math.floor(100_000 + Math.random() * 900_000).toString();
    const hash      = await bcrypt.hash(code, 8);
    const expiresAt = Date.now() + 5 * 60 * 1_000; // 5 minutes

    this.otpStore.set(phone, { hash, expiresAt });

    // TODO (production): send via SMS gateway (Twilio / MSG91 / etc.)
    console.log(`[OTP DEV] Phone: ${phone} → Code: ${code}`);

    return { expiresIn: 120 }; // tell client 2-minute UI countdown
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
      throw new BadRequestException(
        'OTP has expired. Please request a new code.',
      );
    }

    const valid = await bcrypt.compare(otp, stored.hash);

    if (!valid) {
      throw new UnauthorizedException('Incorrect OTP. Please try again.');
    }

    // One-time use: remove after successful verification
    this.otpStore.delete(phone);
    return { verified: true };
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto, ip?: string) {
    const user = await this.usersService.create({
      email:        dto.email,
      passwordHash: dto.password,
      firstName:    dto.firstName,
      lastName:     dto.lastName,
      role:         dto.role,
    });

    await this.auditLog.log({
      userId:       user.id,
      action:       'CREATE',
      resourceType: 'User',
      resourceId:   user.id,
      ipAddress:    ip,
    });

    return this.generateTokens(user.id, user.email, user.role);
  }

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

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    await this.auditLog.log({
      userId,
      action:       'LOGOUT',
      resourceType: 'Auth',
    });
  }

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
