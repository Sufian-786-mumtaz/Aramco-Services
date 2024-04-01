import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  AuthDtoSignIn,
  AuthDtoSignUp,
  EmailSignUpDto,
  ForgotDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  @Post('admin/sign-up-email')
  async createUserByAdmin(
    @Body() emailSignUpDto: EmailSignUpDto,
    @Res() res: Response,
  ) {
    const response = await this.userService
      .send('adminSignUpEmail', emailSignUpDto)
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }

  @Post('sign-up')
  async signUpUser(
    @Body() authDtoSignUp: AuthDtoSignUp,
    @Req() req,
    @Res() res: Response,
  ) {
    const response = await this.userService
      .send('signUpUser', authDtoSignUp)
      .toPromise();
    if (response?.status === HttpStatus.CREATED) {
      //Set the session
      req.session.user = response?.data?.payload;
      delete response?.data?.payload;

      return res.status(response?.status).send({ ...response?.data });
    }
    throw new HttpException(response?.error, response?.status);
  }

  @Post('sign-in')
  async login(
    @Body() authDtoSignIn: AuthDtoSignIn,
    @Req() req,
    @Res() res: Response,
  ) {
    const response = await this.userService
      .send('signInUser', authDtoSignIn)
      .toPromise();
    if (response?.status === HttpStatus.OK) {
      //Set the session
      req.session.user = response?.data?.payload;
      delete response?.data?.payload;

      return res.status(response?.status).send({ ...response?.data });
    }
    throw new HttpException(response?.error, response?.status);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotDto: ForgotDto, @Res() res: Response) {
    const response = await this.userService
      .send('forgotPasswordUser', forgotDto)
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }

  @Post('reset-new-password')
  async setPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    const response = await this.userService
      .send('resetNewPasswordUser', resetPasswordDto)
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }
}
