import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(
    senderId: number,
    receiverId: number,
    content
  ) {
    const conversation = await this.getOrCreateConversation(
      senderId,
      receiverId,
    );

    const message = await this.prisma.message.create({
      data: {
        senderId,
        content,
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

  async getMessagesByConversationId(conversationId: string) {
    // 1. Vérifier si la conversation existe
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        users: {
          select: {
            id_user: true,
            email: true,
            // Ajoutez ici d'autres champs de l'utilisateur si nécessaire (ex: nom, role)
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException("Cette conversation n'existe pas.");
    }

    // 2. Récupérer les messages avec les détails sender et le contenu
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: {
          select: {
            id_user: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Ordre chronologique pour le tchat
      },
    });

    // 3. Formater la réponse pour inclure explicitement le 'receiver' dans chaque message
    // (Le destinataire est l'utilisateur de la conversation qui n'est pas le sender)
    return messages.map((msg) => {
      const receiver = conversation.users.find(
        (user) => user.id_user !== msg.senderId
      );

      return {
        id: msg.id,
        content: msg.content,
        conversationId: msg.conversationId,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
        readAt: msg.readAt,
        sender: msg.sender,       // L'objet complet du Sender
        receiver: receiver || null, // L'objet complet du Receiver
      };
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
