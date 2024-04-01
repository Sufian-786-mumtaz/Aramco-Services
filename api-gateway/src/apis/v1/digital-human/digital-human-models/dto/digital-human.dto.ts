import {
  AUDIO_ASSETS,
  IMAGE_ASSETS,
  JOB_ASSIGNED,
  JOB_COMPLETED,
  JOB_GENERATING,
  JOB_IN_QUEUE,
  JOB_REJECTED,
  VIDEO_ASSETS,
} from '@constants/schemas.constants';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsEmail,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sourceId: string;
}

export class ArtifactsDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsEnum([IMAGE_ASSETS, AUDIO_ASSETS, VIDEO_ASSETS])
  url: string;
}

export class DigitalHumanDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => UserDto)
  user: UserDto;
}

export class OutputJobDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum([
    JOB_ASSIGNED,
    JOB_COMPLETED,
    JOB_GENERATING,
    JOB_IN_QUEUE,
    JOB_REJECTED,
  ])
  status: string;
}
