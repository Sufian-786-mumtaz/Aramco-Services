import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
  Get,
  UseGuards,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { ArtifactsDto, JobDto } from './dto/jobs.dto';
import { AuthGuard } from '@guards/auth/auth.guard';
import { bucketName, s3Client } from '@config/s3Config';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

@UseGuards(AuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(
    @Inject('JOBS_SERVICE')
    private readonly jobService: ClientProxy,
  ) { }

  @Get('all')
  async getAllJobs(@Query() query: Record<string, any>, @Res() res: Response) {
    const queryKey = Object.keys(query)[0];
    const queryValue = query[queryKey];
    let response: {
      status: number;
      data: any;
      error: string | Record<string, any>;
    };
    if (queryKey && queryValue) {
      response = await this.jobService
        .send('findJobsByFilter', { queryKey, queryValue })
        .toPromise();
    } else response = await this.jobService.send('getAllJobs', {}).toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ ...response?.data });
    throw new HttpException(response?.error, response?.status);
  }

  @Get(':id')
  async getJobById(@Param('id') id: string, @Res() res: Response) {
    const response = await this.jobService.send('getJobById', id).toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ ...response?.data });
    throw new HttpException(response?.error, response?.status);
  }

  @Post('create')
  async createJob(@Body() jobDto: JobDto, @Res() res: Response) {
    const response = await this.jobService
      .send('createJob', jobDto)
      .toPromise();

    if (response?.status === HttpStatus.CREATED)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }

  @Put(':id/update')
  async updateJob(
    @Param('id') id: string,
    @Body() job: JobDto,
    @Res() res: Response,
  ) {
    const response = await this.jobService
      .send('updateJob', { id, job })
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ ...response?.data });
    throw new HttpException(response?.error, response?.status);
  }

  @Delete(':id/delete')
  async deleteJob(@Param('id') id: string, @Res() res: Response) {
    const getJob = await this.jobService.send('getJobById', id).toPromise();

    getJob?.data?.job.artifacts?.forEach(async (artifact: ArtifactsDto) => {
      const commandDel = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: `${artifact?.url?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]}`,
      });
      await s3Client.send(commandDel);
    });

    const response = await this.jobService.send('deleteJob', id).toPromise();

    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }
}
