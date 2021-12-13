import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LoginController } from 'src/login/login.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule],
  controllers: [LoginController],
  providers: [],
})
export class AppModule {}
