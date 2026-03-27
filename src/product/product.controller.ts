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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('public-models')
  async getPublicModels(@Query('categoryId') categoryId?: string) {
    const id = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.productService.findAll(id);
  }

  @Get('get-category-count')
  async countAllProductByCategory() {
    return this.productService.getCategoryCounts();
  }

  // 2. AJOUTER (Protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Post('add')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // 3. MODIFIER (Protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateProductDto>,
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
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(+id);

    return {
      message: 'Produit supprimé avec succès',
      statusCode: 200,
    };
  }
}
