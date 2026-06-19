import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/user/prisma.service';
import { ActivityLogModule } from 'src/activity/activity-log.module';

@Module({
  imports: [ActivityLogModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
