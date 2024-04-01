import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from './schemas/departments.schema';
import { DepartmentInterface } from './interface/departments.interface';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) { }

  async getAllDepartments(): Promise<Department[]> {
    return this.departmentModel.find({});
  }

  findDepartmentById(departmentId: any): Promise<Department> {
    return this.departmentModel.findOne({ _id: departmentId }).populate('parentId').exec();
  }

  findDepartmentByFilter({ queryKey, queryValue }): Promise<Department> {
    const filter = { [queryKey]: queryValue };
    return this.departmentModel.findOne(filter);
  }

  createDepartment(
    departmentInterface: DepartmentInterface,
  ): Promise<Department> {
    return this.departmentModel.create(departmentInterface);
  }

  findOneAndUpdate(filter: any, body: any): Promise<Department> {
    return this.departmentModel.findOneAndUpdate(filter, body, { new: true });
  }

  findOneAndDelete(departmentId: any): Promise<any> {
    return this.departmentModel.findByIdAndDelete({ _id: departmentId });
  }

  async findChildDepartments(parentId: any): Promise<Department[]> {
    return this.departmentModel.find({ parentId: parentId });
  }
}
