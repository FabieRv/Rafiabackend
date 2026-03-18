import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id_user: true,
        name: true,
        email: true,
        phone: true,
        adress: true,
        password: true,
        role: true,
      },
    });

    return users;
  }
}
