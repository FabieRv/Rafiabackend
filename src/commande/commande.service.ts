import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
import { CommandeStatus } from '@prisma/client';
import { ItemInput } from 'src/types/ItemInput';

@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService) {}

  // 1. CRÉER UNE COMMANDE
  async createCommande(
    userId: number,
    items: { id_produit: number; quantite: number }[],
  ) {
    return await this.prisma.$transaction(async (tx) => {
      let totalCommande = 0;
      const itemsToCreate: ItemInput[] = [];

      for (const item of items) {
        const produit = await tx.product.findUnique({
          where: { id_produit: item.id_produit },
        });

        if (!produit)
          throw new NotFoundException(`Produit ${item.id_produit} introuvable`);
        if (produit.quantite_stock < item.quantite)
          throw new BadRequestException(
            `Stock insuffisant pour ${produit.nom_produit}`,
          );

        const prixApplique = Math.round(Number(produit.prix));
        totalCommande += prixApplique * item.quantite;

        itemsToCreate.push({
          id_produit: item.id_produit,
          quantite_stock: item.quantite,
          prix: Number(produit.prix),
        });

        // Mise à jour du stock
        await tx.product.update({
          where: { id_produit: item.id_produit },
          data: { quantite_stock: { decrement: item.quantite } },
        });
      }

      // Ajouter la création de la commande ici
      return await tx.commande.create({
        data: {
          id_user: userId,
          total: totalCommande,
          statut: 'EN_ATTENTE',
          items: {
            create: itemsToCreate,
          },
        },
        include: { items: true },
      });
    });
  }

  // 2. RÉCUPÉRER TOUTES LES COMMANDES (Admin)
  async findAll() {
    return this.prisma.commande.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. METTRE À JOUR LE STATUT (Admin)
  async updateStatus(id_commande: number, nouveauStatut: CommandeStatus) {
    const commandeExistante = await this.prisma.commande.findUnique({
      where: { id_commande },
    });

    if (!commandeExistante) {
      throw new NotFoundException(`Commande #${id_commande} non trouvée.`);
    }

    return this.prisma.commande.update({
      where: { id_commande },
      data: { statut: nouveauStatut },
    });
  }

  // 4. RÉCUPÉRER LES COMMANDES D'UN UTILISATEUR
  async findByUserId(userId: number) {
    return this.prisma.commande.findMany({
      where: { id_user: userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
