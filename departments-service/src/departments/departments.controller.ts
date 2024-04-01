import { Controller, HttpStatus } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { MessagePattern } from '@nestjs/microservices';
import { Department } from './schemas/departments.schema';
import handleErrorException from '@errorException/error.exception';
import {
  DEPARTMENT_NOT_FOUND,
  SOMETHING_WENT_WRONG_TRY_AGAIN,
} from '@constants/error.contant';
import {
  DEPARTMENT_CREATION_SUCCESS,
  DEPARTMENT_UPDATE_SUCCESS,
  SUB_DEPARTMENT_UPDATE_SUCCESS,
  DEPARTMENT_DELETION_SUCCESS,
  SUB_DEPARTMENT_CREATION_SUCCESS,
  PARENT_DEPARTMENT_HAVE_CHILD
} from '@constants/messages.contant';
import {
  DepartmentInterface,
  UpdateDepartmentInterface,
} from './interface/departments.interface';
import { log } from 'console';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) { }

  @MessagePattern('getAllDepartments')
  async getAllDepartments(): Promise<Department[]> {
    return await handleErrorException(async () => {
      const departments = await this.departmentsService.getAllDepartments();

      if (!departments) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: DEPARTMENT_NOT_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: { departments },
      };
    });
  }

  @MessagePattern('findDepartmentByFilter')
  async findDepartmentsByFilter(filter: any): Promise<Department[]> {
    return await handleErrorException(async () => {
      const department =
        await this.departmentsService.findDepartmentByFilter(filter);

      if (!department) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: DEPARTMENT_NOT_FOUND,
        };
      }
      return {
        status: HttpStatus.OK,
        data: { department },
      };
    });
  }

  @MessagePattern('getDepartmentById')
  async findDepartmentById(departmentId: any): Promise<Department> {
    return await handleErrorException(async () => {
      const department =
        await this.departmentsService.findDepartmentById(departmentId);
      if (!department) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: DEPARTMENT_NOT_FOUND,
        };
      }

      return {
        status: HttpStatus.OK,
        data: { department },
      };
    });
  }

  @MessagePattern('createDepartment')
  async createNewDepartment(
    departmentInterface: DepartmentInterface,
  ): Promise<any> {
    return await handleErrorException(async () => {
      const department =
        await this.departmentsService.createDepartment(departmentInterface);
      if (!department) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };
      }
      return {
        status: HttpStatus.CREATED,
        data: department,
        message: department.parentId ? SUB_DEPARTMENT_CREATION_SUCCESS : DEPARTMENT_CREATION_SUCCESS,
      };
    });
  }

  @MessagePattern('updateDepartment')
  async findDepartmentByIdAndUpate(
    updateDepartmentInterface: UpdateDepartmentInterface,
  ): Promise<Department> {
    return await handleErrorException(async () => {
      const departmentExist = await this.departmentsService.findDepartmentById(
        updateDepartmentInterface?.id,
      );

      if (!departmentExist) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: DEPARTMENT_NOT_FOUND,
        };
      }
      const updateDepartment = await this.departmentsService.findOneAndUpdate(
        { _id: updateDepartmentInterface?.id },
        updateDepartmentInterface?.department,
      );
      if (!updateDepartment) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };
      }
      return {
        status: HttpStatus.OK,
        data: updateDepartment,
        message: updateDepartment.parentId ? SUB_DEPARTMENT_UPDATE_SUCCESS : DEPARTMENT_UPDATE_SUCCESS,
      };
    });
  }

  @MessagePattern('deleteDepartment')
  async findJobByIdAndDelete(departmentId: any): Promise<any> {
    return await handleErrorException(async () => {
      const departmentExist =
        await this.departmentsService.findDepartmentById(departmentId);

      if (!departmentExist) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: DEPARTMENT_NOT_FOUND,
        };
      }

      if (!departmentExist.parentId) {
        const childDepartments = await this.departmentsService.findChildDepartments(departmentId);
        if (childDepartments.length > 0) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: PARENT_DEPARTMENT_HAVE_CHILD,
          };
        }
      }

      const deleteDepartment =
        await this.departmentsService.findOneAndDelete(departmentId);

      if (!deleteDepartment) {
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };
      }

      return {
        status: HttpStatus.OK,
        message: DEPARTMENT_DELETION_SUCCESS,
      };
    });
  }
}
