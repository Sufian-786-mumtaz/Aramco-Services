import { AuthGuard } from '@guards/auth/auth.guard';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
  Get,
  UseGuards,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { DepartmentDto, DepartmentUpdateDto } from './dto/department.dto';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';

@UseGuards(AuthGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(
    @Inject('DEPARTMENTS_SERVICE')
    private readonly departmentsService: ClientProxy,
  ) { }

  @Get('all')
  async getAllDepartments(@Res() res: Response) {
    const response = await this.departmentsService
      .send('getAllDepartments', {})
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ ...response?.data });
    throw new HttpException(response?.error, response?.status);
  }

  @Get(':id')
  async getDepartmentById(@Param('id') id: string, @Res() res: Response) {
    const response = await this.departmentsService.send('getDepartmentById', id).toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ ...response?.data });
    throw new HttpException(response?.error, response?.status);
  }

  @Post('create')
  async createDepartment(@Body() departmentDto: DepartmentDto, @Res() res: Response) {
    const response = await this.departmentsService
      .send('createDepartment', departmentDto)
      .toPromise();
    if (response?.status === HttpStatus.CREATED)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }

  @Put(':id/update')
  async updateJob(
    @Param('id') id: string,
    @Body() department: DepartmentUpdateDto,
    @Res() res: Response,
  ) {
    const response = await this.departmentsService
      .send('updateDepartment', { id, department })
      .toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ data: { ...response?.data, }, message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }

  @Delete(':id/delete')
  async deleteDepartment(@Param('id') id: string, @Res() res: Response) {
    const response = await this.departmentsService.send('deleteDepartment', id).toPromise();
    if (response?.status === HttpStatus.OK)
      return res.status(response?.status).send({ message: response?.message });
    throw new HttpException(response?.error, response?.status);
  }
}
