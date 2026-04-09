import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { EntryType } from '../food-log.entity';

const ENTRY_TYPES: EntryType[] = ['meal', 'water', 'mood', 'exercise', 'medicine', 'note'];

export class CreateFoodLogDto {
  @ApiProperty({ enum: ENTRY_TYPES, example: 'meal' })
  @IsIn(ENTRY_TYPES)
  entryType!: EntryType;

  @ApiProperty({ example: 'Breakfast' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 120)
  title!: string;

  @ApiPropertyOptional({ example: 'Brown rice · dal · sabzi' })
  @IsOptional()
  @IsString()
  @Length(0, 300)
  detail?: string;

  @ApiPropertyOptional({ example: '320 kcal' })
  @IsOptional()
  @IsString()
  @Length(0, 80)
  displayValue?: string;

  @ApiPropertyOptional({ example: 320 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99_999)
  numericValue?: number;

  @ApiPropertyOptional({ example: 'kcal', enum: ['kcal', 'ml', 'min', 'steps', 'kg', 'hrs'] })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  unit?: string;

  @ApiPropertyOptional({ example: '😊' })
  @IsOptional()
  @IsString()
  @Length(1, 8)
  moodEmoji?: string;

  /**
   * ISO 8601 datetime of the actual activity.
   * Defaults to server time when omitted.
   */
  @ApiPropertyOptional({ example: '2024-04-09T08:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  loggedAt?: string;
}
