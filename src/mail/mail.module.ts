import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailService } from './mail.service';
import { EmailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'ileaugy@gmail.com',
          pass: 'gaecrjghrnuylsoz',
        },
      },
    }),
  ],
  controllers:[EmailController], //commande.id_commande
  providers: [EmailService],
})
export class MailModule {}
