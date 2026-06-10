import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
import { CommandeStatus, StatutLivraison } from '@prisma/client';
import { UpdateStatusDto } from './dto/update.status.dto';

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

  async findAllForAdmin(status?: string) {
    console.log('====================================');
    console.log('1. ENTRÉE DANS FIND_ALL_FOR_ADMIN');
    console.log('Query "status" reçue :', status, `(${typeof status})`);
    console.log('====================================');

    const queryFilter: any = {};

    if (status && status !== 'TOUS') {
      console.log('2. UN FILTRE EST APPLIQUÉ :', status);
      // On vérifie si le statut fait partie de l'enum CommandeStatus
      if (!Object.values(CommandeStatus).includes(status as CommandeStatus)) {
        console.log('❌ STATUT INVALIDE DÉTECTÉ :', status);
        throw new BadRequestException(
          `Le statut '${status}' n'est pas valide.`,
        );
      }
      queryFilter.statut = status as CommandeStatus;
    } else {
      console.log('2. AUCUN FILTRE (AFFICHAGE DE TOUTES LES COMMANDES)');
    }

    try {
      console.log('3. REQUÊTE PRISMA... FILTRE APPLES :', queryFilter);

      const commandes = await this.prisma.commande.findMany({
        where: queryFilter,
        include: {
          user: {
            select: {
              id_user: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log(
        '✅ REQUÊTE PRISMA RÉUSSIE ! Nombre de commandes trouvées :',
        commandes.length,
      );
      return commandes;
    } catch (error) {
      console.log('❌ CRASH DANS FIND_ALL_FOR_ADMIN !');
      console.error("DÉTAIL DE L'ERREUR PRISMA :", error);
      throw error;
    }
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto) {
    const existingCommande = await this.prisma.commande.findUnique({
      where: { id_commande: id },
    });

    if (!existingCommande) {
      throw new NotFoundException(
        `Impossible de modifier : La commande avec l'ID ${id} n'existe pas.`,
      );
    }

    // Étape B : Mettre à jour la commande
    return this.prisma.commande.update({
      where: { id_commande: id },
      data: {
        statut: updateStatusDto.status,
      },
      include: {
        user: true,
        items: true,
      },
    });
  }
}
