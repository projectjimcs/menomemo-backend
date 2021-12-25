import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import { Booking } from 'src/entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>
  ) {}

  async getBookingsByCompanyUuid(uuid: string): Promise<Booking[] | undefined> {
    const company = await this.companyRepository.findOne({
      where: {
        uuid: uuid,
      }
    });

    const bookings = await this.bookingRepository.find({
      where: {
        companyId: company.id,
      }
    });

    return bookings;
  }

  async getBookingById(id: number, relations: string[] = []): Promise<Booking | undefined> {
    const booking = await this.bookingRepository.findOne(id, {
      relations: relations,
    });

    return booking;
  }

  async updateBookingById(id: number, updateObject) {
    const saveStatus = await this.bookingRepository.update(id, updateObject);

    if (saveStatus.affected) {
      return await this.getBookingById(id);
    }

    throw new HttpException('UPDATE BOOKING ERROR', HttpStatus.BAD_REQUEST);
  }
}
