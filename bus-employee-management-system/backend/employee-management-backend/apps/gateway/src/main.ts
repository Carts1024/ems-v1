/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  await app.listen(3001);
}
// Handle the Promise explicitly:
bootstrap().catch(err => {
  console.error('Failed to start the app:', err);
  process.exit(1);
});