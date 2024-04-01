import { AdminGuard } from '@guards/auth/admin.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { UpdateUserDto, UserDto } from './dto/users.dto';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { bucketName, s3Client } from '@config/s3Config';

@UseGuards(AdminGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  @Get('all')
  async getAllUsers(@Res() res: Response) {
    const response = await this.userService
      .send('getAllUsersWithRole', 'employee')
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ ...response?.data });
    throw new HttpException(response?.error, response?.status);
  }

  @Get(':userId')
  async getSingleUser(@Param('userId') userId: string, @Res() res: Response) {
    const response = await this.userService
      .send('findUserById', userId)
      .toPromise();

    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ data: response?.data });
    throw new HttpException(response?.error, response?.status);
  }

  @Post('create')
  async createNewUser(@Body() userDto: UserDto, @Res() res: Response) {
    const response = await this.userService
      .send('createUser', userDto)
      .toPromise();
    if (response?.status === HttpStatus.CREATED)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const userExist = await this.userService
      .send('findUserById', id)
      .toPromise();
    if (!userExist?.data)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const response = await this.userService
      .send('updateUser', { id, ...userDto })
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ ...response?.data });
    throw new HttpException(response?.error, response?.status);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const userExist = await this.userService
      .send('findUserById', id)
      .toPromise();
    if (!userExist?.data)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (userExist?.avatar) {
      const commandDel = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: `${userExist?.data?.avatar?.split(`${process.env.S3_BUCKET_ACCESS_URL}`)[1]}`,
      });
      await s3Client.send(commandDel);
    }

    const response = await this.userService.send('deleteUser', id).toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }
}
