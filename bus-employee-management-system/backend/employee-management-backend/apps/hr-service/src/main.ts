/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { HrServiceModule } from './hr-service.module';

async function bootstrap() {
  const app = await NestFactory.create(HrServiceModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4002);
}
bootstrap();
