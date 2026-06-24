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

  async getOrCreateConversation(senderId: number, receiverId: number) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                id_user: senderId,
              },
            },
          },
          {
            users: {
              some: {
                id_user: receiverId,
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
          connect: [{ id_user: senderId }, { id_user: receiverId }],
        },
      },
      include: {
        users: true,
      },
    });
  }

  async getAllConversations() {
    return this.prisma.conversation.findMany({
      include: {
        users: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // dernier message
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserConversations(userId: number) {
    return this.prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id_user: userId,
          },
        },
      },
      include: {
        users: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
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

  async openConversation(userId: number) {
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!admin) {
      throw new Error('Admin introuvable');
    }

    let conversation = await this.prisma.conversation.findFirst({
      where: {
        users: {
          some: { id_user: userId },
        },
      },
      include: {
        users: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          users: {
            connect: [{ id_user: userId }, { id_user: admin.id_user }],
          },
        },
        include: {
          users: true,
          messages: true,
        },
      });
    }

    return conversation;
  }
}
