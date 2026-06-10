import { Module } from '@nestjs/common';
import { CommandeService } from './commande.service';

import { PrismaService } from 'src/user/prisma.service';
import { CommandeController } from './commande.controller';
import { CommandeAdminController } from './commande.admin.controller';

@Module({
  controllers: [CommandeController, CommandeAdminController],
  providers: [CommandeService, PrismaService],
})
export class CommandeModule {}
