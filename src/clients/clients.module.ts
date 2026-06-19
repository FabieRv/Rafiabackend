import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

import { ActivityLogModule } from 'src/activity/activity-log.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [ActivityLogModule],
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService],
})
export class ClientsModule {}
