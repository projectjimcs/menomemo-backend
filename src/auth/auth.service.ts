import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth.dto';
import * as randomToken from 'rand-token';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  readonly TOKEN_LENGTH = 7;

  constructor(
    private userService: UserService,
    private jwtService: JwtService) {}

  async validateUser(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, password } = authLoginDto;

    const user = await this.userService.findUserByEmail(email);

    if (user && await user.validatePassword(password)) {
      const { password, refreshToken, refreshTokenExp, ...result } = user;
      return result;
    }

    return null;
  }

  async getRefreshToken(userUuid: string): Promise<string> {
    const refreshTokenUpdateData = {
      refreshToken: randomToken.generate(16),
      refreshTokenExp: moment.utc().day(this.TOKEN_LENGTH).format('YYYY-MM-DD HH:mm:ss'),
    }

    await this.userService.updateUserByUuid(userUuid, refreshTokenUpdateData);

    return refreshTokenUpdateData.refreshToken;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.uuid,
    }

    return this.jwtService.sign(payload);
  }
}
