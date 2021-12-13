import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService) {}

  async validateUser(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, password } = authLoginDto;

    const user = await this.userService.findUserByEmail(email);

    if (user && await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.uuid,
    }

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
