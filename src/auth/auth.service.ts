import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, password } = authLoginDto;

    const user = await this.userService.findUserByEmail(email);

    if (user && await user.validatePassword(password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
