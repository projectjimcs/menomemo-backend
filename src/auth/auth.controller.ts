import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth-guard';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticateUser(@Req() req) {
    return {
      user: req.user,
      cookieData: req.secretData,
    }
  }
}