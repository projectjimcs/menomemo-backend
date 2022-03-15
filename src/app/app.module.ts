import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BookingsModule } from 'src/bookings/bookings.module';
import { LoginController } from 'src/login/login.controller';
import { PatientsModule } from 'src/patients/patients.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    BookingsModule,
    PatientsModule,
  ],
  controllers: [LoginController],
  providers: [],
})
export class AppModule {}
