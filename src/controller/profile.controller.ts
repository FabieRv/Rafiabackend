import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';

@Controller('profile')
export class ProfileController {

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Req() req) {
    console.log('test ___success');
    return req.user;
  }
}