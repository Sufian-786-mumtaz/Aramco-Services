import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfigModule } from '@dbConfig/db.config';
import { ConfigModule } from '@nestjs/config';
import { RoleService } from './role/role.service';
import { RoleModule } from './role/role.module';
import { MediaStorageModule } from './media-storage/media-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseConfigModule,
    UserModule,
    AuthModule,
    RoleModule,
    MediaStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
