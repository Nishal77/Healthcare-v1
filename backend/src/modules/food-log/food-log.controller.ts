import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

import { CreateFoodLogDto } from './dto/create-food-log.dto';
import { FoodLogService } from './food-log.service';

@ApiTags('food-log')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('food-log')
export class FoodLogController {
  constructor(private readonly foodLogService: FoodLogService) {}

  // ── POST /food-log ─────────────────────────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Add a new food / activity log entry' })
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateFoodLogDto,
  ) {
    return this.foodLogService.create(user.id, dto);
  }

  // ── GET /food-log?date=2024-04-09 ─────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Get all entries for a specific date' })
  @ApiQuery({ name: 'date', example: '2024-04-09', description: 'Local calendar date YYYY-MM-DD' })
  findByDate(
    @CurrentUser() user: User,
    @Query('date') date: string,
  ) {
    const dateStr = date ?? new Date().toISOString().slice(0, 10);
    return this.foodLogService.findByDate(user.id, dateStr);
  }

  // ── GET /food-log/summary?date=2024-04-09 ─────────────────────────────────
  @Get('summary')
  @ApiOperation({ summary: 'Daily totals: calories, water, exercise, meal count' })
  @ApiQuery({ name: 'date', example: '2024-04-09' })
  summary(
    @CurrentUser() user: User,
    @Query('date') date: string,
  ) {
    const dateStr = date ?? new Date().toISOString().slice(0, 10);
    return this.foodLogService.getDailySummary(user.id, dateStr);
  }

  // ── GET /food-log/week?date=2024-04-09 ────────────────────────────────────
  @Get('week')
  @ApiOperation({ summary: 'Mon–Sun aggregation for the week containing date' })
  @ApiQuery({ name: 'date', example: '2024-04-09' })
  week(
    @CurrentUser() user: User,
    @Query('date') date: string,
  ) {
    const dateStr = date ?? new Date().toISOString().slice(0, 10);
    return this.foodLogService.getWeeklySummary(user.id, dateStr);
  }

  // ── DELETE /food-log/:id ───────────────────────────────────────────────────
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a log entry (audit-trail preserved)' })
  remove(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.foodLogService.remove(user.id, id);
  }
}
