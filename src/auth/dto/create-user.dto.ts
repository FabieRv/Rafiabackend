import { Role } from '@prisma/client';

export class CreateUserDto {
  name: string;
  email: string;
  phone: string;
  adress: string;
  password: string;
  role?: Role; 
}

export type CreateUser = CreateUserDto;
