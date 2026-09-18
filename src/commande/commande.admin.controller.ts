import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Delete,
  Req,
} from '@nestjs/common';

import { CommandeService } from './commande.service';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/middleware/roles.decorator';
import { UpdateStatusDto } from './dto/update.status.dto';

@Controller('admin/commandes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class CommandeAdminController {
  constructor(private readonly commandeService: CommandeService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.commandeService.findAllForAdmin(status);
  }

  @Get('count')
  countCommandes() {
    return this.commandeService.countCommandes();
  }

  @Get('totalventes')
  async countAllTotalventecommande() {
    console.log('🔥 NEW VERSION ACTIVE');

    const totalArticles = await this.commandeService.getTotalVentesCount();

    return totalArticles;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commandeService.findOneForAdmin(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req,
  ) {
    return this.commandeService.updateStatus(id, updateStatusDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandeService.remove(id);
  }
}
