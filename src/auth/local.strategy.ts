import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('dto-------------')
    console.log(email)
    console.log(password)
    const user = await this.authService.validateUser({
      email,
      password,
    });
  
    if (!user) {
      throw new UnauthorizedException();
    }
  
    return user;
  }
}