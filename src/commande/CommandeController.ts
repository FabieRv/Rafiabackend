import path from 'path';
import { CommandeService } from './commande.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandeStatus } from '@prisma/client';

@Controller('commandes')
export class CommandeController {
  constructor(private readonly CommandeService: CommandeService) {}

  @Post()
  async create(
    @Body()
    data: {
      userId: number;
      items: { id_produit: number; quantite: number }[];
    },
  ) {
    return this.CommandeService.createCommande(data.userId, data.items);
  }

  @Get()
  async findAll() {
    return this.CommandeService.findAll();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: CommandeStatus,
  ) {
    return this.CommandeService.updateStatus(id, status);
  }
}
