import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Booking } from 'src/entities/booking.entity';
import { BookingsService } from './bookings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Booking]), UserModule, AuthModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})

export class BookingsModule {}
