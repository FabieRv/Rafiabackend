import { Controller, Get } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';

@Controller('catalogues')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @Get('public')
  getPublicCatalogues() {
    return this.catalogueService.getCataloguesByCategories();
  }
}
