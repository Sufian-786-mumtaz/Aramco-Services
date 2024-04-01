import * as bcrypt from 'bcrypt';
import { Controller, HttpStatus } from '@nestjs/common';
import {
  ACCOUNT_NOT_EXIST,
  CREDIENTIAL_NOT_VALID,
  LOGIN_WITH_WAIT_LIST_EMAIL,
  ONE_TIME_TOKEN_EXPIRED,
  SOMETHING_WENT_WRONG_TRY_AGAIN,
  USER_ALREADY_EXIST_WITH_EMAIL,
  USER_ALREADY_EXIST_WITH_USERNAME,
} from '@constants/error.contant';
import {
  AuthSignIn,
  AuthSignUp,
  EmailSignUp,
  ForgotPassword,
  ResetPassword,
} from './interface/auth.interface';
import { UserService } from '@user/user.service';
import { JwtTokenService } from './jwt/jwt.token.service';
import {
  EMAIL_SENT_MESSAGE,
  PASSWORD_CHANGED_MESSAGE,
} from '@constants/messages.contant';
import { SendGridService } from './sendgrid/sendgrid.service';
import { MessagePattern } from '@nestjs/microservices';
import handleErrorException from '@errorException/error.exception';
import { USER_ACTIVE, USER_ROLE } from '@constants/schemas.contants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly sendgridService: SendGridService,
  ) {}

  @MessagePattern('adminSignUpEmail')
  async createUserByAdmin(emailSignUp: EmailSignUp): Promise<any> {
    return await handleErrorException(async () => {
      // Find user by email
      const userExist = await this.userService.findUserByFilter({
        email: emailSignUp.email,
      });

      if (userExist)
        return {
          status: HttpStatus.FORBIDDEN,
          error: USER_ALREADY_EXIST_WITH_EMAIL,
        };

      //Accessing the Tokens
      const token = await this.jwtTokenService.generateSignUpToken(
        emailSignUp.email,
      );

      await this.sendgridService.signUpEmail(emailSignUp, token);

      return {
        status: HttpStatus.OK,
        message: EMAIL_SENT_MESSAGE,
      };
    });
  }

  @MessagePattern('signUpUser')
  async signUpUser(authSignUp: AuthSignUp) {
    return await handleErrorException(async () => {
      // Decrypt forgot token
      const tokenInfo = await this.jwtTokenService.decryptSignUpToken(
        authSignUp.token,
      );

      if (tokenInfo?.user?.email !== authSignUp.email)
        return {
          status: HttpStatus.BAD_REQUEST,
          error: LOGIN_WITH_WAIT_LIST_EMAIL,
        };

      // Find user by email
      const userExist = await this.userService.findUserByFilter({
        email: authSignUp.email,
      });

      if (userExist)
        return {
          status: HttpStatus.FORBIDDEN,
          error: USER_ALREADY_EXIST_WITH_EMAIL,
        };

      // Find user by username
      const userNameExist = await this.userService.findUserByFilter({
        userName: authSignUp.userName,
      });

      if (userNameExist)
        return {
          status: HttpStatus.FORBIDDEN,
          error: USER_ALREADY_EXIST_WITH_USERNAME,
        };

      //Generating user password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(authSignUp.password, salt);

      // Update and Sign up user
      const user = await this.userService.createUser({
        firstName: authSignUp.firstName,
        lastName: authSignUp.lastName,
        email: authSignUp.email,
        status: USER_ACTIVE,
        password: hashPassword,
        userName: authSignUp.userName,
      });

      if (!user)
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };

      //Accessing the Tokens
      const { payload, accessToken, refreshToken } =
        await this.jwtTokenService.generateAccessToken(user);

      return {
        status: HttpStatus.CREATED,
        data: { payload, user, accessToken, refreshToken },
      };
    });
  }

  @MessagePattern('signInUser')
  async login(authSignIn: AuthSignIn): Promise<any> {
    return await handleErrorException(async () => {
      const filter = {};
      if (authSignIn?.userName) filter['userName'] = authSignIn?.userName;
      if (authSignIn?.email) filter['email'] = authSignIn?.email;

      // Find user by email or username
      const user = await this.userService.findUserByFilter(filter);
      if (!user)
        return {
          status: HttpStatus.NOT_FOUND,
          error: ACCOUNT_NOT_EXIST,
        };

      //Compare user password
      const isMatch = await bcrypt.compare(
        authSignIn?.password,
        user?.password,
      );

      if (!isMatch)
        return {
          status: HttpStatus.BAD_REQUEST,
          error: CREDIENTIAL_NOT_VALID,
        };

      //Accessing the Tokens
      const { payload, accessToken, refreshToken } =
        await this.jwtTokenService.generateAccessToken(user);

      return {
        status: HttpStatus.OK,
        data: { user, accessToken, refreshToken, payload },
      };
    });
  }

  @MessagePattern('forgotPasswordUser')
  async forgotPassword(forgotPassword: ForgotPassword) {
    return await handleErrorException(async () => {
      // Find user by email or username
      const user = await this.userService.findUserByFilter({
        email: forgotPassword.email,
      });
      if (!user)
        return {
          status: HttpStatus.NOT_FOUND,
          error: ACCOUNT_NOT_EXIST,
        };

      //Accessing the Tokens
      const token =
        await this.jwtTokenService.generateForgotPasswordToken(user);

      await this.sendgridService.forgotPasswordEmail(user, token);

      return {
        status: HttpStatus.OK,
        message: EMAIL_SENT_MESSAGE,
      };
    });
  }

  @MessagePattern('resetNewPasswordUser')
  async setPassword(resetPassword: ResetPassword) {
    return await handleErrorException(async () => {
      // Decrypt forgot token
      const userInfo = await this.jwtTokenService.decryptForgotToken(
        resetPassword.token,
      );

      // Find user by email or username
      const user = await this.userService.findUserById(userInfo?.user?.userId);
      if (!user)
        return { status: HttpStatus.NOT_FOUND, error: ACCOUNT_NOT_EXIST };

      if (userInfo?.user?.encodeURI !== user?.password)
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: ONE_TIME_TOKEN_EXPIRED,
        };

      //Generating user password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(resetPassword.password, salt);

      // Update user password
      const userUpdated = await this.userService.findOneAndUpdate(
        { _id: userInfo?.user?.userId },
        { password: hashPassword },
      );

      if (!userUpdated)
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };

      return {
        status: HttpStatus.OK,
        message: PASSWORD_CHANGED_MESSAGE,
      };
    });
  }
}
