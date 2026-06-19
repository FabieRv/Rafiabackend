import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
import { CommandeStatus } from '@prisma/client';
import { UpdateStatusDto } from './dto/update.status.dto';
import { ActivityLogService } from 'src/activity/activity-log.service';

@Injectable()
export class CommandeService {
  constructor(
    private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}

  activityMap: Record<string, string> = {
    CONFIRMEE: 'ORDER_CONFIRME',
    NEGOCIEE: 'ORDER_NEGOCIEE',
    LIVREE: 'ORDER_LIVREE',
    ANNULEE: 'ORDER_ANNULEE',
  };

  // AJOUT AU PANIER
  async addToCart(userId: number, productId: number, quantity: number) {
    let panier = await this.prisma.panier.findUnique({
      where: { id_user: userId },
    });

    if (!panier) {
      panier = await this.prisma.panier.create({
        data: { id_user: userId },
      });
    }

    const existingItem = await this.prisma.panierItem.findFirst({
      where: {
        id_panier: panier.id_panier,
        id_produit: productId,
      },
    });

    if (existingItem) {
      return this.prisma.panierItem.update({
        where: { id_panierItem: existingItem.id_panierItem },
        data: {
          quantite: existingItem.quantite + quantity,
        },
      });
    }

    return this.prisma.panierItem.create({
      data: {
        id_panier: panier.id_panier,
        id_produit: productId,
        quantite: quantity,
      },
    });
  }

  async getCart(userId: number) {
    return this.prisma.panier.findUnique({
      where: { id_user: userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async validateOrder(userId: number, data: any) {
    const { items, adresse_livraison, ville, region } = data;

    const TVA_RATE = 0.2;

    const totalHT = items.reduce(
      (acc, item) => acc + item.prix * item.quantite,
      0,
    );

    const totalTTC = totalHT + totalHT * TVA_RATE;

    return this.prisma.$transaction(async (tx) => {
      const commande = await tx.commande.create({
        data: {
          adresse_livraison,
          ville,
          region,
          total: totalTTC,
          statut: 'EN_ATTENTE',

          user: {
            connect: { id_user: userId },
          },

          items: {
            create: items.map((item) => ({
              id_produit: item.id_produit,
              quantite: item.quantite,
              prix: item.prix,
              product_name_snapshot: item.product_name ?? null,
              product_price_snapshot: item.prix,
            })),
          },
        },
      });

      await this.activityLogService.createLog(
        'ORDER_CREATED',
        `Commande CMD ${commande.id_commande} crée`,
        'order',
        commande.id_commande,
        userId,
      );
      return commande;
    });
  }

  async findOneForAdmin(id: number) {
    const commande = await this.prisma.commande.findUnique({
      where: { id_commande: id },

      include: {
        user: true,

        items: {
          include: {
            product: {
              include: {
                sous_category: true,
              },
            },
          },
        },
      },
    });

    if (!commande) {
      throw new NotFoundException(`Commande introuvable`);
    }

    return {
      ...commande,

      items: (commande.items || []).map((item) => ({
        ...item,

        product: item.product
          ? item.product
          : {
              id_produit: item.id_produit,
              nom_produit: 'Produit supprimé',
              prix: 0,
              image: null,
              sous_category: null,
            },
      })),
    };
  }

  //changement d'etat admin
  async findAllForAdmin(status?: string) {
    const queryFilter: any = {};

    if (status && status !== 'TOUS') {
      if (!Object.values(CommandeStatus).includes(status as CommandeStatus)) {
        throw new BadRequestException(`Statut invalide`);
      }
      queryFilter.statut = status;
    }

    try {
      const commandes = await this.prisma.commande.findMany({
        where: queryFilter,
        include: {
          user: true,
          items: {
            include: {
              product: {
                include: {
                  sous_category: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return (commandes || []).map((cmd) => ({
        ...cmd,
        items: (cmd.items || []).map((item) => ({
          ...item,
          product: item.product
            ? {
                id_produit: item.product.id_produit,
                nom_produit: item.product.nom_produit,
                prix: Number(item.product.prix),
                image: item.product.image,
                type: item.product.type,
                sous_category: item.product.sous_category ?? null,
              }
            : {
                id_produit: item.id_produit ?? 0,
                nom_produit: item.product_name_snapshot ?? 'Produit supprimé',
                prix: item.product_price_snapshot ?? 0,
                image: null,
                type: null,
                sous_category: null,
              },
        })),
      }));
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateStatusDto,
    userId: number,
  ) {
    const existingCommande = await this.prisma.commande.findUnique({
      where: { id_commande: id },
    });

    if (!existingCommande) {
      throw new NotFoundException(`Commande ${id} introuvable`);
    }

    const commande = await this.prisma.commande.update({
      where: { id_commande: id },
      data: {
        statut: updateStatusDto.status,
      },
      include: {
        user: true,
        items: true,
      },
    });

    const activityType = this.activityMap[updateStatusDto.status];

    if (activityType) {
      await this.activityLogService.createLog(
        activityType,
        `Commande ${updateStatusDto.status.toLowerCase()}`,
        'order',
        commande.id_commande,
        userId,
      );
    }

    return commande;
  }

  async countCommandes() {
    return this.prisma.commande.count();
  }

  async remove(id: number) {
    await this.prisma.commandeItem.deleteMany({
      where: { id_commande: id },
    });

    return this.prisma.commande.delete({
      where: { id_commande: id },
    });
  }

  async getTotalVentesCount(): Promise<number> {
    const result = await this.prisma.commandeItem.aggregate({
      where: {
        commande: {
          statut: 'LIVREE',
        },
        quantite: {
          not: null,
        },
      },
      _sum: {
        quantite: true,
      },
    });

    return Number(result._sum?.quantite ?? 0);
  }
}
