import * as bcrypt from 'bcrypt';
import { Controller, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { SendGridService } from '@auth/sendgrid/sendgrid.service';
import { MessagePattern } from '@nestjs/microservices';
import handleErrorException from '@errorException/error.exception';
import {
  NewUserInterface,
  UpdateUserInterface,
} from './interface/user.interface';
import { USER_ACTIVE } from '@constants/schemas.contants';
import {
  SOMETHING_WENT_WRONG_TRY_AGAIN,
  USER_NOT_FOUND,
} from '@constants/error.contant';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // private readonly sendgridService: SendGridService,
  ) { }

  @MessagePattern('findUserById')
  async findUserById(id: string) {
    return await handleErrorException(async () => {
      const user = await this.userService.findUserById(id);

      if (!user)
        return {
          status: HttpStatus.NOT_FOUND,
          error: USER_NOT_FOUND,
        };

      return {
        status: HttpStatus.OK,
        data: { user },
      };
    });
  }

  @MessagePattern('getAllUsersWithRole')
  async findAllUsersWithRole() {
    return await handleErrorException(async () => {
      const employees = await this.userService.findAllEmployees();

      if (!employees) {
        return {
          status: 404,
          error: 'No employees found',
        };
      }

      return {
        status: 200,
        data: { employees },
      };
    });
  }

  @MessagePattern('createUser')
  async createUser(user: NewUserInterface) {
    return await handleErrorException(async () => {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.password, salt);
      const newUser = await this.userService.createUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
        password: hashPassword,
        role: user.role,
        department: user.department,
      });
      if (!newUser)
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };

      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
      };
    });
  }

  @MessagePattern('updateUser')
  async updateUser(data: UpdateUserInterface) {
    return await handleErrorException(async () => {
      const jobExist = await this.userService.findUserById(data?.id);

      if (!jobExist) {
        return {
          status: HttpStatus.NOT_FOUND,
          error: USER_NOT_FOUND,
        };
      }

      const updatedUser = await this.userService.findOneAndUpdate(data.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        status: data.status,
        role: data.role,
        department: data.department,
      });

      if (!updatedUser)
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };

      return {
        status: HttpStatus.OK,
        message: 'User updated successfully',
      };
    });
  }

  @MessagePattern('deleteUser')
  async deleteUser(id: string) {
    return await handleErrorException(async () => {
      const userExist = await this.userService.findUserById(id);

      if (!userExist)
        return {
          status: HttpStatus.NOT_FOUND,
          error: USER_NOT_FOUND,
        };

      const deletedUser = await this.userService.findOneAndDelete(id);

      if (!deletedUser)
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: SOMETHING_WENT_WRONG_TRY_AGAIN,
        };

      return {
        status: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    });
  }
}
