import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/user/prisma.service';

@Injectable()
export class CatalogueService {
  constructor(private prisma: PrismaService) {}

  async getCataloguesByCategories() {
    return this.prisma.category.findMany({
      where: {
        catalogues: {
          some: { statut: 'ACTIF' },
        },
      },
      include: {
        catalogues: {
          where: { statut: 'ACTIF' },
          select: {
            id_catalogue: true,
            nom_lien_pdf: true,
            date_ajout: true,
          },
        },
      },
    });
  }

  // Pour ton futur panel Admin
  async findAllForAdmin() {
    return this.prisma.catalogue.findMany({
      include: {
        categorie: true,
        user: { select: { name: true } },
      },
    });
  }
}
