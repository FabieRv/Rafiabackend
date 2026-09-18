import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';

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
  role: string;
  image: string;
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
  // @Post('login')
  // async login(@Body() authBody: AuthBody) {
  //   return await this.authService.login(authBody);
  // }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  //localhost:3000/change-password
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() body: ChangePasswordDto, @Request() req: any) {
    console.log('REQ.USER:', req.user);

    const userId = req.user.userId;

    return this.authService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  // localhost:3000/forgot-password
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    console.log('EMAIL RECU:', body.email);
    return this.authService.forgotPassword(body.email); // ✅
  }
}
