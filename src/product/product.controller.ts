import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  UploadedFile,
  Query,
  ParseIntPipe,
  Req,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDtoRequest } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';
import { Roles } from 'src/middleware/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDtoRequest: any,
    @Req() req,
  ) {
    console.log('o====================================on est ici');

    if (!file) {
      throw new BadRequestException('Image must not be void,it is required');
    }

    createProductDtoRequest.image = file.filename;
    const userId = req.user.userId;
    return await this.productService.create(createProductDtoRequest, userId);
  }

  // MODIFIER (Protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateProductDtoRequest>,
    @Req() req,
  ) {
    console.log(
      '=== 🛰️ [BACKEND CONTROLLER] PATCH /products/:id TRIGGERED ===',
    );
    console.log('ID du produit ciblé (param) :', id);
    console.log('Payload partiel reçu (@Body) :', updateDto);
    console.log('Utilisateur extrait du Guard (req.user) :', req.user);

    const userId = req.user?.userId;
    if (!userId) {
      console.error(
        "❌ [ERROR] Le userId n'a pas pu être extrait de req.user. Vérifiez votre JwtStrategy.",
      );
    }
    if (file) updateDto.image = file.filename;

    const updatedProduct = await this.productService.update(
      +id,
      updateDto,
      userId,
    );
    console.log('✅ [BACKEND CONTROLLER] Traitement terminé avec succès.');
    return {
      message: 'Produit mis à jour avec succès',
      id_modifie: +id,
      statusCode: 200,
      product: updatedProduct,
    };
  }

  // 4. SUPPRIMER (Protégé par JWT)
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    await this.productService.remove(+id, userId);

    return {
      message: 'Produit supprimé avec succès',
      statusCode: 200,
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  //GET CATEGORY
  @Get('category/find')
  getAllCategory() {
    return this.productService.findAllCategory();
  }

  @Get('sous_category/find')
  getAllSousCategorie() {
    return this.productService.findAllSousCategorie();
  }
}
