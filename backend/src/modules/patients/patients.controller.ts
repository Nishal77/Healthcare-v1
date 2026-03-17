import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User } from '../users/entities/user.entity';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';

@ApiTags('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me')
  @Roles('patient')
  @ApiOperation({ summary: 'Get own patient profile' })
  getMyProfile(@CurrentUser() user: User) {
    return this.patientsService.findByUserId(user.id);
  }

  @Patch('me')
  @Roles('patient')
  @ApiOperation({ summary: 'Update own patient profile' })
  updateMyProfile(@CurrentUser() user: User, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(user.id, dto, user.id);
  }
}
