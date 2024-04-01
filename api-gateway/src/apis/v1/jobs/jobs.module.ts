import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'JOBS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.JOBS_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.JOBS_SERVICE_PORT) || 4802,
        },
      },
    ]),
  ],
  controllers: [JobsController],
})
export class JobsModule {}
