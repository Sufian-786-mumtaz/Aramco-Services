import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { TokenService } from '@services/token/token.service';
import { CreateOrganizationDto } from './dto/organization.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';

@Controller('organization')
export class OrganizationController {
  constructor(
    @Inject('DIGITAL_HUMAN') private readonly voiceService: ClientProxy,
    private readonly tokenService: TokenService,
  ) {}

  @Post('create')
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Res() res: Response,
  ) {
    const apiKey = await this.tokenService.createToken(
      createOrganizationDto.email,
    );

    const response = await this.voiceService
      .send('createOrganization', {
        ...createOrganizationDto,
        apiKey,
      })
      .toPromise();

    if (response?.status === HttpStatus.CREATED) {
      return res.status(HttpStatus.CREATED).send(response?.data);
    }
    throw new HttpException(response?.error, response?.status);
  }
}
