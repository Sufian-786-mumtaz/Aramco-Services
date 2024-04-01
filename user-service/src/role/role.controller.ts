import { Controller, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import { MessagePattern } from '@nestjs/microservices';
import { Role } from './schemas/role.schema';
import handleErrorException from '@errorException/error.exception';
import {
    ROLE_NOT_FOUND,
    SOMETHING_WENT_WRONG_TRY_AGAIN,
} from '@constants/error.contant';
import {
    ROLE_CREATION_SUCCESS,
    ROLE_UPDATE_SUCCESS,
    ROLE_DELETION_SUCCESS,
} from '@constants/messages.contant';
import {
    NewRoleInterface,
    UpdateRoleInterface,
} from './interface/role.interface';

@Controller('role')
export class RoleController {
    constructor(private readonly rolesService: RoleService) { }

    @MessagePattern('getAllRoles')
    async getAllRoles(): Promise<Role[]> {
        return await handleErrorException(async () => {
            const roles = await this.rolesService.getAllRoles();

            if (!roles) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }

            return {
                status: HttpStatus.OK,
                data: { roles },
            };
        });
    }

    @MessagePattern('findRolesByFilter')
    async findRolesByFilter(filter: any): Promise<Role[]> {
        return await handleErrorException(async () => {
            const roles =
                await this.rolesService.findRolesByFilter(filter);

            if (!roles) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }
            return {
                status: HttpStatus.OK,
                data: { roles },
            };
        });
    }

    @MessagePattern('getRoleById')
    async findRoleById(roleId: any): Promise<Role> {
        return await handleErrorException(async () => {
            const role =
                await this.rolesService.findRoleById(roleId);
            if (!role) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }

            return {
                status: HttpStatus.OK,
                data: { role },
            };
        });
    }

    @MessagePattern('createRole')
    async createNewRole(
        newRoleInterface: NewRoleInterface,
    ): Promise<any> {
        return await handleErrorException(async () => {
            const role =
                await this.rolesService.createRole(newRoleInterface);
            if (!role) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: SOMETHING_WENT_WRONG_TRY_AGAIN,
                };
            }
            return {
                status: HttpStatus.CREATED,
                data: role,
                message: ROLE_CREATION_SUCCESS,
            };
        });
    }

    @MessagePattern('updateRole')
    async findRoleByIdAndUpate(
        updateRoletInterface: UpdateRoleInterface,
    ): Promise<Role> {
        return await handleErrorException(async () => {
            const roleExist = await this.rolesService.findRoleById(
                updateRoletInterface?.id,
            );

            if (!roleExist) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }
            const updateRole = await this.rolesService.findOneAndUpdate(
                { _id: updateRoletInterface?.id },
                updateRoletInterface.roles,
            );

            if (!updateRole) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: SOMETHING_WENT_WRONG_TRY_AGAIN,
                };
            }

            return {
                status: HttpStatus.OK,
                data: updateRole,
                message: ROLE_UPDATE_SUCCESS,
            };
        });
    }

    @MessagePattern('deleteRole')
    async findRoleByIdAndDelete(roleId: any): Promise<any> {
        return await handleErrorException(async () => {
            const roleExist =
                await this.rolesService.findRoleById(roleId);

            if (!roleExist) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    error: ROLE_NOT_FOUND,
                };
            }

            const deleteRole =
                await this.rolesService.findOneAndDelete(roleId);

            if (!deleteRole) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: SOMETHING_WENT_WRONG_TRY_AGAIN,
                };
            }

            return {
                status: HttpStatus.OK,
                message: ROLE_DELETION_SUCCESS,
            };
        });
    }
}
