import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DEPARTMENTS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DEPARTMENTS_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.DEPARTMENTS_SERVICE_PORT) || 4803,
        },
      },
    ]),
  ],
  controllers: [DepartmentsController],
})
export class DepartmentsModule { }
