import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { JwtAuthGuard } from 'src/middleware/jwt-auth.guard';

@Controller('commande')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async confirmOrder (@Req() req, @Body() body) {
    console.log(req.user);
    console.log('USER =-----------------user', req.user);
    console.log('BODY =-----------------body', body);
    const userId = req.user?.userId;

    return this.commandeService.validateOrder(userId, body);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    console.log('ok------------------------------------------ok');
    return this.commandeService.getCart(+userId);
  }
}
