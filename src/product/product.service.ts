import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
import { CreateProductDtoRequest } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreateProductDtoRequest) {
    try {
      return await this.prisma.product.create({
        data: {
          nom_produit: data.nom_produit,
          description: data.description,
          type: data.type,
          prix: Number(data.prix),
          quantite_stock: Number(data.quantite_stock),
          image: data.image,
          //Number(data.id_sous_categorie)
          sous_category: {
            connect: {
              id_sous_categorie: Number(data.id_sous_categorie),
            },
          },
        },
      });
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
  async update(id: number, data: Partial<CreateProductDtoRequest>) {
    return this.prisma.product.update({
      where: { id_produit: id },
      data,
    });
  }

  // DELETE
  async remove(id: number) {
    return this.prisma.product.update({
      where: { id_produit: id },
      data: {
        is_active: false,
      },
    });
  }
}
