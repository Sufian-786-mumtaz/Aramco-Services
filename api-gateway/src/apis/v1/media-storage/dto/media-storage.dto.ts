import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsObject,
  IsArray,
  IsBoolean
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
}

export class MediaStorageDto {
  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  isShareAi: string

  @IsObject()
  user: UserDto

  @IsOptional()
  @IsArray()
  departmentIds?: string[]
}

export class UpdateMediaStorageDto {
  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  isShareAi: string

  @IsOptional()
  @IsObject()
  user?: UserDto

  @IsOptional()
  @IsArray()
  departmentIds?: string[]

}