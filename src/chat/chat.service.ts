import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async startConversation(
    senderId: number,
    receiverId: number,
    content: string,
  ) {
    const conversation = await this.getOrCreateConversation(
      senderId,
      receiverId,
    );

    const message = await this.prisma.message.create({
      data: {
        content,
        senderId,
        conversationId: conversation.id,
      },
    });

    return {
      conversation,
      message,
    };
  }

  async getOrCreateConversation(adminId: number, userId: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                id_user: adminId,
              },
            },
          },
          {
            users: {
              some: {
                id_user: userId,
              },
            },
          },
        ],
      },
      include: {
        users: true,
      },
    });

    if (conversation) {
      return conversation;
    }

    return this.prisma.conversation.create({
      data: {
        users: {
          connect: [{ id_user: adminId }, { id_user: userId }],
        },
      },
      include: {
        users: true,
      },
    });
  }

  /*async sendMessage(data: {
        content: string;
        senderId: number;
        conversationId: string;
    }) {

        return this.prisma.message.create({
            data,
            include: {
                sender: true,
            },
        });
    }*/

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
