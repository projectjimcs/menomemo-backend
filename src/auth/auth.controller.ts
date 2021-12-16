import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from './jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticateUser(@Req() req) {
    return req.user;
    // this.userService.create(body).catch(err => {
    //   console.log('Error'); // !!!
    // });
  }
}