import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser() {
    return "Hello";
  }

  @Post()
  createUser(
    @Body() body: CreateUserDto
  ) {
    this.userService.create(body);
  }
}
