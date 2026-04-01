import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SyncHealthDataDto {
  @IsOptional()
  @IsNumber()
  @Min(20) @Max(300)
  heartRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(50) @Max(100)
  spo2?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(200)
  hrv?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(100_000)
  steps?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(24)
  sleepHours?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(10_000)
  calories?: number;

  @IsOptional()
  @IsNumber()
  @Min(95) @Max(106)
  bodyTemp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) @Max(10)
  waterLiters?: number;

  @IsOptional()
  @IsString()
  deviceSource?: string;

  @IsDateString()
  recordedAt!: string;
}
