import { Module } from '@nestjs/common';
import { MediaStorageController } from './media-storage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaStorageService } from './media-storage.service';
import { MediaStorageSchema, MediaStorage } from './schemas/media-storage';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MediaStorage.name, schema: MediaStorageSchema }]),
  ],
  controllers: [MediaStorageController],
  providers: [MediaStorageService]
})
export class MediaStorageModule { }
