import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { UserType } from 'src/entities/usertype.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserType)
    private userTypeRepository: Repository<UserType>
  ) {}

  async create(payload: CreateUserDto) {
    const user = new User();
    user.firstname = payload.firstname;
    user.lastname = payload.lastname;
    user.email = payload.email;
    user.password = payload.password;

    const employeeType = await this.userTypeRepository.findOne({
      where: {key: 'employee'}
    });
    user.usertype = employeeType;
    
    const success = await this.userRepository.save(user);
    // !!! Return something?
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      }
    });
  }

  // !!! Refactor?
  async findUserByUuid(uuid: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        uuid: uuid,
      }
    });
  }

  async updateUserByUuid(uuid: string, updateData: {}) {
    await this.userRepository.update({
      uuid: uuid,
    }, updateData);
  }

  async findUserByRefreshToken(token: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        refreshToken: token,
      }
    });
  }
}
