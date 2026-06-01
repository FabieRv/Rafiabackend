import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandeService } from './commande.service';

@Controller('cart')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Post('add')
  addToCart(
    @Body() body: { userId: number; productId: number; quantity: number },
  ) {
    return this.commandeService.addToCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.commandeService.getCart(+userId);
  }
  
  @Post('validate')
  async validate(@Body() body: { userId: number }) {
    // C'est ici que le "Loading" du frontend sera déclenché
    const result = await this.commandeService.validateOrder(body.userId);
    return { message: 'Commande réussie', data: result };
  }
}
