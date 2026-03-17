import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User } from '../users/entities/user.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { MedicalRecordsService } from './medical-records.service';

@ApiTags('medical-records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

  @Get()
  @Roles('patient', 'provider')
  @ApiOperation({ summary: 'List medical records for a patient' })
  list(@CurrentUser() user: User, @Query('patientId') patientId?: string) {
    const pid = user.role === 'patient' ? user.id : (patientId ?? user.id);
    return this.service.listForPatient(pid, user.id, user.role);
  }

  @Get(':id')
  @Roles('patient', 'provider')
  @ApiOperation({ summary: 'Get a single medical record' })
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne(id, user.id, user.role);
  }

  @Post()
  @Roles('provider')
  @ApiOperation({ summary: 'Create a medical record (provider only)' })
  create(@CurrentUser() user: User, @Body() dto: CreateMedicalRecordDto) {
    return this.service.create(dto, user.id);
  }
}
