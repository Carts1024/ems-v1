/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { AuthMsModule } from './auth-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthMsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 4003,
    },
  });

  await app.startAllMicroservices();
  await app.listen(4000); // this starts HTTP server
  // console.log('STMP_USER:', process.env.STMP_USER);
  // console.log('STMP_PASS:', process.env.STMP_PASS ? '*****' : 'MISSING!');
  // console.log('Auth service is running on http://localhost:4000');
}
bootstrap().catch(err => {
  console.error('Microservice failed to start:', err);
  process.exit(1);
});
