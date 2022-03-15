export class GetBookingResponseDto {
  id: number;
  date;
  startTime;
  endTime;
  title: string;
  notes: string;
  isCompleted: boolean;
  patient;
}

export class AddBookingDto {
  title: string;
  notes: string;
  date;
  startTime;
  endTime;
  isCompleted: boolean;
  isAllDay: boolean;
  patient: string;
  doctor: string;
}

export class UpdateBookingDto {
  title: string;
  notes: string;
  date;
  startTime;
  endTime;
  isCompleted: boolean;
  isAllDay: boolean;
}