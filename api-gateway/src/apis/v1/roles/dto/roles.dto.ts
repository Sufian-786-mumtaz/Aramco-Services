import {
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class RolesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateRolesDto {

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

}
