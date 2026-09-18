import { IsEmail } from 'class-validator';
import { IsLowercaseEmail } from '../validators/validatorCustomer';

export class AuthBodyDto {
  @IsEmail()
  @IsLowercaseEmail()
  email: string;

  password: string;
}
