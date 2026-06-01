import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService) {}

  //create
  async addToCart(userId: number, productId: number, quantity: number) {
    let panier = await this.prisma.panier.findUnique({
      where: { id_user: userId },
    });

    if (!panier) {
      panier = await this.prisma.panier.create({
        data: { id_user: userId },
      });
    }

    //si produit deja dans le panier
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

  // (pour l'affichage et l'icône)
  async getCart(userId: number) {
    return this.prisma.panier.findUnique({
      where: { id_user: userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  //valider le panier et tranformer en commande
  async validateOrder(userId: number) {
    const panier = await this.getCart(userId);

    if (!panier || panier.items.length === 0) {
      throw new NotFoundException('Le panier est vide');
    }

    // Calculer le total
    const total = panier.items.reduce((acc, item) => {
      return acc + Number(item.product.prix) * item.quantite;
    }, 0);

    // Utiliser une transaction Prisma pour créer la commande et vider le panier
    return this.prisma.$transaction(async (tx) => {
      // Créer la commande
      const commande = await tx.commande.create({
        data: {
          id_user: userId,
          total: total,
          statut: 'EN_ATTENTE',
          items: {
            create: panier.items.map((item) => ({
              id_produit: item.id_produit,
              quantite: item.quantite,
              prix: Number(item.product.prix),
            })),
          },
        },
      });

      // Vider le panier
      await tx.panierItem.deleteMany({
        where: { id_panier: panier.id_panier },
      });

      return commande;
    });
  }
}
