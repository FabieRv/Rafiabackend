import { IsEmail, IsString, MinLength } from 'class-validator';
import { IsLowercaseEmail } from '../validators/validatorCustomer';

export class LoginDto {
  @IsEmail()
  @IsLowercaseEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
