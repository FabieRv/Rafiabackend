import { Module } from '@nestjs/common';
import { CommandeService } from './commande.service';

import { CommandeController } from './commande.controller';
import { CommandeAdminController } from './commande.admin.controller';
import { ActivityLogModule } from 'src/activity/activity-log.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CommandeController, CommandeAdminController],
  providers: [CommandeService, PrismaService],
  imports: [ActivityLogModule],
})
export class CommandeModule {}
