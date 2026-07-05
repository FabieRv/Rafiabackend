import { Module } from '@nestjs/common';
import { CommandeService } from './commande.service';

import { CommandeController } from './commande.controller';
import { CommandeAdminController } from './commande.admin.controller';
import { ActivityLogModule } from 'src/activity/activity-log.module';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from 'src/mail/mail.service';

@Module({
  controllers: [CommandeController, CommandeAdminController],
  providers: [CommandeService, PrismaService, EmailService],
  imports: [ActivityLogModule],
})
export class CommandeModule {}
