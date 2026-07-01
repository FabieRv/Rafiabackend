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
  @Get('messages/:adminId/:userId')
  async getMessages(
    @Param('adminId') adminId: string,
    @Param('userId') userId: string,
  ) {
    const aId = Number(adminId);
    const uId = Number(userId);
    if (isNaN(aId) || isNaN(uId)) {
      throw new Error(`Invalid IDs: adminId=${adminId}, userId=${userId}`);
    }

    const conversation = await this.chatService.getOrCreateConversation(
      aId,
      uId,
    );
    // const conversation = await this.chatService.getOrCreateConversation(
    //   Number(adminId),

    //   Number(userId),
    // );
    console.log('adminId RAW:', adminId);
    console.log('userId RAW:', userId);

    return this.chatService.getMessages(conversation.id);
  }
  // @Get('messages/:conversationId')
  // async getMessages(@Param('conversationId') conversationId: string) {
  //   return this.chatService.getMessages(conversationId);
  // }

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

  @UseGuards(JwtAuthGuard)
  @Post('open')
  async openChat(@Request() req) {
    const userId = req.user.id_user;
    return this.chatService.openConversation(userId);
  }
}
