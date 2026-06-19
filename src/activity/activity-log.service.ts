import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async createLog(
    type: string,
    message: string,
    entityType?: string,
    entityId?: number,
    userId?: number,
  ) {
    return this.prisma.activityLog.create({
      data: {
        type,
        message,
        entityType,
        entityId,
        userId,
      },
    });
  }

  async getAllLogs() {
    return this.prisma.activityLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
