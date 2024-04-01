import {
  AUDIO_ASSETS,
  IMAGE_ASSETS,
  VIDEO_ASSETS,
} from '@constants/schemas.constants';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
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
  @IsEnum([IMAGE_ASSETS, AUDIO_ASSETS, VIDEO_ASSETS])
  type: string;

  @IsNotEmpty()
  url: string;
}

export class JobDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  user: UserDto;
}
