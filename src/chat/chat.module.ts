import { Module } from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.getway';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
