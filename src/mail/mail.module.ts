import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersController } from './mail.controller';
import { EmailService } from './mail.service';

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
  controllers: [UsersController],
  providers: [EmailService],
})
export class MailModule {}
