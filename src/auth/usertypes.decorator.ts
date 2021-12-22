import { SetMetadata } from '@nestjs/common';

export const Usertypes = (...usertypes: string[]) => SetMetadata('usertypes', usertypes);