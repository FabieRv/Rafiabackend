import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // ton frontend si tu en as un
    credentials: true,
  });

  await app.listen(3001); // maintenant le port correspond au client
  console.log('Nest server listening on http://localhost:3000');
}
bootstrap();
