import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { AuthBody, CreateUser } from './auth.controller';
import { PrismaService } from 'src/user/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    console.log('JWT SERVICE READY');
  }

  //register
  async register(authRegister: CreateUser) {
    try {
      const { name, email, password, phone, adress, role, image } =
        authRegister;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException('Email invalide');
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('Email existe déjà');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let finalRole: Role = Role.USER;
      if (role) {
        const roleUpper = role.toUpperCase();
        if (roleUpper === 'ADMIN') finalRole = Role.ADMIN;
      }

      const imagePath = 'https://ui-avatars.com/api/?name=' + name;
      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          phone,
          adress,
          password: hashedPassword,
          role: finalRole,
          image: imagePath,
        },
      });
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      console.error(err);
      throw new BadRequestException('Erreur interne du serveur');
    }
  }

  //login
  async login(authBody: AuthBody) {
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
      userId: existingUser.id_user,
      role: existingUser.role,
      name: existingUser.name,
      email: existingUser.email,
    });
  }

  private async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValid(password: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  }

  private async authenticateUser(user: any) {
    const payload = {
      userId: user.userId,
      role: user.role,
      email: user.email,
    };
    console.log('payload------------------', payload);
    console.log('payload =', JSON.stringify(payload, null, 2));
    console.log('user------------------', JSON.stringify(user, null, 2));
    return {
      access_token: await this.jwtService.sign(payload),
      role: user.role,
      name: user.name,
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
        where: { id_user: userId },
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
        where: { id_user: userId },
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
      { userId: user.id_user },
      { expiresIn: '15m' },
    );
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
    console.log('Lien de réinitialisation :', resetLink);

    return { message: 'Lien de réinitialisation envoyé à votre email' };
  }
}
