import { Module } from '@nestjs/common';
import { OrganizationController } from './organization/organization.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TokenService } from '@services/token/token.service';
import { DigitalHumanModelsController } from './digital-human-models/digital-human-models.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DIGITAL_HUMAN',
        transport: Transport.TCP,
        options: {
          host: process.env.DIGITAL_HUMAN_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.DIGITAL_HUMAN_SERVICE_PORT) || 4804,
        },
      },
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
  providers: [TokenService],
  controllers: [OrganizationController, DigitalHumanModelsController],
})
export class DigitalHumanModule {}
