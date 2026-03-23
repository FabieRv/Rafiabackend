import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service'; // Assure-toi que le chemin est correct
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        nom_produit: data.nom_produit,
        description: data.description,
        prix: data.prix,
        quantite_stock: data.quantite_stock,
        image: data.image,
        id_sous_categorie: data.id_sous_categorie,
        id_catalogue: data.id_catalogue,
      },
    });
  }

  // READ : Tous les produits
  async findAll() {
    return this.prisma.product.findMany({
      include: {
        sous_category: {
          include: { category: true },
        },
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

  // UPDATE
  async update(id: number, data: Partial<CreateProductDto>) {
    return this.prisma.product.update({
      where: { id_produit: id },
      data,
    });
  }

  // DELETE
  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id_produit: id },
    });
  }
}
