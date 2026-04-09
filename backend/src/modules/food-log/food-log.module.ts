import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodLog } from './food-log.entity';
import { FoodLogService } from './food-log.service';
import { FoodLogController } from './food-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FoodLog])],
  providers: [FoodLogService],
  controllers: [FoodLogController],
  exports: [FoodLogService],
})
export class FoodLogModule {}
