import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Usertypes } from 'src/auth/usertypes.decorator';
import { CreateUserDto, GetDoctorResponseDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser() {
    return "Hello";
  }

  @Post()
  createUser(
    @Body() body: CreateUserDto
  ) {
    this.userService.create(body).catch(err => {
      console.log('Error'); // !!!
    });
  }

  @Get('/doctors')
  @Usertypes('employee', 'admin', 'internal')
  async getCompanyDoctors(@Req() req): Promise<GetDoctorResponseDto[]> {
    const companyUuid = req.user.companyUuid;

    return await this.userService.getDoctorsByCompanyUuid(companyUuid);
  }
}
