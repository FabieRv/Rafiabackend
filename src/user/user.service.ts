import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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
        image: true,
      },
    });

    return users;
  }

  async updateImage(userId: number, image: string) {
    if (!userId) {
      throw new Error('Missing userId');
    }

    return this.prisma.user.update({
      where: {
        id_user: userId,
      },
      data: {
        image,
      },
    });
  }
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id_user: id },
    });
  }

  async countUsers(): Promise<number> {
    return this.prisma.user.count();
  }
}
