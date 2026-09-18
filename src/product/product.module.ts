import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ActivityLogModule } from 'src/activity/activity-log.module';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'multer.config';

@Module({
  imports: [ActivityLogModule, MulterModule.register(multerConfig)],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
