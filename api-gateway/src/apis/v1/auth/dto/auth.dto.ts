import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';

export class EmailSignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;
}

export class AuthDtoSignUp {
  @MinLength(3)
  @IsNotEmpty()
  firstName: string;

  @MinLength(3)
  @IsNotEmpty()
  lastName: string;

  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username should not contain special characters or spaces.',
  })
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsJWT()
  token: string;

  @IsNotEmpty()
  password: string;
}

export class AuthDtoSignIn {
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username should not contain special characters or spaces.',
  })
  userName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserSessionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  role: string;
}

export class ForgotDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @IsJWT()
  @IsNotEmpty()
  token: string;
}
