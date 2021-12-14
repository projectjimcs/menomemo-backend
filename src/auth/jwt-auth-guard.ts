import { ExecutionContext, Injectable, UnauthorizedException, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import * as moment from 'moment';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    try {
      // !!! REFACTOR THIS?
      const accessToken = ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];

          if (!data) {
            return null;
          }

          return data.token;
        }
      ])(request);

      const refreshToken = ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];

          if (!data) {
            return null;
          }

          return data.refreshToken;
        }
      ])(request);

      if (!accessToken) {
        throw new UnauthorizedException('Access token is not set');
      }

      const isValidAccessToken = await this.authService.validateToken(accessToken);

      if (isValidAccessToken) {
        return this.activate(context);
      }

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is not set');
      }

      const user = await this.userService.findUserByRefreshToken(refreshToken);

      const isValidRefreshToken = moment.utc(user.refreshTokenExp).isSameOrAfter(moment.utc());

      if (!isValidRefreshToken) {
        throw new UnauthorizedException('Refresh token is not valid');
      }

      const newToken = await this.authService.getAccessToken(user);
      const newRefreshToken = await this.authService.getRefreshToken(user.uuid);

      const secretData = {
        token: newToken,
        refreshToken: newRefreshToken,
      };

      response.cookie('auth-cookie', secretData, {httpOnly: true})
  
      return this.activate(context);
    } catch (err) {
      console.log(err)
      return false;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
