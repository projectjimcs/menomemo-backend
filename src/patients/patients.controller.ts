import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Usertypes } from 'src/auth/usertypes.decorator';
import { GetPatientResponseDto } from './dto/patient.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
@UseGuards(RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @Usertypes('employee', 'admin', 'internal')
  async getCompanyPatients(@Req() req): Promise<GetPatientResponseDto[]> {
    const companyUuid = req.user.companyUuid;
    console.log('git to paitent')
    // !!! Probably add transformers here for return data in future
    return await this.patientsService.getPatientsByCompanyUuid(companyUuid);
  }
}
