import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './mail.service';

@Controller('mail')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get('send')
  testMail(@Query('email') email: string, @Query('commande') commande: string) {
    const order = JSON.parse(commande);
    return this.emailService.sendMailConfirmation(email, order);
  }
}
