import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestMail(destinataire: string) {
    console.log('-------------------tested mail -------------------------');
    await this.mailerService.sendMail({
      to: destinataire,
      subject: 'Test NestJS',
      text: 'Bonjour depuis NestJS !',
      html: '<b>Bonjour depuis NestJS !</b>',
    });
    return 'mail sent!';
  }
}
