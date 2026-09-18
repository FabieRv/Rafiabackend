import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ActivityLogService } from 'src/activity/activity-log.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}

  async create(createClientDto: CreateClientDto, userId: number) {
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

    await this.activityLogService.createLog(
      'CLIENT_CREATED',
      `Client ${newClient.name} crée`,
      'user',
      newClient.id_user,
      userId,
    );
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

  async update(id: number, updateClientDto: UpdateClientDto, userId: number) {
    await this.findOne(id);
    const updated = await this.prisma.user.update({
      where: { id_user: id },
      data: updateClientDto,
      select: { id_user: true, name: true, email: true },
    });

    await this.activityLogService.createLog(
      'CLIENT_UPDATED',
      `Client ${updated.name} modifié`,
      'user',
      updated.id_user,
      userId,
    );
    return JSON.parse(JSON.stringify(updated));
  }

  async remove(id: number, userId: number) {
    await this.findOne(id);

    const deleted = await this.prisma.user.delete({
      where: { id_user: id },
    });
    await this.activityLogService.createLog(
      'CLIENT_DELETED',
      `Client ${deleted.name} supprimé`,
      'user',
      deleted.id_user,
      userId,
    );
    return { message: `Client ${id} supprimé`, deleted };
  }
}
