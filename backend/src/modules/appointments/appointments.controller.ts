import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User } from '../users/entities/user.entity';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles('patient')
  @ApiOperation({ summary: 'List own appointments' })
  list(@CurrentUser() user: User) {
    return this.appointmentsService.listForPatient(user.id, user.id);
  }

  @Post()
  @Roles('patient')
  @ApiOperation({ summary: 'Book an appointment' })
  create(@CurrentUser() user: User, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(user.id, dto, user.id);
  }

  @Patch(':id/cancel')
  @Roles('patient')
  @ApiOperation({ summary: 'Cancel an appointment' })
  cancel(@CurrentUser() user: User, @Param('id') id: string) {
    return this.appointmentsService.cancel(id, user.id);
  }
}
