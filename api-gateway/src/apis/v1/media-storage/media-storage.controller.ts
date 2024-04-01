import { AuthGuard } from '@guards/auth/auth.guard';
import {
    Body,
    Controller,
    HttpException,
    BadRequestException,
    InternalServerErrorException,
    UploadedFiles,
    HttpStatus,
    Inject,
    UseInterceptors,
    Post,
    Res,
    Get,
    UseGuards,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { MediaStorageDto, UpdateMediaStorageDto } from './dto/media-storage.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { bucketName, s3Client } from '@config/s3Config';
import * as multer from 'multer';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';

@UseGuards(AuthGuard)
@Controller('media-storage')
export class MediaStorageController {
    constructor(
        @Inject('USER_SERVICE')
        private readonly medaiStorageService: ClientProxy,
    ) { }

    @Get('all')
    async getAllMediaStorage(@Res() res: Response) {
        const response = await this.medaiStorageService.send('getAllMediaStorage', {}).toPromise();
        if (response?.status === HttpStatus.OK)
            return res.status(response?.status).send({ ...response?.data });
        throw new HttpException(response?.error, response?.status);
    }

    @Get(':id')
    async getMediaStorageById(@Param('id') id: string, @Res() res: Response) {
        const response = await this.medaiStorageService.send('getMediaStorageById', id).toPromise();
        if (response?.status === HttpStatus.OK)
            return res.status(response?.status).send({ ...response?.data });
        throw new HttpException(response?.error, response?.status);
    }

    @Post('create')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'file', maxCount: 1 },
            ],
            {
                storage: multer.memoryStorage(),
                // limits: {
                //     fileSize: 20 * 1024 * 1024,
                // },
            },
        ),
    )
    async createMediaStorage(
        @UploadedFiles()
        files: { file: Express.Multer.File[] },
        @Body() mediaStorageDto: MediaStorageDto,
        @Res() res: Response) {
        if (!files.file[0]) throw new BadRequestException('file not found');
        const timestamp = Date.now();
        let fileName: string;
        if (mediaStorageDto.fileName) {
            const name = files.file[0].originalname
            const parts = name.split('.');
            const extension = parts[parts.length - 1];
            fileName = `${mediaStorageDto?.fileName}.${extension}`
        } else {
            fileName = `${timestamp}_${files.file[0].originalname.replace(/\s/g, '')}`;
        }

        // Upload file to S3
        const fileCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: `media-storage/${fileName}`,
            Body: files.file[0].buffer,
            ContentType: files.file[0].mimetype,
        });
        await s3Client.send(fileCommand);
        console.log("departmentIds---->>>", mediaStorageDto.departmentIds,)
        const response = await this.medaiStorageService
            .send('createMediaStorage', {
                fileName: fileName,
                description: mediaStorageDto.description,
                isShareAi: mediaStorageDto.isShareAi,
                user: mediaStorageDto.user,
                departmentIds: mediaStorageDto.departmentIds,
                url: `${process.env.S3_BUCKET_ACCESS_URL}media-storage/${fileName}`,
                status: mediaStorageDto.isShareAi === 'true' ? 'Processing' : null
            }).toPromise();
        if (response?.status === HttpStatus.CREATED)
            return res.status(response?.status).send({ message: response?.message });
        throw new HttpException(response?.error, response?.status);
    }

    @Put(':id/update')
    @UseInterceptors(
        FileFieldsInterceptor([{ name: 'file', maxCount: 1 }], {
            storage: multer.memoryStorage(),
            // limits: {
            //     fileSize: 10 * 1024 * 1024,
            // },
        }),
    )
    async updateMediaStorage(
        @UploadedFiles()
        files: { file?: Express.Multer.File[] },
        @Param('id') id: string,
        @Body() updateMediaStorageDto: UpdateMediaStorageDto,
        @Res() res: Response,
    ) {
        let fileName: string | undefined
        if (updateMediaStorageDto.isShareAi === 'true') {

        }
        let resObj: any = { ...updateMediaStorageDto, id: id, }
        if (files && files.file && files.file.length > 0) {
            if (updateMediaStorageDto.fileName) {
                const name = files.file[0].originalname
                const parts = name.split('.');
                const extension = parts[parts.length - 1];
                fileName = `${updateMediaStorageDto?.fileName}.${extension}`
            } else {
                const timestamp = Date.now();
                fileName = `${timestamp}_${files.file[0].originalname.replace(/\s/g, '')}`;
            }
            // Upload file to S3
            const fileCommand = new PutObjectCommand({
                Bucket: bucketName,
                Key: `media-storage/${fileName}`,
                Body: files.file[0].buffer,
                ContentType: files.file[0].mimetype,
            });
            await s3Client.send(fileCommand);
            resObj.fileName = fileName;
            resObj.url = `${process.env.S3_BUCKET_ACCESS_URL}media-storage/${fileName}`;
        }
        resObj.status = updateMediaStorageDto.isShareAi === 'true' ? "Processing" : null
        const response = await this.medaiStorageService.send('updateMediaStorage', resObj).toPromise();
        if (response?.status === HttpStatus.OK)
            return res.status(response?.status).send({ data: { ...response?.data, }, message: response?.message });
        throw new HttpException(response?.error, response?.status);
    }

    @Delete(':id/delete')
    async deleteMediaStorage(@Param('id') id: string, @Res() res: Response) {
        // Get the media storage entry first
        const response = await this.medaiStorageService.send('getMediaStorageById', id).toPromise();
        if (response?.status !== HttpStatus.OK) {
            throw new HttpException(response?.error, response?.status);
        }

        // Extract file name from the media storage entry
        const fileName = response.data.fileName;

        // Delete the file from the S3 bucket
        const deleteFileCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: `media-storage/${fileName}`,
        });
        await s3Client.send(deleteFileCommand);
        const deleteResponse = await this.medaiStorageService.send('deleteMediaStorage', id).toPromise();
        if (deleteResponse?.status === HttpStatus.OK)
            return res.status(deleteResponse?.status).send({ message: deleteResponse?.message });
        throw new HttpException(deleteResponse?.error, deleteResponse?.status);
    }
}
