export class CreateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export class GetDoctorResponseDto {
  firstname: string;
  lastname: string;
  email: string;
  uuid: string;
  companyId: number;
  status: string;
  isDoctor: boolean;
}