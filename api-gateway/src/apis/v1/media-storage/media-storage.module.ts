import { Module } from '@nestjs/common';
import { MediaStorageController } from './media-storage.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.USER_SERVICE_PORT) || 4801,
        },
      },
    ]),
  ],
  controllers: [MediaStorageController]
})
export class MediaStorageModule { }
