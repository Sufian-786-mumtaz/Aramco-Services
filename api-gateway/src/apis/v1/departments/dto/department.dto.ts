import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsDefined,
  IsNotEmptyObject,
} from 'class-validator';

export class HODDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  email: string;
}

export class DepartmentDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => HODDto)
  hod: HODDto;

  @IsOptional()
  description: string;

  @IsOptional()
  contact_email: string;

  @IsOptional()
  status: string;
}

export class DepartmentUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  hod: object;

  @IsOptional()
  description: string;

  @IsOptional()
  contact_email: string;

  @IsOptional()
  status: string;
}
