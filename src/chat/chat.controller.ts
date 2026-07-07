import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('messages/:senderId/:receiverId')
  async getOrCreateChat(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.chatService.getOrCreateConversation(
      Number(senderId),
      Number(receiverId),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('conversation/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessagesByConversationId(conversationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversations/:userId')
  async getConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/conversations')
  async getAdminConversations() {
    console.log('-----------CHAT ------');
    return this.chatService.getUserConversations(1);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getMessagesByUser(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Post('open')
  async openChat(@Request() req) {
    const userId = req.user.id_user;
    return this.chatService.openConversation(userId);
  }
}
