import {
  ADMIN_ROLE,
  DIRECTOR_ROLE,
  EMPLOYEE_ROLE,
  MANAGER_ROLE,
  STAFF_ROLE,
  SVP_ROLE,
  UNASSIGN_ROLE,
  USER_ACTIVE,
  USER_INACTIVE,
  VP_ROLE,
} from '@constants/schemas.constants';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsEmail,
  Matches,
  IsOptional,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum([USER_ACTIVE, USER_INACTIVE])
  status: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @IsOptional()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum([
    EMPLOYEE_ROLE,
    ADMIN_ROLE,
    SVP_ROLE,
    VP_ROLE,
    MANAGER_ROLE,
    DIRECTOR_ROLE,
    STAFF_ROLE,
    UNASSIGN_ROLE
  ])
  role: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum([USER_ACTIVE, USER_INACTIVE])
  status: string;

  @IsOptional()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum([
    EMPLOYEE_ROLE,
    ADMIN_ROLE,
    SVP_ROLE,
    VP_ROLE,
    MANAGER_ROLE,
    DIRECTOR_ROLE,
    STAFF_ROLE,
    UNASSIGN_ROLE
  ])
  role: string;
}
