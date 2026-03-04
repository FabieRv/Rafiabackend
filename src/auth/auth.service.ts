import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthBody, CreateUser } from './auth.controller';
import { PrismaService } from 'src/user/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    console.log('JWT SERVICE READY');
  }

  async register(authRegister: CreateUser) {
    const { name, email, password, phone, adress } = authRegister;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        adress,
        phone,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login({ authBody }: { authBody: AuthBody }) {
    const { email, password } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      throw new NotFoundException("l'utilisateur n'existe pas");
    }
    const isValid = await this.isPasswordValid(password, existingUser.password);

    if (!isValid) {
      throw new UnauthorizedException('le mot de pass est invalide');
    }
    return this.authenticateUser({
      userId: existingUser.id,
    });
    // console.log({ secret: process.env.JWT_SECRET });
  }

  private async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValid(password: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  }

  private async authenticateUser({ userId }: { userId: number }) {
    const payload = { sub: userId };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      console.log('USER ID:', userId);
      console.log('OLD:', oldPassword);
      console.log('NEW:', newPassword);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      console.log('USER FOUND:', user);

      if (!user) throw new Error('Utilisateur non trouvé');

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password,
      );

      console.log('OLD PASSWORD VALID:', isOldPasswordValid);

      if (!isOldPasswordValid) throw new Error('Ancien mot de passe incorrect');

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      return { message: 'Mot de passe changé avec succès' };
    } catch (error) {
      console.error('CHANGE PASSWORD ERROR:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email non trouvé');

    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '15m' },
    );
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
    console.log('Lien de réinitialisation :', resetLink);

    return { message: 'Lien de réinitialisation envoyé à votre email' };
  }
}
