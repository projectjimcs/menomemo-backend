import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth.dto';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  readonly TOKEN_LENGTH = 1;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService) {}

  async validateUser(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, password } = authLoginDto;
    const user = await this.userService.findUserByEmail(email, ['company']);

    if (user && await user.validatePassword(password)) {
      const { password, refreshToken, refreshTokenExp, ...result } = user;
      return result;
    }

    return null;
  }

  async validateToken(token: string, isReturnUser: boolean = false) {
    try {
      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (user) {
        return isReturnUser ? user : true;
      }

      return false;
    } catch (err) {
      // !!! Bad way of doing this?
      if (err.message === 'invalid signature') {
        throw new UnauthorizedException('Beep Boop No Go');
      } else {
        return isReturnUser ? null : false;
      }
    }
  }

  async getRefreshToken(userUuid: string): Promise<string> {
    const refreshTokenUpdateData = {
      refreshToken: randomToken.generate(16),
      refreshTokenExp: moment().add(this.TOKEN_LENGTH, 'days').format('YYYY-MM-DD HH:mm:ss'),
    }

    await this.userService.updateUserByUuid(userUuid, refreshTokenUpdateData);

    return refreshTokenUpdateData.refreshToken;
  }

  async getAccessToken(user: any) {
    console.log('in access token')
    const payload = {
      email: user.email,
      sub: user.uuid,
      companyUuid: user.company.uuid,
      usertype: user.usertype.key,
    }
    console.log(payload);
    return this.jwtService.sign(payload);
  }
}
