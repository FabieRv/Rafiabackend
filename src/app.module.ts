import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductModule } from './product/product.module';
import { ClientsModule } from './clients/clients.module';

import { CatalogueModule } from './catalogue/catalogue.module';
import { CommandeModule } from './commande/commande.module';
import { ActivityLogModule } from './activity/activity-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UserModule,
    AuthModule,
    ProductModule,
    ClientsModule,
    CommandeModule,
    CatalogueModule,
    ActivityLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
