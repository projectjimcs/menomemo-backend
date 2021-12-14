import { Controller, Req, Post, UseGuards, Res, Get } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth-guard';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('login')
export class LoginController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(req.user);
    const refreshToken = await this.authService.getRefreshToken(req.user.uuid);

    const secretData = {
      token,
      refreshToken,
    };

    res.cookie('auth-cookie', secretData, {httpOnly: true})
      .send({ success: true });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return 'secure route';
  }
}
