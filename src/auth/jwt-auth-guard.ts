import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import * as moment from 'moment';
import * as cookieParser from 'cookie-parser';

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
      let accessToken = ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];

          if (!data) {
            return null;
          }

          return data.token;
        },
        ExtractJwt.fromHeader('cookie'),
      ])(request);

      let refreshToken = ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth-cookie'];

          if (!data) {
            return null;
          }

          return data.refreshToken;
        }
      ])(request);

      let parsedCookie = cookieParser.JSONCookie(accessToken);

      accessToken = parsedCookie && parsedCookie.hasOwnProperty('token') ? parsedCookie['token'] : accessToken;
      refreshToken = parsedCookie && parsedCookie.hasOwnProperty('refreshToken') ? parsedCookie['refreshToken'] : refreshToken;

      if (!accessToken) {
        throw new UnauthorizedException('Access token is not set');
      }

      const isValidAccessToken = await this.authService.validateToken(accessToken);

      if (isValidAccessToken) {
        const cookieData = {
          token: accessToken,
          refreshToken,
        }

        request.secretData = cookieData;
        request.cookies['auth-cookie'] = cookieData;
        return this.activate(context);
      }

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is not set');
      }

      const user = await this.userService.findUserByRefreshToken(refreshToken, ['company']);

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

      request.cookies['auth-cookie'] = secretData;
      response.cookie('auth-cookie', secretData, {httpOnly: true});
      request.secretData = secretData;

      return this.activate(context);
    } catch (err) {
      return false; // !!! Delete cookies
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
