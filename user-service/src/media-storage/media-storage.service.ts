import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaStorage } from './schemas/media-storage';
import { NewMediaStorageInterface } from './interface/media-storage.interface';

@Injectable()
export class MediaStorageService {
    constructor(
        @InjectModel(MediaStorage.name)
        private readonly mediaStorageModal: Model<MediaStorage>,
    ) { }

    async getAllMediaStorage(): Promise<MediaStorage[]> {
        return this.mediaStorageModal.find({});
    }

    findMediaStorageById(mediaStorageId: any): Promise<MediaStorage> {
        return this.mediaStorageModal.findOne({ _id: mediaStorageId }).exec();
    }

    findMediaStorageByFilter({ queryKey, queryValue }): Promise<MediaStorage> {
        const filter = { [queryKey]: queryValue };
        return this.mediaStorageModal.findOne(filter);
    }

    createMediaStorage(
        mediaStorageInterface: NewMediaStorageInterface,
    ): Promise<MediaStorage> {
        return this.mediaStorageModal.create(mediaStorageInterface);
    }

    findOneAndUpdate(filter: any, body: any): Promise<MediaStorage> {
        return this.mediaStorageModal.findOneAndUpdate(filter, body, { new: true });
    }

    findOneAndDelete(mediaStorageId: any): Promise<any> {
        return this.mediaStorageModal.findByIdAndDelete({ _id: mediaStorageId });
    }
}
