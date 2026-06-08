import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  //count user

  @Get('count')
  async countUsers() {
    const count = await this.userService.countUsers();
    return { count };
  }
  //prend un user
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getUsers();
  }

  //gerer profil
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile() {
    return 'test ok';
  }

  //gerer avatar image
  @UseGuards(JwtAuthGuard)
  @Post('uploadimage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return { ok: true };
  }
}
