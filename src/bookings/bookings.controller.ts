import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Usertypes } from 'src/auth/usertypes.decorator';
import { AddBookingDto, GetBookingResponseDto, UpdateBookingDto } from './dto/booking.dto';


@Controller('bookings')
@UseGuards(RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Usertypes('employee', 'admin', 'internal')
  async getCompanyBookings(@Req() req): Promise<GetBookingResponseDto[]> {
    const companyUuid = req.user.companyUuid;

    return await this.bookingsService.getBookingsByCompanyUuid(companyUuid);
  }

  @Post()
  @Usertypes('employee', 'admin', 'internal')
  async addBooking(
    @Req() req,
    @Body() body: AddBookingDto,
  ) {
    console.log('the user:')
    console.log(req.user)
    if (!req.user.companyUuid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); //!!! Custom error message maybe?
    }

    // const company = 
    console.log('inside add booking')
    console.log(body)
    const createBookingObject = {
      companyId: req.user.companyUuid, // !!! Quite awkward to do this...will change later
      title: body.title,
      notes: body.notes,
      date: body.date,
      startTime: body.isAllDay ? null : body.startTime,
      endTime: body.isAllDay ? null : body.endTime,
      isCompleted: body.isCompleted,
      patient: body.patient,
      bookedBy: req.user.sub,
      bookedWith: body.doctor,
    }

    const addedBooking = await this.bookingsService.addBooking(createBookingObject);

    return addedBooking;
  }

  @Put('/:bookingId')
  @Usertypes('employee', 'admin', 'internal')
  async updateBooking(
    @Req() req,
    @Param('bookingId') bookingId: number,
    @Body() body: UpdateBookingDto,
  ) {
    const booking = await this.bookingsService.getBookingById(bookingId, ['company']);

    if (booking.company.uuid !== req.user.companyUuid) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); //!!! Custom error message maybe?
    }

    const updatedBooking = await this.bookingsService.updateBookingById(bookingId, {
      title: body.title,
      notes: body.notes,
      date: body.date || booking.date,
      startTime: body.isAllDay ? null : body.startTime,
      endTime: body.isAllDay ? null : body.endTime,
      isCompleted: body.isCompleted,
    });

    return updatedBooking;
  }
}
