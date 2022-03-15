import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { UserType } from 'src/entities/usertype.entity';
import { Company } from 'src/entities/company.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
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

  async findUserByEmail(email: string, relations: string[] = []): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: relations,
    });
  }

  // !!! Refactor?
  async findUserByUuid(uuid: string, relations: string[] = []): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        uuid: uuid,
      },
      relations: relations,
    },);
  }

  async updateUserByUuid(uuid: string, updateData: {}) {
    await this.userRepository.update({
      uuid: uuid,
    }, updateData);
  }

  async findUserByRefreshToken(token: string, relations: string[] = []): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        refreshToken: token,
      },
      relations: relations,
    });
  }

  async getDoctorsByCompanyUuid(uuid: string): Promise<User[] | undefined> {
    const company = await this.companyRepository.findOne({
      where: {
        uuid: uuid,
      }
    });

    const doctors = await this.userRepository.find({
      select: ['uuid', 'firstname', 'lastname', 'companyId', 'status', 'isDoctor'],
      where: {
        companyId: company.id,
        status: 'active',
        isDoctor: true,
      }
    });

    return doctors;
  }
}
