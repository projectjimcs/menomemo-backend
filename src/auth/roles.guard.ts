import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import * as moment from 'moment';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const usertypes = this.reflector.get<string[]>('usertypes', context.getHandler());
    // !!! File needs refactoring lots of duplicate with jwt auth guard
    if (!usertypes) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const accessToken = ExtractJwt.fromExtractors([
      (request: Request) => {
        const data = request?.cookies['auth-cookie'];

        if (!data) {
          return null;
        }

        return data.token;
      },
    ])(request);

    if (!accessToken) {
      throw new UnauthorizedException('Access token is not set');
    }

    const refreshToken = ExtractJwt.fromExtractors([
      (request: Request) => {
        const data = request?.cookies['auth-cookie'];

        if (!data) {
          return null;
        }

        return data.refreshToken;
      }
    ])(request);

    let user = await this.authService.validateToken(accessToken, true);

    if (user && usertypes.includes(user.usertype)) {
      const cookieData = {
        token: accessToken,
        refreshToken,
      }

      request.cookies['auth-cookie'] = cookieData;
      request.user = user;
      return true;
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is not set');
    }

    user = await this.userService.findUserByRefreshToken(refreshToken, ['company']);

    if (!user) {
      throw new UnauthorizedException('No matching user');
    }

    const isValidRefreshToken = moment.utc(user.refreshTokenExp).isSameOrAfter(moment.utc());

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    if (user && usertypes.includes(user.usertype.key)) {
      const newToken = await this.authService.getAccessToken(user);
      const newRefreshToken = await this.authService.getRefreshToken(user.uuid);

      const secretData = {
        token: newToken,
        refreshToken: newRefreshToken,
      };
      //!!! user object here a bit different than other one since other one is from jwt
      request.user = {
        email: user.email,
        companyUuid: user.company.uuid,
        usertype: user.usertype.key,
      }

      request.cookies['auth-cookie'] = secretData;
      response.cookie('auth-cookie', secretData, {httpOnly: true});

      return true;
    }
  
    return false;
  }
}