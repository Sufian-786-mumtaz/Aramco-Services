import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { NewRoleInterface } from './interface/role.interface';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name)
        private readonly roleModel: Model<Role>,
    ) { }

    async getAllRoles(): Promise<Role[]> {
        return this.roleModel.find({});
    }

    findRoleById(roleId: any): Promise<Role> {
        return this.roleModel.findOne({ _id: roleId }).exec();
    }

    findRolesByFilter({ queryKey, queryValue }): Promise<Role> {
        const filter = { [queryKey]: queryValue };
        return this.roleModel.findOne(filter);
    }

    createRole(
        roleInterface: NewRoleInterface,
    ): Promise<Role> {
        return this.roleModel.create(roleInterface);
    }

    findOneAndUpdate(filter: any, body: any): Promise<Role> {
        return this.roleModel.findOneAndUpdate(filter, body, { new: true });
    }

    findOneAndDelete(roleId: any): Promise<any> {
        return this.roleModel.findByIdAndDelete({ _id: roleId });
    }
}
