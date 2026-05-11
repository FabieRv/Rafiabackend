import { Module } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
import { CommandeController } from './CommandeController';
import { CommandeService } from './commande.service';

@Module({
  controllers: [CommandeController],
  providers: [CommandeService, PrismaService],
})
export class CommandeModule {}
