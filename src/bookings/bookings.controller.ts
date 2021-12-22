import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Usertypes } from 'src/auth/usertypes.decorator';


@Controller('bookings')
@UseGuards(RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Usertypes('employee', 'admin', 'internal')
  async getCompanyBookings(@Req() req) {
    const companyUuid = req.user.companyUuid;

    return await this.bookingsService.getBookingsByCompanyUuid(companyUuid);
  }
}
