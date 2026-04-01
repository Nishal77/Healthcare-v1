import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SyncHealthDataDto } from './dto/sync-health-data.dto';
import { HealthSyncService } from './health-sync.service';

@Controller('health-sync')
@UseGuards(JwtAuthGuard)
export class HealthSyncController {
  constructor(private readonly svc: HealthSyncService) {}

  @Post('sync')
  async sync(@Body() dto: SyncHealthDataDto, @Req() req: Request) {
    const userId = (req as any).user?.sub as string;
    const ip     = req.ip ?? 'unknown';
    return this.svc.syncReading(userId, dto, ip);
  }

  @Get('latest')
  async latest(@Req() req: Request) {
    const userId = (req as any).user?.sub as string;
    return this.svc.getLatestReading(userId);
  }

  @Get('history')
  async history(@Req() req: Request, @Query('days') days?: string) {
    const userId = (req as any).user?.sub as string;
    return this.svc.getReadingHistory(userId, days ? parseInt(days, 10) : 7);
  }

  @Get('dosha/latest')
  async doshaLatest(@Req() req: Request) {
    const userId = (req as any).user?.sub as string;
    return this.svc.getLatestDoshaAnalysis(userId);
  }

  @Get('dosha/history')
  async doshaHistory(@Req() req: Request) {
    const userId = (req as any).user?.sub as string;
    return this.svc.getDoshaHistory(userId);
  }
}
