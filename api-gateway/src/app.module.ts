import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@apis/v1/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '@exception/global-exception';
import { JobsModule } from '@apis/v1/jobs/jobs.module';
import { TokenModule } from '@services/token/token.module';
import { DigitalHumanModule } from '@apis/v1/digital-human/digital-human.module';
import { DepartmentsModule } from './apis/v1/departments/departments.module';
import { UsersModule } from './apis/v1/users/users.module';
import { RolesModule } from './apis/v1/roles/roles.module';
import { MediaStorageModule } from '@apis/v1/media-storage/media-storage.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_ACCESS_SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    JobsModule,
    TokenModule,
    DigitalHumanModule,
    DepartmentsModule,
    UsersModule,
    RolesModule,
    MediaStorageModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule { }
