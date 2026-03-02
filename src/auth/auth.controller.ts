import { register } from 'module';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

export type AuthBody = {
  email: string;
  password: string;
};

export type CreateUser = {
  name: string;
  email: string;
  phone: string;
  adress: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //localhost:3000/register
  @Post('register')
  async register(@Body() authRegister: CreateUser) {
    return this.authService.register(authRegister);
  }

  //localhost:3000/login
  @Post('login')
  async login(@Body() authBody: AuthBody) {
    return await this.authService.login({
      authBody,
    });
  }

  // tu envoies ton token securisé "abc123"
  // localhost:3000/auth
  @Get()
  async authenticated() {
   await fetch('auth',{
   
    headers:{
      'content-type':'application/js',
      'Authorization': 'Bearer abc123',
    },
    

   });
    return;
  }
}
