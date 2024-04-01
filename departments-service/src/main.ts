import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.DEPARTMENTS_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.DEPARTMENTS_SERVICE_PORT) || 4803,
      },
    },
  );

  await app
    .listen()
    .then(() => console.log(`Department service is up and running`));
}

bootstrap();
