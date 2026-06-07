import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
import { CommandeStatus, StatutLivraison } from '@prisma/client';

@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService) {}

  //ajout au panier
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

  //get panier
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

  //valider commande
  async validateOrder(userId: number, data: any) {
    const { items, adresse_livraison, ville, region } = data;

    const totalTTC = items.reduce(
      (acc, item) => acc + item.prix * item.quantite * 1.2,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const nouvelleCommande = await tx.commande.create({
        data: {
          adresse_livraison,
          ville,
          region,
          total: totalTTC,
          statut: 'EN_ATTENTE',

          user: {
            connect: {
              id_user: userId,
            },
          },

          items: {
            create: items.map((item) => ({
              id_produit: item.id_produit,
              quantite: item.quantite,
              prix: item.prix,
            })),
          },
        },
      });
      return nouvelleCommande;
    });
  }
}
