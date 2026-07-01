import { Controller, Get } from '@nestjs/common';
import { EmailService } from './mail.service';

@Controller('mail')
export class UsersController {
  constructor(private readonly emailService: EmailService) {}
  @Get('send')
  testMail() {
    console.log('-------------------called -------------------------');
    return this.emailService.sendTestMail('augustinrakotoarivelo@gmail.com');
  }
}
