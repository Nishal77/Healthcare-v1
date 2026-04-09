import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateQueryDto {
  /** Local calendar date: "2024-04-09" */
  @ApiProperty({ example: '2024-04-09' })
  @IsNotEmpty()
  @IsDateString()
  date!: string;
}
