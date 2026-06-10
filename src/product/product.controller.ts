import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDtoRequest } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';
import { Roles } from 'src/middleware/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //get liste des produits
  @Get('public-models')
  async getPublicModels(@Query('categoryId') categoryId?: string) {
    const id = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.productService.findAll(id);
  }

  //get par category
  @Get('get-category-count')
  async countAllProductByCategory() {
    return this.productService.getCategoryCounts();
  }

  //cout product
  @Get('count')
  async countProducts() {
    return {
      count: await this.productService.countProducts(),
    };
  }


  //GET
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async create(@Body() createProductDtoRequest: CreateProductDtoRequest) {
    return await this.productService.create(createProductDtoRequest);
  }

  // MODIFIER (Protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateProductDtoRequest>,
  ) {
    await this.productService.update(+id, updateDto);
    return {
      message: 'Produit mis à jour avec succès',
      id_modifie: +id,
      statusCode: 200,
    };
  }

  // 4. SUPPRIMER (Protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(+id);

    return {
      message: 'Produit supprimé avec succès',
      statusCode: 200,
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }
}
