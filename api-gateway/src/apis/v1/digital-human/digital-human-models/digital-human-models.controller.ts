import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFiles,
  HttpStatus,
  Res,
  BadRequestException,
  Inject,
  HttpException,
  UseGuards,
  Put,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as multer from 'multer';
import { DigitalHumanDto, OutputJobDto } from './dto/digital-human.dto';
import {
  audioMineTypes,
  imagesMineTypes,
  videoMineTypes,
} from '@constants/minetypes.constant';
import { bucketName, s3Client } from '@config/s3Config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { ClientProxy } from '@nestjs/microservices';
import { DigitalHumanTokenGuard } from '@guards/digitalHuman/digital-human.guard';
import axios from 'axios';
import { AuthGuard } from '@guards/auth/auth.guard';

@Controller('digital-human')
export class DigitalHumanModelsController {
  constructor(
    @Inject('JOBS_SERVICE') private readonly jobService: ClientProxy,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
      ],
      {
        storage: multer.memoryStorage(),
        limits: {
          fileSize: 20 * 1024 * 1024,
        },
      },
    ),
  )
  async uploadFiles(
    @UploadedFiles()
    files: { image: Express.Multer.File[]; audio: Express.Multer.File[] },
    @Body() digitalHumanDto: DigitalHumanDto,
    @Res() res: Response,
  ) {
    // Check the files
    if (!files?.image?.[0])
      throw new BadRequestException('Image file not found');
    if (!files?.audio?.[0])
      throw new BadRequestException('Audio file not found');

    // Check MIME type of files
    if (!imagesMineTypes.includes(files.image[0].mimetype))
      throw new BadRequestException('Invalid MIME type for the image file');
    if (!audioMineTypes.includes(files.audio[0].mimetype))
      throw new BadRequestException('Invalid MIME type for the audio file');

    const timestamp = Date.now();
    const imageName = `${timestamp}_${files.image[0].originalname.replace(/\s/g, '')}`;
    const audioName = `${timestamp}_${files.audio[0].originalname.replace(/\s/g, '')}`;

    // Upload image to S3
    const imageCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: `digital-human/${imageName}`,
      Body: files.image[0].buffer,
      ContentType: files.image[0].mimetype,
    });
    await s3Client.send(imageCommand);

    // Upload audio to S3
    const audioCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: `digital-human/${audioName}`,
      Body: files.audio[0].buffer,
      ContentType: files.audio[0].mimetype,
    });
    await s3Client.send(audioCommand);

    const response = await this.jobService
      .send('createJob', {
        artifacts: [
          {
            type: 'image',
            url: `${process.env.S3_BUCKET_ACCESS_URL}digital-human/${imageName}`,
          },
          {
            type: 'audio',
            url: `${process.env.S3_BUCKET_ACCESS_URL}digital-human/${audioName}`,
          },
        ],
        title: 'Avatar',
        description: digitalHumanDto.description,
        user: digitalHumanDto.user,
        status: 'in-queue',
      })
      .toPromise();

    if (response?.status === HttpStatus.CREATED) {
      const formData = new FormData();
      formData.append('description', digitalHumanDto.description);
      formData.append('user[id]', digitalHumanDto.user?.id);
      formData.append('user[name]', digitalHumanDto.user?.name);
      formData.append('user[email]', digitalHumanDto.user?.email);
      formData.append('user[sourceId]', response?.data?._id);
      formData.append('platform', 'aramco');
      formData.append(
        'image',
        new Blob([new Uint8Array(files.image[0].buffer)], {
          type: files.image[0].mimetype,
        }),
        files.image[0].originalname,
      );
      formData.append(
        'audio',
        new Blob([new Uint8Array(files.audio[0].buffer)], {
          type: files.audio[0].mimetype,
        }),
        files.audio[0].originalname,
      );

      await axios.post(
        'https://solutionsloftmail.com/api/v1/digital-human/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'API-Key': process.env.API_KEY,
          },
        },
      );

      return res.status(HttpStatus.CREATED).send(response?.data);
    }

    throw new HttpException(response?.error, response?.status);
  }

  @UseGuards(DigitalHumanTokenGuard)
  @Put('update/:jobId')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'video', maxCount: 1 }], {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async updateAvatarJobOutput(
    @UploadedFiles()
    files: { video: Express.Multer.File[] },
    @Res() res: Response,
    @Param('jobId') jobId: string,
    @Body() job: OutputJobDto,
  ) {
    if (!files?.video?.[0])
      throw new InternalServerErrorException('Video file not found');

    // Check MIME type of files
    if (!videoMineTypes.includes(files.video[0].mimetype))
      throw new InternalServerErrorException(
        'Invalid MIME type for the image file',
      );

    const timestamp = Date.now();

    // Upload image to S3
    const videoCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: `digital-human/outputs/${timestamp}_${files.video[0].originalname}`,
      Body: files.video[0].buffer,
      ContentType: files.video[0].mimetype,
    });
    await s3Client.send(videoCommand);

    const response = await this.jobService
      .send('updateJob', {
        jobId,
        status: job?.status,
        outputs: [
          {
            type: 'video',
            url: `${process.env.S3_BUCKET_ACCESS_URL}digital-human/outputs/${timestamp}_${files.video[0].originalname}`,
          },
        ],
      })
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ ...response?.data });
    throw new HttpException(response?.error, response?.status);
  }
}
