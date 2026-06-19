import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['polling', 'websocket'],
})
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinConversation')
  handleJoinRoom(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('JOIN ROOM:----------+++++', conversationId);
    client.join(conversationId);

    return {
      joined: conversationId,
    };
  }

  handleConnection(client: Socket) {
    console.log('🔌 CONNECTED:', client.id);
    client.emit('newMessage', {
      content: 'backend OK',
    });
  }

  handleDisconnect(client: Socket) {
    console.log('❌ Client disconnected:', client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { userId: number; adminId: number; content: string },
  ) {
    console.log('MESSAGE REÇU:', data);
    const result = await this.chatService.startConversation(
      data.userId,
      data.adminId,
      data.content,
    );

    console.log('ROOM ID:', result.conversation.id);
    const roomId = String(result.conversation.id);
    this.server.to(roomId).emit('newMessage', result.message);

    return result;
  }
  /*await chatService.startConversation(
    adminId,
    userId,
    'Bonjour, comment puis-je vous aider ?',
    );
    await chatService.startConversation(
    userId,
    adminId,
    'Bonjour, j’ai besoin d’aide.',
    );
  */
}
