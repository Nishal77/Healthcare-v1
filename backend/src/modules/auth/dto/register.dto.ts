import { IsEmail, IsIn, IsString, Matches, MinLength } from 'class-validator';
import type { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  // HIPAA: enforce strong password policy
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;

  @IsString()
  @MinLength(1)
  firstName!: string;

  @IsString()
  @MinLength(1)
  lastName!: string;

  @IsIn(['patient', 'provider'])
  role!: UserRole;
}
