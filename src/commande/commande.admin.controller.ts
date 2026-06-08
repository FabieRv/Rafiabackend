import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
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

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.commandeService.updateStatus(id, updateStatusDto);
  }
}
