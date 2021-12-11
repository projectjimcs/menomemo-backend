import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(payload: CreateUserDto) {
    const user = new User();
    user.firstname = payload.firstname;
    user.lastname = payload.lastname;
    user.email = payload.email;
    user.password = payload.password;
    await this.userRepository.save(user);
  }
}
