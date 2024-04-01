import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as expressSession from 'express-session';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    expressSession({
      secret: `${process.env.SESSION_SECRET}`,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const PORT = process.env.PORT || 4800;

  await app.listen(PORT, '0.0.0.0', () =>
    console.log(`Server listening on http://localhost:${PORT}/health`),
  );
}

bootstrap();
