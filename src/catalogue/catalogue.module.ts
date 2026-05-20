import { Module } from '@nestjs/common';

import { CatalogueController } from './catalogue.controller';
import { PrismaService } from 'src/user/prisma.service';

@Module({
  controllers: [CatalogueController],
  providers: [PrismaService],
})
export class CatalogueModule {}
