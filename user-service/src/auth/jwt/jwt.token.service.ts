import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateSignUpToken(email: string) {
    const payload = {
      sub: email,
      user: {
        email,
      },
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: `${process.env.JWT_SIGN_UP_EMAIL_SECRET}`,
    });
    return token;
  }

  async generateForgotPasswordToken(user: any) {
    const payload = {
      sub: user?._id,
      user: {
        userId: user?._id,
        email: user?.email,
        encodeURI: user?.password,
      },
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: `${process.env.JWT_EMAIL_SECRET}`,
    });
    return token;
  }

  async generateAccessToken(user: any) {
    const payload = {
      sub: user?._id,
      user: {
        userId: user?._id,
        email: user?.email,
        role: user?.role ?? 'user',
      },
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: `${process.env.JWT_ACCESS_SECRET}`,
      expiresIn: '7d',
      algorithm: 'HS512',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: `${process.env.JWT_REFRESH_SECRET}`,
      expiresIn: '30d',
      algorithm: 'HS512',
    });
    return { payload, accessToken, refreshToken };
  }

  async decryptForgotToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: `${process.env.JWT_EMAIL_SECRET}`,
    });
  }

  async decryptSignUpToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: `${process.env.JWT_SIGN_UP_EMAIL_SECRET}`,
    });
  }
}
