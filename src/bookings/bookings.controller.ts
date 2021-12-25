import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Usertypes } from 'src/auth/usertypes.decorator';
import { GetBookingResponseDto, UpdateBookingDto } from './dto/booking.dto';


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
