import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  getUsers() {
    return this.UserService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/userId')
  getUser(@Param('userId') userId: string) {
    return this.UserService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile() {
    return 'test ok';
  }
}
