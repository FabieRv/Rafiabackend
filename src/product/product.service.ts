import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateProductDtoRequest } from './dto/create-product.dto';
import { ActivityLogService } from 'src/activity/activity-log.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}

  // CREATE
  async create(data: CreateProductDtoRequest, userId: number) {
    try {
      const categorieAdd = await this.prisma.category.findUnique({
        where: {
          id_categorie: Number(data.categorie),
        },
        include: {
          sous_categories: {
            orderBy: {
              id_sous_categorie: 'asc',
            },
          },
        },
      });

      const sousCategorie =
        categorieAdd?.sous_categories[data.id_sous_categorie - 1];

      console.log(
        '-------------sousCategorie-----------' + JSON.stringify(sousCategorie),
      );

      const product = await this.prisma.product.create({
        data: {
          nom_produit: data.nom_produit,
          description: data.description,
          type: data.type,
          prix: Number(data.prix),
          quantite_stock: Number(data.quantite_stock),
          image: data.image,
          sous_category: {
            connect: {
              id_sous_categorie: Number(sousCategorie?.id_sous_categorie),
            },
          },
        },
      });
      const STATUS = data.isEdit ? 'PRODUCT_UPDATED' : 'PRODUCT_CREATED';
      const VALUE_MODIF = data.isEdit ? 'modifié' : 'créé';
      await this.activityLogService.createLog(
        STATUS,
        `${product.nom_produit} ${VALUE_MODIF}`,
        'product',
        product.id_produit,
        userId,
      );

      return product;
    } catch (error) {
      console.error('Erreur Prisma :', error);
      throw error;
    }
  }

  // READ : Tous les produits
  async findAll(categoryId?: number) {
    return this.prisma.product.findMany({
      where: {
        is_active: true,
        ...(categoryId
          ? {
              sous_category: {
                id_categorie: categoryId,
              },
            }
          : {}),
      },
      include: {
        sous_category: {
          include: {
            category: {
              include: {
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        date_ajout: 'desc',
      },
    });
  }

  // READ : Un seul produit par ID
  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id_produit: id },
      include: {
        sous_category: {
          include: {
            category: {
              include: { type: true },
            },
          },
        },
      },
    });
  }

  //get liste les category
  async getCategoryCounts() {
    const categories = await this.prisma.category.findMany({
      include: {
        sous_categories: {
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id_categorie,
      name: cat.nom_categorie,
      count: cat.sous_categories.reduce(
        (acc, sc) => acc + sc._count.products,
        0,
      ),
    }));
  }

  async countProducts(): Promise<number> {
    return this.prisma.product.count({
      where: {
        is_active: true,
      },
    });
  }

  // UPDATE
  async update(
    id: number,
    data: Partial<CreateProductDtoRequest>,
    userId: number,
  ) {
    console.log('------------DATA------------' + JSON.stringify(data));
    try {
      console.log('------------DATA------------' + JSON.stringify(data));

      // 1. Convertir explicitement les IDs reçus en vrais nombres
      const categorieId = Number(data.categorie);

      // CORRECTION 1 : AJOUT DE AWAIT ICI
      const sousCategoryList = await this.prisma.sousCategory.findMany({
        where: { id_categorie: categorieId },
      });

      console.log(
        '------------LISTE REÇUE BDD------------' +
          JSON.stringify(sousCategoryList),
      );

      if (!data.id_sous_categorie) {
        throw new BadRequestException("Sous categorie n'existe pas");
      }

      // CORRECTION 2 : On s'assure que l'index existe dans le tableau reçu
      const index = Number(data.id_sous_categorie) - 1;
      const sousCategorie = sousCategoryList[index];

      if (!sousCategorie) {
        throw new BadRequestException(
          `Aucune sous-catégorie trouvée à l'index ${index} pour cette catégorie.`,
        );
      }

      const sousCategorieId = Number(sousCategorie.id_sous_categorie);
      const prixNumeric = Number(data.prix);
      const quantiteNumeric = Number(data.quantite_stock);

      console.log(
        '-------------sousCategorie finale-----------' +
          JSON.stringify(sousCategorie),
      );

      if (!sousCategorie) {
        throw new BadRequestException(
          "La sous-catégorie spécifiée n'existe pas.",
        );
      }

      console.log(
        '-------------sousCategorie-----------' + JSON.stringify(sousCategorie),
      );
      const cleanData = {
        nom_produit: data.nom_produit,
        description: data.description,
        type: data.type,
        prix: prixNumeric,
        quantite_stock: Number(data.quantite_stock),
        image: data.image,
        id_sous_categorie: Number(sousCategorieId),
      };

      const cleanUserId = Number(userId);
      const product = await this.prisma.product.update({
        where: { id_produit: id },
        data: cleanData,
      });

      const log = await this.activityLogService.createLog(
        'PRODUCT_UPDATED',
        `${product.nom_produit} modifié`,
        'product',
        product.id_produit,
        cleanUserId,
      );

      return product;
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  async remove(id: number, userId: number) {
    const product = await this.prisma.product.delete({
      where: { id_produit: id },
    });
    await this.activityLogService.createLog(
      'PRODUCT_DELETE',
      `produit n°${id} supprimé`,
      'product ',
      id,
      userId,
    );
  }
}
