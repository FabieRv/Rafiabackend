import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaService } from 'src/user/prisma.service';
import { ActivityLogModule } from 'src/activity/activity-log.module';

@Module({
  imports: [ActivityLogModule],
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService],
})
export class ClientsModule {}
