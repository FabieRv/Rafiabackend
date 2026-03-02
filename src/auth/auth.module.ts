import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/user/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../middleware/jwt.strategy';
import { ProfileController } from 'src/controller/profile.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController, ProfileController],
  providers: [PrismaService, AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
