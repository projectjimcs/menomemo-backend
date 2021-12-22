import { Injectable } from '@nestjs/common';
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
}
