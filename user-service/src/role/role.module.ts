import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesSchema, Role } from './schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RolesSchema }]),
  ],
  providers: [RoleService],
  controllers: [RoleController]
})
export class RoleModule { }
