import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import { Booking } from 'src/entities/booking.entity';
import { Patient } from 'src/entities/patient.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async addBooking(addObject) {
    const company = await this.companyRepository.findOne({
      where: {
        uuid: addObject.companyId,
      }
    });

    const patient = await this.patientRepository.findOne({
      where: {
        uuid: addObject.patient,
      }
    });

    const bookedByUser = await this.userRepository.findOne({
      where: {
        uuid: addObject.bookedBy,
      }
    });

    const bookedWithUser = await this.userRepository.findOne({
      where: {
        uuid: addObject.bookedWith,
      }
    });

    if (!company || !patient || !bookedByUser || !bookedWithUser) {
      throw new HttpException('ADD BOOKING ERROR', HttpStatus.BAD_REQUEST); // !!! Modify how things work here?
    }

    addObject.companyId = company.id;
    addObject.patientId = patient.id;
    addObject.bookedBy = bookedByUser.id;
    addObject.bookedWith = bookedWithUser.id;

    const newBooking = await this.bookingRepository.insert(addObject);
    console.log('new booking here:')
    console.log(newBooking)
  }
}
