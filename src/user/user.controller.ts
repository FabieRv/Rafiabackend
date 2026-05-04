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
  constructor(private readonly UserService: UserService) {}

  @Get()
  getUsers() {
    return this.UserService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.UserService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile() {
    return 'test ok';
  }

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
    console.log('USER:', req.user);
    console.log('FILE:', file);

    return { ok: true };
  }
}
