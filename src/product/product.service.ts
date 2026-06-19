import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
import { CreateProductDtoRequest } from './dto/create-product.dto';
import { ActivityLogService } from 'src/activity/activity-log.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private activityLogService: ActivityLogService,
  ) {}

  // CREATE
  async create(data: CreateProductDtoRequest, userId: number) {
    try {
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
              id_sous_categorie: Number(data.id_sous_categorie),
            },
          },
        },
      });

      await this.activityLogService.createLog(
        'PRODUCT_CREATED',
        `${product.nom_produit} créé`,
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
    try {
      const cleanUserId = Number(userId);
      const product = await this.prisma.product.update({
        where: { id_produit: id },
        data,
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
    const product = await this.prisma.product.update({
      where: { id_produit: id },
      data: {
        is_active: false,
      },
    });
    await this.activityLogService.createLog(
      'PRODUCT_DELETE',
      `${product.nom_produit} supprimé`,
      'product ',
      product.id_produit,
      userId,
    );
  }
}
