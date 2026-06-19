import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';

import * as path from 'path';
import { Response } from 'express';
import { PrismaService } from 'src/prisma.service';

@Controller('catalogue')
export class CatalogueController {
  constructor(private prisma: PrismaService) {}

  @Get('download/:id')
  async downloadCatalogue(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: any,
  ) {
    console.log('-------------------' + id);
    const catalogue = await this.prisma.catalogue.findUnique({
      where: {
        id_catalogue: id,
      },
    });

    if (!catalogue || !catalogue.nom_lien_pdf) {
      throw new NotFoundException('PDF introuvable');
    }
    console.log('process.cwd():', process.cwd());
    console.log('DB path:', catalogue.nom_lien_pdf);

    const filePath = path.join(
      process.cwd(),
      'uploads/catalogues/' + catalogue.nom_lien_pdf,
    );

    return res.download(filePath);
  }
}
