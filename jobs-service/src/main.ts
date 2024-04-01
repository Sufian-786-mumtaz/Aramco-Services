import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.JOBS_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.JOBS_SERVICE_PORT) || 4802,
      },
    },
  );

  await app.listen().then(() => console.log(`Jobs service is up and running`));
}

bootstrap();
