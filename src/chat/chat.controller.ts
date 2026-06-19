import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
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
}
