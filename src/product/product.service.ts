import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';
import {CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  //CREATE
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

  //READ
  async findAll() {
    return this.prisma.product.findMany({
      include: {
        sous_category: {
          include: { category: true },
        },
      },
    });
  }

  //UPDATE
  async update(id: number, data: Partial<CreateProductDto>) {
    return this.prisma.product.update({
      where: { id_produit: id },
      data,
    });
  }

  // DELETE : Supprimer
  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id_produit: id },
    });
  }
}
