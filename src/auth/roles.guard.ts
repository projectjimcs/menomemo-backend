import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const usertypes = this.reflector.get<string[]>('usertypes', context.getHandler());

    if (!usertypes) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const accessToken = ExtractJwt.fromExtractors([
      (request: Request) => {
        const data = request?.cookies['auth-cookie'];

        if (!data) {
          return null;
        }

        return data.token;
      },
    ])(request);

    const user = await this.authService.validateToken(accessToken, true);

    if (user && usertypes.includes(user.usertype)) {
      request.user = user;
      return true;
    }
  
    return false;
  }
}