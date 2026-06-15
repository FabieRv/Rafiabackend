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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('🔥 HIT COMMANDE ID-------- =', id);
    return this.commandeService.findOneForAdmin(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.commandeService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commandeService.remove(id);
  }
}
