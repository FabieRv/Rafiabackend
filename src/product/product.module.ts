import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ActivityLogModule } from 'src/activity/activity-log.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [ActivityLogModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
