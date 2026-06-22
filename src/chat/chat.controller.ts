import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('messages/:adminId/:userId')
  async getMessages(
    @Param('adminId') adminId: number,
    @Param('userId') userId: number,
  ) {
    const conversation = await this.chatService.getOrCreateConversation(
      Number(adminId),
      Number(userId),
    );
    return this.chatService.getMessages(conversation.id);
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
    return this.chatService.getAllConversations();
  }
}
