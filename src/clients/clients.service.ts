import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/user/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const newClient = await this.prisma.user.create({
      data: { ...createClientDto, role: 'USER' },
      select: {
        id_user: true,
        name: true,
        email: true,
        adress: true,
        createdAt: true,
      },
    });
    return JSON.parse(JSON.stringify(newClient));
  }

  async findAll() {
    const clients = await this.prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id_user: true,
        name: true,
        email: true,
        phone: true,
        adress: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // CETTE LIGNE EST LA CLÉ : Elle casse la boucle infinie
    return JSON.parse(JSON.stringify(clients));
  }

  async findOne(id: number) {
    const client = await this.prisma.user.findFirst({
      where: { id_user: id, role: 'USER' },
      select: {
        id_user: true,
        name: true,
        email: true,
        phone: true,
        adress: true,
        createdAt: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }
    return JSON.parse(JSON.stringify(client));
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    await this.findOne(id);
    const updated = await this.prisma.user.update({
      where: { id_user: id },
      data: updateClientDto,
      select: { id_user: true, name: true, email: true },
    });
    return JSON.parse(JSON.stringify(updated));
  }
  async remove(id: number) {
    await this.findOne(id);

    const deleted = await this.prisma.user.delete({
      where: { id_user: id },
    });

    return { message: `Client ${id} supprimé`, deleted };
  }
}
