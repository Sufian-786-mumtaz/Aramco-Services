import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '@user/schemas/user.schema';
import { SendGridService } from './sendgrid/sendgrid.service';
import { UserService } from '@user/user.service';
import { JwtTokenService } from './jwt/jwt.token.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_ACCESS_SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    SendGridService,
    UserService,
    JwtTokenService,
    ConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
