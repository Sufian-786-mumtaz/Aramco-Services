import { Controller, HttpStatus } from '@nestjs/common';
import { MediaStorageService } from './media-storage.service';
import { MessagePattern } from '@nestjs/microservices';
import { MediaStorage } from './schemas/media-storage';
import handleErrorException from '@errorException/error.exception';
import {
    ROLE_NOT_FOUND,
    SOMETHING_WENT_WRONG_TRY_AGAIN,
} from '@constants/error.contant';
import {
    MEDIA_STORAGE_CREATION_SUCCESS,
    MEDIA_STORAGE_UPDATE_SUCCESS,
    MEDIA_STORAGE_DELETION_SUCCESS,
} from '@constants/messages.contant';
import {
    NewMediaStorageInterface,
    UpdateMediaStorageInterface,
} from './interface/media-storage.interface';

@Controller('media-storage')
export class MediaStorageController {
    constructor(private readonly mediaStorageService: MediaStorageService) { }

    @MessagePattern('getAllMediaStorage')
    async getAllMediaStorage(): Promise<MediaStorage[]> {
        return await handleErrorException(async () => {
            const mediaStorage = await this.mediaStorageService.getAllMediaStorage();

            if (!mediaStorage) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }

            return {
                status: HttpStatus.OK,
                data: { mediaStorage },
            };
        });
    }

    @MessagePattern('findMediaStorageByFilter')
    async findMediaStorageByFilter(filter: any): Promise<MediaStorage[]> {
        return await handleErrorException(async () => {
            const mediaStorage =
                await this.mediaStorageService.findMediaStorageByFilter(filter);

            if (!mediaStorage) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }
            return {
                status: HttpStatus.OK,
                data: { mediaStorage },
            };
        });
    }

    @MessagePattern('getMediaStorageById')
    async findMediaStorageById(mediaStorageId: any): Promise<MediaStorage> {
        return await handleErrorException(async () => {
            const mediaStorage =
                await this.mediaStorageService.findMediaStorageById(mediaStorageId);
            if (!mediaStorage) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }

            return {
                status: HttpStatus.OK,
                data: { mediaStorage },
            };
        });
    }

    @MessagePattern('createMediaStorage')
    async createNewMediaStorage(
        newMediaStorageInterface: NewMediaStorageInterface,
    ): Promise<any> {
        return await handleErrorException(async () => {
            const mediaStorage =
                await this.mediaStorageService.createMediaStorage(newMediaStorageInterface);
            if (!mediaStorage) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: SOMETHING_WENT_WRONG_TRY_AGAIN,
                };
            }
            return {
                status: HttpStatus.CREATED,
                data: mediaStorage,
                message: MEDIA_STORAGE_CREATION_SUCCESS,
            };
        });
    }

    @MessagePattern('updateMediaStorage')
    async findMediaStorageByIdAndUpate(
        updateMediaStorageInterface: UpdateMediaStorageInterface,
    ): Promise<MediaStorage> {
        console.log('update', updateMediaStorageInterface)
        return await handleErrorException(async () => {
            const mediaStorageExist = await this.mediaStorageService.findMediaStorageById(
                updateMediaStorageInterface?.id,
            );

            if (!mediaStorageExist) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }
            const updateMediaStorage = await this.mediaStorageService.findOneAndUpdate(
                { _id: updateMediaStorageInterface?.id },
                {
                    fileName: updateMediaStorageInterface?.fileName,
                    description: updateMediaStorageInterface?.description,
                    url: updateMediaStorageInterface?.url,
                    user: updateMediaStorageInterface?.user,
                    departmentIds: updateMediaStorageInterface?.departmentIds,
                    status: updateMediaStorageInterface.status,
                    isShareAi: updateMediaStorageInterface.isShareAi
                }
            );

            if (!updateMediaStorage) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: SOMETHING_WENT_WRONG_TRY_AGAIN,
                };
            }

            return {
                status: HttpStatus.OK,
                data: updateMediaStorage,
                message: MEDIA_STORAGE_UPDATE_SUCCESS,
            };
        });
    }

    @MessagePattern('deleteMediaStorage')
    async findMediaStorageByIdAndDelete(mediaStorageId: any): Promise<any> {
        return await handleErrorException(async () => {
            const mediaStorageExist =
                await this.mediaStorageService.findMediaStorageById(mediaStorageId);

            if (!mediaStorageExist) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }

            const deleteMediaStorage =
                await this.mediaStorageService.findOneAndDelete(mediaStorageId);

            if (!deleteMediaStorage) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: SOMETHING_WENT_WRONG_TRY_AGAIN,
                };
            }

            return {
                status: HttpStatus.OK,
                message: MEDIA_STORAGE_DELETION_SUCCESS,
            };
        });
    }
}
