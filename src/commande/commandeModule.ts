import { Module } from '@nestjs/common';
import { CommandeService } from './commande.service';

import { PrismaService } from 'src/user/prisma.service';
import { CommandeController } from './commandeController';

@Module({
  controllers: [CommandeController],
  providers: [CommandeService, PrismaService],
})
export class CommandeModule {}
